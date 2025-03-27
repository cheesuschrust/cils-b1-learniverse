
import { IAuthService } from "./interfaces/IAuthService";
import { IDocumentService } from "./interfaces/IDocumentService";
import { AuthService } from "./AuthService";
import DocumentService from "./DocumentService";

// Service factory to enable dependency injection and easier mocking
export class ServiceFactory {
  private static _instance: ServiceFactory;
  private _authService: any;
  private _documentService: any;
  
  private constructor() {
    this._authService = AuthService;
    this._documentService = DocumentService;
  }
  
  public static getInstance(): ServiceFactory {
    if (!ServiceFactory._instance) {
      ServiceFactory._instance = new ServiceFactory();
    }
    return ServiceFactory._instance;
  }
  
  // For testing - allows overriding services with mocks
  public static resetInstance(): void {
    ServiceFactory._instance = new ServiceFactory();
  }
  
  // For testing - allows injecting mock services
  public injectServices(services: {
    authService?: any;
    documentService?: any;
  }) {
    if (services.authService) {
      this._authService = services.authService;
    }
    
    if (services.documentService) {
      this._documentService = services.documentService;
    }
  }
  
  public get authService(): IAuthService {
    return this._authService;
  }
  
  public get documentService(): IDocumentService {
    return this._documentService;
  }
}

// Create and export a default instance
export const serviceFactory = ServiceFactory.getInstance();

// Convenience method for accessing services
export default serviceFactory;
