/*
*/

require(['Board'], function(Board) {
	b = new Board();
	b.render(document.querySelector("#board"));
	
	function shadeRow(moveNumber, color) {
		var tbody = document.querySelector("#history tbody");
		tbody.children[moveNumber - 1].setAttribute("style", "color:" + color + ";");
	}
	
	function onPrev() {
		if (b.kifu.currentMove > 0) {
			var tbody = document.querySelector("#history tbody");
			tbody.children[b.kifu.currentMove].setAttribute("style", "color:#ddd;");
			b.renderUnmove(document.querySelector("#pieces"));
			b.kifu.currentMove -= 1;
		}
	}
	
	function onDrag(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
	}
	
	function onDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		var file = e.dataTransfer.files[0];
		var reader = new FileReader();
		reader.onload = onLoad;
		reader.readAsText(file);
		document.querySelector("#load").textContent = file.name;
	}
	
	function onLoad(e) {
		var sgf = e.target.result;
		b.kifu.loadFromSGF(sgf);
		b.kifu.renderMeta(document.querySelector("#meta"));
		b.kifu.renderHistory(document.querySelector("#history"), {"style": "color:#ddd;" });
		shadeRow(1, "#000");
		b.renderMove(document.querySelector("#pieces"));
	}
	
	function onNext() {
		if (b.kifu.currentMove < b.kifu.trunk.length - 1) {
			b.kifu.currentMove += 1;
			b.renderMove(document.querySelector("#pieces"));
			shadeRow(b.kifu.currentMove + 1, "#000");
		}
	}
	
	function onKeyPress(e) {
		if (e.key == "ArrowRight") {
			onNext();
		} else if (e.key == "ArrowLeft") {
			onPrev();
		}
	}
	
	document.querySelector("#prev").addEventListener("click", onPrev);
	document.querySelector("#load").addEventListener("dragover", onDrag);
	document.querySelector("#load").addEventListener("drop", onDrop);
	document.querySelector("#next").addEventListener("click", onNext);
	document.addEventListener("keypress", onKeyPress);
});
