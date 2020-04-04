var mqtt = require('mqtt');
const Mailer = require('nodemailer');

var options = {
  username: "indoor-lora-insa",
  password: "ttn-account-v2.UhQI53_Tdv9Z9BM9153WGUcgAdCf35hlXvSn9tlxtHc",
}
var client  = mqtt.connect("mqtt://eu.thethings.network",options);
client.subscribe("+/devices/+/up");

//  --------------------------------------

client.on("connect",function(){	
  console.log("connected"+" "+client.connected);
});

client.on('message', function(topic, message_raw, packet){
  message = message_raw.toString();
  message_json = JSON.parse(message);
  
  time = message_json.metadata.time;
  heure = time.slice(time.indexOf("T")+1,time.indexOf("."));

  device = message_json.dev_id;

  if(message_json.payload_raw == 'MA=='){
    payload = "0";
  } else {
    if(message_json.payload_raw == 'MQ=='){
      payload = "1";
    }
  } 
  if((payload == "1") && ((Number(heure.slice(0,2)) < 6) || (Number(heure.slice(0,2)) > 22))){
    
    subject = "Le device "+device+" a détecté une lumière allumée";
    text = "Le device "+device+" a détecté une lumière allumée";
    sendMail(subject, text);
  }
});

client.on("error",function(error){
  console.log("Can't connect" + error);
  process.exit(1)
});

function sendMail(subject, text){
  // Create a SMTP transporter object
  let transporter = Mailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port:465,
      service :'yahoo',
      secure:false,
      auth: {
          user:'pirinsalora@yahoo.com',
          pass:'pirloratc'
      },
      debug: false,
      logger: true,
  });
  // Message object
  let message = {
      from:'pirinsalora@yahoo.com',
      to: 'prenom.nom@insa-lyon.fr',
      subject: subject,
      text: text,
      // html: '<p><b>Hello</b> email automatique, ne pas répondre svp</p>'
  };

  transporter.sendMail(message, (err, info) => {
      if (err) {
          console.log('Error occurred. ' + err);
          return process.exit(1);
      }

      console.log('Message sent');
  });
};