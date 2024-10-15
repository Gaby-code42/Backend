const Book = require('../models/Book')
const sharp = require('sharp')
const fs = require ('fs')
const path = require ('path')

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

exports.getBestBook = (req, res, next) => {

  Book.find()
  .sort({ averageRating: -1 })
  .limit(3)
  .then((bestBooks) => {
      res.json(bestBooks);
  })
  .catch((error) => {
      res.status(500).json({ message: error.message });
  });
};

exports.addRating = (req, res, next) => {
  const bookId = req.params.id
  const { userId, rating } = req.body

  console.log(bookId)
  console.log(rating, userId)

  if (typeof rating !== 'number' || isNaN(rating)) {
    return res.status(400).json({ message: 'Le rating doit être un nombre' })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "La note doit être comprise entre 1 et 5" })
  }

  Book.findById(bookId)
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' })
      }

      const existingRating = book.ratings.find(r => r.userId === userId)
      if (existingRating) {
        existingRating.grade = rating
      } else {
        const newRating = { userId, grade: rating }
        book.ratings.push(newRating)
      }

      const totalRatings = book.ratings.length
      const totalGrade = book.ratings.reduce((sum, r) => sum + r.grade, 0)
      book.averageRating = totalGrade / totalRatings

      return book.save()
    })
    .then((book) => { 
      res.status(200).json(book)
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de la note:', error)
      res.status(500).json({ message: 'Erreur serveur', error })
    });
};
  
exports.createBook = (req, res, next) => {

  const bookObject = JSON.parse(req.body.book)

  delete bookObject._id
  delete bookObject._userId

  bookObject.year = Number(bookObject.year)

  const originalImagePath = req.file.path

  const resizedImageName = `resized_${req.file.filename}`
  const resizedImagePath = path.join('images', resizedImageName)

  sharp(originalImagePath)
    .resize(210) 
    .toFile(resizedImagePath) 
    .then(() => {

      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${resizedImageName}`, // URL de l'image redimensionnée
        ratings: bookObject.ratings
      })

      book.save()
        .then(() => res.status(201).json({ message: 'Livre ajouté' }))
        .catch(error => res.status(400).json({ error }))
      
      fs.unlink(originalImagePath, (err) => {
        if (err) console.error('Erreur lors de la suppression du fichier original:', err)
      })
    })
    .catch(error => res.status(500).json({ error: 'Erreur lors du traitement de l\'image' }))
};

exports.modifyBook = (req, res, next) => {

    Book.findOne({_id: req.params.id})
    
    .then((book) => {

    if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' })
    }

    if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisée' })
    }

    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié avec succès' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
  }

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
      .then((book) => {
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé'})
        }

        if (book.userId !== req.auth.userId) {
          return res.status(403).json({ message: 'Requête non autorisée' })
        }

        const filename = book.imageUrl.split('/images/')[1]

        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
          }
      })

        Book.deleteOne({ _id: req.params.id})
          .then(() => res.status(200).json({ message:'Livre supprimé avec succès'}))
          .catch(error => res.status(400).json({ error }))

      })
      .catch(error => res.status(500).json({ error }))
  }


