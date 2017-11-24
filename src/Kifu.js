/*
*/

define(function(require, exports, module) {
	var SGFGrove = require("SGFGrove");
	
	function Kifu() {
		this.meta = [];
		this.trunk = [];
		this.currentMove = -1;
		return this;
	}
	
	Kifu.prototype.loadFromSGF = function(sgf) {
		var collection = SGFGrove.parse(sgf);
		var gameTree = collection[0];
		var trunk = gameTree[0];
		this.meta = trunk[0];
		this.trunk = trunk.slice(1);
		this.meta.NM = this.trunk.length;
		this.currentMove = 0;
	};
	
	Kifu.prototype.translateCoords = function(ndx) {
		if (typeof(ndx) == "undefined") { ndx = this.kifu.currentMove; }
		var alphaOffset = "A".charCodeAt();
		var move = this.trunk[ndx];
		var side = Object.keys(move)[0];
		return [
			move[side][0].toUpperCase(), // char
			move[side][1].toUpperCase().charCodeAt() - alphaOffset + 1
		];
	};
	
	Kifu.prototype.renderMeta = function(table) {
		var fieldMap = {
			"DT": "Date",
			"EV": "Event",
			"PB": "Black",
			"PW": "White",
			"RE": "Result",
			"TM": "Time Limit",
			"NM": "Number of Moves"
		};
		while (table.childElementCount > 0) {
			table.removeChild(table.children[0]);
		}
		var tbody = document.createElement("tbody");
		Object.keys(fieldMap).forEach(function(key) {
			var tr = document.createElement("tr");
			var tdl = document.createElement("td");
			var tdr = document.createElement("td");
			tdl.textContent = fieldMap[key] + ": ";
			tdl.setAttribute("class", "metaField");
			tdr.textContent = this.meta[key];
			tdr.setAttribute("class", "metaValue");
			tr.appendChild(tdl);
			tr.appendChild(tdr);
			tbody.appendChild(tr);
		}, this);
		table.appendChild(tbody);
	};
	
	Kifu.prototype.renderHistory = function(table, rowAttrs) {
		if (typeof(rowAttrs) == "undefined") { rowAttrs = {}; }
		var tbody = table.querySelector("tbody");
		while (tbody.childElementCount > 0) {
			tbody.removeChild(tbody.children[0]);
		}
		this.trunk.forEach(function(move, ndx) {
			var coords = this.translateCoords(ndx);
			var tr = document.createElement("tr");
			var tdl = document.createElement("td");
			var tdr = document.createElement("td");
			Object.keys(rowAttrs).forEach(function(key) {
				tr.setAttribute(key, rowAttrs[key]);
			}, this);
			tdl.textContent = (ndx + 1);
			tdr.textContent = coords[0] + coords[1];
			tr.appendChild(tdl);
			tr.appendChild(tdr);
			tbody.appendChild(tr);
		}, this);
	};
	
	return Kifu;
});
