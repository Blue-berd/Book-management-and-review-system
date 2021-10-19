const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { validator, jwt } = require('../utils')
const { systemConfig } = require('../configs')
const { userModel, bookModel, reviewModel } = require('../models')


const registerBook = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!validator.isValid(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide details' })
             return
        }
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = requestBody

        if (!validator.isValid(title)) {
             res.status(400).send({ status: false, message: 'Please provide title' })
             return
         }
            console.log(requestBody)
        const isTitleAlreadyUsed = await bookModel.findOne({ title }); // {email: email} object shorthand property

        if (isTitleAlreadyUsed) {
            res.status(400).send({ status: false, message: `${title} is already registered` });
            return;
        }

        if (!validator.isValid(excerpt)) {
            res.status(400).send({ status: false, message: 'Please provide excerpt' })
            return
        }

        if (!validator.isValid(userId)) {
            res.status(400).send({ status: false, message: 'Please provide userId' })
            return
        }

        if (!validator.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: ` ${userId} is invalid. Please provide valid userId` })
            return
        }

        if (!validator.isValid(ISBN)) {
            res.status(400).send({ status: false, message: 'Please provide ISBN' })
            return
        }

        const isISBNAlreadyUsed = await bookModel.findOne({ ISBN }); // {email: email} object shorthand property

        if (isISBNAlreadyUsed) {
            res.status(400).send({ status: false, message: `${ISBN} is already registered` });
            return;
        }

        if (!validator.isValid(category)) {
            res.status(400).send({ status: false, message: 'Category is required' })
            return
        }

        if (!validator.isValid(subcategory)) {
            res.status(400).send({ status: false, message: 'Subcategory is required' })
            return
        }

        if (!validator.isValid(releasedAt)) {
            res.status(400).send({ status: false, message: 'Released Date is required' })
            return
        }

        if (!validator.validateDate(releasedAt)) {
            res.status(400).send({ status: false, message: 'Invalid Released Date ' })
            return
        }

        const user = await userModel.findById(userId)

        if (!user) {
            res.status(400).send({ status: false, message: `User does not exit` })
            return
        }

        const bookData = {
            title,
            excerpt, userId, ISBN,
            category, subcategory,releasedAt
        }

        const newBook = await bookModel.create(bookData)
        res.status(201).send({ status: true, message: "Success", data: newBook })



    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

const listBooks = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false }
        const queryParams = req.query

        if (validator.isValidRequestBody(queryParams)) {
            const { userId, category, subcategory } = queryParams

            if (validator.isValid(userId) && validator.isValidObjectId(userId)) {
                filterQuery['userId'] = userId
            }

            if (validator.isValid(category)) {
                filterQuery['category'] = category.trim()
            }



            if (validator.isValid(subcategory)) {
                filterQuery['subcategory'] = subcategory.trim()
            }
        }

        const books = await bookModel.find(filterQuery, { book_id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title : 1})

        if (Array.isArray(books) && books.length === 0) {
            res.status(404).send({ status: false, message: 'No books found' })
            return
        }

        res.status(200).send({ status: true, message: 'Success', data: books })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const getBook = async function (req, res) {

    try {
        const filterQuery = { isDeleted: false }
        //const queryParams = req.query.collegeName

        if (req.params && Object.keys(req.params).length == 0) {
            res.status(400).send({ status: false, msg: "Requires params" })
            return
        }

        if (validator.isValidObjectId(req.params.book_id)) {
            filterQuery['book_id'] = req.params.bookId
        }


        const book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false }, { __v: 0 })

        if (!(book)) {
            res.status(400).send({ status: false, message: 'Book doesnt exist' })
            return
        }

        const reviews = await reviewModel.find({ bookId: req.params.bookId })

       

        let details = { book,reviewsData: reviews }
        res.status(200).send({ status: true, message: "Success", data: {...book["_doc"], reviewsData:reviews} })


    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}

let updateBooks = async function (req, res) {
    try {
        if (req.params.bookId && req.body && Object.keys(req.body).length > 0) {

            if (!validator.isValidObjectId(req.params.bookId)) {

                res

                  .status(400)

                  .send({ status: false, msg: "please enter a valid book id" });

                return;

              }

            let updateProperty = {};
            if (req.body.ISBN){
                updateProperty.ISBN = req.body.ISBN;
                const isISBNAlreadyUsed = await bookModel.findOne({ ISBN: updateProperty.ISBN }); // {email: email} object shorthand property

                if (isISBNAlreadyUsed) {
                    res.status(400).send({ status: false, message: `ISBN is already registered` });
                    return;
                }
            }
            if (req.body.releasedAt) {
                
                if (!validator.validateDate(req.body.releasedAt)) {
                    res.status(400).send({ status: false, message: 'Invalid Released Date ' })
                    return
                }
                else
                {
                    updateProperty.releasedAt = req.body.releasedAt;
                }
            }
            if (req.body.excerpt) updateProperty.excerpt = req.body.excerpt;
            if (req.body.title) {
                updateProperty.title = req.body.title;
                const isTitleAlreadyUsed = await bookModel.findOne({ title: updateProperty.title });
                if (isTitleAlreadyUsed) {
                    res.status(400).send({ status: false, message: `title is already registered` });
                    return;
                }
            }
 
            let book = await bookModel.findOneAndUpdate(
                { isDeleted: false, _id: req.params.bookId },
                {
                    $set: updateProperty
                },
                { new: true }
            );
            if (book) {
                res.status(200).send({ status: true,message:"Success", data: book });
            } else {
                res.status(404).send({ status: false, msg: "book id not present" });
            }
        } else {
            res.status(400).send({ status: false, msg: "request body not found" });
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


const deleteBook = async function (req, res) {
    try {
        const params = req.params
        const bookId = params.bookId

        //const userIdFromToken = req.userId

        if (!validator.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        // if(!validator.isValidObjectId(userIdFromToken)) {
        //     res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
        // }

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null })
        // const blog = await blogModel.findOne({_id: blogId})

        if (!book) {
            res.status(404).send({ status: false, message: `Book not found` })
        }

        if (book.isDeleted && deletedAt !== null) {
            res.status(404).send({ status: false, message: `Book is already deleted.` })
        }

      

        let bookDeleted = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true } )
        res.status(200).send({ status: true, message: `Success`, data: bookDeleted})

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}






module.exports = { registerBook, listBooks, getBook, updateBooks, deleteBook }
