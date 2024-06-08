const { Client,LocalAuth, AuthStrategy,MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// Create a new client instance
const client = new Client(
    {
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        },
        authStrategy: new LocalAuth({
            dataPath: 'clientdata'
        })
    }
);

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', async message => {
    const content = message.body;
	if (content === '!ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
	}
    if(content === '!meme'){
        const meme = await axios("https://meme-api.com/gimme")
        .then(res=>res.data)
        client.sendMessage(message.from,await MessageMedia.fromUrl(meme.url));
    }
});

// Start your client
client.initialize();
