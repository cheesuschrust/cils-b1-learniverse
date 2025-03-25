/**
 * SEO Utility Functions
 * 
 * This file contains utilities for analyzing and improving SEO for Italian language learning content.
 */

import { ContentType } from '@/types/contentType';

export interface SEOScore {
  overall: number;
  metrics: {
    titleEffectiveness: number;
    keywordUsage: number;
    contentQuality: number;
    readability: number;
    metaDescription: number;
    linkStructure: number;
    mobileResponsiveness: number;
    pageSpeed: number;
  };
  recommendations: SEORecommendation[];
}

export interface SEORecommendation {
  type: 'critical' | 'important' | 'suggestion';
  title: string;
  description: string;
  priority: number;
  actionable: boolean;
  action?: string;
  link?: string;
}

export interface PageMetadata {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  h1Tags: string[];
  h2Tags: string[];
  imageCount: number;
  wordCount: number;
  contentType: ContentType;
  internalLinks: string[];
  externalLinks: string[];
  lastUpdated?: Date;
}

/**
 * Analyze SEO score for a specific page
 */
export const analyzeSEO = (metadata: PageMetadata): SEOScore => {
  // Calculate individual metric scores
  const titleScore = calculateTitleScore(metadata);
  const keywordScore = calculateKeywordScore(metadata);
  const contentScore = calculateContentScore(metadata);
  const readabilityScore = calculateReadabilityScore(metadata);
  const metaDescriptionScore = calculateMetaDescriptionScore(metadata);
  const linkScore = calculateLinkScore(metadata);
  const mobileScore = 95; // This would be calculated from actual mobile testing data
  const speedScore = 88; // This would be calculated from actual page speed data
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (titleScore * 0.15) +
    (keywordScore * 0.2) +
    (contentScore * 0.2) +
    (readabilityScore * 0.1) +
    (metaDescriptionScore * 0.1) +
    (linkScore * 0.1) +
    (mobileScore * 0.1) +
    (speedScore * 0.05)
  );
  
  // Generate recommendations based on scores
  const recommendations = generateRecommendations(metadata, {
    titleEffectiveness: titleScore,
    keywordUsage: keywordScore,
    contentQuality: contentScore,
    readability: readabilityScore,
    metaDescription: metaDescriptionScore,
    linkStructure: linkScore,
    mobileResponsiveness: mobileScore,
    pageSpeed: speedScore
  });
  
  return {
    overall: overallScore,
    metrics: {
      titleEffectiveness: titleScore,
      keywordUsage: keywordScore,
      contentQuality: contentScore,
      readability: readabilityScore,
      metaDescription: metaDescriptionScore,
      linkStructure: linkScore,
      mobileResponsiveness: mobileScore,
      pageSpeed: speedScore
    },
    recommendations
  };
};

/**
 * Calculate title effectiveness score
 */
const calculateTitleScore = (metadata: PageMetadata): number => {
  const { title, keywords } = metadata;
  
  if (!title) return 30;
  
  let score = 70; // Base score
  
  // Length check (optimal is 50-60 characters)
  if (title.length >= 40 && title.length <= 65) {
    score += 15;
  } else if (title.length > 30 && title.length < 75) {
    score += 5;
  }
  
  // Keyword usage in title
  if (keywords && keywords.length > 0) {
    const lowerTitle = title.toLowerCase();
    const keywordInTitle = keywords.some(keyword => 
      lowerTitle.includes(keyword.toLowerCase())
    );
    
    if (keywordInTitle) score += 15;
  }
  
  return Math.min(100, score);
};

/**
 * Calculate keyword usage score
 */
const calculateKeywordScore = (metadata: PageMetadata): number => {
  const { keywords, title, description, h1Tags, h2Tags } = metadata;
  
  if (!keywords || keywords.length === 0) return 30;
  
  let score = 50; // Base score
  
  // Number of keywords (not too few, not too many)
  if (keywords.length >= 2 && keywords.length <= 5) {
    score += 10;
  } else if (keywords.length > 5 && keywords.length <= 8) {
    score += 5;
  }
  
  // Keyword presence in important elements
  if (title && keywords.some(kw => title.toLowerCase().includes(kw.toLowerCase()))) {
    score += 10;
  }
  
  if (description && keywords.some(kw => description.toLowerCase().includes(kw.toLowerCase()))) {
    score += 10;
  }
  
  const h1HasKeyword = h1Tags.some(h1 => 
    keywords.some(kw => h1.toLowerCase().includes(kw.toLowerCase()))
  );
  
  if (h1HasKeyword) score += 10;
  
  const h2HasKeyword = h2Tags.some(h2 => 
    keywords.some(kw => h2.toLowerCase().includes(kw.toLowerCase()))
  );
  
  if (h2HasKeyword) score += 10;
  
  return Math.min(100, score);
};

