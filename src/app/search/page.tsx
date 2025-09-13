'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchForm from '@/components/search/SearchForm';
import SearchResults from '@/components/results/SearchResults';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [metadata, setMetadata] = useState<SearchMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialSearchDone, setInitialSearchDone] = useState(false);

  const handleSearch = async (searchData: {
    skills: string[];
    mode: 'profile-building' | 'learning' | 'quick-wins';
    limit: number;
    feelingLucky?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const result = await response.json();

      if (result.success) {
        setRepositories(result.data.repositories);
        setMetadata(result.data.metadata);
      } else {
        setError(result.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle URL parameters for trending searches
  useEffect(() => {
    const skillsParam = searchParams.get('skills');
    const modeParam = searchParams.get('mode') as 'profile-building' | 'learning' | 'quick-wins' | null;
    
    if (skillsParam && !initialSearchDone) {
      const skills = skillsParam.split(',').map(skill => skill.trim().toLowerCase());
      const mode = modeParam || 'profile-building';
      
      setInitialSearchDone(true);
      handleSearch({
        skills,
        mode,
        limit: 20
      });
    }
  }, [searchParams, initialSearchDone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <MagnifyingGlassIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Repository Search
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find repositories that match your skills and interests. Get personalized suggestions 
            with detailed scoring and opportunity analysis.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <SearchForm 
            onSearch={handleSearch} 
            loading={loading}
            initialSkills={searchParams.get('skills')?.split(',').map(skill => skill.trim().toLowerCase())}
            initialMode={searchParams.get('mode') as 'profile-building' | 'learning' | 'quick-wins' || 'profile-building'}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              Finding your perfect repositories...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <div className="text-red-600 dark:text-red-400 font-medium mb-2">
                Search Error
              </div>
              <div className="text-red-500 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {repositories.length > 0 && metadata && (
          <SearchResults 
            repositories={repositories} 
            metadata={metadata}
            onLoadMore={() => {
              // TODO: Implement pagination
            }}
          />
        )}

        {/* Empty State */}
        {!loading && repositories.length === 0 && !error && (
          <div className="text-center py-12">
            <SparklesIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
              Ready to find your perfect match?
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your skills above to discover repositories tailored to your expertise.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
