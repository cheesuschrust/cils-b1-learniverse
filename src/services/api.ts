import { supabase } from "@/lib/supabase";

interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export class API {
  static async handleRequest<T>(
    endpoint: string,
    method: string = "GET",
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    try {
      // For real API requests, create proper URL
      const url = `/api${endpoint}`;
      
      // Mock response based on endpoint and method
      // In a real app, this would make a fetch request
      // For this implementation, we'll use Supabase directly
      
      if (endpoint.startsWith("/auth")) {
        return await this.handleAuthRequests<T>(endpoint, method, data);
      } else if (endpoint.startsWith("/user")) {
        return await this.handleUserRequests<T>(endpoint, method, data);
      } else if (endpoint.startsWith("/content")) {
        return await this.handleContentRequests<T>(endpoint, method, data);
      } else if (endpoint.startsWith("/questions")) {
        return await this.handleQuestionRequests<T>(endpoint, method, data);
      }
      
      // Default mock response
      return { success: true } as unknown as T;
    } catch (error: any) {
      // Log and rethrow to be handled by the calling function
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw new Error(error.message || "API request failed");
    }
  }
  
  private static async handleAuthRequests<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
    switch (endpoint) {
      case "/auth/login":
        if (method === "POST") {
          const { email, password } = data;
          const { data: authData, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) throw error;
          
          // Fetch additional user data from our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user?.id)
            .single();
          
          if (userError) throw userError;
          
          // Return formatted user data
          return {
            user: {
              id: userData.id,
              firstName: userData.first_name,
              lastName: userData.last_name,
              email: userData.email,
              role: userData.role,
              isVerified: userData.is_verified,
              // Add other properties
            }
          } as unknown as T;
        }
        break;
        
      case "/auth/register":
        if (method === "POST") {
          const { email, password, firstName, lastName } = data;
          
          // Register with Supabase Auth
          const { data: authData, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
              },
            },
          });
          
          if (error) throw error;
          
          // Insert into our users table
          // This would be handled by triggers in a real implementation
          const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
              id: authData.user?.id,
              email,
              first_name: firstName,
              last_name: lastName,
              role: 'user',
              subscription: 'free',
              is_verified: false,
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              last_active: new Date().toISOString(),
              preferred_language: 'both',
              status: 'active'
            })
            .select()
            .single();
          
          if (userError) throw userError;
          
          // Return formatted user data
          return {
            user: {
              id: userData.id,
              firstName: userData.first_name,
              lastName: userData.last_name,
              email: userData.email,
              role: userData.role,
              isVerified: userData.is_verified,
              // Add other properties
            }
          } as unknown as T;
        }
        break;
        
      case "/auth/forgot-password":
        if (method === "POST") {
          const { email } = data;
          
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          
          if (error) throw error;
          
          return { success: true } as unknown as T;
        }
        break;
        
      // Handle other auth endpoints
      default:
        throw new Error(`Unhandled auth endpoint: ${endpoint}`);
    }
    
    throw new Error(`Unhandled auth request: ${method} ${endpoint}`);
  }
  
  private static async handleUserRequests<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
    switch (endpoint) {
      case "/user/profile":
        if (method === "GET") {
          const { userId } = data;
          
          const { data: userData, error } = await supabase
            .from('users')
            .select(`
              *,
              user_preferences(*),
              user_metrics(*)
            `)
            .eq('id', userId)
            .single();
          
          if (error) throw error;
          
          // Return formatted user data
          return {
            user: {
              id: userData.id,
              firstName: userData.first_name,
              lastName: userData.last_name,
              email: userData.email,
              role: userData.role,
              isVerified: userData.is_verified,
              // Add other properties from user_preferences and user_metrics
            }
          } as unknown as T;
        }
        break;
        
      case "/user/update":
        if (method === "PUT") {
          const { userId, userData } = data;
          
          // Update user data
          const { error } = await supabase
            .from('users')
            .update({
              first_name: userData.firstName,
              last_name: userData.lastName,
              preferred_language: userData.preferredLanguage,
              // Add other properties
            })
            .eq('id', userId);
          
          if (error) throw error;
          
          // Fetch updated user data
          const { data: updatedUser, error: fetchError } = await supabase
            .from('users')
            .select(`
              *,
              user_preferences(*),
              user_metrics(*)
            `)
            .eq('id', userId)
            .single();
          
          if (fetchError) throw fetchError;
          
          // Return formatted user data
          return {
            user: {
              id: updatedUser.id,
              firstName: updatedUser.first_name,
              lastName: updatedUser.last_name,
              email: updatedUser.email,
              role: updatedUser.role,
              isVerified: updatedUser.is_verified,
              // Add other properties
            }
          } as unknown as T;
        }
        break;
        
      // Handle other user endpoints
      default:
        throw new Error(`Unhandled user endpoint: ${endpoint}`);
    }
    
    throw new Error(`Unhandled user request: ${method} ${endpoint}`);
  }
  
  private static async handleContentRequests<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
    // Handle content endpoints with Supabase
    return { success: true } as unknown as T;
  }
  
  private static async handleQuestionRequests<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<T> {
    // Handle question endpoints with Supabase
    return { success: true } as unknown as T;
  }
}
