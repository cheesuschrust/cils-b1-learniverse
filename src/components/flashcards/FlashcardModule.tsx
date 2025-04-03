
import React, { useState, useEffect } from 'react';
import { useFlashcards } from '@/contexts/FlashcardsContext';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Download, Upload, Loader2, WifiOff, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useOfflineCapability from '@/hooks/useOfflineCapability';
import FlashcardSetCreator from './FlashcardSetCreator';
import FlashcardSetCard from './FlashcardSetCard';
import FlashcardStudyView from './FlashcardStudyView';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FlashcardModule = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    flashcards, 
    flashcardSets, 
    isLoading, 
    createFlashcardSet,
    publicFlashcardSets,
    fetchPublicSets,
    exportFlashcards,
    importFlashcards
  } = useFlashcards();
  const [activeTab, setActiveTab] = useState('my-sets');
  const [showCreator, setShowCreator] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const { toast } = useToast();
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  const { isOnline, isOfflineReady, enableOfflineAccess } = useOfflineCapability('/flashcards');

  const flashcardsLimit = hasReachedLimit('flashcards');
  const currentUsage = getUsage('flashcards');
  const maxFlashcards = getLimit('flashcards');

  useEffect(() => {
    if (isOnline && isAuthenticated) {
      fetchPublicSets();
    }
  }, [isOnline, isAuthenticated, fetchPublicSets]);

  const handleCreateSet = () => {
    if (flashcardsLimit) {
      toast({
        title: "Flashcard Limit Reached",
        description: `You've reached your limit of ${maxFlashcards} flashcards. Upgrade to Premium for up to 1000 flashcards.`,
        variant: "destructive"
      });
      return;
    }
    setShowCreator(true);
  };

  const handleExport = async () => {
    try {
      const data = await exportFlashcards();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flashcards-export.json';
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your flashcards have been exported successfully."
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your flashcards.",
        variant: "destructive"
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          // Check if import would exceed limit
          if (!user?.isPremium && (currentUsage + data.length > maxFlashcards)) {
            toast({
              title: "Limit Exceeded",
              description: `Importing ${data.length} flashcards would exceed your limit of ${maxFlashcards}. Upgrade to Premium for more.`,
              variant: "destructive"
            });
            return;
          }
          
          await importFlashcards(data);
          toast({
            title: "Import Successful",
            description: `Imported ${data.length} flashcards successfully.`
          });
        } catch (error) {
          console.error("Import error:", error);
          toast({
            title: "Import Failed",
            description: "There was an error importing your flashcards. Please check the file format.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleStudySet = (setId: string) => {
    setSelectedSetId(setId);
    incrementUsage('flashcards');
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Italian Flashcards</CardTitle>
          <CardDescription>
            Please log in to use flashcards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need to be logged in to use the flashcards feature.</p>
        </CardContent>
      </Card>
    );
  }

  if (selectedSetId) {
    return (
      <FlashcardStudyView 
        setId={selectedSetId} 
        onBack={() => setSelectedSetId(null)} 
      />
    );
  }

  if (showCreator) {
    return (
      <FlashcardSetCreator 
        onCancel={() => setShowCreator(false)}
        onCreated={(setId) => {
          setShowCreator(false);
          toast({
            title: "Set Created",
            description: "Your flashcard set has been created successfully."
          });
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading flashcards...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Italian Flashcards</h1>
          <p className="text-muted-foreground">
            Learn and review Italian vocabulary with spaced repetition
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {currentUsage} / {maxFlashcards} Flashcards
          </Badge>
          {!isOnline && !isOfflineReady && (
            <Button onClick={enableOfflineAccess} disabled={!isOnline} variant="outline" size="sm">
              <WifiOff className="mr-2 h-4 w-4" />
              Enable Offline
            </Button>
          )}
        </div>
      </div>
      
      {!isOnline && !isOfflineReady && (
        <Alert className="mb-6">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>You're offline</AlertTitle>
          <AlertDescription>
            Connect to the internet to use flashcards or enable offline access when online.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={handleCreateSet}>
          <Plus className="mr-2 h-4 w-4" /> Create New Set
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
        <Button variant="outline" onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" /> Import
        </Button>
      </div>
      
      <Tabs defaultValue="my-sets" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-sets">My Sets</TabsTrigger>
          <TabsTrigger value="public-sets">Public Sets</TabsTrigger>
          <TabsTrigger value="due-today">Due Today</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-sets" className="space-y-6">
          {flashcardSets.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  You haven't created any flashcard sets yet. 
                  Create your first set to start learning Italian!
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button onClick={handleCreateSet}>Create My First Set</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcardSets.map(set => (
                <FlashcardSetCard 
                  key={set.id} 
                  set={set} 
                  onStudy={handleStudySet}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="public-sets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicFlashcardSets.map(set => (
              <FlashcardSetCard 
                key={set.id} 
                set={set} 
                onStudy={handleStudySet}
                isPublic
              />
            ))}
            {publicFlashcardSets.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {isOnline ? "No public flashcard sets available." : "You need to be online to view public sets."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="due-today">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcardSets.filter(set => set.dueCount && set.dueCount > 0).map(set => (
              <FlashcardSetCard 
                key={set.id} 
                set={set}
                onStudy={handleStudySet}
                showDueCount
              />
            ))}
            {flashcardSets.filter(set => set.dueCount && set.dueCount > 0).length === 0 && (
              <Card className="col-span-full">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No flashcards due for review today. Great job!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlashcardModule;
