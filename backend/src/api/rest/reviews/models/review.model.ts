import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  reviewId: string;
  restaurantId: string;
  userId: string;
  reviewText: string;
  rating: number;
}

const reviewSchema: Schema<IReview> = new Schema<IReview>({
  restaurantId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  reviewText: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const Review: Model<IReview> = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
