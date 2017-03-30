const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var MicroGear = require('microgear');

const APPID  = "20scoopsSmartHome";
const KEY    = "9m6JZvFwYd42YWR";
const SECRET = "tRH075AnfqAi6Z2XY62TyDyjZ";
const ALIAS = "facebook_chatbot";

var microgear = MicroGear.create({
    key : KEY,
    secret : SECRET
});

microgear.on('connected', function() {
	console.log('Connected...');
	microgear.setalias("facebook_chatbot");
    setInterval(function() {
        microgear.chat('facebook_chatbot', 'Hello world.');
    },1000);
});

microgear.on('message', function(topic,body) {
    console.log('incoming : '+topic+' : '+body);
});

microgear.on('closed', function() {
    console.log('Closed...');
});

microgear.connect(APPID);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: false
}));

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

app.post('/control',function(req,res){
	var userId = req.param('chatfuel user id', null);
	var input = req.param('query',null);
	// TODO : check input contain word command
	sendTextMessage(userId, "เปิดไฟให้แล้วจ้า")
	console.log(req.body);
	return res.send(userId);
});

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