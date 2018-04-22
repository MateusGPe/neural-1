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
    Vector in, out, nodes;

    void _init(unsigned int in_n, unsigned int out_n, unsigned int n) {
        in._init(in_n);
        out._init(out_n);
        nodes._init(n);
    }

    void _free() {
        in._free();
        out._free();
        nodes._free();
    }

    void _print() {
        in._print();
        out._print();
        nodes._print();
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
};

int main (void) {
    Brain test;
    srand(time(NULL));

    test._init(3, 2, 0);
    test._print();
    test._free();

    return 0;
}