const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: false
}));

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

app.get('/control/:command',function(req,res){
	console.log(req.params.command)
	return res.send(req.params.command);
});

app.post('/control',function(req,res){
	var userId = req.param('chatfuel user id', null);
	sendTextMessage(userId, "เปิดไฟให้แล้วจ้า")
	console.log(req.body);
	return res.send(userId);
});

app.get('/read/:type',function(req,res){
	return res.send(req.params.type);
})

var port = app.get('port')
app.listen(port, function () {
  console.log('Express listening on port! '+port)
});

const token = "EAAJGo7i4jZCIBAA3B1ZB9tmWdeSGnZBJ4cBpAILraVf7wjZAi4GPECpgEZBrsZAjH3yYTd86FOK8wHhUgwqB87iaoOHwXSOm4bSFKh40PmRQ1LqHZApRv3BDKZA8VMAKDlee2Y1YfPGOavGSTpS10jPtNYdnBgJVII86xzzapMmNEgZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}