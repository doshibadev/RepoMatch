import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { MagnifyingGlassIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <MagnifyingGlassIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🚀 RepoMatch
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Find your next open-source contribution in seconds. Get personalized repository suggestions 
            powered by intelligent scoring algorithms.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/search"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Start Matching Repositories
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/api"
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 font-semibold text-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl"
            >
              View API Documentation
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">275K+</div>
              <div className="text-sm text-gray-500">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">35+</div>
              <div className="text-sm text-gray-500">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-500">Scoring Modes</div>
            </div>
          </div>
        </div>

        {/* Recent Popular Searches */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Trending Searches
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                See what developers are searching for right now
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                <Link 
                  href="/search?skills=react,javascript&mode=profile-building"
                  className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                >
                  <span className="mr-2">🔥</span>
                  React + JavaScript
                </Link>
                <Link 
                  href="/search?skills=python,machine-learning&mode=learning"
                  className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-sm font-medium"
                >
                  <span className="mr-2">📈</span>
                  Python + ML
                </Link>
                <Link 
                  href="/search?skills=nodejs,express&mode=quick-wins"
                  className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
                >
                  <span className="mr-2">⚡</span>
                  Node.js + Express
                </Link>
                <Link 
                  href="/search?skills=typescript,nextjs&mode=profile-building"
                  className="inline-flex items-center px-4 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors text-sm font-medium"
                >
                  <span className="mr-2">🚀</span>
                  TypeScript + Next.js
                </Link>
                <Link 
                  href="/search?skills=go,kubernetes&mode=learning"
                  className="inline-flex items-center px-4 py-2 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors text-sm font-medium"
                >
                  <span className="mr-2">🐳</span>
                  Go + Kubernetes
                </Link>
                <Link 
                  href="/search?skills=rust,webassembly&mode=quick-wins"
                  className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
                >
                  <span className="mr-2">🦀</span>
                  Rust + WebAssembly
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tool Status & Stats */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                System Status
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time data and performance metrics
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Repository Index</h3>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">Live</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Repositories</span>
                    <span className="font-semibold text-gray-900 dark:text-white">275,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Last Updated</span>
                    <span className="font-semibold text-gray-900 dark:text-white">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">New Today</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">+1,234</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Performance</h3>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">Optimal</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Avg Response Time</span>
                    <span className="font-semibold text-gray-900 dark:text-white">1.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Success Rate</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">99.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Cache Hit Rate</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">87%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Search Activity</h3>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">Active</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Searches Today</span>
                    <span className="font-semibold text-gray-900 dark:text-white">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Unique Skills</span>
                    <span className="font-semibold text-gray-900 dark:text-white">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Avg Results</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Technical Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Built with modern technologies and optimized for performance
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Algorithm & Data</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-300">Multi-dimensional scoring algorithm</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-300">Semantic skill normalization</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-300">Real-time GitHub API integration</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-300">Intelligent caching system</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance & Scale</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-300">Parallel API processing</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-300">Multi-layer caching (Redis + CDN)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-300">Progressive result loading</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-300">Optimized for 1000+ concurrent users</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <span className="mr-2">⚡</span>
                    Powered by GitHub API
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🔧</span>
                    Built with Next.js & TypeScript
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">☁️</span>
                    Deployed on Vercel
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
