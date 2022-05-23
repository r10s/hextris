
let PLAYERS = {};

function getHighscoreFor(addr) {
    return PLAYERS[addr] ? PLAYERS[addr].score : 0;
}

function setHighscoreFor(addr, name, score) {
    if (getHighscoreFor(addr) < score) {
        PLAYERS[addr] = {'name': name, 'score': score}
        return true
    }
    return false
}

function updateSelfHighscore(score) {
    const addr = window.webxdc.selfAddr;
    const name = window.webxdc.selfName;
    if (setHighscoreFor(addr, name, score)) {
        const info = name + ' scored ' + score + ' in Hextris';
        const payload = {addr: addr, name: name, score: score};
        const summary = 'Top score held by ' + getAllHighscores().shift().name;
        window.webxdc.sendUpdate({payload: payload, summary: summary, info: info}, info);
    }
}

function getAllHighscores() {
    return Object.keys(PLAYERS).map((addr) => {
        const player = PLAYERS[addr];
        player.addr = addr;
        return player;
    }).sort((a, b) => b.score - a.score);
}

window.webxdc.setUpdateListener((update) => {
    const player = update.payload
    setHighscoreFor(player.addr, player.name, player.score)
    if (update.serial === update.max_serial) {
        // TODO: update highscore list
    }
}, 0)
