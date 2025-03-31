
import React, { useEffect, useState } from 'react';  
import { CitizenshipReadinessProps, ContentType } from '../types/app-types';  

const CitizenshipReadinessComponent: React.FC<CitizenshipReadinessProps> = ({  
  userId,  
  onStatusChange  
}) => {  
  const [readiness, setReadiness] = useState<number>(0);  
  const [sectionScores, setSectionScores] = useState<Record<ContentType, number>>({  
    listening: 0,  
    reading: 0,  
    writing: 0,  
    speaking: 0,  
    grammar: 0,  
    vocabulary: 0,  
    culture: 0  
  });  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {  
    loadReadinessData();  
  }, [userId]);  

  const loadReadinessData = async () => {  
    setLoading(true);  
    try {  
      const response = await fetch(`/api/citizenship-readiness?userId=${userId}`);  
      
      if (!response.ok) {  
        throw new Error('Failed to load citizenship readiness data');  
      }  
      
      const data = await response.json();  
      setReadiness(data.overallReadiness);  
      setSectionScores(data.sectionScores);  
      
      if (onStatusChange) {  
        onStatusChange(data.overallReadiness);  
      }  
    } catch (error) {  
      console.error('Error loading citizenship readiness:', error);  
      setError('Failed to load your readiness data. Please try again.');  
    } finally {  
      setLoading(false);  
    }  
  };  

  const getReadinessLabel = (score: number): string => {  
    if (score >= 90) return 'Eccellente';  
    if (score >= 75) return 'Molto Buono';  
    if (score >= 60) return 'Buono';  
    if (score >= 45) return 'Sufficiente';  
    if (score >= 30) return 'Necessita Pratica';  
    return 'Inizio';  
  };  

  const getReadinessColor = (score: number): string => {  
    if (score >= 90) return '#4CAF50';  
    if (score >= 75) return '#8BC34A';  
    if (score >= 60) return '#CDDC39';  
    if (score >= 45) return '#FFC107';  
    if (score >= 30) return '#FF9800';  
    return '#F44336';  
  };  

  if (loading) {  
    return <div className="loading">Caricamento stato preparazione...</div>;  
  }  

  if (error) {  
    return <div className="error-message">{error}</div>;  
  }  

  return (  
    <div className="citizenship-readiness">  
      <h2>Preparazione per l'Esame di Cittadinanza</h2>  
      
      <div className="overall-readiness">  
        <div className="readiness-gauge">  
          <svg viewBox="0 0 120 120" className="gauge">  
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" strokeWidth="12" />  
            <circle   
              cx="60"   
              cy="60"   
              r="54"   
              fill="none"   
              stroke={getReadinessColor(readiness)}   
              strokeWidth="12"  
              strokeDasharray={`${readiness * 3.39} 339`}  
              strokeLinecap="round"  
              transform="rotate(-90 60 60)"  
            />  
            <text x="60" y="60" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold">  
              {Math.round(readiness)}%  
            </text>  
          </svg>  
          <p className="readiness-label">{getReadinessLabel(readiness)}</p>  
        </div>  
      </div>  
      
      <div className="section-scores">  
        <h3>Punteggi per Sezione</h3>  
        <div className="score-bars">  
          {(Object.entries(sectionScores) as [ContentType, number][]).map(([section, score]) => (  
            <div key={section} className="score-bar-item">  
              <div className="section-label">  
                {section.charAt(0).toUpperCase() + section.slice(1)}  
              </div>  
              <div className="score-bar-container">  
                <div   
                  className="score-bar-fill"   
                  style={{   
                    width: `${score}%`,  
                    backgroundColor: getReadinessColor(score)  
                  }}   
                />  
              </div>  
              <div className="section-score">{Math.round(score)}%</div>  
            </div>  
          ))}  
        </div>  
      </div>  
      
      <div className="readiness-suggestions">  
        <h3>Suggerimenti per il Miglioramento</h3>  
        <ul className="suggestion-list">  
          {readiness < 60 && (  
            <li>  
              <strong>Necessaria maggiore pratica:</strong> Il tuo punteggio di preparazione è sotto il 60%,   
              ti consigliamo di concentrarti sulle sezioni con i punteggi più bassi.  
            </li>  
          )}  
          {sectionScores.culture < 50 && (  
            <li>  
              <strong>Cultura e storia italiana:</strong> Dedica più tempo allo studio della cultura   
              e storia italiana, elementi essenziali per il test di cittadinanza.  
            </li>  
          )}  
          {sectionScores.listening < 50 && (  
            <li>  
              <strong>Comprensione orale:</strong> Migliora la tua capacità di comprensione ascoltando   
              regolarmente podcast o guardando video in italiano.  
            </li>  
          )}  
          {readiness >= 75 && (  
            <li>  
              <strong>Ottimo lavoro!</strong> Sei sulla buona strada per superare l'esame.   
              Continua a praticare per mantenere il tuo livello di preparazione.  
            </li>  
          )}  
        </ul>  
      </div>  
      
      <button   
        onClick={loadReadinessData}  
        className="refresh-button"  
      >  
        Aggiorna Dati  
      </button>  
    </div>  
  );  
}  

export default CitizenshipReadinessComponent;
