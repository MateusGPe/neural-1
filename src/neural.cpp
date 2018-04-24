#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <cmath>

/*
    void sumHiddenInput(int nH, int n, int m, HiddenLayer *h) {
        for(int i = 0; i < n; ++i) {
            h[nH].node[i] = 0;
            for(int j = 0; j < m; ++j)
                h[nH].node[i] += h[nH].inEdge[j][i];
            h[nH].node[i] = activationFunction(h[nH].node[i]);
        }
    }
*/

double activationFunction(double x) {
	return 1. / (1. + exp(-x)); 
}

struct Vector {
    unsigned int dim;
    double *vec;

    void _init(unsigned int n) {
        dim = n;
        vec = (double *)malloc(dim * sizeof(double));
        if (vec == NULL) {
            fprintf(stderr, "Error allocating memory (Vector._init)\n");
            exit(1);
        }
    }

    void _free() {
        free(vec);
    }

    void _print() {
        // printf("Size of vector: %lu\n", sizeof(vec));
        for (unsigned int i = 0; i < dim; ++i) {
            printf("%+1.4lf ", vec[i]);
        }
        printf("\n");
    }

    void random() {
        for (unsigned int i = 0; i < dim; ++i) {
            vec[i] = (double)rand() / (double)RAND_MAX;
        }
    }
};

struct Layer {
    Vector *in, nodes, *out;

    void _init(unsigned int in_n, unsigned int n, unsigned int out_n) {
        nodes._init(n);

        in = (Vector *)malloc(in_n * sizeof(Vector));
        out = (Vector *)malloc(out_n * sizeof(Vector));
        if (in == NULL) {
            fprintf(stderr, "Error allocating memory (Layer._init -> in is NULL)\n");
            exit(1);
        }
        if (out == NULL) {
            fprintf(stderr, "Error allocating memory (Layer._init -> out is NULL)\n");
            exit(1);
        }

        for (unsigned int i = 0; i < in_n; ++i) {
            in[i]._init(in_n);
        }
        for (unsigned int i = 0; i < out_n; ++i) {
            out[i]._init(out_n);
        }
    }

    void _free() {
        nodes._free();

        if (in != NULL) {
            for (unsigned int i = 0; i < in[0].dim; ++i) {
                in[i]._free();
            }
        }
        free(in);

        if (out != NULL) {
            for (unsigned int i = 0; i < out[0].dim; ++i) {
                out[i]._free();
            }
        }
        free(out);
    }

    void _print() {
        if (in != NULL) {
            printf("In\n");
            for (unsigned int i = 0; i < in[0].dim; ++i) {
                // printf("%d\n", i);
                in[i]._print();
            }
        }

        printf("Nodes\n");
        nodes._print();
        
        if (out != NULL) {
            printf("Out\n");
            for (unsigned int i = 0; i < out[0].dim; ++i) {
                // printf("%d\n", i);
                out[i]._print();
            }
        }

        
        printf("\n");
    }

    void random_weights() {
        if (in != NULL) {
            for (unsigned int i = 0; i < in[0].dim; ++i) {
                in[i].random();
            }
        }
        
        if (out != NULL) {
            for (unsigned int i = 0; i < out[0].dim; ++i) {
                out[i].random();
            }
        }
    }
};

struct Brain {
    Layer in, hid, out;

    void _init(unsigned int in_n, unsigned int hid_n, unsigned int out_n) {
        in._init(0, in_n, hid_n);
        hid._init(in_n, hid_n, out_n);
        out._init(hid_n, out_n, 0);
    }

    void _free() {
        in._free();
        hid._free();
        out._free();
    }

    void _print() {
        printf("\tINPUT LAYER\n");
        in._print();

        printf("\tHIDDEN LAYER/S\n");
        hid._print();

        printf("\tOUTPUT LAYER\n");
        out._print();
    }

    void random() {
        in.random_weights();
        hid.random_weights();
        out.random_weights();
    }

    void _pprint() {
        
    }
};

int main (int argc, const char **argv) {
    Brain test;
    srand(time(NULL));

    test._init(3, 3, 2);
    test.random();
    test._print();
    test._free();

    return 0;
}