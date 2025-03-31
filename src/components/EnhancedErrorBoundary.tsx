
import React, { Component, ErrorInfo } from 'react';
import { EnhancedErrorBoundaryProps } from '../types/type-definitions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('EnhancedErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo
    });
    
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
        <Card className="border-destructive mt-4">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="text-destructive flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Si è verificato un errore
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 font-medium">{this.state.error?.message || "Errore sconosciuto"}</p>
            
            {this.state.error && (
              <details className="mb-4">
                <summary className="font-medium cursor-pointer">Stack Trace</summary>
                <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto text-xs max-h-[300px]">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            {this.state.errorInfo && (
              <details>
                <summary className="font-medium cursor-pointer">Component Stack</summary>
                <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto text-xs max-h-[300px]">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </CardContent>
          <CardFooter className="bg-muted/20 flex justify-center">
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="w-full md:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Riprova
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}
