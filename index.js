const express = require("express");
const app = express();
const env = process.env.NODE_ENV || "development";
const config = require("./knexfile.js")[env];
const knex = require("knex")(config);


const ejs = require("ejs");
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;


const bcrypt = require("bcrypt-as-promised");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.static("views"));

app.get("/sign_up",function(req,res, next){
 res.render("signup");
});

app.post("/users/:user_id/todos", function(req, res, next){
  const user_id = req.params.user_id;
  knex("todos")
   .insert({
     task:req.body.task,
     user_id: user_id
   })
    .then(function(){
      res.redirect("/users/" + user_id);
    })
});

app.get("/users", function(req,res, next){
  knex("users") //we use knex to get all users
  .then(function(data){
    res.render("index", {data});
  });
})

app.get("/todos", function(req,res, next){
  knex("todos")
  .then(function(todos){
    res.render("todos", {todos});
  })
})

app.get("/users/:id", function(req,res,next){
  knex("users")
  .where("id", req.params.id)
  .first()
  .then(function(user){
    knex("todos")
    .where("user_id", req.params.id)
    .then(function(todos){
      res.render("user", {user, todos});
    });
  });
});



app.post("/users", function(req, res, next){
  const {username, password} = req.body;
  console.log("This is req.body", req.body);
  bcrypt.hash(req.body.password, 12)
  .then(function(hashed_password){
    return knex("users")
     .insert({
       username,
       hashed_password
     })
  }).then(function(users){
    res.redirect("/users");
    //res.sendStatus(200)
  })
  .catch(function(err){
    next(err);
  });
});

app.listen(port, function(){
  console.log("Listening on 3000...");
});
