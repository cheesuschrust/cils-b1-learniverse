
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';

export const TrainingDataTable: React.FC = () => {
  // Mock data
  const trainingData = [
    { id: 1, text: 'Come stai oggi?', type: 'question', language: 'italian', created: '2023-10-05', difficulty: 'beginner' },
    { id: 2, text: 'Mi piacerebbe visitare Roma', type: 'statement', language: 'italian', created: '2023-10-06', difficulty: 'beginner' },
    { id: 3, text: 'Qual è il significato di questa espressione?', type: 'question', language: 'italian', created: '2023-10-07', difficulty: 'intermediate' },
    { id: 4, text: 'La politica economica italiana nel dopoguerra', type: 'text', language: 'italian', created: '2023-10-08', difficulty: 'advanced' },
    { id: 5, text: 'Potrei avere il menu, per favore?', type: 'question', language: 'italian', created: '2023-10-09', difficulty: 'beginner' },
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">Training Data Entries</h3>
          <p className="text-sm text-muted-foreground">Manage the data used to train AI models</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Data
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>A list of training data for AI models.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Text</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainingData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell className="max-w-[300px] truncate">{item.text}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    item.difficulty === 'beginner' ? 'default' : 
                    item.difficulty === 'intermediate' ? 'secondary' : 'outline'
                  }>
                    {item.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>{item.created}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
