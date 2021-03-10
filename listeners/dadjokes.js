// write out the possible greetings for 
// 'hey dad' or 'hi dad' or 'whats up dad'
// string for same greeting & response

// array for different greeting & response
let greetings = [
    'hey',
    'hi',
    'whats up',
    'what\'s up',
    'hows it going',
    'how\'s it going',
    ['love you', 'love you too'],
    ['love u', 'love u too'],
];

// response names
// todo: add rare responses & names
let names = [
    'champ',
    'son',
    'sport',
    'bud',
    'buddy',
    'pal',
];

// positive responses for the gay question
let positives = [
    "yeah",
    "yep",
    "yes",
    "obviously",
];

// key-value map for cooldowns of users
let cooldowns = {};

// export our setup function so we can run it in index.js
exports.setup = function(gbv) {
    // set up a message listener
    gbv.client.on('message', msg => {
        
        // print messages sent by users
        if (msg.content.length > 0) {
            gbv.fp.p(gbv.p_codes.info, `[${msg.guild.name}] [#${msg.channel.name}] ${msg.author.tag}: ${msg.content}`);
        } else {
            gbv.fp.p(gbv.p_codes.info, `[${msg.guild.name}] [#${msg.channel.name}] ${msg.author.tag} sent an image or empty message`);
        }

        // make sure we don't encourage ourselves or get a loop w/ another bot
        if (!msg.author.bot) {
            // make sure a user isn't spamming
            if (cooldowns[msg.author.id] == null) {

                // add the user to the cooldowns list and remove it once time is up
                cooldowns[msg.author.id] = true;
                setTimeout(gbv.cfg.cooldown_time, () => {
                    cooldowns[msg.author.id] = null;
                });

                // process the content and run the regular expression
                let content = msg.content.trim().toLowerCase();
                let re = new RegExp(/.*?(?:^|[\s])(?:(?:im)|(?:i'm)|(?:i am)) ([\w\s]+?)(?:$|[!.,\r\n])/i);
                let match = content.match(re);
                if (match) {

                    // pop that dad joke if there's a match
                    // (using QueuedResponseHandler from index.js through the passed GloBal Variables)
                    gbv.fp.p(gbv.p_codes.info, `[${msg.guild.name}] [#${msg.channel.name}] ${msg.author.tag} triggered command with string \'${match[1]}\'}`);
                    gbv.qrh.queueResponse(msg.channel, `hi ${match[1]} i'm dad`);

                } else if (content == 'dad am i gay?') {

                    // autorespond
                    gbv.fp.p(gbv.p_codes.info`[${msg.guild.name}] [#${msg.channel.name}] ${msg.author.tag} triggered autoresponse`);
                    gbv.qrh.queueResponse(msg.channel, positives[Math.floor(Math.random() * positives.length)]);

                } else if (content.includes(' dad')) {

                    // do the greeting thing
                    for (i in greetings) {
                        let greeting = greetings[i];
                        if (content.includes(`${(typeof (greeting) == "string" && greeting) || (typeof (greeting) == "object" && greeting[0])} dad`)) {
                            gbv.fp.p(gbv.p_codes.info, `[${msg.guild.name}] [${msg.channel.name}] ${msg.author.tag} triggered autoresponse`);
                            gbv.qrh.queueResponse(msg.channel, `${(typeof (greeting) == "string" && greeting) || (typeof (greeting) == "object" && greeting[1])} ${names[Math.floor(Math.random() * names.length)]}`);
                        }
                    }

                } else if (content == 'whats up' || content == 'what\'s up') {

                    // respond to what's up
                    gbv.fp.p(gbv.p_codes.info, `[${msg.guild.name}] [#${msg.channel.name}] ${msg.author.tag} triggered autoresponse`);
                    gbv.qrh.queueResponse(msg.channel, `the sky`);

                }
                
            }
        }
    });
}