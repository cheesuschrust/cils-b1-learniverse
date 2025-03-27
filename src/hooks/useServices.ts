
import { useContext, createContext } from 'react';
import serviceFactory, { ServiceFactory } from '@/services/ServiceFactory';

// Create a context for the service factory
export const ServiceContext = createContext<ServiceFactory>(serviceFactory);

// Hook for consuming services
export function useServices() {
  const services = useContext(ServiceContext);
  return services;
}

// Hook specifically for auth service
export function useAuthService() {
  const services = useServices();
  return services.authService;
}

// Hook specifically for document service
export function useDocumentService() {
  const services = useServices();
  return services.documentService;
}
