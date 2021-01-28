const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/webhooks/answer', (req, res) => {
	res.json(mainMenu(req));
});

app.post('/webhooks/events', (req, res) => {
	console.log(req.body);
	res.sendStatus(204);
});

app.post('/webhooks/dtmf', (req, res) => {
	let actions = [];
	let ncco = [];
	switch (req.body.dtmf) {
		case '1':
			actions.push({
				action: 'talk',
				text: `It is ${new Intl.DateTimeFormat(undefined, {
					dateStyle: 'full',
					timeStyle: 'long',
				}).format(Date.now())}`,
			});
			break;
		case '2':
			actions.push({
				action: 'stream',
				streamUrl: [
					'https://nexmo-community.github.io/ncco-examples/assets/voice_api_audio_streaming.mp3',
				],
			});
	}
	ncco = actions.concat(mainMenu(req));

	console.log(ncco);

	res.json(ncco);
});

function mainMenu (req) {
	return [
		{
			action: 'talk',
			bargeIn: true,
			text:
				'Welcome. Press 1 to hear the current date or 2 to play audio. Press any other key to hear these options again.',
		},
		{
			action: 'input',
			type: [ 'dtmf' ],
			dtmf: {
				maxDigits: 1,
			},
			eventUrl: [ `${req.protocol}://${req.get('host')}/webhooks/dtmf` ],
		},
	];
}

app.listen(3000);
