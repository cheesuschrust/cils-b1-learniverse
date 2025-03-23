
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  date: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  verified: boolean;
}

// Mock reviews data - will be replaced with real database data later
const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Marco D.",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    date: "2023-10-15",
    rating: 5,
    comment: "This app has transformed my Italian language learning journey. The focused B2 citizenship exam preparation helped me pass on my first try!",
    helpfulCount: 24,
    verified: true
  },
  {
    id: "2",
    userName: "Sofia P.",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    date: "2023-09-22",
    rating: 4,
    comment: "Very comprehensive coverage of all the citizenship exam topics. The listening exercises were particularly helpful for me.",
    helpfulCount: 18,
    verified: true
  },
  {
    id: "3",
    userName: "Alex T.",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    date: "2023-11-05",
    rating: 5,
    comment: "I struggled with Italian grammar for months before finding this app. The explanations are clear and the practice exercises are perfectly targeted for the B2 exam.",
    helpfulCount: 32,
    verified: true
  }
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ""
  });
  const { toast } = useToast();

  const handleRatingChange = (rating: number) => {
    setNewReview({...newReview, rating});
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview({...newReview, comment: e.target.value});
  };

  const handleSubmitReview = () => {
    if (newReview.comment.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please provide more details in your review",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would be sent to the server
    const review: Review = {
      id: `${Date.now()}`,
      userName: "You",
      userAvatar: "https://i.pravatar.cc/150?img=8",
      date: new Date().toISOString().split('T')[0],
      rating: newReview.rating,
      comment: newReview.comment,
      helpfulCount: 0,
      verified: true
    };

    setReviews([review, ...reviews]);
    setNewReview({rating: 5, comment: ""});
    setShowReviewForm(false);
    
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!"
    });
  };

  const markHelpful = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? {...review, helpfulCount: review.helpfulCount + 1} 
        : review
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Read reviews from language learners who have successfully prepared for their CILS B2 Cittadinanza exam with our platform.
          </p>
          
          {!showReviewForm && (
            <Button 
              onClick={() => setShowReviewForm(true)} 
              className="mt-6"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Write a Review
            </Button>
          )}
        </div>

        {showReviewForm && (
          <Card className="max-w-2xl mx-auto mb-10">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Share Your Experience</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= newReview.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  rows={4}
                  value={newReview.comment}
                  onChange={handleCommentChange}
                  placeholder="Share your experience with our platform..."
                  className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview}>
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{review.userName}</p>
                      {review.verified && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-100">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                
                <p className="mb-4 text-sm">{review.comment}</p>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs flex items-center"
                  onClick={() => markHelpful(review.id)}
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Helpful ({review.helpfulCount})
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
