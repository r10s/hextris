
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

function escapeHtml(raw) {
    return raw.replace(/[&<>"']/g, function onReplace(match) {
        return '&#' + match.charCodeAt(0) + ';';
    });
}

function getAllHighscoresHtml() {
    var ret = "Highscores"
    var cnt = 0
    getAllHighscores().forEach(item => {
        if (cnt < 5) {
            const name = item.name.length > 17 ? item.name.substring(0, 15) + '…' : item.name;
            ret += "<br>"
            ret += cnt === 0 ? '<span style="color:#fcbd6d; text-shadow: .05em .05em white;">' : ''
            ret += escapeHtml(name) + " - " + escapeHtml(item.score + '')
            ret += cnt === 0 ? '</span>' : ''
            cnt += 1
        }
    });
    return ret;
}

window.webxdc.setUpdateListener((update) => {
    const player = update.payload
    setHighscoreFor(player.addr, player.name, player.score)
    if (update.serial === update.max_serial) {
        $('#highscorelist').html(getAllHighscoresHtml())
    }
}, 0)
