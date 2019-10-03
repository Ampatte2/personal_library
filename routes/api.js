/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = "mongodb+srv://Ampatte2:Roflpwn123@personal-library-u9ypx.mongodb.net/test?retryWrites=true&w=majority";
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db){
        var database = db.db("test");
        var collection = database.collection("books");
        collection.find().toArray((err, docs)=>{
          if (err){console.log(err)};
          res.json(docs);
          db.close();
        })
      })
    
      
    })
    
    .post(function (req, res){
      var title = req.body.title;
    
      var newBook = {title: title, comments: [], commentcount: 0};
      console.log(title);
      MongoClient.connect(MONGODB_CONNECTION_STRING, {new: true}, function (err, db){
        console.log("connection successful");
        var database = db.db("test");
        var collection = database.collection("books");
        collection.insertOne(newBook, (err, docs)=>{
          if (err){return res.type("text").send("no title given")};
          res.json(docs.ops[0]);
          db.close(); 
        })
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      
      
      MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db){
        console.log("connection successful")
        var database = db.db("test");
        var collection = database.collection("books");
        collection.deleteMany({},(err, docs)=>{
          if (err){
             db.close();
             return res.type("text").send("could not delete ");
          }else{
            res.type("text").send("complete delete successful");
            db.close();
          };

        })
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      bookid.toString();
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      console.log(bookid);
       MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db){
        console.log("connection successful")
        var database = db.db("test");
        var collection = database.collection("books");
        collection.findOne({_id: ObjectId(bookid)},(err, docs)=>{
          if (err){
             db.close();
             return res.type("text").send("no book exists");
          }else{
            res.json(docs);
            db.close();
          };

        })
      });
    
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      console.log(comment);
      //json res format same as .get
      MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db){
        console.log("connection successful")
        var database = db.db("test");
        var collection = database.collection("books");
        collection.findOneAndUpdate({_id: ObjectId(bookid)}, {$push: {"comments": comment}, $inc: {"commentcount": 1} }, (err, docs)=>{
          if (err){
             db.close();
             return res.type("text").send("Failed Push");
          }else{
            res.json(docs.value);
            db.close();
          };

        })
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
    
    
      MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db){
        var database = db.db("test");
        var collection = database.collection("books");
        collection.findOneAndDelete({_id: ObjectId(bookid)}, (err, docs)=>{
          if (err){db.close;
                   return res.type("text").send("Could not delete " + bookid)
          }if (docs.value===null){
            return res.type("text").send("_id error")
          }else{res.type("text").send("deleted " + bookid)}; 
          db.close();
        })
      })
    });
  
};
