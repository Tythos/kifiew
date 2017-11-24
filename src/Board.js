/*
*/

define(function(require, exports, module) {
	var Kifu = require("Kifu");
	var d3 = require("d3.min");
	var numeric = require("numeric");
	
	function splice(x, y) {
		if (x.length != y.length) {
			console.error("Splice input dimensions must match");
		}
		return x.map(function(_, i) {
			return [x[i], y[i]];
		});
	}
	
	function Board() {
		this.kifu = new Kifu();
		this.alphaOffset = "A".charCodeAt();
		return this;
	}
	
	Board.prototype.renderMove = function(pieces) {
		/*
		*/
		var coords = this.kifu.translateCoords(this.kifu.currentMove);
		var side = this.kifu.currentMove % 2 == 0 ? "B" : "W";
		var point = pieces.querySelector("#_" + coords[0] + coords[1]);
		var label = pieces.querySelector("#__" + coords[0] + coords[1]);
		if (side.toUpperCase() == "B") {
			d3.select(point)
				.attr("stroke", "black")
				.attr("fill", "black");
			d3.select(label)
				.attr("fill", "white")
				.text(this.kifu.currentMove + 1);
		} else if (side.toUpperCase() == "W") {
			d3.select(point)
				.attr("stroke", "black")
				.attr("fill", "white");
			d3.select(label)
				.attr("fill", "black")
				.text(this.kifu.currentMove + 1);
		}
	};
	
	Board.prototype.renderUnmove = function(pieces) {
		/* Removes piece added by the current move index.
		*/
		var coords = this.kifu.translateCoords(this.kifu.currentMove);
		var side = this.kifu.currentMove % 2 == 0 ? "B" : "W";
		var point = pieces.querySelector("#_" + coords[0] + coords[1]);
		var label = pieces.querySelector("#__" + coords[0] + coords[1]);
		d3.select(point)
			.attr("stroke", "none")
			.attr("fill", "none");
		d3.select(label)
			.attr("fill", "none")
			.text("");
	};

	Board.prototype.render = function(svg) {
		/*
		*/
		var svg = d3.select(svg);
		var width = parseInt(svg.style("width"));
		var height = parseInt(svg.style("height"));
		var I = 19, J = 19;
		var margin = { top: 0.05, right: 0.05, bottom: 0.05, left: 0.05 };
		
		var xScale = d3.scaleLinear()
			.domain([0, I-1])
			.range([width*margin.left, width*(1-margin.right)]);
		var yScale = d3.scaleLinear()
			.domain([0, J-1])
			.range([height*(1-margin.bottom), height*margin.top]);
		var line = d3.line()
			.x(function(d) { return xScale(d[0]); })
			.y(function(d) { return yScale(d[1]); });
			
		var xi = numeric.linspace(0, I-1);
		var yi = numeric.linspace(0, J-1);
		var x0 = (new Array(I)).fill(0);
		var y0 = (new Array(J)).fill(0);
		var grid = svg.append("g");
		for (var i = 0; i < I; i++) {
			var xy = splice(numeric.add(x0, i), yi);
			grid.append("path").attr("d", line(xy));
		}
		for (var j = 0; j < J; j++) {
			var xy = splice(xi, numeric.add(y0, j));
			grid.append("path").attr("d", line(xy));
		}
		
		var xAxis = svg.append("g").classed("xAxis", true);
		for (var i = 0; i < I; i++) {
			xAxis.append("text")
				.text(String.fromCharCode(i + this.alphaOffset))
				.attr("x", xScale(i))
				.attr("y", yScale(0));
		}
		var yAxis = svg.append("g").classed("yAxis", true);
		for (var j = 0; j < J; j++) {
			yAxis.append("text")
				.text(j + 1)
				.attr("x", xScale(0) - 5)
				.attr("y", yScale(j));
		}
		
		var pieces = svg.append("g").attr("id", "pieces");
		for (var i = 0; i < I; i++) {
			for (var j = 0; j < J; j++) {
				pieces.append("circle")
					.attr("cx", xScale(i))
					.attr("cy", yScale(j))
					.attr("r", 10)
					.attr("id", "_" + String.fromCharCode(i + this.alphaOffset) + (j+1))
					.attr("stroke", "none")
					.attr("fill", "none");
				pieces.append("text")
					.attr("x", xScale(i))
					.attr("y", yScale(j))
					.attr("id", "__" + String.fromCharCode(i + this.alphaOffset) + (j+1));
			}
		}
	};
	
	return Board;
});
