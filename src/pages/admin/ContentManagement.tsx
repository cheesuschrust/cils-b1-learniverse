
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileUpload, FolderOpen, Edit, Trash2, Plus, CheckCircle, BookOpen, FileText, Video, SlidersHorizontal, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BilingualText from '@/components/language/BilingualText';

// Mock content data
const contentItems = [
  { 
    id: '1', 
    title: 'Italian Beginner Grammar', 
    type: 'lesson', 
    category: 'grammar',
    status: 'published', 
    difficulty: 'beginner',
    createdAt: '2025-03-15T10:30:00Z',
    updatedAt: '2025-03-18T14:45:00Z'
  },
  { 
    id: '2', 
    title: 'Common Italian Phrases', 
    type: 'flashcards', 
    category: 'vocabulary',
    status: 'published', 
    difficulty: 'beginner',
    createdAt: '2025-03-10T09:15:00Z',
    updatedAt: '2025-03-10T09:15:00Z'
  },
  { 
    id: '3', 
    title: 'Italian Past Tense', 
    type: 'quiz', 
    category: 'grammar',
    status: 'draft', 
    difficulty: 'intermediate',
    createdAt: '2025-03-22T16:20:00Z',
    updatedAt: '2025-03-22T16:20:00Z'
  },
  { 
    id: '4', 
    title: 'Italian Food Vocabulary', 
    type: 'lesson', 
    category: 'vocabulary',
    status: 'published', 
    difficulty: 'beginner',
    createdAt: '2025-03-05T11:00:00Z',
    updatedAt: '2025-03-20T13:30:00Z'
  },
  { 
    id: '5', 
    title: 'Italian Subjunctive Mood', 
    type: 'video', 
    category: 'grammar',
    status: 'review', 
    difficulty: 'advanced',
    createdAt: '2025-03-25T08:40:00Z',
    updatedAt: '2025-03-25T08:40:00Z'
  },
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'reading', label: 'Reading' },
  { value: 'listening', label: 'Listening' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'writing', label: 'Writing' }
];

const types = [
  { value: 'all', label: 'All Types' },
  { value: 'lesson', label: 'Lesson' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'flashcards', label: 'Flashcards' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'exercise', label: 'Exercise' }
];

const difficulties = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner (A1-A2)' },
  { value: 'intermediate', label: 'Intermediate (B1-B2)' },
  { value: 'advanced', label: 'Advanced (C1-C2)' }
];

const ContentManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  // Filter content based on selected filters and search query
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });
  
  const handleDeleteContent = (id: string) => {
    // In a real app, this would call an API to delete content
    toast({
      title: language === 'italian' ? 'Contenuto Eliminato' : 'Content Deleted',
      description: language === 'italian' 
        ? 'Il contenuto è stato eliminato con successo' 
        : 'The content has been successfully deleted',
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          {language === 'italian' ? 'Pubblicato' : 'Published'}
        </Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
          {language === 'italian' ? 'Bozza' : 'Draft'}
        </Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          {language === 'italian' ? 'In Revisione' : 'In Review'}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="h-4 w-4 mr-2" />;
      case 'quiz':
        return <CheckCircle className="h-4 w-4 mr-2" />;
      case 'flashcards':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'video':
        return <Video className="h-4 w-4 mr-2" />;
      default:
        return <FileText className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <>
      <Helmet>
        <title>
          {language === 'italian' ? 'Gestione Contenuti - Dashboard Admin' : 'Content Management - Admin Dashboard'}
        </title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            <BilingualText
              english="Content Management"
              italian="Gestione Contenuti"
            />
          </h1>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            <BilingualText
              english="Create Content"
              italian="Crea Contenuto"
            />
          </Button>
        </div>
        
        <Tabs defaultValue="library" className="space-y-6">
          <TabsList>
            <TabsTrigger value="library">
              <BilingualText
                english="Content Library"
                italian="Libreria Contenuti"
              />
            </TabsTrigger>
            <TabsTrigger value="upload">
              <BilingualText
                english="Upload Content"
                italian="Carica Contenuti"
              />
            </TabsTrigger>
            <TabsTrigger value="categories">
              <BilingualText
                english="Categories"
                italian="Categorie"
              />
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BilingualText
                english="Content Analytics"
                italian="Analisi Contenuti"
              />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle>
                  <BilingualText
                    english="Content Library"
                    italian="Libreria Contenuti"
                  />
                </CardTitle>
                <CardDescription>
                  <BilingualText
                    english="Manage all content items in the system"
                    italian="Gestisci tutti gli elementi di contenuto nel sistema"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative md:w-72">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={language === 'italian' ? 'Cerca contenuti...' : 'Search content...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                      <div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'italian' ? 'Categoria' : 'Category'} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {language === 'italian' && category.value === 'all' ? 'Tutte le Categorie' : category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'italian' ? 'Tipo' : 'Type'} />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {language === 'italian' && type.value === 'all' ? 'Tutti i Tipi' : type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'italian' ? 'Difficoltà' : 'Difficulty'} />
                          </SelectTrigger>
                          <SelectContent>
                            {difficulties.map((difficulty) => (
                              <SelectItem key={difficulty.value} value={difficulty.value}>
                                {language === 'italian' && difficulty.value === 'all' ? 'Tutti i Livelli' : difficulty.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'italian' ? 'Titolo' : 'Title'}</TableHead>
                          <TableHead>{language === 'italian' ? 'Tipo' : 'Type'}</TableHead>
                          <TableHead>{language === 'italian' ? 'Categoria' : 'Category'}</TableHead>
                          <TableHead>{language === 'italian' ? 'Difficoltà' : 'Difficulty'}</TableHead>
                          <TableHead>{language === 'italian' ? 'Stato' : 'Status'}</TableHead>
                          <TableHead>{language === 'italian' ? 'Aggiornato' : 'Updated'}</TableHead>
                          <TableHead className="text-right">{language === 'italian' ? 'Azioni' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContent.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              {language === 'italian' ? 'Nessun contenuto trovato' : 'No content found'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredContent.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {getTypeIcon(item.type)}
                                  <span className="capitalize">{item.type}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="capitalize">{item.category}</span>
                              </TableCell>
                              <TableCell>
                                <span className="capitalize">{item.difficulty}</span>
                              </TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteContent(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>
                  <BilingualText
                    english="Upload Content"
                    italian="Carica Contenuti"
                  />
                </CardTitle>
                <CardDescription>
                  <BilingualText
                    english="Add new content to the library"
                    italian="Aggiungi nuovi contenuti alla libreria"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      {language === 'italian' ? 'Titolo' : 'Title'}
                    </Label>
                    <Input id="title" placeholder={language === 'italian' ? 'Inserisci titolo...' : 'Enter title...'} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="content-type">
                        {language === 'italian' ? 'Tipo di Contenuto' : 'Content Type'}
                      </Label>
                      <Select defaultValue="lesson">
                        <SelectTrigger id="content-type">
                          <SelectValue placeholder={language === 'italian' ? 'Seleziona tipo...' : 'Select type...'} />
                        </SelectTrigger>
                        <SelectContent>
                          {types.filter(t => t.value !== 'all').map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        {language === 'italian' ? 'Categoria' : 'Category'}
                      </Label>
                      <Select defaultValue="grammar">
                        <SelectTrigger id="category">
                          <SelectValue placeholder={language === 'italian' ? 'Seleziona categoria...' : 'Select category...'} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c.value !== 'all').map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">
                        {language === 'italian' ? 'Difficoltà' : 'Difficulty'}
                      </Label>
                      <Select defaultValue="beginner">
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder={language === 'italian' ? 'Seleziona difficoltà...' : 'Select difficulty...'} />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.filter(d => d.value !== 'all').map((difficulty) => (
                            <SelectItem key={difficulty.value} value={difficulty.value}>
                              {difficulty.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      {language === 'italian' ? 'File' : 'File'}
                    </Label>
                    <div className="border-2 border-dashed rounded-md p-8 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-primary/10 p-4 rounded-full">
                          <FileUpload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            {language === 'italian' ? 'Trascina i file qui o fai clic per caricare' : 'Drag files here or click to upload'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'italian' 
                              ? 'Supporta video, audio, documenti PDF, Word, PowerPoint, CSV e file ZIP' 
                              : 'Supports video, audio, PDF, Word, PowerPoint, CSV, and ZIP files'}
                          </p>
                        </div>
                        <Button size="sm">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          {language === 'italian' ? 'Sfoglia file' : 'Browse Files'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  {language === 'italian' ? 'Cancella' : 'Cancel'}
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'italian' ? 'Carica Contenuto' : 'Upload Content'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>
                  <BilingualText
                    english="Content Categories"
                    italian="Categorie di Contenuto"
                  />
                </CardTitle>
                <CardDescription>
                  <BilingualText
                    english="Manage content categories and tags"
                    italian="Gestisci categorie e tag dei contenuti"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {language === 'italian' ? 'Categorie' : 'Categories'}
                    </h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      {language === 'italian' ? 'Aggiungi Categoria' : 'Add Category'}
                    </Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'italian' ? 'Nome' : 'Name'}</TableHead>
                          <TableHead>{language === 'italian' ? 'Slug' : 'Slug'}</TableHead>
                          <TableHead>{language === 'italian' ? 'Contenuti' : 'Content Items'}</TableHead>
                          <TableHead className="text-right">{language === 'italian' ? 'Azioni' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.filter(c => c.value !== 'all').map((category) => (
                          <TableRow key={category.value}>
                            <TableCell className="font-medium">{category.label}</TableCell>
                            <TableCell>{category.value}</TableCell>
                            <TableCell>
                              {contentItems.filter(item => item.category === category.value).length}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>
                  <BilingualText
                    english="Content Analytics"
                    italian="Analisi dei Contenuti"
                  />
                </CardTitle>
                <CardDescription>
                  <BilingualText
                    english="View content performance and usage statistics"
                    italian="Visualizza prestazioni e statistiche di utilizzo dei contenuti"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <SlidersHorizontal className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    {language === 'italian' ? 'Analisi dei Contenuti' : 'Content Analytics'}
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    {language === 'italian' 
                      ? 'Le statistiche dettagliate sull\'utilizzo dei contenuti e sulle prestazioni saranno disponibili qui.' 
                      : 'Detailed statistics on content usage and performance will be available here.'}
                  </p>
                  <Button className="mt-4">
                    {language === 'italian' ? 'Configura Analisi' : 'Configure Analytics'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ContentManagement;
