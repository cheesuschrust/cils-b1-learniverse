
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ChatbotManager from '@/components/admin/ChatbotManager';

// Define interface for props if needed
interface ChatbotManagementPageProps {}

const ChatbotManagementPage: React.FC<ChatbotManagementPageProps> = () => {
  return (
    <>
      <Helmet>
        <title>Chatbot Management - Admin</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <ChatbotManager />
      </div>
    </>
  );
};

export default ChatbotManagementPage;
