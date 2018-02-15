#include <cstdio>
#include <cstdlib>
#include <ctime>

// Structure for input and output layers
struct OutLayer {
	double *node;
};

// Structure for hidden layers between in/out put
struct HiddenLayer {
	double *node, **inEdge, **outEdge;
};

// Neural network structure
// joining in/out put layers with the hidden
struct Brain {
	int numInputNodes, numOutputNodes, numHiddenLayers;
	int *nodesHidden;
	OutLayer input, output;
	HiddenLayer *hidden;
};

void initVector(int n, double **vec) {
	double *v;
	v = (double *)malloc(n * sizeof(double));
	if(v == NULL) exit(1);
	*vec=v;
}

void initMatrix(int n, int m, double ***a) {
	double **mat;
  	mat = (double **)malloc(n * sizeof(double *));
  	if(mat == NULL) exit(1);
  	for(int i = 0; i < n; ++i) {
    	mat[i] = (double *)calloc(m * sizeof(double));
    	if(mat[i] == NULL) exit(1);
  	}
  	*a = mat;
}

void freeMatrix(int n, double **mat) {
	for(int i = 0; i < n; ++i) free(mat[i]);
  	free(mat);
}

int main() {
	// Variable declaration
	Brain brain;
	
	// Specific values for the network
	brain.numInputNodes = 2;
	brain.numOutputNodes = 2;
	brain.numHiddenLayers = 1;

	// Allocating memory for the neural network
	// check of NULL pointer TODO
	initVector(brain.numHiddenLayers, brain.nodesHidden);
	for(int i = 0; i < brain.numHiddenLayers; ++i) brain.nodesHidden[i] = 1;
	
	initVector(numInputNodes, brain.input.node);
	initVector(numOutputNodes, brain.output.node);
	
	brain.hidden = (HiddenLayer *)calloc(numHiddenLayers * sizeof(HiddenLayer));
	for(int i = 0; i < numHiddenLayers; ++i) {
		if(i == 0) {
			initVector(brain.nodesHidden[i], brain.hidden[i].node);
			initMatrix(brain.nodesHidden[i], brain.numInputNodes, brain.hidden[i].inEdge);
			initMAtrix(brain.nodesHidden[i], brain.numOutputNodes, brain.hidden[i].outEdge);	
		}
	}



	// Training

	// Free of the neural network
	free(brain.input.node);
	free(brain.output.node);
	for(int i = 0; i < numHiddenLayers; ++i) {
		free(brain.hidden[i].node);
		freeMatrix(brain.nodesHidden[i], brain.hidden[i].inEdge);
		freeMAtrix(brain.nodesHidden[i], brain.hidden[i].outEdge);	
	}
	free(brain.hidden);

	return 0;
}