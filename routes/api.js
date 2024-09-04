/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
// const mongoose = require('mongoose');
// const commentModel = require('../models').Comment;
const bookModel = require('../models').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      bookModel.find({})
        .then(data => {
          res.json(data);
        })
        .catch(err => console.log(err));
    })
    
    .post(function (req, res){
      let bookTitle = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!bookTitle) return res.send('missing required field title');
      // create new book
      new bookModel({ title: bookTitle })
        .save()
        .then((data) => {
          res.json({'_id': data.id, 'title': data.title});                                                                                                                                                                                                                                                                                    
        })
        .catch(err => console.log(err));
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      bookModel.deleteMany({})
        .then((deleted) => {
          res.send('complete delete successful');
        })
        .catch(err => console.log(err))
    });


  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      bookModel.findById(bookid)
        .then(data => {
          if (!data) {
            res.send('no book exists');
          } else {
            res.json({
              _id: data.id,
              title: data.title,
              comments: data.comments,
              commentcount: data.commentcount
            });
          }
        })
        .catch(err => {
          res.send('no book exists');
        });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      if (!comment) {
        res.send('missing required field comment')
      } else {
        // const newComment = new commentModel({comment: comment});
        //json res format same as .get
        bookModel.findById(bookid)
          .then(book => {
            if (!book) {
              res.send('no book exists');
            } else {
              bookModel.findByIdAndUpdate(
                bookid,
                {$push: {comments: comment}, $inc: {commentcount: 1}},
                {new: true}
              )
                .then(data => {
                  res.json({
                    _id: data.id,
                    title: data.title,
                    comments: data.comments,
                    commentcount: data.commentcount
                  });
                })
                .catch(err => console.log(err));
            }
          })
          .catch(err => {
            res.send('no book exists');
          });
      }
      
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      bookModel.findByIdAndDelete(bookid)
        .then(data => {
          res.send('delete successful');
        })
        .catch(err=>console.log(err));
    });
  
};
