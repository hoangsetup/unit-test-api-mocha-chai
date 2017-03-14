/**
 * Created by hoangdv on 3/13/2017.
 */
'use strict';
var Book = require('../models/book');
/**
 * GET /book
 * @param req
 * @param res
 */
function getBooks(req, res) {
	Book.find({}, (err, books) => {
		if (err) {
			return res.json(err);
		}
		res.json(books);
	});
}

/**
 * POST /book
 * @param req
 * @param res
 */
function postBook(req, res) {
	var newBook = new Book(req.body);
	newBook.save((err, book) => {
		if (err) {
			return res.json(err);
		}
		res.json({
			message: 'Book successfully added!',
			book
		});
	});
}

/**
 * GET /book/:id
 * @param req
 * @param res
 */
function getBook(req, res) {
	Book.findById(req.params.id, (err, book) => {
		if (err) {
			return res.json(err);
		}
		res.json(book);
	});
}

function deleteBook(req, res) {
	Book.remove({_id: req.params.id}, (err, result) => {
		if (err) {
			return res.json(err);
		}
		res.json({
			message: 'Book successfully deleted!',
			result
		});
	});
}

/**
 * PUT /book/:id
 * @param req
 * @param res
 */
function updateBook(req, res) {
	Book.findById({_id: req.params.id}, (err, book) => {
		if (err) {
			return res.json(err);
		}
		Object.assign(book, req.body).save((err, book) => {
			if (err) {
				return res.json(err);
			}
			res.json({
				message: 'Book updated!',
				book
			})
		});
	});
}

module.exports = {
	getBooks,
	postBook,
	getBook,
	deleteBook,
	updateBook
};