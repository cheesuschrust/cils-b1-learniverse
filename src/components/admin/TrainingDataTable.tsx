
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Edit, Trash2 } from 'lucide-react';

// This is a placeholder component - in a real implementation it would fetch data from the database
export const TrainingDataTable: React.FC = () => {
  const [data] = useState([
    { 
      id: '1', 
      inputText: 'Come ti chiami?',
      expectedOutput: "What's your name?",
      contentType: 'grammar',
      difficulty: 'beginner',
      language: 'italian',
      verified: true,
      createdAt: new Date(2023, 5, 15)
    },
    { 
      id: '2', 
      inputText: 'La capitale dell\'Italia è Roma.',
      expectedOutput: 'The capital of Italy is Rome.',
      contentType: 'culture',
      difficulty: 'beginner',
      language: 'italian',
      verified: true,
      createdAt: new Date(2023, 6, 20)
    },
    { 
      id: '3', 
      inputText: 'Il Presidente della Repubblica viene eletto dal Parlamento in seduta comune dei suoi membri.',
      expectedOutput: 'The President of the Republic is elected by Parliament in a joint session of its members.',
      contentType: 'citizenship',
      difficulty: 'advanced',
      language: 'italian',
      verified: false,
      createdAt: new Date(2023, 7, 5)
    },
    { 
      id: '4', 
      inputText: 'Vorrei prenotare un tavolo per quattro persone, per favore.',
      expectedOutput: 'I would like to book a table for four people, please.',
      contentType: 'vocabulary',
      difficulty: 'intermediate',
      language: 'italian',
      verified: true,
      createdAt: new Date(2023, 8, 10)
    },
    { 
      id: '5', 
      inputText: 'Il condizionale si usa per esprimere un\'azione ipotetica o un desiderio.',
      expectedOutput: 'The conditional is used to express a hypothetical action or a desire.',
      contentType: 'grammar',
      difficulty: 'intermediate',
      language: 'italian',
      verified: false,
      createdAt: new Date(2023, 9, 15)
    }
  ]);

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Input Text</TableHead>
            <TableHead>Expected Output</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="max-w-[200px] truncate">{item.inputText}</TableCell>
              <TableCell className="max-w-[200px] truncate">{item.expectedOutput}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {item.contentType}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{item.difficulty}</TableCell>
              <TableCell>
                {item.verified ? (
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="text-xs">Pending</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
