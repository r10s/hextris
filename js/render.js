function render() {
	var grey = '#bdc3c7';
	if (gameState === 0) {
		grey = "rgb(220, 223, 225)";
	}

	ctx.clearRect(0, 0, trueCanvas.width, trueCanvas.height);
	clearGameBoard();
	if (gameState === 1 || gameState === 2 || gameState === -1 || gameState === 0) {
		if (op < 1) {
			op += 0.01;
		}
		ctx.globalAlpha = op;
		drawPolygon(trueCanvas.width / 2 , trueCanvas.height / 2 , 6, (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth, 30, grey, false,6);
		drawTimer();
		ctx.globalAlpha = 1;
	}

	var i;
	for (i = 0; i < MainHex.blocks.length; i++) {
		for (var j = 0; j < MainHex.blocks[i].length; j++) {
			var block = MainHex.blocks[i][j];
			block.draw(true, j);
		}
	}
	for (i = 0; i < blocks.length; i++) {
		blocks[i].draw();
	}

	MainHex.draw();
	drawScoreboard();

	for (i = 0; i < MainHex.texts.length; i++) {
		var alive = MainHex.texts[i].draw();
		if(!alive){
			MainHex.texts.splice(i,1);
			i--;
		}
	}

	if ((MainHex.ct < 650 && (gameState !== 0) && !MainHex.playThrough)) {
		if (MainHex.ct > (650 - 50)) {
			ctx.globalAlpha = (50 - (MainHex.ct - (650 - 50)))/50;
		}

		if (MainHex.ct < 50) {
			ctx.globalAlpha = (MainHex.ct)/50;
		}

		renderBeginningText();
		ctx.globalAlpha = 1;
	}

	if (gameState == -1) {
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = 'rgb(236,240,241)';
		ctx.fillRect(0, 0, trueCanvas.width, trueCanvas.height);
		ctx.globalAlpha = 1;
	}

	settings.prevScale = settings.scale;
	settings.hexWidth = settings.baseHexWidth * settings.scale;
	settings.blockHeight = settings.baseBlockHeight * settings.scale;
}

function renderBeginningText() {
	const upperheight = (trueCanvas.height/2) - ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (5/6);
	const lowerheight = (trueCanvas.height/2) + ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (11/16);
    const fontSize = 33;
    if(/mobile|Mobile|iOS|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		input_text = 'tap screen\'s left'
		action_text = 'and right sides to rotate'
		score_text = 'match 3+ blocks to score'
    } else {
		input_text = 'use left and right'
		action_text = 'arrow keys to rotate'
		score_text = 'match 3+ blocks to score'
    }
	renderText((trueCanvas.width)/2 + 2 * settings.scale,upperheight-0*settings.scale, fontSize, '#2c3e50', input_text);
	renderText((trueCanvas.width)/2 + 2 * settings.scale,upperheight+33*settings.scale, fontSize, '#2c3e50', action_text);

	renderText((trueCanvas.width)/2 + 2 * settings.scale,lowerheight,fontSize, '#2c3e50', score_text);
}

function renderHighscore() {
	const lowerheight = (trueCanvas.height/2) + ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (11/16);
	const fontSize = 27

	var cnt = 0
	getAllHighscores().forEach(item => {
		if (cnt < 5) {
			const name = item.name.length > 17 ? item.name.substring(0, 15) + '…' : item.name;
			const line = name + " " + item.score
			renderText((trueCanvas.width)/2 + 2 * settings.scale, lowerheight + (fontSize*cnt), fontSize, '#2c3e50', line);
			cnt += 1
		}
	});
}
