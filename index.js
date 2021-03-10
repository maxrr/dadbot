// global requirements
const Djs = require('discord.js')
const client = new Djs.Client();
const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('./config.json'));
const DEV_MODE = cfg.dev_mode || false;

// list out our codes
let PNT_INFO = 0
let PNT_UPD = 1
let PNT_ERR = 2
let PNT_FS = 3

// make a FancyPrinter for us to use
FancyPrinter = require('./util/fancyprinter.js').FancyPrinter;
const fp = new FancyPrinter(PNT_INFO, PNT_UPD, PNT_ERR, PNT_FS);
fp.warmup();
fp.p(PNT_UPD, 'Starting up...')

// make our QRH class for making the 'father is typing...' work
class QueuedResponseHandler {
    constructor(delay) {
        // default delay is 2s
        this.delay = delay || 2000;
    }

    // queueResponse method
    queueResponse(channel, content, delay) {
        channel.startTyping();
        setTimeout(() => {
            channel.send(content);
            channel.stopTyping();
        }, delay || this.delay)
    }
}

const qrh = new QueuedResponseHandler();

// login text, says user w/ tag & how many guilds
client.on('ready', () => {
    fp.p(PNT_UPD, `Logged in as ${client.user.tag}`);

    let servedUsers = 0;
    client.guilds.cache.forEach(guild => {
        servedUsers += guild.memberCount;
    });
    
    fp.p(PNT_UPD, `I am active on ${client.guilds.cache.size} guild(s), serving ${servedUsers} users`);
});

// load files in ./listeners/
let listeners = fs.readdirSync('./listeners/', { withFileTypes: true })
for (let i in listeners) {
    let file = listeners[i];
    if (file.name.substring(file.name.length - 3) == '.js') {
        if (!file.name.startsWith('_') && (!file.name.startsWith('*') || DEV_MODE)) {
            try {
                // provide key-pair object w/ important GloBal Variables (gbv)
                require(`./listeners/${file.name}`).setup({
                    Djs: Djs,
                    client: client,
                    fs: fs,
                    cfg: cfg,
                    DEV_MODE: DEV_MODE,
                    qrh: qrh,
                    fp: fp,
                    p_codes: {
                        info: PNT_INFO,
                        upd: PNT_UPD,
                        err: PNT_ERR,
                        fs: PNT_FS
                    }
                });
                fp.p(PNT_FS, `${file.name} completed setup`)
            } catch(err) {
                fp.p(PNT_ERR, `${file.name} failed setup! Error below:\n${err}`)
            }
        }
    }
}

// log in the client after we've done all that jazz
client.login(cfg.token);