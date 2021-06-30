const dbconfig = require("./config");
const express = require("express");
const bcrypt = require("bcrypt"); 
const fetch = require("node-fetch");
var jwt = require('jsonwebtoken');
exports.verify = function(req,res,next){
    const access = req.headers["authorization"]
    if(typeof access !== 'undefined') {
        req.token = access
        next()
    }
    else {
        res.sendStatus(403)
    }
}
exports.checkUser = (req,res,next) => {
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    res.json({
        token: token
    })
}