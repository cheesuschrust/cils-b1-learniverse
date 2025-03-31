
import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface CourseSEOProps {
  name: string;
  description: string;
  provider?: string;
  providerUrl?: string;
  courseCode?: string;
  courseLevel?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  price?: number;
  currency?: string;
  learningOutcomes?: string[];
  image?: string;
}

/**
 * Component for adding course structured data to pages
 */
const CourseSEO: React.FC<CourseSEOProps> = ({
  name,
  description,
  provider = "Italian Language Learning Platform",
  providerUrl = window.location.origin,
  courseCode,
  courseLevel,
  startDate,
  endDate,
  duration,
  price,
  currency = "USD",
  learningOutcomes = [],
  image
}) => {
  // Create course schema
  const courseSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': name,
    'description': description,
    'provider': {
      '@type': 'Organization',
      'name': provider,
      'sameAs': providerUrl
    }
  };
  
  // Add optional properties if provided
  if (courseCode) courseSchema.courseCode = courseCode;
  if (courseLevel) courseSchema.educationalLevel = courseLevel;
  if (image) courseSchema.image = image;
  
  // Add learning outcomes if provided
  if (learningOutcomes.length > 0) {
    courseSchema.teaches = learningOutcomes;
  }
  
  // Add course instance if we have timing information
  if (startDate || endDate || duration) {
    const courseInstance: Record<string, any> = {
      '@type': 'CourseInstance'
    };
    
    if (startDate) courseInstance.startDate = startDate;
    if (endDate) courseInstance.endDate = endDate;
    if (duration) courseInstance.duration = duration;
    
    // Add pricing information if available
    if (price !== undefined) {
      courseInstance.offers = {
        '@type': 'Offer',
        'price': price,
        'priceCurrency': currency
      };
    }
    
    courseSchema.hasCourseInstance = courseInstance;
  } else if (price !== undefined) {
    // Add pricing even without course instance
    courseSchema.offers = {
      '@type': 'Offer',
      'price': price,
      'priceCurrency': currency
    };
  }
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(courseSchema)}
      </script>
    </Helmet>
  );
};

export default CourseSEO;
