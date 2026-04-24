import os
import json
import asyncio
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from openai import AsyncOpenAI
from tavily import AsyncTavilyClient
import numpy as np

# Lazy load sentence_transformers to avoid slow start up if not needed right away
try:
    from sentence_transformers import SentenceTransformer, util
    _st_model = None
except ImportError:
    SentenceTransformer = None

class SearchResult(BaseModel):
    id: str
    title: str
    url: str
    domain: str
    snippet: str
    publishedDate: Optional[str] = None
    score: float = 0.0

class Citation(BaseModel):
    index: int
    url: str
    title: str
    domain: str
    snippet: Optional[str] = None

class AIOverview(BaseModel):
    content: str
    citations: List[Citation]

class AIFullAnswer(BaseModel):
    content: str
    citations: List[Citation]
    followUpQuestions: Optional[List[str]] = None

class FAQItem(BaseModel):
    question: str
    answer: str
    citations: Optional[List[Citation]] = None

class RelatedSearch(BaseModel):
    query: str

class KnowledgeEntity(BaseModel):
    title: str
    subtitle: Optional[str] = None
    category: Optional[str] = None
    description: str
    facts: List[Dict[str, str]]
    sourceUrl: Optional[str] = None
    sourceName: Optional[str] = None

class SearchResponseModel(BaseModel):
    query: str
    tab: str
    webResults: List[SearchResult]
    aiOverview: Optional[AIOverview] = None
    aiFullAnswer: Optional[AIFullAnswer] = None
    faqItems: List[FAQItem] = []
    relatedSearches: List[RelatedSearch] = []
    knowledgePanel: Optional[KnowledgeEntity] = None
    totalResults: Optional[int] = None
    searchTimeMs: Optional[int] = None


