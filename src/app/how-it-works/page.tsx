import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { 
  CpuChipIcon, 
  ChartBarIcon, 
  LightBulbIcon, 
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  StarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <CpuChipIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            How RepoMatch Works
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the intelligent system behind RepoMatch that finds your perfect open-source projects 
            using advanced algorithms, semantic analysis, and multi-dimensional scoring.
          </p>
        </div>

        {/* System Overview */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              System Overview
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                    <MagnifyingGlassIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Smart Search</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Multi-strategy GitHub search combining language, topic, and activity-based queries 
                  to find diverse repository sizes and types.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                    <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Intelligent Scoring</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Multi-dimensional scoring algorithm analyzing relevance, quality, and opportunity 
                  with mode-specific weighting and bonuses.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-3">
                    <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Semantic Analysis</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Advanced skill normalization and expansion using semantic relationships 
                  to understand technology connections and context.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Algorithm Deep Dive */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              The Scoring Algorithm
            </h2>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Relevance Score */}
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">R</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Relevance Score</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    How well the repository matches your skills and interests
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Language Match</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Topic Match</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">README Keywords</span>
                      <span className="font-medium">25%</span>
                    </div>
                  </div>
                </div>

                {/* Quality Score */}
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">Q</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality Score</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Repository health, documentation, and community engagement
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Stars & Forks</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Recent Activity</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Documentation</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Contributors</span>
                      <span className="font-medium">20%</span>
                    </div>
                  </div>
                </div>

                {/* Opportunity Score */}
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">O</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Opportunity Score</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Contribution opportunities and maintainer responsiveness
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Good First Issues</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Open Issues</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Contributors</span>
                      <span className="font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Final Score Calculation</h4>
                <div className="bg-gray-900 dark:bg-slate-900 rounded-lg p-4">
                  <pre className="text-green-400 text-sm">
{`Final Score = (Relevance × W₁) + (Quality × W₂) + (Opportunity × W₃) + Bonuses - Penalties

Where W₁, W₂, W₃ are mode-specific weights:
• Learning: W₁=0.3, W₂=0.5, W₃=0.2
• Quick-wins: W₁=0.2, W₂=0.1, W₃=0.7  
• Profile-building: W₁=0.6, W₂=0.3, W₃=0.1`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mode-Specific Behavior */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Mode-Specific Behavior
            </h2>
            
            <div className="space-y-8">
              {/* Learning Mode */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 border-b border-blue-200 dark:border-blue-800">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                    <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Learning Mode</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Focus Areas</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Quality documentation and tutorials</li>
                        <li>• Good first issues for hands-on learning</li>
                        <li>• Educational content and examples</li>
                        <li>• Active community and support</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Bonuses & Penalties</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• +0.3 for repos with {`>10`} good first issues</li>
                        <li>• +0.15 for tutorial/example content</li>
                        <li>• +0.2 for educational topics</li>
                        <li>• -0.5 for repos with no learning opportunities</li>
                        <li>• -0.3 for poor documentation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Wins Mode */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4 border-b border-green-200 dark:border-green-800">
                  <div className="flex items-center">
                    <RocketLaunchIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                    <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">Quick Wins Mode</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Focus Areas</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Manageable issue counts (5-50 issues)</li>
                        <li>• Recent activity and responsiveness</li>
                        <li>• Good first issues available</li>
                        <li>• Not overwhelming or too competitive</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Bonuses & Penalties</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• +0.4 for any good first issues</li>
                        <li>• +0.3 for perfect issue count (5-50)</li>
                        <li>• +0.2 for recent activity (within 7 days)</li>
                        <li>• -0.6 for overwhelming repos ({`>500`} issues)</li>
                        <li>• -0.5 for repos with no open issues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Building Mode */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-4 border-b border-purple-200 dark:border-purple-800">
                  <div className="flex items-center">
                    <StarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
                    <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100">Profile Building Mode</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Focus Areas</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• High-visibility, well-known projects</li>
                        <li>• Exact skill matches and relevance</li>
                        <li>• Established, mature projects</li>
                        <li>• Production-ready frameworks/libraries</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Bonuses & Penalties</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• +0.4 for repos with {`>5000`} stars</li>
                        <li>• +0.2 for production/enterprise topics</li>
                        <li>• +0.1 for mature projects ({`>1`} year)</li>
                        <li>• -0.5 for low-visibility repos ({`<50`} stars)</li>
                        <li>• -0.3 for very new repos ({`<30`} days)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Strategy */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Search Strategy
            </h2>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recent Activity Search</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Finds smaller, active repositories sorted by recent updates to discover 
                    emerging projects and active communities.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Topic-Based Search</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Searches repositories with specific topics and keywords, using star limits 
                    to find smaller projects with focused themes.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Language Search</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Targets repositories by programming language with lower star thresholds 
                    to find language-specific projects of various sizes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skill Normalization */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Skill Normalization & Expansion
            </h2>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Semantic Relationships</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Our system understands the relationships between technologies and automatically 
                    expands your skills to find more relevant repositories.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Input: "react"</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Expands to: javascript, jsx, frontend, web, ui, component, hooks</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Input: "machine-learning"</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Expands to: python, tensorflow, pytorch, data-science, ai, neural-network</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Input: "nodejs"</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Expands to: javascript, server, backend, express, npm, api</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Normalization Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Direct Match</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Exact match in skill graph</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-100 dark:bg-green-900 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">2</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Alias Matching</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Matches common aliases (js → javascript)</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-purple-100 dark:bg-purple-900 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">3</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Fuzzy Matching</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Handles variations and typos</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-orange-100 dark:bg-orange-900 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">4</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Fallback</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Accepts any skill as-is with lower weight</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance & Caching */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Performance & Caching
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Multi-Layer Caching</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Browser Cache</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Instant results for repeated searches</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">2</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">CDN Cache</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Fast global content delivery</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-purple-100 dark:bg-purple-900 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">3</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Redis Cache</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Server-side caching for API responses</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Optimization Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <RocketLaunchIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Parallel Processing</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Multiple API calls executed simultaneously</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Smart Batching</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Efficient request grouping and processing</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <LightBulbIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Progressive Loading</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Results displayed as they become available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Experience the power of intelligent repository matching. Our algorithm analyzes thousands 
              of repositories to find the ones that perfectly align with your skills and goals.
            </p>
            <a 
              href="/search" 
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Start Searching
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
