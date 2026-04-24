'use client';

import type { VideoResult } from '@/types/search';
import { PlayCircle } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface VideoListProps {
  videos: VideoResult[];
}

export default function VideoList({ videos }: VideoListProps) {
  if (!videos.length) {
    return <div className="py-12 text-center text-zinc-500">No videos found.</div>;
  }

  return (
    <div className="space-y-6" id="video-list">
      {videos.map(video => (
        <a
          key={video.id}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row gap-4"
        >
          {/* Thumbnail */}
          <div className="relative shrink-0 w-full sm:w-60 h-36 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <PlayCircle className="w-12 h-12 text-white drop-shadow-md" />
            </div>
            {/* Duration badge */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-medium backdrop-blur-sm">
                {video.duration}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col py-1">
            <h3 className="text-lg font-medium text-blue-600 group-hover:underline leading-snug mb-2 dark:text-blue-400">
              {video.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{video.channelName}</span>
              <span>•</span>
              <span className="capitalize">{video.platform}</span>
              {video.views && (
                <>
                  <span>•</span>
                  <span>{video.views}</span>
                </>
              )}
              {video.publishedAt && (
                <>
                  <span>•</span>
                  <span>{formatTimeAgo(video.publishedAt)}</span>
                </>
              )}
            </div>

            {video.snippet && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {video.snippet}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
