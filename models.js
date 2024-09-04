const mongoose = require('mongoose');
const { Schema } = mongoose;

// // create comment schema
// const commentSchema = new Schema({
//     comment: { type: String, required: true}
// });

// create book schema
const bookSchema = new Schema({
    title: { type: String, required: true },
    comments: [],
    commentcount: { type: Number, default: 0 }
});

// const Comment = mongoose.model('Comment', commentSchema);
const Book = mongoose.model('Book', bookSchema);

// exports.Comment = Comment;
exports.Book = Book;