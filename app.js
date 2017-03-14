/**
 * Created by hoangdv on 3/13/2017.
 */
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;
var bookRouter = require('./app/routes/book');
var config = require('config');
var mongoConnectOption = {
	server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
	replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
};

mongoose.connect(config.database, mongoConnectOption);
var db = mongoose.connection;

db.on('error', console.log.bind(console, 'connection error: '));
if (config.util.getEnv('NODE_ENV') !== 'test') {
	app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.text());

app.get('/', (req, res) => {
	res.status(200).json({
		message: 'Wellcome to our Bookstore!'
	})
});

app.route('/book')
	.get(bookRouter.getBooks)
	.post(bookRouter.postBook);
app.route('/book/:id')
	.get(bookRouter.getBook)
	.put(bookRouter.updateBook)
	.delete(bookRouter.deleteBook);

app.listen(port, () => {
	console.log("Listening on port " + port);
});

// for testing
module.exports = app;