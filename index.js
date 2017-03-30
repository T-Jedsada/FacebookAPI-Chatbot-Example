const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const MicroGear = require('microgear');
const app = express();

const APPID  = "20scoopsSmartHome";
const KEY    = "9m6JZvFwYd42YWR";
const SECRET = "tRH075AnfqAi6Z2XY62TyDyjZ";
const ALIAS = "facebook_chatbot";
const token = "EAAJGo7i4jZCIBAKZCEa9onrJiz1tYBt5jHK2bdRRGaZCeNZBJw9s5WZBI2zgxbpNL22c11BZA4U9s5EZBaTeGcULzNTcblthhXQPieIpTZCXcP9QyKRat1uSn8qKhphy7ofMPpDt8OvKeMaC3PHLUIy5bDK5wnNOtnw3c9RDmdJWbgZDZD"

var temp, humid;
var dataTurnOn = ["Turn on", "turn on", "light on", "Light on", "เปิดไฟ"];
var dataTurnOff = ["Turn off", "turn off", "light off", "Light off", "ปิดไฟ"];
var dataReadTemp = ["temp","Temp","Temp?", "temperature", "Temperature", "temp?", "What temperature", "อุณหภูมิเท่าไร","อุณหภูมิ", "อุณหภูมิตอนนี้"];
var dataReadHumid = ["humid", "What humidity", "humidity?", "humidity", "ความชื้น", "ความชื้นเท่าไร","ความชื้นตอนนี้"];

var microgear = MicroGear.create({
    key : KEY,
    secret : SECRET
});

microgear.on('connected', function() {
	console.log('Connected...');
	microgear.setalias("facebook_chatbot");
	microgear.subscribe("/gearname/facebook_chatbot/humid");
	microgear.subscribe("/gearname/facebook_chatbot/temp");
});

microgear.on('message', function(topic,body) {
	if (topic.includes("/temp")) temp = "Temperature : " + body + " celcius";
    else humid = "Humidity : " + body + " %RH";
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
	// var userId = req.param('chatfuel user id', null);
	var userId = req.param('messenger user id', null);
	var input = req.param('query',null);
	if(dataTurnOn.indexOf(input) > -1) {
		microgear.publish("/gearname/facebook_chatbot","1");
		sendTextMessage(userId, "ไฟใน 20Scoops Campus ได้เปิดแล้ว");
	} else if(dataTurnOff.indexOf(input) > -1){
		microgear.publish("/gearname/facebook_chatbot","0");
		sendTextMessage(userId, "ไฟใน 20Scoops Campus ได้ปิดแล้ว");
	} else if(dataReadTemp.indexOf(input) > -1){
		sendTextMessage(userId, temp);
	} else if(dataReadHumid.indexOf(input) > -1){
		sendTextMessage(userId, humid);
	} else {
		sendTextMessage(userId, "ไม่มีคำสั่งพวกนี้อยู่ในการเรียนรู้ ขออภัยด้วย ค่ะ");
	}
	console.log(req.body);
	return res.send(userId);
});

app.listen(app.get('port'), function () {
  console.log('Express listening on port! '+app.get('port'))
});

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