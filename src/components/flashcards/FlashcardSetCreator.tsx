
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useFlashcards } from '@/contexts/FlashcardsContext';
import { Plus, Loader2, X, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Set name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  category: z.string().optional(),
  isPublic: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
  language: z.string().default("italian"),
});

type FormValues = z.infer<typeof formSchema>;

interface FlashcardSetCreatorProps {
  onCancel: () => void;
  onCreated: (setId: string) => void;
}

const FlashcardSetCreator: React.FC<FlashcardSetCreatorProps> = ({
  onCancel,
  onCreated
}) => {
  const { createFlashcardSet, isLoading } = useFlashcards();
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      isPublic: false,
      isFavorite: false,
      language: 'italian',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const setId = await createFlashcardSet({
        ...values,
        tags,
      });
      
      if (setId) {
        toast({
          title: "Success",
          description: "Flashcard set created successfully",
        });
        onCreated(setId);
      } else {
        toast({
          title: "Error",
          description: "Failed to create flashcard set",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating flashcard set:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Flashcard Set</CardTitle>
        <CardDescription>
          Create a new set of flashcards to help you learn Italian vocabulary and phrases
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Set Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Common Phrases, Food Vocabulary" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive name for your flashcard set
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this set covers..." 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Vocabulary, Grammar, Conversation" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Tags (Optional)</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {tag}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag..."
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 10}
                >
                  <Tag className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Press Enter to add a tag. Maximum 10 tags.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Public Set</FormLabel>
                      <FormDescription>
                        Make this set available to all users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isFavorite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Favorite</FormLabel>
                      <FormDescription>
                        Add to your favorites for quick access
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Set
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlashcardSetCreator;
