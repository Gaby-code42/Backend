const express = require('express')
const router = express.Router()

const bookCtrl = require('../controllers/books')

router.get('/', bookCtrl.getAllBooks)
  
router.get('/:id', bookCtrl.getOneBook )
  
router.get('/bestrating', bookCtrl.getBestBooks )
  
router.post('/', bookCtrl.createBook )

router.post('/:id/rating', (req, res, next) => {
    /* a compléter */
})
  
router.put('/:id', bookCtrl.modifyBook)
  
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router