/**
 * Calculate content quality score
 */
const calculateContentScore = (metadata: PageMetadata): number => {
  const { wordCount, h1Tags, h2Tags, imageCount } = metadata;
  
  let score = 40; // Base score
  
  // Content length (300+ words is good for most pages)
  if (wordCount >= 500) {
    score += 20;
  } else if (wordCount >= 300) {
    score += 15;
  } else if (wordCount >= 200) {
    score += 10;
  }
  
  // Heading structure
  if (h1Tags.length === 1) { // Exactly one H1 is ideal
    score += 10;
  }
  
  if (h2Tags.length >= 2) { // Multiple H2s show good content structure
    score += 10;
  }
  
  // Images (good for engagement and breaking up text)
  if (imageCount >= 3) {
    score += 10;
  } else if (imageCount >= 1) {
    score += 5;
  }
  
  // Freshness
  if (metadata.lastUpdated) {
    const ageInDays = (new Date().getTime() - metadata.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays < 30) {
      score += 10; // Content updated in the last month
    } else if (ageInDays < 90) {
      score += 5; // Content updated in the last 3 months
    }
  }
  
  return Math.min(100, score);
};

/**
 * Calculate readability score
 */
const calculateReadabilityScore = (metadata: PageMetadata): number => {
  // In a real implementation, this would analyze the actual content
  // For now, we'll return a simulated score
  const { contentType } = metadata;
  
  // Different content types might have different readability standards
  switch (contentType) {
    case 'multiple-choice':
      return 95; // Usually very readable
    case 'flashcards':
      return 98; // Very concise and readable
    case 'writing':
      return 85; // More complex content
    case 'speaking':
      return 90; // Conversation practice is usually accessible
    case 'listening':
      return 88; // Audio content with transcripts
    default:
      return 85; // Default score
  }
};

/**
 * Calculate meta description score
 */
const calculateMetaDescriptionScore = (metadata: PageMetadata): number => {
  const { description, keywords } = metadata;
  
  if (!description) return 30;
  
  let score = 50; // Base score
  
  // Length check (optimal is 120-160 characters)
  if (description.length >= 120 && description.length <= 160) {
    score += 25;
  } else if (description.length >= 80 && description.length < 120) {
    score += 15;
  } else if (description.length > 160 && description.length <= 200) {
    score += 10;
  }
  
  // Keyword usage in description
  if (keywords && keywords.length > 0) {
    const lowerDesc = description.toLowerCase();
    const keywordInDesc = keywords.some(keyword => 
      lowerDesc.includes(keyword.toLowerCase())
    );
    
    if (keywordInDesc) score += 25;
  }
  
  return Math.min(100, score);
};

/**
 * Calculate link structure score
 */
const calculateLinkScore = (metadata: PageMetadata): number => {
  const { internalLinks, externalLinks } = metadata;
  
  let score = 60; // Base score
  
  // Internal links - important for site structure and keeping users on your site
  if (internalLinks.length >= 5) {
    score += 20;
  } else if (internalLinks.length >= 2) {
    score += 10;
  }
  
  // External links - good for credibility and context
  if (externalLinks.length >= 2) {
    score += 15;
  } else if (externalLinks.length >= 1) {
    score += 5;
  }
  
  // Check for duplicate links (would reduce score in real implementation)
  
  return Math.min(100, score);
};

/**
 * Generate SEO recommendations based on metric scores
 */
