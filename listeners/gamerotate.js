// set up global counter since we don't have iterators
let c = 0;

// our diff options
let games = [
    ['COMPETING', 'a farting contest'],
    ['PLAYING', 'catch with my son'],
    ['WATCHING', 'some football'],
    ['LISTENING', 'to some ACDC'],
    ['WATCHING', 'something NSFW'],
];

// recursive function to be called
function changeGame(cli, wait, cb) {

    // call .setActivity() with our args
    cli.user.setActivity(games[c][1], { type: games[c][0] })
        .then(p => cb[0](p))
        .catch(e => cb[1](e));

    // increment c but make sure it's within the bounds of games[]
    c++;
    if (c > games.length - 1) { c = 0; }

    // we use setTimeout() to wait a certain amount of time (see ../config.json) 
    // before changing it to the next game in the cycle
    setTimeout(() => {
       
        changeGame(cli, wait, cb);

    }, wait);
}

exports.setup = function(gbv) {
    gbv.client.on('ready', () => {

        // call it for the first time and get the ball rolling...
        // we use callbacks instead of promises here because i'm stupid
        // and couldn't figure out how to return the promise in a recursive function
        changeGame(gbv.client, gbv.cfg.game_wait_time, [(presence) => {
            gbv.fp.p(gbv.p_codes.upd, `Activity set to \'${presence.activities[0].name}\'`);
        }, (err) => {
            gbv.fp.p(gbv.p_codes.err, `Activity set failed! Error below:\n${err}`);
        }])

    });
}