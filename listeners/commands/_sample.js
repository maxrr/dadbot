// supplied to immediately register command on one guild instead
// of waiting an hour for it to disperse to all connected guilds
// !! change this to null if you want this to work on all guilds !!
let guildId = '253247201860517889';

const commands = [
    {
        name: 'ping',
        description: 'ping pong',
    },
];

exports.setup = function(gbv) {

    // clear commands before we do anything else so that we don't double up on commands

    gbv.client.on('ready', () => {
        
        gbv.client.interactions.getCommands()
            .then((arr) => {

                gbv.fp.p(`$iClearing commands...`);
                if (arr.length == 0) {
                    gbv.fp.p(`$iNo commands registered`);
                }
                for (let command of arr) {
                    gbv.fp.p(`$iDeleting command ${command.name}`);
                    gbv.client.interactions.deleteCommand(command.id);
                }

                gbv.fp.p(`$iCreating new commands...`)
                for (cmd of commands) {
                    gbv.client.interactions.createCommand(cmd, guildId)
                        .then(gbv.fp.p(`$iNew command registered: ${cmd.name}`))
                        .catch(console.error);
                }
                
            });

    });

    gbv.client.on('interactionCreate', interaction => {
        gbv.fp.p(`$iInteraction received from ${interaction.author.tag}`);
        if (interaction.name === 'ping') {
            interaction.channel.send('pong');
        }
    });

    
}