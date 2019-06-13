var mqtt = require('mqtt');
const nodemailer = require('nodemailer');


var options = {
  username: "indoor-lora-insa",
  password: "ttn-account-v2.UhQI53_Tdv9Z9BM9153WGUcgAdCf35hlXvSn9tlxtHc",

}
var client  = mqtt.connect("mqtt://eu.thethings.network",options);



client.subscribe("+/devices/+/up");

client.on("connect",function(){	
  console.log("connected"+" "+client.connected);
});
client.on('message', function(topic, message, packet){
  console.log(message.toString());
});
client.on("error",function(error){
  console.log("Can't connect" + error);
  process.exit(1)
});