
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useFlashcards } from '@/contexts/FlashcardsContext';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface FlashcardSetCreatorProps {
  onCancel: () => void;
  onCreated: (setId: string) => void;
}

const FlashcardSetCreator: React.FC<FlashcardSetCreatorProps> = ({ 
  onCancel, 
  onCreated 
}) => {
  const { createFlashcardSet } = useFlashcards();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [category, setCategory] = useState('');
  const [initialCards, setInitialCards] = useState([
    { id: '1', front: '', back: '' },
    { id: '2', front: '', back: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCard = () => {
    setInitialCards([
      ...initialCards,
      { id: `${Date.now()}`, front: '', back: '' }
    ]);
  };

  const handleRemoveCard = (id: string) => {
    if (initialCards.length <= 2) return;
    setInitialCards(initialCards.filter(card => card.id !== id));
  };

  const handleCardChange = (id: string, field: 'front' | 'back', value: string) => {
    setInitialCards(initialCards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleSubmit = async () => {
    if (!name || initialCards.some(card => !card.front || !card.back)) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const validCards = initialCards.filter(card => card.front && card.back);
      const result = await createFlashcardSet({
        name,
        description,
        isPublic,
        category: category || undefined,
        initialCards: validCards.map(card => ({
          front: card.front,
          back: card.back,
          italian: card.front,
          english: card.back
        }))
      });
      
      onCreated(result.id);
    } catch (error) {
      console.error('Error creating flashcard set:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex mb-6">
        <Button variant="ghost" onClick={onCancel} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Flashcard Set</h1>
          <p className="text-muted-foreground">Add your flashcards below</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Set Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Set Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Italian Verb Conjugations" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what this set is about" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Input 
              id="category" 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              placeholder="e.g. Verbs, Nouns, CILS B1" 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="public" 
              checked={isPublic} 
              onCheckedChange={setIsPublic} 
            />
            <Label htmlFor="public">
              Make this set public for other users to see
            </Label>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">Flashcards</h2>
      
      <div className="space-y-4 mb-6">
        {initialCards.map((card, index) => (
          <Card key={card.id}>
            <CardHeader className="py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Card {index + 1}</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleRemoveCard(card.id)}
                  disabled={initialCards.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`front-${card.id}`}>Front (Italian)</Label>
                <Input 
                  id={`front-${card.id}`} 
                  value={card.front} 
                  onChange={e => handleCardChange(card.id, 'front', e.target.value)}
                  placeholder="e.g. parlare" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`back-${card.id}`}>Back (English)</Label>
                <Input 
                  id={`back-${card.id}`} 
                  value={card.back} 
                  onChange={e => handleCardChange(card.id, 'back', e.target.value)}
                  placeholder="e.g. to speak" 
                />
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button variant="outline" onClick={handleAddCard} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Card
        </Button>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!name || initialCards.some(card => !card.front || !card.back) || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Flashcard Set'}
        </Button>
      </div>
    </div>
  );
};

export default FlashcardSetCreator;
