
import React from 'react';
import { ListeningModule } from '../../components/listening/ListeningModule';

const ListeningPracticePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Listening Practice</h1>
      <p className="mb-6 text-gray-600">Improve your listening skills with these interactive exercises.</p>
      <ListeningModule />
    </div>
  );
};

export default ListeningPracticePage;