const generateRecommendations = (
  metadata: PageMetadata, 
  metrics: SEOScore['metrics']
): SEORecommendation[] => {
  const recommendations: SEORecommendation[] = [];
  
  // Title recommendations
  if (metrics.titleEffectiveness < 70) {
    recommendations.push({
      type: 'important',
      title: 'Improve Page Title',
      description: 'Your page title should be 50-60 characters and include your primary keyword.',
      priority: 85,
      actionable: true,
      action: 'Edit page title',
      link: `/admin/seo/edit?url=${encodeURIComponent(metadata.url)}&field=title`
    });
  }
  
  // Keyword recommendations
  if (metrics.keywordUsage < 70) {
    recommendations.push({
      type: 'important',
      title: 'Optimize Keyword Usage',
      description: 'Keywords should appear in your title, description, and headings.',
      priority: 80,
      actionable: true,
      action: 'Review keyword placement',
      link: `/admin/seo/keywords?url=${encodeURIComponent(metadata.url)}`
    });
  }
  
  // Content recommendations
  if (metrics.contentQuality < 70) {
    if (metadata.wordCount < 300) {
      recommendations.push({
        type: 'critical',
        title: 'Increase Content Length',
        description: 'Your content is too short. Aim for at least 300 words for better search rankings.',
        priority: 90,
        actionable: true,
        action: 'Add more content',
        link: `/admin/seo/edit?url=${encodeURIComponent(metadata.url)}&field=content`
      });
    }
    
    if (metadata.h2Tags.length < 2) {
      recommendations.push({
        type: 'suggestion',
        title: 'Add More Subheadings',
        description: 'Break up your content with H2 and H3 headings to improve readability.',
        priority: 70,
        actionable: true,
        action: 'Add subheadings',
        link: `/admin/seo/edit?url=${encodeURIComponent(metadata.url)}&field=headings`
      });
    }
  }
  
  // Meta description recommendations
  if (metrics.metaDescription < 70) {
    recommendations.push({
      type: 'important',
      title: 'Improve Meta Description',
      description: 'Your meta description should be 120-160 characters and include your primary keyword.',
      priority: 85,
      actionable: true,
      action: 'Edit meta description',
      link: `/admin/seo/edit?url=${encodeURIComponent(metadata.url)}&field=description`
    });
  }
  
  // Link structure recommendations
  if (metrics.linkStructure < 70) {
    if (metadata.internalLinks.length < 3) {
      recommendations.push({
        type: 'suggestion',
        title: 'Add More Internal Links',
        description: 'Link to other relevant pages on your site to improve navigation and SEO.',
        priority: 70,
        actionable: true,
        action: 'Add internal links',
        link: `/admin/seo/edit?url=${encodeURIComponent(metadata.url)}&field=links`
      });
    }
  }
  
  // Page speed recommendations (these would be based on actual speed tests)
  if (metrics.pageSpeed < 80) {
    recommendations.push({
      type: 'important',
      title: 'Improve Page Speed',
      description: 'Slow page speed affects user experience and search rankings.',
      priority: 80,
      actionable: true,
      action: 'View speed optimization tips',
      link: `/admin/seo/speed?url=${encodeURIComponent(metadata.url)}`
    });
  }
  
  // Sort recommendations by priority
  return recommendations.sort((a, b) => b.priority - a.priority);
};

/**
 * Get keyword suggestions for Italian language learning content
 */
export const getKeywordSuggestions = (contentType: ContentType): string[] => {
  // In a real implementation, this would use keyword research data
  // For now, we'll return useful suggestions for different content types
  
  const baseKeywords = [
    'learn italian online',
    'italian language course',
    'italian vocabulary',
    'italian grammar',
    'speak italian',
    'italian for beginners',
    'b1 italian',
    'italian citizenship test',
    'italian language exam',
    'italian study guide'
  ];
  
  const specificKeywords: Record<ContentType, string[]> = {
    'multiple-choice': [
      'italian practice tests',
      'italian quiz',
      'italian language assessment',
      'italian proficiency test',
      'italian test questions'
    ],
    'flashcards': [
      'italian vocabulary flashcards',
      'italian word list',
      'italian vocabulary builder',
      'memorize italian words',
      'italian flashcard app'
    ],
    'writing': [
      'italian writing exercises',
      'italian composition practice',
      'italian writing skills',
      'italian essay examples',
      'how to write in italian'
    ],
    'speaking': [
      'italian pronunciation guide',
      'italian speaking practice',
      'italian conversation practice',
      'italian speaking exercises',
      'italian dialogue examples'
    ],
    'listening': [
      'italian listening comprehension',
      'italian audio lessons',
      'italian listening exercises',
      'italian podcast for learners',
      'understand spoken italian'
    ],
    'pdf': [
      'italian pdf worksheets',
      'italian pdf exercises',
      'italian study materials pdf',
      'italian grammar pdf',
      'italian workbook pdf'
    ],
    'audio': [
      'italian audio lessons',
      'italian language audio',
      'learn italian audio',
      'italian pronunciation audio',
      'italian listening practice'
    ],
    'csv': [],
    'json': [],
    'txt': [],
    'unknown': []
  };
  
  // Combine general keywords with content-specific ones
  return [...baseKeywords, ...specificKeywords[contentType]];
};

