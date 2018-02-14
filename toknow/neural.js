class NeuralNetwork extends Genetech{
	constructor(inputNum, outputNum, canvasId){
		super();

		this.nCanvas = document.getElementById(canvasId);
		if(this.nCanvas){
			this.nContext = this.nCanvas.getContext("2d");
			this.nCanvas.width = 400;
			this.nCanvas.height = 300;
		}

		this.inputNum = inputNum;
		this.outputNum = outputNum;
		this.innovationPool = 0;
		this.doRandomGeneration();
	}

	doRandomGeneration(){
		this.genes = [];
		for(var i=0; i<this.params.individualsPerGeneration; i++){
			this.genes[i] = {
				node: [],
				edge: []
			}
			for(var j=0; j<this.inputNum; j++){
				this.genes[i].node[j] = {
					num: j,
					type: 1,
					incoming: [],
					value: 0
				};
			}
			for(var j=0; j<this.outputNum; j++){
				this.genes[i].node[this.inputNum+j] = {
					num: this.inputNum+j,
					type: -1,
					incoming: [],
					value: 0
				};
			}
			var times = Math.floor(Math.random() * 3 + 1);
			for(var k=0; k<times; k++){
				var randInput, randOutput;
				[randInput, randOutput] = [Math.floor(Math.random()*this.inputNum), this.inputNum+Math.floor(Math.random()*this.outputNum)];
				this.pushEdge(this.genes[i], {
					origin: randInput,
					destination: randOutput,
					innovation: 0,
					weight: 2-Math.random()*4,
					enabled: true
				});
				this.genes[i].node[randOutput].incoming.push(this.genes[i].edge.length-1);
			}
		}
		
		this.generationFitness = [];
		this.fitness = [];
	}

	addMutation(){
		var totalMutated = Math.round(this.params.ignoredIndividuals);
		for(var i=0; i<totalMutated; i++){
			var mutateIndividual =  this.params.individualsPerGeneration-this.params.ignoredIndividuals+Math.floor(this.params.ignoredIndividuals*Math.random());
			var r = Math.random();
			if(r < 0.05)
				this.linkMutation(this.genes[mutateIndividual]);
			else if(r < 0.9)
				this.pointMutation(this.genes[mutateIndividual]);
			else if(r < 0.93)
				this.nodeMutation(this.genes[mutateIndividual]);
			else
				this.addDisable(this.genes[mutateIndividual]);
		}
	}

	pointMutation(brain){
		var edge = Math.floor(Math.random()*brain.edge.length);
		brain.edge[edge].weight += this.params.mutationEffect*(Math.random()-2);
	}

	linkMutation(brain){
		var origin = Math.floor(Math.random()*brain.node.length);
		var destination = Math.floor(Math.random()*brain.node.length);
		if((origin < this.inputNum && destination < this.inputNum) || (origin >= this.inputNum && origin < this.inputNum+this.outputNum && destination >= this.inputNum && destination < this.inputNum+this.outputNum))
			return;
		if(destination <= origin)
			[origin, destination] = [destination, origin];
		this.pushEdge(brain, {
			origin: origin,
			destination: destination,
			innovation: this.getInnovation(),
			weight: Math.floor((Math.random()*4)-2),
			enabled: true
		});
		brain.node[destination].incoming.push(brain.edge.length-1);
	}

	nodeMutation(brain){
		var j = Math.floor(brain.edge.length*Math.random());
		var k = brain.node.length;
		brain.node.push({
			num: k,
			type: 0,
			incoming: [],
			value: 0
		});
		brain.edge[j].enabled = false;
		var innov = this.getInnovation();
		var destination = brain.edge[j].destination;
		this.pushEdge(brain, {
			origin: brain.edge[j].origin,
			destination: k,
			weight: 1,
			innovation: innov,
			enabled: true
		});
		brain.node[k].incoming.push(brain.edge.length-1);
		this.pushEdge(brain, {
			origin: k,
			destination: destination,
			weight: brain.edge[j].weight,
			innovation: innov,
			enabled: true
		});
		for(var i in brain.node[destination].incoming)
			if(brain.node[destination].incoming[i] == j){
				brain.node[destination].incoming[i] = brain.edge.length-1;
				break;
			}
	}

	addDisable(brain){
		var j = Math.floor(Math.random()*brain.edge.length);
		brain.edge[j].enabled = !brain.edge[j].enabled;
	}

	getInnovation(){
		this.innovationPool++;
		return this.innovationPool;
	}

	// mother have more fitnesss than father
	mixGenes(mother, father){
		var child = {
				node: [],
				edge: []
		};
		if(father.node.length > mother.node.length){
			for(var i in father.node){
				child.node.push(clone(father.node[i]));
				child.node[child.node.length-1].incoming = [];
			}
		}else{
			for(var i in mother.node){
				child.node.push(clone(mother.node[i]));
				child.node[child.node.length-1].incoming = [];
			}
		}
		var jf = 0, jm = 0;
		for(var i=0; i<=this.innovationPool; i++){
			var innFather, innMother;
			for(innFather=0; jf < father.edge.length && father.edge[jf].innovation <= i; jf++, innFather++);
			for(innMother=0; jm < mother.edge.length && mother.edge[jm].innovation <= i; jm++, innMother++);
			if(innFather == 0 && innMother == 0)
				continue;
			if(innMother == 0){
				for(var j=jf-innFather; j<jf; j++){
					if(this.pushEdge(child, clone(father.edge[j])))
						child.node[father.edge[j].destination].incoming.push(child.edge.length-1);
				}
			}
			for(var j=jm-innMother; j<jm; j++){{}
				if(this.pushEdge(child, clone(mother.edge[j])))
					child.node[mother.edge[j].destination].incoming.push(child.edge.length-1);
			}
		}
		return [child, null];
	}

	pushEdge(brain, edge){
		for(var k=0; k<brain.edge.length; k++){
			if(brain.edge[k].origin == edge.origin && brain.edge[k].destination == edge.destination)
				return false;
		}
		brain.edge.push(edge);
		return true;
	}

	evaluate(brain, inputs){
		for(var i=0; i<this.inputNum; i++)
			brain.node[i].value = inputs[i];
		for(var i=this.inputNum; i<brain.node.length; i++){
			brain.node[i].value = 0;
		}
		for(var i=this.inputNum+this.outputNum; i<brain.node.length; i++){
			for(var j in brain.node[i].incoming){
				var k = brain.node[i].incoming[j];
				if(brain.edge[k].enabled)
					brain.node[i].value += brain.edge[k].weight*brain.node[brain.edge[k].origin].value;
			}
		}
		var ar = [];
		for(var i=this.inputNum, l=0; l<this.outputNum; i++, l++){
			for(var j in brain.node[i].incoming){
				var k = brain.node[i].incoming[j];
				if(brain.edge[k].enabled)
					brain.node[i].value += brain.edge[k].weight*brain.node[brain.edge[k].origin].value;
			}
			ar[l] = brain.node[i].value;
		}
		return ar;
	}

	drawNetwork(brain, context, canvas){
		if(!this.nCanvas && !context)
			return;
		var cwidth, cheight;
		if(!context){
			context = this.nContext;
			cwidth = this.nCanvas.width;
			cheight = this.nCanvas.height;
		}else{
			cwidth = 400;
			cheight = 300;
		}
		context.clearRect(0, 0, cwidth, cheight);
		var height = [];
		var width = [];
		for(var i=0; i<this.inputNum; i++){
			width[i] = 20;
			height[i] = cheight*(i+2)/(this.inputNum+3);
		}
		var tNum = this.inputNum+this.outputNum;
		for(var i=this.inputNum; i<tNum; i++){
			width[i] = cwidth-20;
			height[i] = cheight*(i-this.inputNum+2)/(this.outputNum+3);
		}
		for(var i=tNum; i<brain.node.length; i++){
			if(brain.node[i].incoming.length > 0)
				width[i] = cwidth*((brain.edge[brain.node[i].incoming[0]].innovation+2)/(this.innovationPool+3));
			height[i] = cheight*(Math.random());
		}

		context.lineWidth = 2;
		for(var i in brain.edge){
			var edge = brain.edge[i];
			if(edge.enabled){
				context.strokeStyle = "rgba(0, 155, 0, 0.5)";
			}else{
				context.strokeStyle = "rgba(150, 0, 0, 0.5)";
			}
			context.beginPath();
			context.moveTo(width[edge.origin], height[edge.origin]);
			context.lineTo(width[edge.destination], height[edge.destination]);
			context.closePath();
			context.stroke();
		}
		context.fillStyle = "rgb(0, 255, 0)";
		for(var i=0; i<this.inputNum; i++){
			context.beginPath();
			context.arc(width[i], height[i], 3, 0, 2*Math.PI)
			context.closePath();
			context.fill();
		}

		context.fillStyle = "rgb(0, 0, 255)";
		for(var i=this.inputNum; i<tNum; i++){
			context.beginPath();
			context.arc(width[i], height[i], 3, 0, 2*Math.PI)
			context.closePath();
			context.fill();
		}

		context.fillStyle = "rgb(150, 150, 150)";
		for(var i=tNum; i<brain.node.length; i++){
			context.beginPath();
			context.arc(width[i], height[i], 3, 0, 2*Math.PI)
			context.closePath();
			context.fill();
		}
	}
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
