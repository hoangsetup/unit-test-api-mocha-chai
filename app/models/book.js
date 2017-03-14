/**
 * Created by hoangdv on 3/13/2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var Schema = mongoose.Schema;
var BookSchema = new Schema(
	{
		title: {type: String, required: true},
		author: {type: String, required: true},
		year: {type: Number, required: true},
		pages: {type: Number, min: 1, required: true},
		createdAt: {type: Date, default: Date.now},
		updatedAt: {type: Date}
	},
	{versionKey: false}
);

BookSchema.pre('save', next => {
	now = Date.now();
	if (!this.createdAt) {
		this.createdAt = now
	}
	next();
});

module.exports = mongoose.model('books', BookSchema);