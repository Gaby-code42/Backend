const Book = require('../models/Book')

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
  }

exports.getOneBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }))
  }

exports.getBestBooks = (req, res, next) => {
    Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error }))
  
  }

exports.addRating = (req, res, next) => {
  const { userId, grade } = req.body
  
}

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId
    const book = new Book({
      ...bookObject,
      userID: req.auth.userID,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    book.save()
    .then(() => { res.status(201).json({message: 'Livre ajouté'})})
    .catch(error => { res.status(400).json({ error })})
  }

exports.modifyBook = (req, res, next) => {
    Book.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id})
    .then(() =>res.status(200).json({ message: 'Livre modifié'}))
    .catch(error => res.status(400).json({ error }))
  }

exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  }

