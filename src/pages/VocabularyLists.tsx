
import React from 'react';
import { Helmet } from "react-helmet-async";

export default function VocabularyLists() {
  return (
    <>
      <Helmet>
        <title>Vocabulary Lists | CILS B1 Cittadinanza</title>
      </Helmet>
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Vocabulary Lists</h1>
          <p className="text-muted-foreground mt-2">
            Build your Italian vocabulary with curated word lists
          </p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            We're currently building this feature to enhance your learning experience.
            Check back soon for curated vocabulary lists organized by topic and difficulty.
          </p>
        </div>
      </div>
    </>
  );
}
