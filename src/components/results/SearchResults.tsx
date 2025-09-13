'use client';

import { useState } from 'react';
import RepositoryCard from './RepositoryCard';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  goodFirstIssues: number;
  lastUpdated: string;
  scores: {
    relevance: number;
    quality: number;
    opportunity: number;
    final: number;
  };
  explanation?: string;
  opportunities: Array<{
    type: string;
    count: number;
    url: string;
  }>;
}

interface SearchMetadata {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  searchTime: number;
  cached: boolean;
  skills: {
    input: string[];
    normalized: Array<{
      original: string;
      normalized: string;
      category: string;
      weight: number;
    }>;
    expanded: string[];
  };
  mode: string;
  sort: string;
}

interface SearchResultsProps {
  repositories: Repository[];
  metadata: SearchMetadata;
  onLoadMore: () => void;
}

export default function SearchResults({ repositories, metadata, onLoadMore }: SearchResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Results Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Found {formatNumber(metadata.total)} repositories
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span>Mode: <span className="font-medium capitalize">{metadata.mode.replace('-', ' ')}</span></span>
              <span>Sort: <span className="font-medium capitalize">{metadata.sort}</span></span>
              <span>Time: <span className="font-medium">{formatTime(metadata.searchTime)}</span></span>
              {metadata.cached && (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                  Cached
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">
              {showDetails ? 'Hide' : 'Show'} Search Details
            </span>
            {showDetails ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Search Details */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Skills Analysis</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Input: </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metadata.skills.input.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Expanded: </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metadata.skills.expanded.slice(0, 10).join(', ')}
                      {metadata.skills.expanded.length > 10 && '...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Normalized Skills */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Normalized Skills</h3>
                <div className="space-y-1">
                  {metadata.skills.normalized.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900 dark:text-white">
                        {skill.original} → {skill.normalized}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        {skill.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Repository Cards */}
      <div className="space-y-4">
        {repositories.map((repo, index) => (
          <RepositoryCard
            key={repo.id}
            repository={repo}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Load More */}
      {metadata.hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Load More Results
          </button>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Showing {repositories.length} of {formatNumber(metadata.total)} repositories
        {metadata.searchTime > 0 && (
          <span className="ml-2">
            • Found in {formatTime(metadata.searchTime)}
          </span>
        )}
      </div>
    </div>
  );
}
