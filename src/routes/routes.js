const express = require('express');

const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')

const router = express.Router();

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});


router.get('/bookList', bookController.getBooks);
router.post('/createBook', bookController.createNewBook);

router.get('/userList', userController.getUsers);
router.post('/createUser', userController.createNewUser);

// user create ,update, find--> params, findAndupdate , delete 

router.post('/create-user',userController.createUser);
router.get('/all-users',userController.getAllUsers);
router.get('/:id/user-details',userController.getUserDetails);

// update examples

router.put('/updatejay',userController.updatejay);
router.put('/update-many-users',userController.updateManyUsers);
router.put('/:id/update-specific-user',userController.updateSpecificUser);
router.delete('/:id/delete-user',userController.deleteUser);




module.exports = router;