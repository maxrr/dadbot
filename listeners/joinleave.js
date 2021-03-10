exports.setup = function(gbv) {

	// create the listener we want for when the client joins a new guild
	gbv.client.on('guildCreate', (guild) => {
		gbv.fp.p(gbv.p_codes.upd, `Joined new guild ${guild.id} (${guild.name})`);
	});

	// creates the listener we want for when the client leaves a guild
	gbv.client.on('guildDelete', (guild) => {
		gbv.fp.p(gbv.p_codes.upd, `Left/kicked from guild ${guild.id} (${guild.name})`);
	});

	// create the listener we want for when a guild changes its name
    gbv.client.on('guildUpdate', (oldGuild, newGuild) => {
		gbv.fp.p(gbv.p_codes.upd, `Guild ${oldGuild.id} was updated: ${oldGuild.name == newGuild.name ? ('no name change, still \'' + oldGuild.name + '\'') : (oldGuild.name + ' -> ' + newGuild.name)}`);
	});
}



