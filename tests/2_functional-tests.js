/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { Comment } = require('zombie/lib/dom');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    let testId;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({title: 'Enemy'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Enemy');
            assert.property(res.body, '_id');
            testId = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  (done) => {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'Is an array');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'comments');
            assert.isNumber(res.body[0].commentcount);
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  (done) => {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/66d83971beb9098765432123')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  (done) => {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/'+ testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Enemy');
            assert.equal(res.body._id, testId);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/'+testId)
          .send({comment: 'very good'})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.comments, 'very good');
            assert.equal(res.body._id, testId);
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/'+testId)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', (done) => {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/123456789098765432123456')
          .send({ comment: 'Nice book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai
          .request(server)
          .keepOpen()
          .del('/api/books/'+testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        chai
          .request(server)
          .keepOpen()
          .del('/api/books/123456789098765432123456')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
