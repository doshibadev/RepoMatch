import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { CodeBracketIcon, DocumentTextIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function ApiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <CodeBracketIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            API Documentation
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Integrate RepoMatch into your own applications with our powerful REST API. 
            Get repository recommendations, skill analysis, and detailed scoring data.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <RocketLaunchIcon className="h-6 w-6 mr-2" />
                  Quick Start
                </h2>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-900 dark:bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`curl -X POST "http://localhost:3000/api/search" \\
  -H "Content-Type: application/json" \\
  -d '{
    "skills": ["react", "typescript", "javascript"],
    "mode": "learning",
    "limit": 10,
    "starRange": { "min": 100, "max": 5000 }
  }'`}
                  </pre>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    💡 Pro Tip
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Use the star range filter to narrow down results by repository size. Include both languages 
                    and frameworks in your skills array for the most relevant matches. Start with a small limit (5-10) 
                    to test, then increase based on your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            API Endpoints
          </h2>
          
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Search Endpoint */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Search Repositories
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      POST /api/search
                    </p>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                    POST
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Parameters</h4>
                    <div className="space-y-3">
                      <div>
                        <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">skills</code>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">Array of strings</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Technologies you know or want to learn (e.g., ["react", "python", "javascript"])
                        </p>
                      </div>
                      <div>
                        <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">mode</code>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">String</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Search mode: "profile-building", "learning", or "quick-wins"
                        </p>
                      </div>
                      <div>
                        <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">limit</code>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">Number</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Number of results (1-50, default: 20)
                        </p>
                      </div>
                      <div>
                        <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">feelingLucky</code>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">Boolean</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Return random high-quality repositories (optional)
                        </p>
                      </div>
                      <div>
                        <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">starRange</code>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">Object</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Filter by star count: {`{"min": 100, "max": 5000}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Response</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div>• <strong>repositories</strong> - Array of matched repositories</div>
                      <div>• <strong>metadata</strong> - Search statistics and timing</div>
                      <div>• <strong>skills</strong> - Normalized and expanded skills</div>
                      <div>• <strong>scores</strong> - Detailed scoring breakdown</div>
                      <div>• <strong>opportunities</strong> - Contribution opportunities</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Endpoint */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Get Trending Repositories
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      GET /api/trending
                    </p>
                  </div>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    GET
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Query Parameters</h4>
                    <div className="space-y-3">
                      <div>
                        <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">language</code>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">String</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Programming language filter (optional)
                        </p>
                      </div>
                      <div>
                        <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">since</code>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">String</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Time period: "daily", "weekly", "monthly" (default: "weekly")
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Response</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div>• <strong>repositories</strong> - Array of trending repositories</div>
                      <div>• <strong>language</strong> - Filtered language</div>
                      <div>• <strong>since</strong> - Time period used</div>
                      <div>• <strong>total</strong> - Total number of results</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Response Examples
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Successful Search Response
                </h3>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-900 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`{
  "success": true,
  "data": {
    "repositories": [
      {
        "id": 123456,
        "name": "awesome-react",
        "full_name": "user/awesome-react",
        "description": "A curated list of React resources",
        "url": "https://github.com/user/awesome-react",
        "stars": 1500,
        "forks": 200,
        "language": "JavaScript",
        "topics": ["react", "javascript", "frontend"],
        "goodFirstIssues": 5,
        "lastUpdated": "2024-01-15T10:30:00Z",
        "scores": {
          "relevance": 0.85,
          "quality": 0.92,
          "opportunity": 0.78,
          "final": 0.85
        },
        "explanation": "High relevance due to React expertise match...",
        "opportunities": [
          {
            "type": "good-first-issues",
            "count": 5,
            "url": "https://github.com/user/awesome-react/issues?q=is:issue+is:open+label:good-first-issue"
          }
        ]
      }
    ],
    "metadata": {
      "total": 1250,
      "page": 1,
      "limit": 10,
      "hasMore": true,
      "searchTime": 1.2,
      "cached": false,
      "skills": {
        "input": ["react"],
        "normalized": [
          {
            "original": "react",
            "normalized": "React",
            "category": "Frontend Framework",
            "weight": 1.0
          }
        ],
        "expanded": ["react", "javascript", "jsx", "frontend"]
      },
      "mode": "learning",
      "sort": "relevance",
      "filters": {
        "starRange": { "min": 100, "max": 5000 }
      }
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Usage Examples
          </h2>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Basic Search */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 border-b border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Basic Search
                </h3>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-900 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`{
  "skills": ["react", "javascript"],
  "mode": "learning",
  "limit": 10
}`}
                  </pre>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                  Find React and JavaScript projects for learning.
                </p>
              </div>
            </div>

            {/* Star Range Filtering */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4 border-b border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  With Star Range
                </h3>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-900 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`{
  "skills": ["python", "django"],
  "starRange": { "min": 500, "max": 10000 },
  "mode": "profile-building"
}`}
                  </pre>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                  Find established Python/Django projects with 500-10,000 stars.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Error Handling
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                  Error Response Example
                </h3>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-900 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-red-400 text-sm">
{`{
  "success": false,
  "error": "Invalid skills parameter. Please provide an array of skill names.",
  "code": "VALIDATION_ERROR"
}`}
                  </pre>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Common Error Codes:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">VALIDATION_ERROR</code> - Invalid request parameters</li>
                    <li>• <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">RATE_LIMIT_EXCEEDED</code> - Too many requests</li>
                    <li>• <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">GITHUB_API_ERROR</code> - GitHub API issues</li>
                    <li>• <code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">INTERNAL_ERROR</code> - Server error</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Rate Limits & Best Practices
          </h2>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Rate Limits
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• <strong>Search:</strong> 100 requests/hour</li>
                <li>• <strong>Trending:</strong> 200 requests/hour</li>
                <li>• <strong>Burst:</strong> 10 requests/minute</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Best Practices
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Cache results when possible</li>
                <li>• Use appropriate limits (5-20)</li>
                <li>• Handle errors gracefully</li>
                <li>• Implement retry logic</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
