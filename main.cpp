#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <cmath>

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

void initVectorDouble(int n, double **vec) {
	double *v = (double *)malloc(n * sizeof(double));
	if(v == NULL) exit(1);
	*vec=v;
}

void initVectorInt(int n, int **vec) {
	int *v = (int *)malloc(n * sizeof(int));
	if(v == NULL) exit(1);
	*vec=v;
}

void initMatrixDouble(int n, int m, double ***a) {
	double **mat = (double **)malloc(n * sizeof(double *));
  	if(mat == NULL) exit(1);
  	for(int i = 0; i < n; ++i) {
    	mat[i] = (double *)malloc(m * sizeof(double));
    	if(mat[i] == NULL) exit(1);
  	}
  	*a = mat;
}

void freeMatrixDouble(int n, double **mat) {
	for(int i = 0; i < n; ++i) free(mat[i]);
  	free(mat);
}

double randomDouble() {
	return (double)rand()/RAND_MAX;
}

double activationFunction(double x) {
	return 1. / (1. + exp(-x)); 
}

void sumHiddenInput(int nH, int n, int m, HiddenLayer *h) {
	for(int i = 0; i < n; ++i) {
		h[nH].node[i] = 0;
		for(int j = 0; j < m; ++j)
			h[nH].node[i] += h[nH].inEdge[j][i];
		// h[nH].node[i] = activationFunction(h[nH].node[i]);
	}
}

void sumHiddenOutput(int nH, int n, int nO, HiddenLayer *h, OutLayer o) {
	for(int i = 0; i < nO; ++i) {
		o.node[i] = 0;
		for(int j = 0; j < nO; ++j)
			o.node[i] += h[nH].node[j] * h[nH].outEdge[j][i];
		// o.node[i] = activationFunction(o.node[i]);
	}
}

void randomMatrix(int n, int m, double **M) {
	for(int i = 0; i < n; ++i)
		for(int j = 0; j < m; ++j)
			M[i][j] = randomDouble();
}

void printVector(int n, double *v) {
	for(int i = 0; i < n; ++i) printf("%0.2lf\t", v[i]);
	printf("\n");
}

void printMatrix(int n, int m, double **M) {
	for(int i = 0; i < m; ++i)
		printf("\t%d", i + 1);
	printf("\n");

	for(int i = 0; i < n; ++i) {
		printf("%d", i + 1);
		for(int j = 0; j < m; ++j)
			printf("\t%0.2lf", M[i][j]);
		printf("\n");
	}
}

int main() {
	// Variable declaration
	Brain brain;
	
	// Specific values for the network
	brain.numInputNodes = 2;
	brain.numOutputNodes = 1;
	brain.numHiddenLayers = 1;

	// Allocating memory for the neural network
	// check of NULL pointer TODO
	initVectorInt(brain.numHiddenLayers, &brain.nodesHidden);
	for(int i = 0; i < brain.numHiddenLayers; ++i) brain.nodesHidden[i] = 3;
	
	initVectorDouble(brain.numInputNodes, &brain.input.node);
	initVectorDouble(brain.numOutputNodes, &brain.output.node);
	
	brain.hidden = (HiddenLayer *)malloc(brain.numHiddenLayers * sizeof(HiddenLayer));
	for(int i = 0; i < brain.numHiddenLayers; ++i) {
		if(i == 0) {
			initVectorDouble(brain.nodesHidden[i], &brain.hidden[i].node);
			initMatrixDouble(brain.nodesHidden[i], brain.numInputNodes, &brain.hidden[i].inEdge);
			initMatrixDouble(brain.nodesHidden[i], brain.numOutputNodes, &brain.hidden[i].outEdge);	
		}
	}

	// Some tests
	srand(time(NULL));

	for(int i = 0; i < brain.numHiddenLayers; ++i) {
		randomMatrix(brain.nodesHidden[i], brain.numInputNodes, brain.hidden[i].inEdge);
		randomMatrix(brain.nodesHidden[i], brain.numOutputNodes, brain.hidden[i].outEdge);

		printMatrix(brain.nodesHidden[i], brain.numInputNodes, brain.hidden[i].inEdge);
		printMatrix(brain.nodesHidden[i], brain.numOutputNodes, brain.hidden[i].outEdge);

		sumHiddenInput(i, brain.nodesHidden[i], brain.numInputNodes, &brain.hidden[i]);
		printVector(brain.nodesHidden[i], brain.hidden[i].node);

		sumHiddenOutput(i, brain.nodesHidden[i], brain.numOutputNodes, &brain.hidden[i], brain.output);
		printVector(brain.numOutputNodes, brain.output.node);
	}



	// Training

	// Free of the neural network
	free(brain.input.node);
	free(brain.output.node);
	for(int i = 0; i < brain.numHiddenLayers; ++i) {
		free(brain.hidden[i].node);
		freeMatrixDouble(brain.nodesHidden[i], brain.hidden[i].inEdge);
		freeMatrixDouble(brain.nodesHidden[i], brain.hidden[i].outEdge);	
	}
	free(brain.hidden);

	return 0;
}