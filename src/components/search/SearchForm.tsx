'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchFormProps {
  onSearch: (data: {
    skills: string[];
    mode: 'profile-building' | 'learning' | 'quick-wins';
    limit: number;
    feelingLucky?: boolean;
    starRange?: { min?: number; max?: number };
  }) => void;
  loading: boolean;
  initialSkills?: string[];
  initialMode?: 'profile-building' | 'learning' | 'quick-wins';
}

export default function SearchForm({ onSearch, loading, initialSkills, initialMode }: SearchFormProps) {
  const [skills, setSkills] = useState<string[]>(initialSkills || []);
  const [skillInput, setSkillInput] = useState('');
  const [mode, setMode] = useState<'profile-building' | 'learning' | 'quick-wins'>(initialMode || 'profile-building');
  const [limit, setLimit] = useState(20);
  
  // Filter states
  const [starRange, setStarRange] = useState<{ min?: number; max?: number }>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update form when initial values change
  useEffect(() => {
    if (initialSkills) {
      setSkills(initialSkills);
    }
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialSkills, initialMode]);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim().toLowerCase();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length > 0) {
      onSearch({ 
        skills, 
        mode, 
        limit,
        starRange: Object.keys(starRange).length > 0 ? starRange : undefined
      });
    }
  };

  const handleFeelingLucky = () => {
    if (skills.length > 0) {
      onSearch({ 
        skills, 
        mode, 
        limit, 
        feelingLucky: true,
        starRange: Object.keys(starRange).length > 0 ? starRange : undefined
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };


  // Popular languages and frameworks
  const popularLanguages = [
    'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'php', 'ruby',
    'swift', 'kotlin', 'c++', 'c#', 'dart', 'r', 'scala', 'clojure'
  ];

  const popularFrameworks = [
    'react', 'vue', 'angular', 'svelte', 'nodejs', 'express', 'nextjs', 'nuxt',
    'django', 'flask', 'fastapi', 'spring', 'rails', 'laravel', 'symfony',
    'flutter', 'react-native', 'ionic', 'electron', 'tensorflow', 'pytorch'
  ];


  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Skills Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            What are your skills?
          </label>
          
          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input Field */}
          <div className="relative">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a skill and press Enter or comma..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={loading}
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Popular Languages */}
          <div className="mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Popular languages:</p>
            <div className="flex flex-wrap gap-2">
              {popularLanguages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => addSkill(language)}
                  disabled={loading || skills.includes(language)}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Frameworks */}
          <div className="mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Popular frameworks:</p>
            <div className="flex flex-wrap gap-2">
              {popularFrameworks.map((framework) => (
                <button
                  key={framework}
                  type="button"
                  onClick={() => addSkill(framework)}
                  disabled={loading || skills.includes(framework)}
                  className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {framework}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            What's your goal?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                value: 'profile-building',
                label: 'Profile Building',
                description: 'High-quality, well-known repositories',
                icon: '🏆'
              },
              {
                value: 'learning',
                label: 'Learning Mode',
                description: 'Educational value and skill development',
                icon: '📚'
              },
              {
                value: 'quick-wins',
                label: 'Quick Wins',
                description: 'Easy contributions for immediate impact',
                icon: '⚡'
              }
            ].map((option) => (
              <label
                key={option.value}
                className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-all ${
                  mode === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value={option.value}
                  checked={mode === option.value}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="sr-only"
                  disabled={loading}
                />
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Results Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Number of results: {limit}
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            disabled={loading}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>5</span>
            <span>50</span>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-center w-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <span className="mr-2">Advanced Filters</span>
            <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 border-t border-gray-200 dark:border-gray-600 pt-6">
            {/* Star Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Repository Size (Stars)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minimum</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={starRange.min || ''}
                    onChange={(e) => setStarRange({...starRange, min: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Maximum</label>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={starRange.max || ''}
                    onChange={(e) => setStarRange({...starRange, max: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading || skills.length === 0}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Finding Repositories...
              </div>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
                Find My Perfect Match
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleFeelingLucky}
            disabled={loading || skills.length === 0}
            className="sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            <SparklesIcon className="h-5 w-5 inline mr-2" />
            I'm Feeling Lucky
          </button>
        </div>
      </form>
    </div>
  );
}
