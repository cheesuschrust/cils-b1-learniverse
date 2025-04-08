
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FlashcardDeck from '@/components/learning/FlashcardDeck';
import { Loader2, Plus, Layers } from 'lucide-react';

interface FlashcardSet {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  language: string;
  is_public: boolean;
  is_favorite: boolean;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  italian: string;
  english: string;
  set_id: string;
}

const FlashcardsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [displayMode, setDisplayMode] = useState<'list' | 'study'>('list');

  useEffect(() => {
    fetchFlashcardSets();
  }, [user]);

  useEffect(() => {
    if (selectedSetId) {
      fetchFlashcards(selectedSetId);
    }
  }, [selectedSetId]);

  const fetchFlashcardSets = async () => {
    try {
      setLoading(true);
      
      // Fetch both user's own sets and public sets
      const { data: userSets, error: userError } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('user_id', user?.id);
      
      const { data: publicSets, error: publicError } = await supabase
        .from('flashcard_sets')
        .select('*')
        .eq('is_public', true)
        .neq('user_id', user?.id);
      
      if (userError) throw userError;
      if (publicError) throw publicError;
      
      // Combine sets and remove duplicates
      const sets = [...(userSets || []), ...(publicSets || [])];
      
      setFlashcardSets(sets);
      
      // Auto-select the first set if available
      if (sets.length > 0 && !selectedSetId) {
        setSelectedSetId(sets[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching flashcard sets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashcards = async (setId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('set_id', setId);
      
      if (error) throw error;
      
      setFlashcards(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching flashcards",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetSelect = (value: string) => {
    setSelectedSetId(value);
    setDisplayMode('list');
  };

  const handleStartStudy = () => {
    setDisplayMode('study');
  };

  const handleStudyComplete = (results: { correct: number; incorrect: number; total: number }) => {
    toast({
      title: "Study session complete",
      description: `You got ${results.correct} out of ${results.total} correct.`,
    });
  };

  const getSelectedSet = () => {
    return flashcardSets.find(set => set.id === selectedSetId);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>No Flashcard Sets</CardTitle>
            <CardDescription>
              You don't have any flashcard sets yet. Create one to start studying!
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Flashcard Set
            </Button>
          </CardFooter>
        </Card>
      );
    }

    if (displayMode === 'study' && flashcards.length > 0) {
      const selectedSet = getSelectedSet();
      
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Studying: {selectedSet?.name}
            </h2>
            <Button variant="outline" onClick={() => setDisplayMode('list')}>
              Back to List
            </Button>
          </div>
          
          <FlashcardDeck 
            flashcards={flashcards.map(card => ({
              id: card.id,
              front: card.front || card.italian,
              back: card.back || card.english
            }))}
            onComplete={handleStudyComplete}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{getSelectedSet()?.name || 'Flashcards'}</CardTitle>
            <CardDescription>
              {getSelectedSet()?.description || 'Study and memorize with flashcards'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flashcards.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  No flashcards in this set.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    This set contains {flashcards.length} flashcards.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {flashcards.slice(0, 4).map((card) => (
                      <Card key={card.id} className="h-32">
                        <CardContent className="p-4 h-full flex items-center justify-center text-center">
                          {card.front || card.italian}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {flashcards.length > 4 && (
                    <p className="text-sm text-center text-muted-foreground mt-2">
                      And {flashcards.length - 4} more...
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Flashcard
            </Button>
            {flashcards.length > 0 && (
              <Button onClick={handleStartStudy}>
                <Layers className="mr-2 h-4 w-4" />
                Start Studying
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Flashcards</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flashcard Sets</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedSetId || undefined} onValueChange={handleSetSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a set" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Sets</SelectLabel>
                    {flashcardSets
                      .filter(set => set.user_id === user?.id)
                      .map(set => (
                        <SelectItem key={set.id} value={set.id}>
                          {set.name}
                        </SelectItem>
                      ))
                    }
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Public Sets</SelectLabel>
                    {flashcardSets
                      .filter(set => set.user_id !== user?.id)
                      .map(set => (
                        <SelectItem key={set.id} value={set.id}>
                          {set.name}
                        </SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Set
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