class RAGPipeline:
    def __init__(self):
        openai_key = os.environ.get("OPENAI_API_KEY")
        tavily_key = os.environ.get("TAVILY_API_KEY")
        
        if not openai_key or not tavily_key:
            print("WARNING: OPENAI_API_KEY or TAVILY_API_KEY is missing. RAG pipeline will fail.")
            
        self.llm = AsyncOpenAI(api_key=openai_key or "dummy_key")
        self.tavily = AsyncTavilyClient(api_key=tavily_key or "dummy_key")
        self.model_name = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

    def _get_st_model(self):
        global _st_model
        if SentenceTransformer is None:
            return None
        if _st_model is None:
            # use a fast, lightweight model for ranking snippets on CPU
            _st_model = SentenceTransformer('all-MiniLM-L6-v2') 
        return _st_model

    async def execute_search(self, query: str, tab: str = "all") -> SearchResponseModel:
        import time
        start_time = time.time()
        
        # 1. Fetch live web results
        tavily_res = await self.tavily.search(
            query=query,
            search_depth="advanced",
            max_results=12,
            include_images=False,
            include_answer=False
        )
        
        results = tavily_res.get("results", [])
        
        # Parse into our internal format
        import uuid
        from urllib.parse import urlparse
        
        web_results = []
        for r in results:
            domain = urlparse(r["url"]).netloc.replace("www.", "")
            web_results.append({
                "id": str(uuid.uuid4())[:8],
                "title": r["title"],
                "url": r["url"],
                "domain": domain,
                "snippet": r["content"],
                "publishedDate": r.get("published_date")
            })

        # 2. Source Ranking
        # Let's rank snippets to push the most semantically relevant to the top for the LLM
        ranked_results = self._rank_sources(query, web_results)
        
        # 3. Preparation for AI Generation
        top_k = 8
        context_sources = ranked_results[:top_k]
        
        citations = []
        for i, s in enumerate(context_sources):
            citations.append(Citation(
                index=i+1,
                url=s["url"],
                title=s["title"],
                domain=s["domain"],
                snippet=s["snippet"][:150]
            ))
            
        needs_ai = tab in ["all", "ai"]
        
        ai_overview = None
        ai_full = None
        faq_items = []
        related_searches = []
        entity = None
        
        if needs_ai and len(context_sources) > 0:
            tasks = []
            
            # Overview or Full Mode task
            mode = "full" if tab == "ai" else "overview"
            tasks.append(self._generate_answer(query, context_sources, citations, mode))
            
            # Other parallel tasks
            tasks.append(self._generate_related_searches(query, context_sources))
            tasks.append(self._generate_paa(query, context_sources, citations))
            
            if tab == "all":
                tasks.append(self._extract_entity(query, context_sources))
            else:
                tasks.append(self._resolve_dummy()) # maintains array alignment
                
            res = await asyncio.gather(*tasks, return_exceptions=True)
            
            answer_dict = res[0] if not isinstance(res[0], Exception) else {}
            related = res[1] if not isinstance(res[1], Exception) else []
            faqs = res[2] if not isinstance(res[2], Exception) else []
            ent = res[3] if not isinstance(res[3], Exception) else None
            
            if mode == "overview":
                if answer_dict:
                    ai_overview = AIOverview(content=answer_dict.get("content", ""), citations=citations)
            else:
                if answer_dict:
                    ai_full = AIFullAnswer(
                        content=answer_dict.get("content", ""), 
                        citations=citations,
                        followUpQuestions=answer_dict.get("follow_ups", [])
                    )
                    
            related_searches = [RelatedSearch(query=q) for q in related]
            faq_items = faqs
            entity = ent

        search_time_ms = int((time.time() - start_time) * 1000)

        # Build response
        final_web_results = []
        for r in ranked_results:
            final_web_results.append(SearchResult(
                id=r["id"],
                title=r["title"],
                url=r["url"],
                domain=r["domain"],
                snippet=r["snippet"],
                publishedDate=r["publishedDate"]
            ))

        return SearchResponseModel(
            query=query,
            tab=tab,
            webResults=final_web_results,
            aiOverview=ai_overview,
            aiFullAnswer=ai_full,
            faqItems=faq_items,
            relatedSearches=related_searches,
            knowledgePanel=entity,
            totalResults=len(ranked_results) * 1234, # Fake extrapolation for scale vibe
            searchTimeMs=search_time_ms
        )
        
    def _rank_sources(self, query: str, results: List[Dict]) -> List[Dict]:
        """Rank sources using cosine similarity if sentence-transformers is installed, else return as-is."""
        model = self._get_st_model()
        if not model or not results:
            return results
            
        try:
            query_emb = model.encode(query, convert_to_tensor=True)
            doc_texts = [r["title"] + " " + r["snippet"] for r in results]
            doc_embs = model.encode(doc_texts, convert_to_tensor=True)
            
            cosine_scores = util.cos_sim(query_emb, doc_embs)[0]
            scores = cosine_scores.cpu().tolist()
            
            for i, r in enumerate(results):
                r["score"] = scores[i]
                
            # Sort by score descending
            ranked = sorted(results, key=lambda x: x["score"], reverse=True)
            return ranked
        except Exception as e:
            print(f"Ranking error: {e}")
            return results

    async def _generate_answer(self, query: str, sources: List[Dict], citations: List[Citation], mode: str) -> Dict[str, Any]:
        source_text = "\n\n".join([f"[{i+1}] {s['title']} \nURL: {s['url']} \nSnippet: {s['snippet'][:800]}" for i, s in enumerate(sources)])
        
        if mode == "overview":
            sys_msg = "You are a professional search engine AI. Provide a concise 2-4 sentence overview answering the user's query using ONLY the provided sources. Include inline citations like [1], [2]. Do NOT make up information. If sources are insufficient, say 'Insufficient sufficient information available in the top search results.'"
        else:
            sys_msg = "You are a professional search engine AI. Provide a comprehensive, well-structured answer using ONLY the provided sources. Use markdown formatting with ## headings. Include inline citations [1], [2], etc. Structure: Overview, Key Points, Detailed Analysis, Conclusion. Do NOT hallucinate."

        try:
            res = await self.llm.chat.completions.create(
                model=self.model_name,
                temperature=0.3,
                messages=[
                    {"role": "system", "content": sys_msg},
                    {"role": "user", "content": f"Query: {query}\n\nSearch Context:\n{source_text}"}
                ],
                max_tokens=2048
            )
            content = res.choices[0].message.content
            
            # Extract followups if full mode
            follow_ups = []
            if mode == "full":
                try:
                    fq_res = await self.llm.chat.completions.create(
                         model=self.model_name,
                         temperature=0.5,
                         messages=[
                             {"role": "system", "content": "Generate 4 follow-up questions for the query. Return them as a raw JSON string array. Eg: [\"What is X?\", \"How does X work?\"]"},
                             {"role": "user", "content": f"Query: {query}\nAnswer: {content[:500]}"}
                         ]
                    )
                    j_str = fq_res.choices[0].message.content
                    start = j_str.find("[")
                    end = j_str.rfind("]")
                    if start != -1 and end != -1:
                        follow_ups = json.loads(j_str[start:end+1])
                except Exception:
                    pass
                    
            return {"content": content, "follow_ups": follow_ups}
            
        except Exception as e:
            print(f"Error generating AI answer: {e}")
            return {"content": "Could not generate an AI answer at this time."}

    async def _generate_related_searches(self, query: str, sources: List[Dict]) -> List[str]:
        context = ", ".join([s["title"] for s in sources[:3]])
        try:
            res = await self.llm.chat.completions.create(
                 model=self.model_name,
                 temperature=0.6,
                 messages=[
                     {"role": "system", "content": "Generate 6 related search queries. Output ONLY a valid JSON string array of strings."},
                     {"role": "user", "content": f"Original query: {query}\nRelated context: {context}"}
                 ]
            )
            j_str = res.choices[0].message.content
            start = j_str.find("[")
            end = j_str.rfind("]")
            if start != -1 and end != -1:
                return json.loads(j_str[start:end+1])
        except Exception:
            pass
        return [f"{query} explained", f"{query} alternatives", f"{query} tutorial"]

    async def _generate_paa(self, query: str, sources: List[Dict], citations: List[Citation]) -> List[FAQItem]:
        source_text = "\n".join([f"[{i+1}] {s['title']}: {s['snippet'][:400]}" for i, s in enumerate(sources[:5])])
        try:
            res = await self.llm.chat.completions.create(
                 model=self.model_name,
                 temperature=0.4,
                 messages=[
                     {"role": "system", "content": "Generate 3-4 FAQ items from the sources. Return ONLY a valid JSON array like: [{\"question\":\"...\", \"answer\":\"...\", \"citation_indexes\":[1,2]}]. Base answers ONLY on the sources."},
                     {"role": "user", "content": f"Query: {query}\n\nSources:\n{source_text}"}
                 ]
            )
            j_str = res.choices[0].message.content
            start = j_str.find("[")
            end = j_str.rfind("]")
            if start != -1 and end != -1:
                items = json.loads(j_str[start:end+1])
                faqs = []
                for item in items:
                    c_idx = item.get("citation_indexes", [])
                    faqs.append(FAQItem(
                        question=item["question"],
                        answer=item["answer"],
                        citations=[c for c in citations if c.index in c_idx]
                    ))
                return faqs
        except Exception as e:
            print(f"PAA Error: {e}")
        return []

    async def _extract_entity(self, query: str, sources: List[Dict]) -> Optional[KnowledgeEntity]:
        context = "\n".join([f"{s['title']}: {s['snippet'][:200]}" for s in sources[:3]])
        try:
             res = await self.llm.chat.completions.create(
                 model=self.model_name,
                 temperature=0.1,
                 messages=[
                     {"role": "system", "content": "Determine if the query specifically refers to a famous entity (person, company, technology, object, place). If yes, return a JSON object: {\"title\":\"...\", \"subtitle\":\"...\", \"description\":\"... (1 paragraph)\", \"facts\":[{\"label\":\"...\", \"value\":\"...\"}]}. If NO, return the string 'null'."},
                     {"role": "user", "content": f"Query: {query}\n\nContext:\n{context}"}
                 ]
             )
             resp = res.choices[0].message.content.strip()
             if "null" in resp.lower() and len(resp) < 10:
                 return None
                 
             start = resp.find("{")
             end = resp.rfind("}")
             if start != -1 and end != -1:
                 data = json.loads(resp[start:end+1])
                 return KnowledgeEntity(
                     title=data.get("title", query),
                     subtitle=data.get("subtitle"),
                     description=data.get("description", ""),
                     facts=data.get("facts", []),
                     sourceUrl=sources[0]["url"] if sources else None,
                     sourceName="Web Result"
                 )
        except Exception:
            pass
        return None

    async def _resolve_dummy(self):
        return None
