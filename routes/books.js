const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/books')
const multer = require('../middleware/multer-config')

router.get('/', bookCtrl.getAllBooks)
  
router.get('/:id', bookCtrl.getOneBook )
  
router.get('/bestrating', bookCtrl.getBestBooks ) 
  
router.post('/', auth, multer, bookCtrl.createBook )

router.post('/:id/rating', auth, bookCtrl.addRating)
  
router.put('/:id', auth, multer, bookCtrl.modifyBook)
  
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router