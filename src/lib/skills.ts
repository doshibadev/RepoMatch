/**
 * Skill normalization and expansion system
 * Handles semantic relationships between technologies and skills
 */

import cacheManager from './cache';

interface SkillNode {
  name: string;
  aliases: string[];
  category: 'language' | 'framework' | 'library' | 'tool' | 'concept' | 'platform';
  related: string[];
  expanded: string[];
}

interface NormalizedSkill {
  original: string;
  normalized: string;
  category: string;
  expanded: string[];
  weight: number;
}

class SkillNormalizer {
  private skillGraph: Map<string, SkillNode> = new Map();

  constructor() {
    this.initializeSkillGraph();
  }

  /**
   * Normalize and expand a list of skills
   * @param skills - Array of user input skills
   * @returns Array of normalized skills with expansions
   */
  async normalizeSkills(skills: string[]): Promise<NormalizedSkill[]> {
    if (!skills || skills.length === 0) return [];

    // Check cache first
    const cachedSkills = await cacheManager.getSkillNormalization(skills);
    if (cachedSkills) {
      return cachedSkills;
    }

    const normalizedSkills = new Map<string, NormalizedSkill>();

    for (const skill of skills) {
      const normalized = this.normalizeSkill(skill);
      if (normalized) {
        // Avoid duplicates by using normalized name as key
        const key = normalized.normalized.toLowerCase();
        if (!normalizedSkills.has(key)) {
          normalizedSkills.set(key, normalized);
        } else {
          // If skill already exists, increase weight
          normalizedSkills.get(key)!.weight += normalized.weight;
        }
      }
    }

    const result = Array.from(normalizedSkills.values());

    // Cache the result
    await cacheManager.setSkillNormalization(skills, result);

    return result;
  }

  /**
   * Normalize a single skill
   * @param skill - Raw skill input
   * @returns Normalized skill object
   */
  private normalizeSkill(skill: string): NormalizedSkill | null {
    const cleanSkill = skill.trim().toLowerCase();
    if (!cleanSkill) return null;

    // Direct match in skill graph
    const directMatch = this.skillGraph.get(cleanSkill);
    if (directMatch) {
      return {
        original: skill,
        normalized: directMatch.name,
        category: directMatch.category,
        expanded: directMatch.expanded,
        weight: 1.0
      };
    }

    // Check aliases
    for (const [key, node] of this.skillGraph.entries()) {
      if (node.aliases.includes(cleanSkill)) {
        return {
          original: skill,
          normalized: node.name,
          category: node.category,
          expanded: node.expanded,
          weight: 0.9 // Slightly lower weight for alias matches
        };
      }
    }

    // Fuzzy match for common variations
    const fuzzyMatch = this.findFuzzyMatch(cleanSkill);
    if (fuzzyMatch) {
      return {
        original: skill,
        normalized: fuzzyMatch.name,
        category: fuzzyMatch.category,
        expanded: fuzzyMatch.expanded,
        weight: 0.8 // Lower weight for fuzzy matches
      };
    }

    // Return as-is if no match found
    return {
      original: skill,
      normalized: cleanSkill,
      category: 'concept',
      expanded: [cleanSkill],
      weight: 0.5
    };
  }

  /**
   * Find fuzzy matches for skills
   * @param skill - Skill to match
   * @returns Matching skill node or null
   */
  private findFuzzyMatch(skill: string): SkillNode | null {
    const variations = this.generateVariations(skill);
    
    for (const variation of variations) {
      const match = this.skillGraph.get(variation);
      if (match) return match;
    }

    return null;
  }

  /**
   * Generate common variations of a skill name
   * @param skill - Original skill name
   * @returns Array of variations
   */
  private generateVariations(skill: string): string[] {
    const variations = [skill];
    
    // Common abbreviations
    const abbreviations: Record<string, string[]> = {
      'javascript': ['js'],
      'typescript': ['ts'],
      'python': ['py'],
      'react': ['reactjs'],
      'vue': ['vuejs'],
      'angular': ['angularjs'],
      'node': ['nodejs'],
      'machine learning': ['ml', 'machinelearning'],
      'artificial intelligence': ['ai'],
      'user interface': ['ui'],
      'user experience': ['ux'],
      'application programming interface': ['api'],
      'representational state transfer': ['rest'],
      'graphql': ['gql'],
      'cascading style sheets': ['css'],
      'hypertext markup language': ['html']
    };

    // Add abbreviations
    for (const [full, abbrevs] of Object.entries(abbreviations)) {
      if (skill.includes(full)) {
        variations.push(...abbrevs);
      }
      for (const abbrev of abbrevs) {
        if (skill.includes(abbrev)) {
          variations.push(full);
        }
      }
    }

    // Add version numbers
    if (skill.match(/\d+/)) {
      variations.push(skill.replace(/\d+/g, ''));
    } else {
      variations.push(skill + '3', skill + '2', skill + '1');
    }

    return variations;
  }