/**
 * Get SEO improvement tips specific to Italian language learning content
 */
export const getLanguageLearningSeoCotips = (): SEORecommendation[] => {
  return [
    {
      type: 'important',
      title: 'Target B1 Citizenship Test Searchers',
      description: 'Add specific content about the Italian citizenship language requirements and B1 exam preparation.',
      priority: 90,
      actionable: true,
      action: 'Create B1 test content',
      link: '/admin/content/create?template=b1-test-prep'
    },
    {
      type: 'important',
      title: 'Use Italian-English Keyword Pairs',
      description: 'Include both Italian and English translations of key terms to capture bilingual searches.',
      priority: 85,
      actionable: true,
      action: 'Review keyword strategy',
      link: '/admin/seo/keywords'
    },
    {
      type: 'suggestion',
      title: 'Create Region-Specific Content',
      description: 'Content specific to Italian regions can attract more targeted traffic for tourists and expatriates.',
      priority: 75,
      actionable: true,
      action: 'Add regional content',
      link: '/admin/content/create?template=regional-italian'
    },
    {
      type: 'important',
      title: 'Optimize for "Italian for Citizenship" Keywords',
      description: 'Many searchers are specifically looking for language learning for citizenship purposes.',
      priority: 88,
      actionable: true,
      action: 'Add citizenship keywords',
      link: '/admin/seo/keywords?focus=citizenship'
    },
    {
      type: 'suggestion',
      title: 'Add Structured Data for Courses',
      description: 'Use Course and ItemList schema markup to enhance your listings in search results.',
      priority: 70,
      actionable: true,
      action: 'Add structured data',
      link: '/admin/seo/schema'
    },
    {
      type: 'critical',
      title: 'Create Content for Spouse Visa Applicants',
      description: 'Italian spouses of citizens are a specific demographic searching for language learning resources.',
      priority: 90,
      actionable: true,
      action: 'Create spouse visa content',
      link: '/admin/content/create?template=spouse-visa'
    }
  ];
};

/**
 * Get mock SEO performance data for dashboard
 */
export const getMockSeoPerformanceData = () => {
  return {
    trafficByPage: [
      { page: '/courses/italian-basics', visits: 1245, conversion: 5.2 },
      { page: '/practice/multiple-choice', visits: 987, conversion: 4.1 },
      { page: '/flashcards/common-phrases', visits: 876, conversion: 6.3 },
      { page: '/b1-test-preparation', visits: 754, conversion: 8.7 },
      { page: '/grammar/verb-conjugation', visits: 643, conversion: 3.8 }
    ],
    keywordPerformance: [
      { keyword: 'italian citizenship test', position: 3, clicks: 587, ctr: 8.4 },
      { keyword: 'b1 italian practice test', position: 5, clicks: 423, ctr: 6.2 },
      { keyword: 'learn italian online free', position: 12, clicks: 356, ctr: 3.1 },
      { keyword: 'italian for beginners', position: 18, clicks: 287, ctr: 2.4 },
      { keyword: 'italian spouse visa language', position: 2, clicks: 265, ctr: 9.7 }
    ],
    trafficTrend: [
      { month: 'Jan', organic: 3420, paid: 1250 },
      { month: 'Feb', organic: 3650, paid: 1180 },
      { month: 'Mar', organic: 4120, paid: 1320 },
      { month: 'Apr', organic: 4560, paid: 1410 },
      { month: 'May', organic: 5120, paid: 1380 },
      { month: 'Jun', organic: 5540, paid: 1240 }
    ],
    deviceBreakdown: [
      { device: 'Mobile', percentage: 58 },
      { device: 'Desktop', percentage: 32 },
      { device: 'Tablet', percentage: 10 }
    ]
  };
};
