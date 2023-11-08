import { Request, Response } from 'express';
import { AuthenticatedRequest } from 'middlewares/auth.middleware';
import { ReviewService } from 'services/review.service';

const getReviews = async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    try {
        const reviews = await ReviewService.getReviews(restaurantId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error getting reviews' });
    }
};

const createReview = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.user._id;
    const { restaurantId } = req.params;
    const { reviewText, rating } = req.body;
    try {
        const review = await ReviewService.createReview(userId, restaurantId, reviewText, rating);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error creating review' });
    }
};

const editReview = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.user._id;
    const { reviewId } = req.params;
    const { reviewText, rating } = req.body;
    try {
        const review = await ReviewService.editReview(userId, reviewId, reviewText, rating);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error editing review' });
    }
};

const deleteReview = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.user._id;
    const { reviewId } = req.params;
    try {
        const review = await ReviewService.deleteReview(userId, reviewId);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review' });
    }
};

export const ReviewController = {
    getReviews,
    createReview,
    editReview,
    deleteReview,
};