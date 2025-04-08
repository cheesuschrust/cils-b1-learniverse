
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HelpNavigation from '@/components/help/HelpNavigation';
import { Video, Play, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';
import { Button } from '@/components/ui/button';

// Define the video guide interface
interface VideoGuide {
  id: string;
  title: string;
  titleItalian?: string;
  description: string;
  descriptionItalian?: string;
  thumbnail?: string;
  videoUrl: string;
  duration: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'features';
  featured?: boolean;
}

const VideoGuidesPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  
  // Sample video guides data
  const videoGuides: VideoGuide[] = [
    {
      id: 'vid-1',
      title: 'Getting Started with Italian Pronunciation',
      titleItalian: 'Primi passi con la pronuncia italiana',
      description: 'Learn the basics of Italian pronunciation with this comprehensive guide',
      descriptionItalian: 'Impara le basi della pronuncia italiana con questa guida completa',
      videoUrl: 'https://example.com/videos/italian-pronunciation',
      thumbnail: 'https://via.placeholder.com/480x270',
      duration: '8:24',
      category: 'beginner',
      featured: true
    },
    {
      id: 'vid-2',
      title: 'Common Italian Greetings',
      titleItalian: 'Saluti comuni in italiano',
      description: 'Master everyday Italian greetings for various situations',
      descriptionItalian: 'Padroneggia i saluti italiani di tutti i giorni per varie situazioni',
      videoUrl: 'https://example.com/videos/italian-greetings',
      thumbnail: 'https://via.placeholder.com/480x270',
      duration: '5:18',
      category: 'beginner'
    },
    {
      id: 'vid-3',
      title: 'Mastering Italian Verb Conjugation',
      titleItalian: 'Padroneggiare la coniugazione dei verbi italiani',
      description: 'A detailed walkthrough of Italian verb conjugation patterns',
      descriptionItalian: 'Una spiegazione dettagliata dei modelli di coniugazione dei verbi italiani',
      videoUrl: 'https://example.com/videos/verb-conjugation',
      thumbnail: 'https://via.placeholder.com/480x270',
      duration: '12:45',
      category: 'intermediate'
    },
    {
      id: 'vid-4',
      title: 'Advanced Italian Conversation Techniques',
      titleItalian: 'Tecniche avanzate di conversazione italiana',
      description: 'Take your Italian speaking skills to the next level',
      descriptionItalian: 'Porta le tue capacità di parlare italiano al livello successivo',
      videoUrl: 'https://example.com/videos/advanced-conversation',
      thumbnail: 'https://via.placeholder.com/480x270',
      duration: '15:32',
      category: 'advanced'
    },
    {
      id: 'vid-5',
      title: 'Using the Flashcard System Effectively',
      titleItalian: 'Utilizzare efficacemente il sistema di flashcard',
      description: 'Learn how to make the most of our flashcard learning system',
      descriptionItalian: 'Scopri come sfruttare al meglio il nostro sistema di apprendimento con flashcard',
      videoUrl: 'https://example.com/videos/flashcard-system',
      thumbnail: 'https://via.placeholder.com/480x270',
      duration: '6:50',
      category: 'features'
    }
  ];
  
  // Filter videos based on active tab
  const getFilteredVideos = () => {
    if (activeTab === 'all') return videoGuides;
    return videoGuides.filter(video => video.category === activeTab);
  };
  
  const filteredVideos = getFilteredVideos();
  const featuredVideo = videoGuides.find(video => video.featured);
  
  return (
    <>
      <Helmet>
        <title>
          {language === 'italian' ? 'Video Guide - Apprendimento Italiano' : 'Video Guides - Italian Learning'}
        </title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-xl font-bold mb-4">
                <BilingualText
                  english="Help Center"
                  italian="Centro Assistenza"
                />
              </h2>
              <HelpNavigation />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                <BilingualText
                  english="Video Guides"
                  italian="Video Guide"
                />
              </h1>
              <p className="text-muted-foreground">
                <BilingualText
                  english="Watch step-by-step video tutorials to improve your Italian skills"
                  italian="Guarda i tutorial video passo-passo per migliorare le tue abilità in italiano"
                />
              </p>
            </div>
            
            {featuredVideo && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>
                    <BilingualText
                      english="Featured Video"
                      italian="Video in Evidenza"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                      {featuredVideo.thumbnail ? (
                        <img 
                          src={featuredVideo.thumbnail} 
                          alt={language === 'italian' && featuredVideo.titleItalian ? featuredVideo.titleItalian : featuredVideo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Video className="h-16 w-16 text-primary/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-full bg-background/80 hover:bg-background">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        {language === 'italian' && featuredVideo.titleItalian 
                          ? featuredVideo.titleItalian 
                          : featuredVideo.title
                        }
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {language === 'italian' && featuredVideo.descriptionItalian 
                          ? featuredVideo.descriptionItalian 
                          : featuredVideo.description
                        }
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Video className="h-4 w-4 mr-1" />
                        <span>{featuredVideo.duration}</span>
                      </div>
                      <Button asChild>
                        <a href={featuredVideo.videoUrl} target="_blank" rel="noopener noreferrer">
                          <BilingualText
                            english="Watch Video"
                            italian="Guarda il Video"
                          />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  <BilingualText
                    english="All Videos"
                    italian="Tutti i Video"
                  />
                </TabsTrigger>
                <TabsTrigger value="beginner">
                  <BilingualText
                    english="Beginner"
                    italian="Principiante"
                  />
                </TabsTrigger>
                <TabsTrigger value="intermediate">
                  <BilingualText
                    english="Intermediate"
                    italian="Intermedio"
                  />
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <BilingualText
                    english="Advanced"
                    italian="Avanzato"
                  />
                </TabsTrigger>
                <TabsTrigger value="features">
                  <BilingualText
                    english="Features"
                    italian="Funzionalità"
                  />
                </TabsTrigger>
              </TabsList>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map(video => (
                  <Card key={video.id} className="h-full flex flex-col">
                    <div className="relative aspect-video bg-muted">
                      {video.thumbnail ? (
                        <img 
                          src={video.thumbnail} 
                          alt={language === 'italian' && video.titleItalian ? video.titleItalian : video.title}
                          className="w-full h-full object-cover rounded-t-md"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 rounded-t-md">
                          <Video className="h-12 w-12 text-primary/50" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {language === 'italian' && video.titleItalian 
                          ? video.titleItalian 
                          : video.title
                        }
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {language === 'italian' && video.descriptionItalian 
                          ? video.descriptionItalian 
                          : video.description
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                          <Play className="h-3 w-3 mr-2" />
                          <BilingualText
                            english="Watch"
                            italian="Guarda"
                          />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredVideos.length === 0 && (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    <BilingualText
                      english="No videos available in this category"
                      italian="Nessun video disponibile in questa categoria"
                    />
                  </h3>
                  <p className="text-muted-foreground">
                    <BilingualText
                      english="Check back soon for new content"
                      italian="Torna presto per nuovi contenuti"
                    />
                  </p>
                </div>
              )}
            </Tabs>
            
            <Card className="bg-muted">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      <BilingualText
                        english="Can't find what you're looking for?"
                        italian="Non trovi quello che cerchi?"
                      />
                    </h3>
                    <p className="text-muted-foreground">
                      <BilingualText
                        english="Request new video topics or browse our other help resources"
                        italian="Richiedi nuovi argomenti video o consulta le nostre altre risorse di aiuto"
                      />
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <a href="/help">
                        <BilingualText
                          english="Help Center"
                          italian="Centro Aiuto"
                        />
                      </a>
                    </Button>
                    <Button asChild>
                      <a href="/support">
                        <BilingualText
                          english="Request Topic"
                          italian="Richiedi Argomento"
                        />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoGuidesPage;
