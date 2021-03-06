﻿(function (ninja) {
	var qrC = ninja.qrCode = {
		scheme: function() {
			return 'bitcoincash:';
		},

		// determine which type number is big enough for the input text length
		getTypeNumber: function (text) {
			var lengthCalculation = text.length * 8 + 12; // length as calculated by the QRCode
			if (lengthCalculation < 72) { return 1; }
			else if (lengthCalculation < 128) { return 2; }
			else if (lengthCalculation < 208) { return 3; }
			else if (lengthCalculation < 288) { return 4; }
			else if (lengthCalculation < 368) { return 5; }
			else if (lengthCalculation < 480) { return 6; }
			else if (lengthCalculation < 528) { return 7; }
			else if (lengthCalculation < 688) { return 8; }
			else if (lengthCalculation < 800) { return 9; }
			else if (lengthCalculation < 976) { return 10; }
			return null;
		},

		createCanvas: function (text, sizeMultiplier) {
			// create the qrcode itself
			var qrcode = new QRCode(4, 1);
			qrcode.addData(text);
			qrcode.make();
			var width = qrcode.getModuleCount() * sizeMultiplier;
			var height = qrcode.getModuleCount() * sizeMultiplier;
			// create canvas element
			var canvas = document.createElement('canvas');
			var scale = 10.0;
			canvas.width = width * scale;
			canvas.height = height * scale;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			var ctx = canvas.getContext('2d');
			ctx.scale(scale, scale);
			// compute tileW/tileH based on width/height
			var tileW = width / qrcode.getModuleCount();
			var tileH = height / qrcode.getModuleCount();
			// draw in the canvas
			for (var row = 0; row < qrcode.getModuleCount() ; row++) {
				for (var col = 0; col < qrcode.getModuleCount() ; col++) {
					ctx.fillStyle = qrcode.isDark(row, col) ? "#000000" : "#ffffff";
					ctx.fillRect(col * tileW, row * tileH, tileW, tileH);
				}
			}
			// return just built canvas
			return canvas;
		},

		// show QRCodes with canvas
		// parameter: keyValuePair 
		// example: { "id1": "string1", "id2": "string2"}
		//		"id1" is the id of a div element where you want a QRCode inserted.
		//		"string1" is the string you want encoded into the QRCode.
		showQrCode: function (keyValuePair, sizeMultiplier) {
			sizeMultiplier = (sizeMultiplier == undefined) ? 2 : sizeMultiplier; // default 2

			for (var key in keyValuePair) {
				var value = keyValuePair[key];
				var multiplier = sizeMultiplier;
				if (key.startsWith('usergenbcn-qrcode_public')) {
					multiplier = 2.9;
				}

				if (key.startsWith('usergenbcn-qrcode_private')) {
					multiplier = 2.2;
				}

				try {
					if (document.getElementById(key)) {
						document.getElementById(key).innerHTML = "";
						document.getElementById(key).appendChild(qrC.createCanvas(value, multiplier));
					}
				}
				catch (e) {	}
			}
		}
	};
})(ninja);