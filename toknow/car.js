var canvasZoom = 75;
var canvas2Zoom = 150;

class Car extends NeuralNetwork{

	constructor(canvasId, networkCanvasId){
		super(2, 2, networkCanvasId);

		this.canvas = document.getElementById(canvasId);
		this.context = this.canvas.getContext("2d");

		this.canvas.width = 400;
		this.canvas.height = 300;

		this.context.scale(canvasZoom, canvasZoom);
		this.context.translate(this.canvas.width/canvas2Zoom-1.5, this.canvas.height/canvas2Zoom-1.5);

		this.track = [
			[3, 2, 4],
			[1, 3, 6],
			[5, 6, 0]
		];
		this.path = [
			[1,0], [2,0], [2,1], [1,1], [1,2], [0,2], [0,1], [0,0]
		];

		this.bestFitness = 0;

		this.params.individualsPerGeneration = 200;
		this.params.ignoredIndividuals = 150;

		this.doRandomGeneration();
	}


	drawCar(carState){
		this.context.clearRect(-this.canvas.width/canvas2Zoom, -this.canvas.height/canvas2Zoom, 2*this.canvas.width/canvasZoom, 2*this.canvas.height/canvasZoom);
		this.context.fillStyle = "rgba(150, 150, 150, 1.0)";
		for(var i=0; i<this.track.length; i++){
			for(var j=0; j<this.track[i].length; j++){
				switch(this.track[i][j]){
					case 1:
						this.context.fillRect(i, j+0.25, 1, 0.5);
						break;
					case 2:
						this.context.fillRect(i+0.25, j, 0.5, 1);
						break;
					case 3:
						this.context.beginPath();
	      				this.context.arc(i+1, j+1, 0.75, Math.PI, 1.5*Math.PI);
	      				this.context.arc(i+1, j+1, 0.25, 1.5*Math.PI, Math.PI, true);
						this.context.closePath();
	      				this.context.fill();
						break;
					case 4:
						this.context.beginPath();
	      				this.context.arc(i+1, j, 0.75, Math.PI/2, Math.PI);
	      				this.context.arc(i+1, j, 0.25, Math.PI, Math.PI/2, true);
						this.context.closePath();
	      				this.context.fill();
						break;
					case 5:
						this.context.beginPath();
	      				this.context.arc(i, j+1, 0.75, 3*Math.PI/2, 0);
	      				this.context.arc(i, j+1, 0.25, 0, 3*Math.PI/2, true);
						this.context.closePath();
	      				this.context.fill();
						break;
					case 6:
						this.context.beginPath();
	      				this.context.arc(i, j, 0.75, 0, Math.PI/2);
	      				this.context.arc(i, j, 0.25, Math.PI/2, 0, true);
						this.context.closePath();
	      				this.context.fill();
						break;
				}
			}
		}
		this.context.fillStyle = "rgba(0,0,0,1)";
		this.context.save();
		this.context.translate(carState.x, carState.y);
		this.context.rotate(carState.angle);
		this.context.fillRect(-0.1, -0.05, 0.2, 0.1);
		this.context.fillStyle = "rgb(1,0,0)";
		if(carState.inputs[0] < 0.5){
			this.context.fillRect(+carState.inputs[0]*0.707, +carState.inputs[0]*0.707, 0.02, 0.02);
		}else{
			this.context.fillRect(+carState.inputs[0]*0.707, +carState.inputs[0]*0.707, 0.04, 0.04);
		}
		if(carState.inputs[1] < 0.5)
			this.context.fillRect(carState.inputs[1]*0.707, -carState.inputs[1]*0.707, 0.02, 0.02);
		else
			this.context.fillRect(carState.inputs[1]*0.707, -carState.inputs[1]*0.707, 0.04, 0.04);
		this.context.restore();
	}

	simulateStep(car, carState){
		var c = Math.cos(carState.angle), s = Math.sin(carState.angle);
		var inputs = [];
		var ux = carState.x+0.5*0.707*(c-s), uy = carState.y+0.5*0.707*(s+c);
		var lx = carState.x, ly = carState.y;
		if(!this.isCarIn(ux, uy)){
			for(var i=0; i<10; i++){
				var x = (ux+lx)/2, y = (uy+ly)/2;
				if(this.isCarIn(x, y)){
					lx = x;
					ly = y;
				}else{
					ux = x;
					uy = y;
				}
			}
			x = (ux+lx)/2-carState.x;
			y = (uy+ly)/2-carState.y;
			inputs[0] = Math.sqrt(x*x+y*y);
		}else{
			//console.log(carState.angle);
			inputs[0] = 0.5;
		}

		ux = carState.x+0.5*0.707*(c+s);
		uy = carState.y+0.5*0.707*(s-c);
		lx = carState.x;
		ly = carState.y;
		if(!this.isCarIn(ux, uy)){
			for(var i=0; i<10; i++){
				var x = (ux+lx)/2, y = (uy+ly)/2;
				if(this.isCarIn(x, y)){
					lx = x;
					ly = y;
				}else{
					ux = x;
					uy = y;
				}
			}
			x = (ux+lx)/2-carState.x;
			y = (uy+ly)/2-carState.y;
			inputs[1] = Math.sqrt(x*x+y*y);
		}else{
			inputs[1] = 0.5;
		}
		var outL, outR;

		carState.inputs =[inputs[0], inputs[1]];

		[outL, outR] = this.evaluate(car, inputs);

		carState.vx += (outL+outR)*c*0.016666;
		carState.vy += (outL+outR)*s*0.016666;
		var vmax = 1;
		if(carState.vx*carState.vx+carState.vy*carState.vy > vmax*vmax){
			var d = Math.sqrt(carState.vx*carState.vx+carState.vy*carState.vy)/vmax;
			carState.vx /= d;
			carState.vy /= d;
		}

		carState.x += carState.vx*0.016666;
		carState.y += carState.vy*0.016666;
		carState.angle += 250*(-0.05*0.707*outL+0.5*0.707*outR)*0.016666;
	}

