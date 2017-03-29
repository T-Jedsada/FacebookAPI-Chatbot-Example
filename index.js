var express = require('express');
var app = express()

app.set('port', (process.env.PORT || 5000));

app.get('/pond',function(req,res){
	return res.send('Pond');
});

var port = app.get('port')
app.listen(port, function () {
  console.log('Express listening on port! '+port)
});