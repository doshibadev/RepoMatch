'use client';

import { useState } from 'react';
import { 
  StarIcon, 
  CodeBracketIcon, 
  CalendarIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

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

interface RepositoryCardProps {
  repository: Repository;
  rank: number;
}

export default function RepositoryCard({ repository, rank }: RepositoryCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 0.6) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-2 py-1 rounded-full">
                #{rank}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {repository.name}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              {repository.full_name}
            </p>
            {repository.description && (
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                {repository.description}
              </p>
            )}
          </div>
          
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">View</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
            <StarSolidIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{formatNumber(repository.stars)}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
            <CodeBracketIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{formatNumber(repository.forks)}</span>
          </div>
          
          {repository.language && (
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
              <CodeBracketIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{repository.language}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{formatDate(repository.lastUpdated)}</span>
          </div>
        </div>

        {/* Topics */}
        {repository.topics && repository.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {repository.topics.slice(0, 8).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {topic}
              </span>
            ))}
            {repository.topics.length > 8 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{repository.topics.length - 8} more
              </span>
            )}
          </div>
        )}

        {/* Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className={`text-lg font-bold ${getScoreColor(repository.scores.relevance)}`}>
              {Math.round(repository.scores.relevance * 100)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Relevance</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getScoreColor(repository.scores.quality)}`}>
              {Math.round(repository.scores.quality * 100)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Quality</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getScoreColor(repository.scores.opportunity)}`}>
              {Math.round(repository.scores.opportunity * 100)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Opportunity</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getScoreColor(repository.scores.final)}`}>
              {Math.round(repository.scores.final * 100)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Final Score</div>
          </div>
        </div>

        {/* Opportunities */}
        {repository.opportunities.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Contribution Opportunities</h4>
            <div className="flex flex-wrap gap-2">
              {repository.opportunities.map((opp, index) => (
                <a
                  key={index}
                  href={opp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <ExclamationTriangleIcon className="h-3 w-3" />
                  <span>{opp.type.replace('-', ' ')} ({opp.count})</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span className="text-sm font-medium">
            {showDetails ? 'Hide' : 'Show'} Details
          </span>
          {showDetails ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-slate-900/50">
          {repository.explanation && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Why this repository?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{repository.explanation}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Score Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Relevance</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreBgColor(repository.scores.relevance)}`}
                        style={{ width: `${repository.scores.relevance * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{Math.round(repository.scores.relevance * 100)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Quality</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreBgColor(repository.scores.quality)}`}
                        style={{ width: `${repository.scores.quality * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{Math.round(repository.scores.quality * 100)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Opportunity</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreBgColor(repository.scores.opportunity)}`}
                        style={{ width: `${repository.scores.opportunity * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{Math.round(repository.scores.opportunity * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Repository Info</h4>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                <div>Language: {repository.language || 'Unknown'}</div>
                <div>Topics: {repository.topics.length}</div>
                <div>Good First Issues: {repository.goodFirstIssues}</div>
                <div>Last Updated: {formatDate(repository.lastUpdated)}</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Repository
                </a>
                <a
                  href={`${repository.url}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  View Issues
                </a>
                <a
                  href={`${repository.url}/fork`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Fork Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
