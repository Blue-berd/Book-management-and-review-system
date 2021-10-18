const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { validator, jwt } = require('../utils')
const { systemConfig } = require('../configs')
const { userModel, bookModel, reviewModel } = require('../models')

const addReview = async function (req, res) {
    try {
        const requestBody = req.body;
        const params = req.params.bookId;

        if (!(params == req.body.bookId)) {
            res.status(400).send({ status: false, message: 'Id not matched in params and body. Please provide correct details' })
            return
        }

        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide details' })
            return
        }
        const { bookId, reviewedBy, rating, review } = requestBody

        if (!validator.isValidRating(rating)) {
            res.status(400).send({ status: false, message: 'Invalid Rating. Rating can be between 1 to 5.' })
            return
        }

        if (!validator.isValid(bookId)) {
            res.status(400).send({ status: false, message: 'Please provide bookId' })
            return
        }

        if (!validator.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: ` ${bookId} is invalid. Please provide valid userId` })
            return
        }

        if (!validator.isValid(reviewedBy)) {
            res.status(400).send({ status: false, message: 'Please provide reviewedBy' })
            return
        }

        if (!validator.isValid(rating)) {
            res.status(400).send({ status: false, message: 'Rating is required' })
            return
        }

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!book) {
            res.status(400).send({ status: false, message: `Book does not exist` })
            return
        }

        const reviewData = {
            reviewedBy,
            bookId,
            reviewedAt: new Date(), rating, review
        }

        const newReview = await reviewModel.create(reviewData)

        let updateReview = await bookModel.findOneAndUpdate(
            { isDeleted: false, _id: req.params.bookId },
            {
                $inc: { reviews: 1 }
            },
            { new: true }
        );

        res.status(201).send({ status: true, message: "New Review/Rating Added", data: newReview })



    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

let updateReviews = async function (req, res) {
    try {

        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        //const userIdFromToken = req.userId

        if (!validator.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        if (!validator.isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: `${reviewId} is not a valid review id` })
        }

        if (req.body && Object.keys(req.body).length > 0) {

            let updateProperty = {};
            if (req.body.review) updateProperty.review = req.body.review;
            if (req.body.rating) updateProperty.rating = req.body.rating;
            if (req.body.reviewedBy) updateProperty.reviewedBy = req.body.reviewedBy;

            let review = await reviewModel.findOneAndUpdate(
                { bookId: req.params.bookId, _id: req.params.reviewId },
                {
                    $set: updateProperty
                },
                { new: true }
            );
            if (review) {
                res.status(200).send({ status: true, data: review });
            } else {
                res.status(404).send({ status: false, msg: "Review not present" });
            }
        } else {
            res.status(400).send({ status: false, msg: "request body not found" });
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};

const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        //const userIdFromToken = req.userId

        if (!validator.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        if (!validator.isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: `${reviewId} is not a valid review id` })
        }
        // if(!validator.isValidObjectId(userIdFromToken)) {
        //     res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
        // }

        // const review = await reviewModel.deleteOne({ _id: reviewId })
        // // const blog = await blogModel.findOne({_id: blogId})


        // if (review.deletedCount == 0) {
        //     res.status(404).send({ status: false, message: `Review not found` })
        //     return
        // } 

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false})
        // const blog = await blogModel.findOne({_id: blogId})

        if (!book) {
            res.status(404).send({ status: false, message: `Book not found` })
        }

        if (book.isDeleted && deletedAt !== null) {
            res.status(404).send({ status: false, message: `Book is already deleted.` })
        }

        // if (book.userId.toString() !== userIdFromToken) {
        //     res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        // }

        let reviewDeleted = await reviewModel.findOneAndUpdate({ _id: reviewId,  bookId: bookId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true } )
        
        if(reviewDeleted)
        {
            res.status(200).send({ status: true, message: `Review deleted successfully`, data: reviewDeleted})

            let updateReview = await bookModel.findOneAndUpdate(
                { isDeleted: false, _id: req.params.bookId },
                {
                    $inc: { reviews: -1 }
                },
                { new: true }
            );
        }
        else
        {
            res.status(404).send({ status: false, message: `Review not found`})
        }
        
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = { addReview, updateReviews, deleteReview }