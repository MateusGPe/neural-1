#include <cstdio>
#include <cstdlib>
#include <ctime>

int numIndividuals = 10;
int numHidden = 5;
int numInputs = 3;

struct individual {
	int *input;
};

struct hidden {
	double *input;
	double output;
};

struct neural {
	individual * a;
	hidden * hiddenLayer;
};

void trainGen(individual *gen) {

}

int main() {
	individual * gen;

	gen = (individual *)malloc(numIndividuals * sizeof(individual));
	if(gen == NULL)
		fprintf(stderr, "Error allocating mempory for generation.\n");

	srand (time(NULL));
	for(int i = 0; i < numIndividuals; ++i) {
		gen[i].input = (int *)calloc(numInputs, sizeof(int));
		if(gen[i].input == NULL)
			fprintf(stderr, "Error allocating mempory for generation.\n");
		gen[i].input[rand() % numInputs] = 1;
	}

	printf("G A R\n");
	for(int i = 0; i < numIndividuals; ++i) {
		printf("%d %d %d\n", gen[i].input[0], gen[i].input[1], gen[i].input[2]);
	}


	for(int i = 0; i < numIndividuals; ++i) {
		free(gen[i].input);
	}
	free(gen);
	return 0;
}