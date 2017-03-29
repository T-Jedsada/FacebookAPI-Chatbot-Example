const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: false
}));
app.set('port', (process.env.PORT || 5000));

app.get('/control/:command',function(req,res){
	return res.send(req.params.command);
});

app.get('/read/:type',function(req,res){
	return res.send(req.params.type);
})

var port = app.get('port')
app.listen(port, function () {
  console.log('Express listening on port! '+port)
});