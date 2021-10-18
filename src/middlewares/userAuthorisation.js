const { jwt, validator } = require('../utils')
const { userModel, bookModel, reviewModel } = require('../models')

const userAuthorisation = async (req, res, next) => {
    try {
        const token = req.header('x-api-key')
        const decoded = await jwt.verifyToken(token);
   
        req.userId = decoded.userId;
        const user = req.userId
        let bookId = req.params.bookId

        if(!validator.isValidObjectId(bookId)){
            res.status(404).send({ status: false, message: 'Invalid Book Id' })
            return
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null})

        if(!book){
            res.status(404).send({ status: false, message: 'Book not found' })

            return
        }
        let bookUser = book.userId
        if (user == bookUser) {
            next()    
        } else {
             res.status(400).send({ status: false, message: 'Unauthorised access' })
        }
    } catch (error) {
        console.error(`Error! ${error.message}`)
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = userAuthorisation