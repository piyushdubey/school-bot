'use strict'
import * as witModule from 'wit-client.js';

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fetch = require('node-fetch')
const wit = require('./wit-client')
const crypto = require('crypto')

// Webserver parameters
const PORT = process.env.PORT || 8445;

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
if (!FB_PAGE_TOKEN) { throw new Error('missing FB_PAGE_TOKEN') }

const FB_APP_SECRET = process.env.FB_APP_SECRET;
if (!FB_APP_SECRET) { throw new Error('missing FB_APP_SECRET') }

// TODO : Discuss if we need to create a token. Current static
// token my_voice_is_my_password_verify_me works fine for us at the moment
let FB_VERIFY_TOKEN = 'my_voice_is_my_password_verify_me';

/*
crypto.randomBytes(8, (err, buff) => {
  if (err) throw err;
  FB_VERIFY_TOKEN = buff.toString('hex');
  console.log(`/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}"`);
});
*/

// ---------------------------------------------------
// Messenger API specific code

// TODO: Refer Send API reference on developers.facebook.com
const fbMessage = (id, text) => {
	const body = JSON.stringify({
		recipient: { id },
		message: { text },
	});
	const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
	return fetch('https://graph.facebook.com/me/messages?' + qs, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body,
	})
	.then(response => response.json())
	.then(json => {
		if (json.error && json.error.message) {
			throw new Error(json.error.message);
		}
		return json;
	});
};

// ---------------------------------------------------
// Setting up the express webserver
const app = express();

app.use(({method, url}, rsp, next) => {
	rsp.on('finish', () => {
		console.log(`${rsp.statusCode} ${method} ${url}`);
	});
	next();
});

app.use(bodyParser.json({ verify: verifyRequestSignature }));

// Index route
app.get('/', (req, res) => {
	res.send('Hello world, My name is SchoolBot. I can help you study!');
});

// Setup Webhook
app.get('/webhook/', (req, res) => {

	if (req.query['hub.mode'] === 'subscribe' &&
		req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong token')
});

// Message handler
app.post('/webhook/', function (req, res) {

	// Parse the Messenger Payload
	const data = req.body;
	const t = data.object === 'page';
	const s = data.object == 'page';

	console.log(JSON.stringify(data));
	
	if (data.object === 'page') {
		data.entry.forEach(entry => {
			entry.messaging.forEach(event => {

				// Retrieve Facebook user ID of the sender
				const sender = event.sender.id;

				// Process message payload
				if (event.message && !event.message.is_echo) {

					// We could retrieve the user's current session, or create one if it doesn't exist
					// This is useful is we want the bot to figure out the conversation history
					// const sessionId = findOrCreateSession(sender);

					// Retrieve the message content
					const {text, attachments} = event.message;
					witModule.client(text);

					if (attachments) {
						fbMessage(sender, 'Sorry, I can\'t process this message, please type your message!')
						.catch(console.error);
					} else if (text) {
						// We received a text message
						// Extract entities, intents, and traits
						const { entities, intents, traits } = event.message.nlp; 
						if (entities) {
							console.log("entities: " + JSON.stringify(entities));
						}

						if (intents) {
							console.log("intents: " + JSON.stringify(intents));
							const trueIntent = intents[0]
							if (trueIntent){
								fbMessage(sender, "I see you");
							} else if (trueIntent == null){
								fbMessage(sender, "You have no intent");
							}
						}

						if (traits) {
							console.log("traits: " + JSON.stringify(traits));
						}
						// Reply with a dummy message for now
						fbMessage(sender, "We've received your message!!");
					} else {
						console.log('received event', JSON.stringify(event));
					}
				}
			});
		});
		res.sendStatus(200);
	}
});


/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];
  console.log(signature);

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

// Spin up the server
app.listen(PORT);
console.log(`running on port: ${PORT} ...`);
