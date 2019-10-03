/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let preSavedId;

suite('Functional Tests', function() {

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


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
            .post("/api/books")
            .send({title: "Test POST /api/books with title"})
            .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            preSavedId = res.body._id;
            done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
            .post("/api/books")
            .send({})
            .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, "error");
            assert.equal(res.body.error, "no title given");
            done();
        })
        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
            .post("/api/books")
            .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
            assert.property(res.body[0], "title", "Books in array should contain a title");
            assert.property(res.body[0], "_id", "Books in array should contain an _id");
            done();
        })
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server) 
            .get("/api/books/1234")
            .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "no book exists");
          done();
        })
        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        //done();
        chai.request(server)
            .get("/api/books/" + preSavedId)
            .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.isArray(res.body, "response should be an array");
            assert.equal(res.body.title, "Test POST /api/books with title");
            assert.equal(res.body._id, preSavedId);
            done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        //done();
        
        chai.request(server)
            .post("/api/books" + preSavedId)
            .send({comment: "Test POST /api/books/[id] with comment"})
            .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.isArray(res.body.comments, "Comments should be an array");
            assert.equal(res.body.title, "Test POST /api/books with title");
            assert.equal(res.body._id, preSavedId);
           done();
        })
      });
      
    });

  });

});
