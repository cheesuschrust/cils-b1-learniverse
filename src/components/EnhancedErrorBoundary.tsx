
import React, { Component, ErrorInfo } from 'react';  
import { EnhancedErrorBoundaryProps } from '../types/app-types';  

interface ErrorBoundaryState {  
  hasError: boolean;  
  error: Error | null;  
}  

export class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, ErrorBoundaryState> {  
  constructor(props: EnhancedErrorBoundaryProps) {  
    super(props);  
    this.state = {  
      hasError: false,  
      error: null  
    };  
  }  

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {  
    return {  
      hasError: true,  
      error  
    };  
  }  

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {  
    console.error('EnhancedErrorBoundary caught an error:', error, errorInfo);  
    
    if (this.props.onError) {  
      this.props.onError(error, errorInfo);  
    }  
  }  

  render() {  
    if (this.state.hasError) {  
      if (this.props.fallback) {  
        return this.props.fallback;  
      }  
      
      return (  
        <div className="error-boundary">  
          <h2>Si è verificato un errore</h2>  
          <details>  
            <summary>Dettagli dell'errore</summary>  
            <p>{this.state.error?.message}</p>  
          </details>  
          <button   
            onClick={() => this.setState({ hasError: false, error: null })}  
            className="retry-button"  
          >  
            Riprova  
          </button>  
        </div>  
      );  
    }  

    return this.props.children;  
  }  
}  

export default EnhancedErrorBoundary;
