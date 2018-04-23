#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <cmath>

struct Vector {
    unsigned int dim;
    double *vec;

    void _init(unsigned int n) {
        dim = n;
        vec = (double *)malloc(dim * sizeof(double));
        if (vec == NULL) {
            exit(1);
        }
    }

    void _free() {
        free(vec);
    }

    void _print() {
        for (int i = 0; i < dim; ++i) {
            printf("%+2.2lf ", vec[i]);
        }
        printf("\n");
    }

    void random() {
        for (int i = 0; i < dim; ++i) {
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
        if (in == NULL || out == NULL) {
            exit(1);
        }

        for (int i = 0; i < in_n; ++i) {
            in[i]._init(in_n);
        }
        for (int i = 0; i < out_n; ++i) {
            out[i]._init(in_n);
        }
    }

    void _free() {
        if (in != NULL) {
            for (int i = 0; i < in[0].dim; ++i) {
                in[i]._free();
            }
        }

        if (out != NULL) {
            for (int i = 0; i < out[0].dim; ++i) {
                out[i]._free();
            }
        }

        nodes._free();
    }

    void _print() {
        if (in != NULL) {
            for (int i = 0; i < in[0].dim; ++i) {
                in[i]._print();
            }
        }

        nodes._print();
        
        if (out != NULL) {
            for (int i = 0; i < out[0].dim; ++i) {
                out[i]._print();
            }
        }

        
        printf("\n");
    }

    void random_nodes() {
        nodes.random();
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
        in._print();
        hid._print();
        out._print();
    }

    void random() {
        in.random_nodes();
        hid.random_nodes();
        out.random_nodes();
    }
};

int main (void) {
    Brain test;
    srand(time(NULL));

    test._init(3, 3, 2);
    test.random();
    test._print();
    test._free();

    return 0;
}