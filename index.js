// global requirements
const Djs = require('discord.js')
const interactions = require('discord-slash-commands-client');
const fs = require('fs');

// list out our codes
const PNT_INFO = 0
const PNT_UPD = 1
const PNT_ERR = 2
const PNT_FS = 3

// make a FancyPrinter for us to use
const FancyPrinter = require('./util/fancyprinter.js').FancyPrinter;
const fp = new FancyPrinter(PNT_INFO, PNT_UPD, PNT_ERR, PNT_FS);
fp.warmup();
fp.p(PNT_UPD, 'Starting up...')

// get our config and ensure that it's right
const ConfigMaker = require('./util/ensureconfig.js').ConfigMaker;
const cm = new ConfigMaker(fp);
const cfg = cm.getConfig();
const DEV_MODE = cfg.dev_mode || false;
fp.p(PNT_INFO, `Developer mode is currently ${DEV_MODE ? "ENABLED" : "DISABLED"}`);

// boot up the interactions client for slash commands
const client = new Djs.Client();
client.interactions = new interactions.Client(cfg.token, "798589163108696116");

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
/*let listeners = fs.readdirSync('./listeners/', { withFileTypes: true })
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
}*/

// set up our file loader for the files
const FileLoader = require('./util/fileloader.js').FileLoader;
const fl = new FileLoader();
const files = fl.loadDirectory('./listeners', (fileName) => {

    return (
        fileName.substring(fileName.length - 3) == ".js" 
        && (
            (!fileName.startsWith('_') 
            && !fileName.startsWith('*')
        ) 
        || DEV_MODE)
    );

}, true);

// now we iterate through the files and require() them all
for (let file of files) {
    try {
        // provide key-pair object w/ important GloBal Variables (gbv)
        let fileRequire = require(file);
        if (fileRequire.setup) {
            require(file).setup({
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
            fp.p(PNT_FS, `${file} completed setup`);
        } else {
            fp.p(PNT_FS, `${file} would be set up, but no setup function found`);
        }
    } catch (err) {
        fp.p(PNT_ERR, `${file} failed setup! Error below:\n${err}`);
    }
}

// log in the client after we've done all that jazz
client.login(cfg.token);