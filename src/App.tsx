
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import routes from './routes';
import EnhancedErrorBoundary from './components/common/EnhancedErrorBoundary';
import FeedbackWidget from './components/feedback/FeedbackWidget';
import { AIUtilsProvider } from './contexts/AIUtilsContext';

function App() {
  const handleFeedbackSubmit = (feedback: { type: string; message: string }) => {
    // In a real app, this would send the feedback to a server
    console.log('Feedback submitted:', feedback);
  };

  return (
    <EnhancedErrorBoundary>
      <AIUtilsProvider>
        <MainLayout>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
          <FeedbackWidget onSubmit={handleFeedbackSubmit} />
        </MainLayout>
      </AIUtilsProvider>
    </EnhancedErrorBoundary>
  );
}

export default App;
