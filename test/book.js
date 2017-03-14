/**
 * Created by hoangdv on 3/13/2017.
 */
process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var Book = require('../app/models/book');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {
	beforeEach((done) => {
		Book.remove({}, (err) => {
			done();
		});
	});

	describe('GET /book', () => {
		it('it should GET all the books', (done) => {
			chai.request(server)
				.get('/book')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	describe('POST /book', () => {
		it('it should not POST a book without pages field', (done) => {
			var book = {
				title: "The Lord of the Rings",
				author: "J.R.R. Tolkien",
				year: 1954
			};
			chai.request(server)
				.post('/book')
				.send(book)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('pages');
					res.body.errors.pages.should.have.property('kind').eql('required');
					done();
				});
		});

		it('it should POST a book', (done) => {
			var book = {
				title: "The Lord of the Rings",
				author: "J.R.R. Tolkien",
				year: 1954,
				pages: 1170
			};
			chai.request(server)
				.post('/book')
				.send(book)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Book successfully added!');
					res.body.book.should.have.property('title');
					res.body.book.should.have.property('author');
					res.body.book.should.have.property('year');
					res.body.book.should.have.property('pages');
					done();
				});
		});
	});
	/* end POST /book */

	describe('GET /book/:id', () => {
		it('it should GET a book by given id', (done) => {
			var book = new Book({
				title: "The Lord of the Rings",
				author: "J.R.R. Tolkien",
				year: 1954,
				pages: 1170
			});
			book.save((err, book) => {
				chai.request(server)
					.get('/book/' + book._id)
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.a('object');
						if (!res.body) {
							throw new Error('res.body is null');
						}
						res.body.should.have.property('title');
						res.body.should.have.property('author');
						res.body.should.have.property('pages');
						res.body.should.have.property('year');
						res.body.should.have.property('_id').eql(book._id.toString());
						done();
					});
			});
		});
	});
	/* end GET /book/:id*/

	describe('PUT /book/:id', () => {
		it('it should UPDATE a book by given the id', (done) => {
			var book = new Book({
				title: "The Chronicles of Narnia",
				author: "C.S. Lewis",
				year: 1948,
				pages: 777
			});
			book.save((err, book) => {
				chai.request(server)
					.put('/book/' + book._id)
					.send({
						title: "The Chronicles of Narnia",
						author: "C.S. Lewis",
						year: 1950,
						pages: 778
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Book updated!');
						res.body.book.should.have.property('year').eql(1950);
						done();
					});
			});
		});
	});

	describe('DELETE /book/:id', () => {
		it('it should DELETE a book by given the id', (done) => {
			var book = new Book({
				title: "The Chronicles of Narnia",
				author: "C.S. Lewis",
				year: 1948,
				pages: 778
			});
			book.save((err, book) => {
				chai.request(server)
					.delete('/book/' + book._id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Book successfully deleted!');
						res.body.result.should.have.property('ok').eql(1);
						res.body.result.should.have.property('n').eql(1);
						done();
					});
			});
		});
	});
});