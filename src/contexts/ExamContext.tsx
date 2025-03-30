
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CILSExam, ExamProgress } from '@/types/cils-types';
import { fetchExams, fetchUserProgress } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface ExamContextType {
  exams: CILSExam[];
  examProgress: ExamProgress | null;
  loading: boolean;
  error: string | null;
  activeExamId: string | null;
  setActiveExamId: (id: string | null) => void;
  getExamById: (id: string) => CILSExam | undefined;
  refreshProgress: () => Promise<void>;
}

const ExamContext = createContext<ExamContextType>({
  exams: [],
  examProgress: null,
  loading: true,
  error: null,
  activeExamId: null,
  setActiveExamId: () => {},
  getExamById: () => undefined,
  refreshProgress: async () => {},
});

export const useExam = () => useContext(ExamContext);

interface ExamProviderProps {
  children: ReactNode;
}

export const ExamProvider: React.FC<ExamProviderProps> = ({ children }) => {
  const [exams, setExams] = useState<CILSExam[]>([]);
  const [examProgress, setExamProgress] = useState<ExamProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  
  const { user } = useAuth();

  const loadExams = async () => {
    try {
      setLoading(true);
      const examData = await fetchExams();
      setExams(examData);
      
      // Set the first exam as active if none is selected
      if (!activeExamId && examData.length > 0) {
        setActiveExamId(examData[0].id);
      }
    } catch (err) {
      setError('Failed to load exam data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user || !activeExamId) return;
    
    try {
      setLoading(true);
      const progressData = await fetchUserProgress(user.id, activeExamId);
      
      if (progressData.length > 0) {
        setExamProgress(progressData[0]);
      } else {
        setExamProgress(null);
      }
    } catch (err) {
      setError('Failed to load user progress');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load exams on component mount
  useEffect(() => {
    loadExams();
  }, []);

  // Load user progress when user or active exam changes
  useEffect(() => {
    loadUserProgress();
  }, [user, activeExamId]);

  const getExamById = (id: string) => {
    return exams.find(exam => exam.id === id);
  };

  const refreshProgress = async () => {
    await loadUserProgress();
  };

  return (
    <ExamContext.Provider
      value={{
        exams,
        examProgress,
        loading,
        error,
        activeExamId,
        setActiveExamId,
        getExamById,
        refreshProgress,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export default ExamContext;
