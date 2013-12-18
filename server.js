var express = require('express');
var request = require('request');
var fs = require('fs');

var port = process.env.port || 1337;
var app = express();
var map = {};
app.set("trust proxy", true);

app.get('/reqImage',function(req,res){
	var uid = guidGenerator();
	map[uid] = {};
	map[uid].status = false;
	res.send(uid);
});
app.get('/:uid',function (req, res) {
	if(map[req.params.uid])
	{
		map[req.params.uid].status = true;
		map[req.params.uid].timeRead = new Date();
	}
	
	res.sendfile('res/0.gif');   
});

app.get('/',function(req,res){
	res.send(JSON.stringify(map,undefined,2));
});

app.listen(port);

//utility functions
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}