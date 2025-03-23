
import { API } from "./api";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  date: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  verified: boolean;
}

export interface ReviewResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export class ReviewService {
  static async getReviews(page = 1, limit = 10): Promise<ReviewResponse> {
    return API.handleRequest<ReviewResponse>("/reviews", "GET", { page, limit });
  }
  
  static async createReview(reviewData: Omit<Review, "id" | "date" | "helpfulCount" | "verified">): Promise<Review> {
    return API.handleRequest<Review>("/reviews", "POST", reviewData);
  }
  
  static async updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    return API.handleRequest<Review>(`/reviews/${id}`, "PUT", updates);
  }
  
  static async deleteReview(id: string): Promise<void> {
    return API.handleRequest<void>(`/reviews/${id}`, "DELETE");
  }
  
  static async markHelpful(id: string): Promise<Review> {
    return API.handleRequest<Review>(`/reviews/${id}/helpful`, "POST");
  }
  
  static async reportReview(id: string, reason: string): Promise<void> {
    return API.handleRequest<void>(`/reviews/${id}/report`, "POST", { reason });
  }
}