	isCarIn(x, y){
		var i = Math.floor(x), j = Math.floor(y);
		x = x-i, y = y-j;
		if(i < 0 || j < 0 || i >= 3 || j >= 3)
			return false;
		switch(this.track[i][j]){
			case 1:
				if(0.25 <= y && y <= 0.75)
					return true;
				else
					return false;
			case 2:
				if(0.25 <= x && x <= 0.75)
					return true;
				else
					return false;
			case 3:
				x = 1-x;
				y = 1-y;
				var d2 = x*x+y*y;
				if(0.0625 <= d2 && d2 <= 0.5625)
					return true;
				else
					return false;
			case 4:
				x = 1-x;
				var d2 = x*x+y*y;
				if(0.0625 <= d2 && d2 <= 0.5625)
					return true;
				else
					return false;
			case 5:
				y = 1-y;
				var d2 = x*x+y*y;
				if(0.0625 <= d2 && d2 <= 0.5625)
					return true;
				else
					return false;
			case 6:
				var d2 = x*x+y*y;
				if(0.0625 <= d2 && d2 <= 0.5625)
					return true;
				else
					return false;
		}
	}

	getFitness(car){
		var carState = {
			x: 1,
			y: 0.5,
			vx: 0,
			vy: 0,
			angle: 0,
			path: 0,
			inputs: []
		};
		var oldQuad = [], newQuad = [Math.floor(carState.x), Math.floor(carState.y)];
		var ticks = 0;
		do{
			[oldQuad[0], oldQuad[1]] = [newQuad[0], newQuad[1]];
			this.simulateStep(car, carState);
			newQuad = [Math.floor(carState.x), Math.floor(carState.y)];
			if(oldQuad[0] == this.path[0][0] && oldQuad[1] == this.path[0][1] && newQuad[0] == this.path[this.path.length-1][0] && newQuad[1] == this.path[this.path.length-1][1]){
				return -1;
			}else if(newQuad[0] == this.path[0][0] && newQuad[1] == this.path[0][1] && oldQuad[0] == this.path[this.path.length-1][0] && oldQuad[1] == this.path[this.path.length-1][1]){
				if(15-ticks/100 > this.bestFitness)
					this.bestFitness = 15-ticks/100;
				return 15-ticks/100;
			}
			if(newQuad[0] != oldQuad[0] || newQuad[1] != oldQuad[1]){
				for(var i=0; i<this.path.length; i++){
					if(this.path[i][0] == newQuad[0] && this.path[i][1] == newQuad[1]){
						carState.path = i;
						break;
					}
				}
			}
			if(ticks > 120*(carState.path+1)){
				break;
			}
			ticks++;
		}while(this.isCarIn(carState.x, carState.y));
		var nextDif = [];
		var prevDif = [];
		if(carState.path > 0){
			prevDif = [this.path[carState.path-1][0]-this.path[carState.path][0], this.path[carState.path-1][1]-this.path[carState.path][1]];
		}else{
			prevDif = [this.path[this.path.length-1][0]-this.path[carState.path][0], this.path[this.path.length-1][1]-this.path[carState.path][1]];
		}
		if(carState.path < this.path.length-1){
			nextDif = [this.path[carState.path+1][0]-this.path[carState.path][0], this.path[carState.path+1][1]-this.path[carState.path][1]];
		}else{
			nextDif = [this.path[0][0]-this.path[carState.path][0], this.path[0][1]-this.path[carState.path][1]];
		}
		var x = carState.x-Math.floor(carState.x);
		var y = carState.y-Math.floor(carState.y);
		var a, b;
		if(prevDif[0] == 0){
			if(prevDif[1] > 0)
				a = y;
			else {
				a = 1-y;
			}
		}else{
			if(prevDif[0] > 0)
				a = x;
			else {
				a = 1-x;
			}
		}
		if(nextDif[0] == 0){
			if(nextDif[1] > 0)
				b = y;
			else {
				b = 1-y;
			}
		}else{
			if(nextDif[0] > 0)
				b = x;
			else {
				b = 1-x;
			}
		}
		var d = carState.path+b/(a+b);
		if(d > this.bestFitness)
			this.bestFitness = d;
		return d;
	}
}
var stopSimulation = false;
function startSimulation(tri, car){
	var carState = {
		x: 1,
		y: 0.5,
		vx: 0,
		vy: 0,
		angle: 0,
		inputs: []
	};
	stopSimulation = false;
	simulateCar(car, carState, tri);
}
function simulateCar(car, carState, tri){
	tri.simulateStep(car, carState);
	tri.drawCar(carState);
	if(stopSimulation)
		return;
	if(tri.isCarIn(carState.x, carState.y))
		requestAnimationFrame(function(){
			simulateCar(car, carState, tri);
		});
	else {
		startSimulation(tri, car);
	}
}

var stop = false;
var generation = 0;
function startRun(){
	stop = false;
	doRun();
}
function doRun(){
	if(!stop){
		tri.lastBestFitness = 0;
		$("#gen").html(generation++);
		$("#mf").html(tri.bestFitness);
		tri.doGeneration();
		if(generation%500 == 1)
			startSimulation(tri.genes[0]);
		requestAnimationFrame(doRun);
	}
}
function stopRun(){
	stop = true;
}
