'use strict'
const env = "development";
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt-as-promised");
const bodyParser = require("body-parser");
const config = require("../knexfile.js")[env];
const knex = require("knex")(config);

router.use(bodyParser.json());

router.post("/users", function(req, res, next){
  const {username, password} = req.body;
  bcrypt.hash(req.body.password, 12)
  .then(function(hashed_password){
    return knex("users")
     .insert({
       username:req.body.username,
       hashed_password: hashed_password
     })
  }).then(function(){
    res.sendStatus(200)
  }).catch(function(err){
    next(err);
  })
});


module.exports = router;
