const {Wit,log} = require('node-wit')

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN

// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {}



const findOrCreateSession = (fbid) => {
	let sessionId;

	// Check if session already exists for user fbid
	Object.keys(sessions).forEach(k => {
		if (session[k].fbid === fbid) {
			sessionId = k;
		}
	});

	if (!sessionId) {
		// No session found for user fbid, let's create one
		sessionId = new Date().toISOString();
		sessions[sessionId] = {fbid: fbid, context: {}};
	}
	return sessionId;
}

// Setting up wit.ai bot

const wit = new Wit({
	accessToken: WIT_TOKEN,
	logger: new log.Logger(log.info)
})

// Wit message API
const client = (clientMessage) => {
	new Wit({accessToken: WIT_TOKEN});
	client.message(clientMessage, {})
		.then((data) => {
		console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
		})
		.catch(console.error);
} 

const {interactive} = require('node-wit');
interactive(client);

export default wit-client;

