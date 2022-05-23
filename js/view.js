// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutCubic(t, b, c, d) {
	return c * ((t = t / d - 1) * t * t + 1) + b;
}

function renderText(x, y, fontSize, color, text, font) {
	ctx.save();
	if (!font) {
		var font = 'px sans-serif';
	}

	fontSize *= settings.scale;
	ctx.font = fontSize + font;
	ctx.textAlign = 'center';
	ctx.fillStyle = color;
	ctx.fillText(text, x, y + (fontSize / 2) - 9 * settings.scale);
	ctx.restore();
}

function drawScoreboard() {
	if (scoreOpacity < 1) {
		scoreOpacity += 0.01;
		textOpacity += 0.01;
	}
	ctx.globalAlpha = textOpacity;
	var scoreSize = 50;
	var scoreString = String(score);
	if (scoreString.length == 6) {
		scoreSize = 43;
	} else if (scoreString.length == 7) {
		scoreSize = 35;
	} else if (scoreString.length == 8) {
		scoreSize = 31;
	} else if (scoreString.length == 9) {
		scoreSize = 27;
	}
	var color = "rgb(236, 240, 241)";
	if (gameState === 0) {
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 50, "rgb(236, 240, 241)", "start ");
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2.1 + gdy - 155 * settings.scale, 150, "#2c3e50", "hextris");
		renderHighscore()
	} else if (gameState === 2) {
		// game over
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 45, "rgb(236, 240, 241)", "restart ");
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2.1 + gdy - 155 * settings.scale, 150, "#2c3e50", "overflow");
		const lowerheight = (trueCanvas.height/2) + ((settings.rows * settings.blockHeight) * (2/Math.sqrt(3))) * (11/16);
		renderText((trueCanvas.width)/2 + 2 * settings.scale, lowerheight, 33, '#2c3e50', "you scored "+score);
	} else if (gameState != 0 && textOpacity > 0) {
		// fade 'start' button out after tapping
		textOpacity -= 0.05;
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 50, "rgb(236, 240, 241)", "start ");
		renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2.1 + gdy - 155 * settings.scale, 150, "#2c3e50", "hextris");
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
	} else {
		ctx.globalAlpha = scoreOpacity;
		renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
	}

	ctx.globalAlpha = 1;
}

function clearGameBoard() {
	drawPolygon(trueCanvas.width / 2, trueCanvas.height / 2, 6, trueCanvas.width / 2, 30, hexagonBackgroundColor, 0, 'rgba(0,0,0,0)');
}

function drawPolygon(x, y, sides, radius, theta, fillColor, lineWidth, lineColor) {
	ctx.fillStyle = fillColor;
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = lineColor;

	ctx.beginPath();
	var coords = rotatePoint(0, radius, theta);
	ctx.moveTo(coords.x + x, coords.y + y);
	var oldX = coords.x;
	var oldY = coords.y;
	for (var i = 0; i < sides; i++) {
		coords = rotatePoint(oldX, oldY, 360 / sides);
		ctx.lineTo(coords.x + x, coords.y + y);
		oldX = coords.x;
		oldY = coords.y;
	}

	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.strokeStyle = 'rgba(0,0,0,0)';
}

function gameOverDisplay() {
	scoreOpacity = 0
	settings.ending_block=false;
	updateSelfHighscore(score)
	$("#restartXX").show();
}
