import SearchInput from '@/components/SearchInput';
import { Sparkles, Globe, History, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-3xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo Area */}
        <div className="mb-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 via-blue-600 to-cyan-500 rounded-3xl shadow-xl flex items-center justify-center mb-6 transform rotate-3 hover:rotate-6 transition-transform">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 mb-4 dark:text-white">
            NovaMind
          </h1>
          <p className="text-lg text-zinc-500 text-center max-w-md dark:text-zinc-400">
            The next-generation AI search engine. Get answers, explore topics, and find what you need instantly.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full mb-12">
          <SearchInput autoFocus />
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl text-center">
          <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-zinc-50 transition-colors dark:hover:bg-zinc-900">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 dark:bg-blue-900/50">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-1 dark:text-zinc-100">Live Web Search</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Grounded in real-time data from across the web.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-zinc-50 transition-colors dark:hover:bg-zinc-900">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mb-3 dark:bg-violet-900/50">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-1 dark:text-zinc-100">AI Deep Answers</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Comprehensive synthesized answers with citations.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-zinc-50 transition-colors dark:hover:bg-zinc-900">
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center mb-3 dark:bg-cyan-900/50">
              <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-1 dark:text-zinc-100">Blazing Fast</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Optimized for speed with streaming capabilities.</p>
          </div>
        </div>
      </div>
      
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-6">
        <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-500"/> Real-Time Python RAG Online</span>
        <span>Settings</span>
        <span>Privacy</span>
        <span>Terms</span>
      </footer>
    </main>
  );
}
