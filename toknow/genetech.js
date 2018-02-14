class Genetech{
	constructor(){
		this.params = {
			individualsPerGeneration: 20,
			mutationChance: 0.1,
			extremeMutation: 0.2,
			mutationEffect: 0.05,
			ignoredIndividuals: 10,
			crossingChance: 0.1,
			maxRadius: 30
		};
		this.genes = [];
		this.generationFitness = [];
		this.fitness = [];
	}
	mixGenes(a, b){};
	getFitness(a){};
	addMutation(){};
	doRandomGeneration(){};
	getFitness(i){};
	doGeneration(){
		var ignoreSort = 0.6;
		var parentNum = this.params.individualsPerGeneration - this.params.ignoredIndividuals;
		if(this.fitness.length == 0)
			for(var i=0; i<parentNum; i++)
				this.fitness[i] = [this.genes[i], this.getFitness(this.genes[i])];
		for(var i=parentNum; i<this.params.individualsPerGeneration; i++)
			this.fitness[i] = [this.genes[i], this.getFitness(this.genes[i])];
		this.fitness.sort((a, b) => {
			return b[1]-a[1];
		});
		for(var i=0; i<this.params.individualsPerGeneration; i++)
			this.genes[i] = this.fitness[i][0];
		this.generationFitness.push(this.fitness[0][1]);
		for(var i=parentNum; i<this.params.individualsPerGeneration; i+=2){
			var father;
			var mother;
			if(Math.random()>ignoreSort)
				father = Math.floor(parentNum*(1-Math.sqrt(Math.random())));
			else
				father = Math.floor(parentNum*Math.random());
			do{
				if(Math.random()>ignoreSort)
					mother = Math.floor(parentNum*(1-Math.sqrt(Math.random())));
				else
					mother = Math.floor(parentNum*Math.random());
			}while(father == mother);
			if(this.fitness[father][1] > this.fitness[mother][1])
				[father, mother] = [mother, father];
			if(i < this.params.individualsPerGeneration-1)
				[this.genes[i], this.genes[i+1]] = this.mixGenes(this.genes[father], this.genes[mother]);
			else{
				var a;
				[this.genes[i], a] = this.mixGenes(this.genes[father], this.genes[mother]);
			}
			if(this.genes[i+1] == null)
				i--;
		}
		this.addMutation(parentNum);
	}
}
