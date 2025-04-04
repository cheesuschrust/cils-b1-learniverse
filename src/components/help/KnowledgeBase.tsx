
import React, { useState, useEffect } from 'react';
import { Search, Book, FileText, HelpCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';

interface ArticleCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tags: string[];
  isPremium: boolean;
}

const KnowledgeBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  
  // Define article categories
  const categories: ArticleCategory[] = [
    {
      id: 'exam-info',
      name: 'CILS Exam Information',
      description: 'Learn about the CILS B1 exam format, requirements, and scoring',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'citizenship',
      name: 'Citizenship Process',
      description: 'Information about the Italian citizenship application process',
      icon: <Book className="h-5 w-5" />
    },
    {
      id: 'platform',
      name: 'Using Our Platform',
      description: 'Guides for using all features of our learning platform',
      icon: <HelpCircle className="h-5 w-5" />
    }
  ];
  
  // Define articles
  const articles: Article[] = [
    {
      id: 'cils-b1-overview',
      title: 'CILS B1 Exam Overview',
      excerpt: 'An introduction to the CILS B1 exam required for Italian citizenship',
      content: `
# CILS B1 Exam Overview

The CILS (Certificazione di Italiano come Lingua Straniera) is an official certification of Italian language proficiency issued by the University for Foreigners of Siena, recognized by the Italian Ministry of Foreign Affairs.

## Why CILS B1 for Citizenship?

The B1 level is commonly required for citizenship applications. It demonstrates an intermediate level of Italian language proficiency, showing that you can:

- Understand the main points of clear standard input on familiar matters
- Deal with most situations likely to arise while traveling in Italy
- Produce simple connected text on topics that are familiar or of personal interest
- Describe experiences, events, dreams, hopes and ambitions
- Briefly give reasons and explanations for opinions and plans

## Exam Structure

The CILS B1 exam consists of five parts:

1. **Listening (Ascolto)** - 30 minutes
   - Comprehension of conversations and audio recordings
   - Multiple-choice and fill-in-the-blank questions

2. **Reading (Lettura)** - 40 minutes
   - Comprehension of written texts
   - Multiple-choice, matching, and true/false questions

3. **Grammar (Analisi delle strutture di comunicazione)** - 40 minutes
   - Fill-in-the-blank exercises
   - Multiple-choice grammar questions

4. **Writing (Produzione scritta)** - 60 minutes
   - Two writing tasks (short email and longer essay)
   - Total of approximately 180 words

5. **Speaking (Produzione orale)** - 10 minutes
   - Personal introduction
   - Conversation with the examiner
   - Description of an image

## Scoring

Each section is worth 20 points, for a total of 100 points. To pass, you need:

- A minimum of 11/20 in each section
- A total score of at least 60/100

## Exam Dates and Registration

The CILS exam is typically offered four times per year (February, June, August, and December) at certified examination centers worldwide. Registration must be completed several weeks in advance.

## Our Preparation Approach

Our platform is specifically designed to prepare you for all aspects of the CILS B1 exam with:

- Targeted exercises for each exam section
- Practice tests that mirror the actual exam format
- Personalized feedback on your writing and speaking
- Adaptive learning that focuses on your weak areas

Start with our free CILS B1 practice test to assess your current level and create your personalized study plan.
      `,
      categoryId: 'exam-info',
      tags: ['CILS', 'B1', 'exam format', 'citizenship test'],
      isPremium: false
    },
    {
      id: 'citizenship-requirements',
      title: 'Italian Citizenship Requirements',
      excerpt: 'Overview of the requirements for obtaining Italian citizenship',
      content: `
# Italian Citizenship Requirements

There are several paths to Italian citizenship, each with different requirements. This article focuses on the most common paths and their language requirements.

## Citizenship by Descent (Jure Sanguinis)

If you have Italian ancestors, you may qualify for citizenship by descent.

**Key Requirements:**
- Demonstrate an unbroken line of Italian citizenship from your ancestor to you
- Your Italian ancestor must have been alive after the formation of the Italian state (March 17, 1861)
- Your Italian ancestor must not have naturalized in another country before the birth of their child
- Gather birth, marriage, and death certificates for all people in your lineage

**Language Requirement:** None. Citizenship by descent does not require a language test.

## Citizenship by Marriage

If you are married to an Italian citizen, you can apply for citizenship after a certain period.

**Key Requirements:**
- For applications filed after December 1, 2018: Marriage to an Italian citizen for at least 2 years (if residing in Italy) or 3 years (if residing abroad)
- These time periods are reduced by half if you have children together
- No serious criminal record

**Language Requirement:** B1 level Italian language certification (such as CILS B1)

## Citizenship by Residency

If you have legally resided in Italy for a specific period, you may apply for citizenship.

**Key Requirements:**
- EU citizens: 4 years of legal residency
- Non-EU citizens: 10 years of legal residency
- Stateless persons and refugees: 5 years of legal residency
- Continuous registration with your local commune (anagrafe)
- Financial self-sufficiency
- No serious criminal record

**Language Requirement:** B1 level Italian language certification (such as CILS B1)

## Language Certification Details

For citizenship by marriage or residency, you must provide a B1 (or higher) level certification from one of these approved bodies:

- CILS (Certificazione di Italiano come Lingua Straniera)
- CELI (Certificato di Conoscenza della Lingua Italiana)
- PLIDA (Progetto Lingua Italiana Dante Alighieri)
- Roma Tre

The certification must be recent (typically no older than 2 years) at the time of application.

## Exemptions from Language Requirements

The following people may be exempt from the language requirement:

- Those with a serious medical condition affecting language learning (medical documentation required)
- Those who obtained an Italian degree
- Children under 18
- Adults over 65 (in some cases)

## Our Platform's Role in Your Citizenship Journey

Our platform is specifically designed to help you reach the B1 level required for citizenship applications. We offer:

- Targeted CILS B1 exam preparation
- Citizenship-focused vocabulary and topics
- Mock tests that simulate the actual exam
- Progress tracking to ensure you're on path to success

Start with our citizenship assessment to create your personalized Italian learning journey.
      `,
      categoryId: 'citizenship',
      tags: ['citizenship', 'requirements', 'jure sanguinis', 'residency', 'marriage'],
      isPremium: false
    },
    {
      id: 'platform-features',
      title: 'Platform Features Guide',
      excerpt: 'An overview of all the features available in our learning platform',
      content: `
# Platform Features Guide

Our Italian language learning platform is specifically designed to help you prepare for the CILS B1 citizenship exam. Here's a comprehensive guide to all the features available to you.

## Learning Modules

### Daily Questions
- Receive personalized questions every day
- Track your streak for consistent practice
- Receive detailed explanations for each answer
- Free users: 1 question per day
- Premium users: Unlimited questions

### Flashcards
- Spaced repetition system for optimal retention
- Pre-made decks focusing on CILS B1 vocabulary
- Create your own custom flashcard decks
- Free users: Limited to 50 cards
- Premium users: Unlimited flashcards

### Listening Practice
- Audio clips from native Italian speakers
- Different accents and speeds for comprehensive practice
- Transcripts and explanations available
- Free users: 5 exercises per day
- Premium users: Unlimited access

### Reading Comprehension
- Texts at progressive difficulty levels
- CILS B1 exam-style questions
- Cultural and citizenship-related content
- Free users: 5 exercises per day
- Premium users: Unlimited access

### Writing Exercises
- Guided prompts matching CILS exam topics
- Automated feedback on grammar and vocabulary
- Premium users: Personal feedback from Italian tutors
- Free users: 3 exercises per day
- Premium users: Unlimited access and personalized feedback

### Speaking Practice
- Speech recognition technology
- Pronunciation feedback and scoring
- Conversation simulations
- Free users: 5 exercises per day
- Premium users: Unlimited access

## Study Tools

### Progress Tracking
- Comprehensive dashboard showing your progress
- Weak areas identification
- CILS B1 readiness indicator
- Study streak calendar
- Performance analytics

### Mock Exams
- Full CILS B1 exam simulations
- Timed sections matching the real test
- Detailed performance analysis
- Free users: 1 mock exam per month
- Premium users: Unlimited mock exams

### Study Planner
- Personalized study schedule
- Adaptive recommendations
- Exam date countdown
- Premium feature only

## Community Features

### Discussion Forums
- Connect with other citizenship applicants
- Ask questions and share experiences
- Practice writing in Italian
- Get advice from those who've passed the exam

### Resource Library
- Downloadable study materials
- Citizenship application guides
- Italian culture resources
- Free users: Limited access
- Premium users: Full access to all resources

## Account Settings

### Profile Customization
- Update your personal information
- Set your learning goals
- Track your achievements
- Connect social accounts

### Notification Preferences
- Study reminders
- Progress updates
- New content alerts
- Community interactions

### Subscription Management
- View your current plan
- Upgrade or change your subscription
- Billing history and receipts
- Payment methods

For detailed tutorials on using each feature, visit our Video Tutorials section or contact our support team for personalized assistance.
      `,
      categoryId: 'platform',
      tags: ['features', 'guide', 'tutorial', 'premium', 'free'],
      isPremium: false
    },
    {
      id: 'cils-practice-strategies',
      title: 'Effective CILS B1 Practice Strategies',
      excerpt: 'Advanced strategies for efficient CILS B1 exam preparation',
      content: `
# Effective CILS B1 Practice Strategies

Preparing for the CILS B1 exam requires a strategic approach. This guide provides advanced strategies to optimize your study time and maximize your chances of success.

## Creating an Effective Study Schedule

### Time Management
- Allocate at least 30-60 minutes daily for consistent practice
- Focus on one skill area (listening, reading, writing, speaking) per day
- Reserve longer weekend sessions for mock exams and comprehensive review
- Study in shorter, focused sessions rather than marathon cramming

### Balance Your Approach
- Evaluate your current proficiency in each exam section
- Allocate more time to your weakest areas
- Maintain regular practice of stronger skills to prevent regression
- Adjust your schedule based on progress assessments

## Section-Specific Strategies

### Listening (Ascolto)
- Practice with a variety of accents and speech speeds
- Take notes while listening to capture key information
- Listen to Italian media daily (news, podcasts, radio)
- Practice with background noise to build real-world listening skills

### Reading (Lettura)
- Read a variety of text types (news articles, blogs, stories)
- Practice skimming for general meaning and scanning for specific information
- Build vocabulary through context rather than isolated word lists
- Time your reading to build speed and efficiency

### Grammar (Analisi delle strutture di comunicazione)
- Focus on CILS B1 common grammar patterns
- Create personal examples for each grammar rule
- Keep a grammar error journal and review regularly
- Use spaced repetition to master problematic grammar points

### Writing (Produzione scritta)
- Practice with timed conditions to build speed
- Create templates for common writing tasks (emails, essays)
- Build a collection of useful phrases and transitions
- Review and correct your own writing before checking answers

### Speaking (Produzione orale)
- Record yourself and assess your pronunciation
- Practice speaking about common CILS topics
- Prepare and rehearse personal introduction
- Find a language exchange partner for regular conversation

## Mock Exam Approach
- Take full mock exams under timed conditions
- Simulate exam environment (quiet space, no interruptions)
- Complete all sections in one sitting at least twice before your exam
- Analyze your performance to identify patterns in errors

## Two Weeks Before the Exam
- Focus on mock exams and reviewing weak areas
- Familiarize yourself with exam day procedures
- Prepare all required documents
- Ensure you know the exam location and transportation options

## The Day Before
- Light review only - no intensive studying
- Prepare your exam materials (ID, admission ticket, pens)
- Get a good night's sleep
- Avoid alcohol and heavy meals

## Premium Resources
Premium members have access to:
- Personalized study plan based on diagnostic assessment
- One-on-one tutoring sessions with CILS experts
- Advanced error analysis of your practice tests
- Customized feedback on writing and speaking tasks

Our platform's adaptive learning system will automatically integrate these strategies into your personalized study plan, focusing your efforts where they'll have the greatest impact on your CILS B1 success.
      `,
      categoryId: 'exam-info',
      tags: ['CILS', 'study strategies', 'exam preparation', 'advanced'],
      isPremium: true
    },
    {
      id: 'dual-citizenship-guide',
      title: 'Complete Guide to Italian Dual Citizenship',
      excerpt: 'Comprehensive information about obtaining and maintaining dual citizenship',
      content: `
# Complete Guide to Italian Dual Citizenship

Italy recognizes dual citizenship, allowing you to maintain your original citizenship while becoming an Italian citizen. This guide covers everything you need to know about Italian dual citizenship.

## Benefits of Italian Dual Citizenship

- **EU Mobility**: Live, work, study, and retire anywhere in the European Union
- **Healthcare Access**: Access to Italy's public healthcare system
- **Educational Opportunities**: Study at Italian universities at local tuition rates
- **Property Ownership**: Simplified process for purchasing property in Italy
- **Business Advantages**: Establish businesses in Italy and the EU with fewer restrictions
- **Consular Protection**: Receive assistance from Italian consulates worldwide
- **Citizenship for Descendants**: Pass Italian citizenship to your children

## Paths to Dual Citizenship

### 1. Citizenship by Descent (Jure Sanguinis)
Most common and straightforward path for those with Italian ancestry.

**Key Points:**
- No generational limit for qualifying ancestors
- Documentation must prove unbroken chain of Italian citizenship
- Your ancestor must not have naturalized elsewhere before the birth of their descendants
- No language requirements for this path

### 2. Citizenship by Marriage
Available to those married to Italian citizens.

**Key Points:**
- 2 years of marriage if residing in Italy, 3 years if abroad
- Time periods reduced by half with children
- Requires B1 Italian language certification
- Clean criminal record required

### 3. Citizenship by Residency
For those who have legally resided in Italy.

**Key Points:**
- EU citizens: 4 years of legal residency
- Non-EU citizens: 10 years of legal residency
- Requires B1 Italian language certification
- Financial self-sufficiency must be demonstrated
- Clean criminal record required

## Documentation Requirements

### For Citizenship by Descent
- Birth certificates for all people in your lineage
- Marriage certificates for all people in your lineage
- Death certificates (if applicable)
- Naturalization records or proof of non-naturalization
- Certificate of Italian citizenship for your ancestor
- All documents must be apostilled/legalized and translated

### For Citizenship by Marriage or Residency
- Birth certificate
- Marriage certificate (for marriage-based applications)
- Criminal background check
- Proof of residency
- B1 language certification
- Proof of financial resources (for residency-based applications)

## Application Process

### Citizenship by Descent
1. Research your eligibility and identify your Italian ancestor
2. Collect all required documents from both countries
3. Obtain apostilles/legalization for all non-Italian documents
4. Arrange certified translations for all non-Italian documents
5. Book an appointment at your local Italian consulate or comune
6. Submit your application and supporting documentation
7. Wait for processing (typically 1-3 years depending on location)

### Citizenship by Marriage or Residency
1. Obtain Italian language certification (B1 level)
2. Collect all required documents
3. Submit application through the Italian Ministry of Interior portal
4. Attend interview if requested
5. Wait for processing (typically 2-4 years)

## Maintaining Dual Citizenship

- Register with AIRE (Registry of Italians Residing Abroad) if living outside Italy
- Keep your Italian passport current (renew every 10 years)
- Be aware of tax implications in both countries
- Understand voting rights and responsibilities
- Consider implications for military service obligations

## Premium Services

Our premium members have access to:
- Personalized document checklists
- Expert citizenship application reviews
- Consulate booking assistance
- Direct connections to citizenship lawyers
- Document translation services

## Next Steps

1. Take our citizenship eligibility assessment
2. Join our dual citizenship community forum
3. Start your Italian language preparation
4. Schedule a consultation with our citizenship experts

Our platform will support your language learning needs for citizenship by marriage or residency paths, with specific focus on achieving the required B1 certification.
      `,
      categoryId: 'citizenship',
      tags: ['dual citizenship', 'jure sanguinis', 'Italian passport', 'EU citizenship'],
      isPremium: true
    }
  ];
  
  // Filter articles based on search query and selected category
  useEffect(() => {
    let filtered = [...articles];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(article => article.categoryId === selectedCategory);
    }
    
    setFilteredArticles(filtered);
  }, [searchQuery, selectedCategory, articles]);
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
  };
  
  // Handle article selection
  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
  };
  
  // Handle back button for article view
  const handleBackToList = () => {
    setSelectedArticle(null);
  };
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search knowledge base..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="all-articles">All Articles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-6">
          {!selectedCategory && !selectedArticle ? (
            // Show categories
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : selectedArticle ? (
            // Show article content
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToList}
                className="mb-4"
              >
                &larr; Back to Articles
              </Button>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
                  <div className="flex flex-wrap gap-2 items-center">
                    {selectedArticle.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                    {selectedArticle.isPremium && (
                      <Badge variant="default" className="bg-amber-500">Premium</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <MarkdownRenderer content={selectedArticle.content} />
                </CardContent>
              </Card>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handleBackToList}>
                  &larr; Back to Articles
                </Button>
                <Button variant="outline" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Print Article
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            // Show articles in selected category
            <div>
              <div className="flex justify-between items-center mb-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCategory(null)}
                >
                  &larr; Back to Categories
                </Button>
                <h2 className="text-xl font-bold">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
              </div>
              
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <Card 
                        key={article.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleArticleSelect(article)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{article.title}</h3>
                                {article.isPremium && (
                                  <Badge variant="default" className="bg-amber-500">Premium</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{article.excerpt}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No articles found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or browsing all categories
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all-articles">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Card 
                    key={article.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleArticleSelect(article)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{article.title}</h3>
                            {article.isPremium && (
                              <Badge variant="default" className="bg-amber-500">Premium</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{article.excerpt}</p>
                          <div className="flex mt-2 gap-2">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{article.tags.length - 3} more</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBase;
