const fs = require('fs');

// boilerplate config
let boilerplate = {
    token: "your_bot_token",
    dev_mode: false,
    game_wait_time: 900000,
    owner_id: "your_discord_id",
    cooldown_time: 2500,
};

// new class because we can and it's nicer that way
class ConfigMaker {

    // make our constructor
    constructor(fancyprinter, path="./config.json") {
        this.fancyprinter = fancyprinter;
        this.path_to_config = path;
    }
    
    // get function for path
    getPath() {
        return this.path_to_config;
    }

    // biggy method
    getConfig() {

        // if the file exists
        if (fs.existsSync(this.path_to_config)) {
            try {

                // see if we can read the file
                fs.accessSync(this.path_to_config, fs.constants.R_OK);

                // parse config.json at the path to config
                const current_config = JSON.parse(fs.readFileSync(this.path_to_config));

                // loop through the keys of config.json and check them
                for (let key of Object.keys(boilerplate)) {
                    if (current_config[key] == null) {
                        let error_print = `Config is missing key ${key}`;
                        this.fancyprinter.p(`$e${error_print}`);
                        throw new Error(error_print);
                    }
                }

                // check if bot token has been filled
                if (current_config.token == 'your_bot_token') {
                    let error_print = `Config file found and was readable, but bot token was invalid.`;
                    this.fancyprinter.p(`$e${error_print}`);
                    throw new Error(error_print);
                }

                // if nothing's wrong then return the config that currently exists
                return current_config;

            } catch {

                // throw error when we can't read the file
                let error_print = `Config file is not readable at '${this.path_to_config}'`;
                this.fancyprinter.p(`$e${error_print}`);
                throw new Error(error_print);

            }
        } else {

            try {

                // throw error when the file doesn't exist, after we've written it
                // if we don't do this then we'll try and launch with a guaranteed bad bot key
                fs.writeFileSync(this.path_to_config, JSON.stringify(boilerplate, null, 2));
                let error_print = `Config file was nonexistent, boilerplate was written to '${this.path_to_config}'.\nPlease open and configure me.`;
                this.fancyprinter.p(`$e${error_print}`);
                throw new Error(error_print);

            } catch {

                // throw error when failing to write a new config.json from boilerplate
                let error_print = `Config not found, failed to write new boilerplate config at '${this.path_to_config}'`;
                this.fancyprinter.p(`$e${error_print}`);
                throw new Error(error_print);
                
            }

        }
    }

}

module.exports = { ConfigMaker }