  /**
   * Get all expanded skills as a flat array
   * @param skills - Array of normalized skills
   * @returns Flat array of all expanded skills
   */
  getExpandedSkills(skills: NormalizedSkill[]): string[] {
    const expanded = new Set<string>();
    
    for (const skill of skills) {
      expanded.add(skill.normalized);
      skill.expanded.forEach(s => expanded.add(s));
    }

    return Array.from(expanded);
  }

  /**
   * Initialize the skill relationship graph
   */
  private initializeSkillGraph(): void {
    const skills: SkillNode[] = [
      // Frontend Languages
      {
        name: 'javascript',
        aliases: ['js', 'ecmascript'],
        category: 'language',
        related: ['typescript', 'nodejs', 'react', 'vue', 'angular'],
        expanded: ['javascript', 'js', 'ecmascript', 'frontend', 'web', 'browser']
      },
      {
        name: 'typescript',
        aliases: ['ts'],
        category: 'language',
        related: ['javascript', 'react', 'angular', 'nodejs'],
        expanded: ['typescript', 'ts', 'javascript', 'js', 'frontend', 'web', 'typed']
      },
      {
        name: 'html',
        aliases: ['html5'],
        category: 'language',
        related: ['css', 'javascript', 'web'],
        expanded: ['html', 'html5', 'markup', 'web', 'frontend', 'semantic']
      },
      {
        name: 'css',
        aliases: ['css3'],
        category: 'language',
        related: ['html', 'javascript', 'scss', 'sass'],
        expanded: ['css', 'css3', 'styling', 'web', 'frontend', 'design']
      },

      // Frontend Frameworks
      {
        name: 'react',
        aliases: ['reactjs'],
        category: 'framework',
        related: ['javascript', 'typescript', 'jsx', 'redux'],
        expanded: ['react', 'reactjs', 'javascript', 'js', 'frontend', 'web', 'ui', 'component', 'jsx', 'hooks']
      },
      {
        name: 'vue',
        aliases: ['vuejs'],
        category: 'framework',
        related: ['javascript', 'typescript', 'nuxt'],
        expanded: ['vue', 'vuejs', 'javascript', 'js', 'frontend', 'web', 'ui', 'component']
      },
      {
        name: 'angular',
        aliases: ['angularjs'],
        category: 'framework',
        related: ['typescript', 'javascript', 'rxjs'],
        expanded: ['angular', 'angularjs', 'typescript', 'ts', 'javascript', 'js', 'frontend', 'web', 'ui', 'component']
      },
      {
        name: 'svelte',
        aliases: [],
        category: 'framework',
        related: ['javascript', 'typescript'],
        expanded: ['svelte', 'javascript', 'js', 'frontend', 'web', 'ui', 'component']
      },

      // Backend Languages
      {
        name: 'python',
        aliases: ['py'],
        category: 'language',
        related: ['django', 'flask', 'fastapi', 'pandas', 'numpy'],
        expanded: ['python', 'py', 'backend', 'server', 'scripting', 'data-science']
      },
      {
        name: 'java',
        aliases: [],
        category: 'language',
        related: ['spring', 'maven', 'gradle'],
        expanded: ['java', 'backend', 'server', 'enterprise', 'jvm']
      },
      {
        name: 'go',
        aliases: ['golang'],
        category: 'language',
        related: ['gin', 'echo', 'fiber'],
        expanded: ['go', 'golang', 'backend', 'server', 'microservice', 'concurrent']
      },
      {
        name: 'rust',
        aliases: [],
        category: 'language',
        related: ['actix', 'tokio', 'serde'],
        expanded: ['rust', 'backend', 'server', 'systems', 'performance', 'memory-safe']
      },
      {
        name: 'php',
        aliases: [],
        category: 'language',
        related: ['laravel', 'symfony', 'composer'],
        expanded: ['php', 'backend', 'server', 'web']
      },
      {
        name: 'ruby',
        aliases: [],
        category: 'language',
        related: ['rails', 'sinatra', 'bundler'],
        expanded: ['ruby', 'backend', 'server', 'web', 'rails']
      },

      // Backend Frameworks
      {
        name: 'nodejs',
        aliases: ['node'],
        category: 'platform',
        related: ['javascript', 'express', 'koa', 'nestjs'],
        expanded: ['nodejs', 'node', 'javascript', 'js', 'backend', 'server', 'npm']
      },
      {
        name: 'django',
        aliases: [],
        category: 'framework',
        related: ['python', 'djangorestframework'],
        expanded: ['django', 'python', 'py', 'backend', 'server', 'web', 'mvc', 'orm']
      },
      {
        name: 'flask',
        aliases: [],
        category: 'framework',
        related: ['python', 'sqlalchemy'],
        expanded: ['flask', 'python', 'py', 'backend', 'server', 'web', 'microframework']
      },
      {
        name: 'express',
        aliases: ['expressjs'],
        category: 'framework',
        related: ['nodejs', 'javascript'],
        expanded: ['express', 'expressjs', 'nodejs', 'node', 'javascript', 'js', 'backend', 'server', 'web']
      },
      {
        name: 'spring',
        aliases: ['springboot'],
        category: 'framework',
        related: ['java', 'maven'],
        expanded: ['spring', 'springboot', 'java', 'backend', 'server', 'enterprise', 'dependency-injection']
      },

      // Databases
      {
        name: 'postgresql',
        aliases: ['postgres'],
        category: 'tool',
        related: ['sql', 'database'],
        expanded: ['postgresql', 'postgres', 'sql', 'database', 'db', 'relational']
      },
      {
        name: 'mysql',
        aliases: [],
        category: 'tool',
        related: ['sql', 'database'],
        expanded: ['mysql', 'sql', 'database', 'db', 'relational']
      },
      {
        name: 'mongodb',
        aliases: ['mongo'],
        category: 'tool',
        related: ['nosql', 'database'],
        expanded: ['mongodb', 'mongo', 'nosql', 'database', 'db', 'document']
      },
      {
        name: 'redis',
        aliases: [],
        category: 'tool',
        related: ['cache', 'database'],
        expanded: ['redis', 'cache', 'database', 'db', 'key-value', 'in-memory']
      },

      // DevOps & Tools
      {
        name: 'docker',
        aliases: [],
        category: 'tool',
        related: ['kubernetes', 'containerization'],
        expanded: ['docker', 'container', 'containerization', 'devops', 'deployment']
      },
      {
        name: 'kubernetes',
        aliases: ['k8s'],
        category: 'tool',
        related: ['docker', 'containerization'],
        expanded: ['kubernetes', 'k8s', 'container', 'orchestration', 'devops', 'deployment']
      },
      {
        name: 'aws',
        aliases: ['amazon web services'],
        category: 'platform',
        related: ['cloud', 'devops'],
        expanded: ['aws', 'amazon web services', 'cloud', 'devops', 'infrastructure']
      },
      {
        name: 'git',
        aliases: [],
        category: 'tool',
        related: ['github', 'gitlab'],
        expanded: ['git', 'version-control', 'vcs', 'scm']
      },

      // Data Science & AI
      {
        name: 'machine learning',
        aliases: ['ml'],
        category: 'concept',
        related: ['python', 'tensorflow', 'pytorch', 'scikit-learn'],
        expanded: ['machine learning', 'ml', 'ai', 'artificial intelligence', 'data-science', 'python', 'py']
      },
      {
        name: 'tensorflow',
        aliases: ['tf'],
        category: 'library',
        related: ['python', 'machine learning'],
        expanded: ['tensorflow', 'tf', 'python', 'py', 'machine learning', 'ml', 'deep learning', 'neural network']
      },
      {
        name: 'pytorch',
        aliases: [],
        category: 'library',
        related: ['python', 'machine learning'],
        expanded: ['pytorch', 'python', 'py', 'machine learning', 'ml', 'deep learning', 'neural network']
      },
      {
        name: 'pandas',
        aliases: [],
        category: 'library',
        related: ['python', 'data science'],
        expanded: ['pandas', 'python', 'py', 'data-science', 'data-analysis', 'dataframe']
      },

      // Mobile Development
      {
        name: 'react native',
        aliases: ['reactnative'],
        category: 'framework',
        related: ['react', 'javascript', 'mobile'],
        expanded: ['react native', 'reactnative', 'react', 'javascript', 'js', 'mobile', 'ios', 'android', 'cross-platform']
      },
      {
        name: 'flutter',
        aliases: [],
        category: 'framework',
        related: ['dart', 'mobile'],
        expanded: ['flutter', 'dart', 'mobile', 'ios', 'android', 'cross-platform', 'ui']
      },
      {
        name: 'swift',
        aliases: [],
        category: 'language',
        related: ['ios', 'mobile'],
        expanded: ['swift', 'ios', 'mobile', 'apple', 'objective-c']
      },
      {
        name: 'kotlin',
        aliases: [],
        category: 'language',
        related: ['android', 'mobile'],
        expanded: ['kotlin', 'android', 'mobile', 'jvm', 'java']
      }
    ];

    // Build the skill graph
    for (const skill of skills) {
      this.skillGraph.set(skill.name.toLowerCase(), skill);
    }
  }

  /**
   * Get skill statistics for debugging
   */
  getSkillStats(): { totalSkills: number; categories: Record<string, number> } {
    const categories: Record<string, number> = {};
    
    for (const skill of this.skillGraph.values()) {
      categories[skill.category] = (categories[skill.category] || 0) + 1;
    }

    return {
      totalSkills: this.skillGraph.size,
      categories
    };
  }
}

// Create singleton instance
const skillNormalizer = new SkillNormalizer();

export default skillNormalizer;
export type { NormalizedSkill, SkillNode };
