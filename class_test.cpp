#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <cmath>

class Vector {
    public:
        unsigned int dimension;
        double *vector;
    
        void init_vector(unsigned int entered_dimension) {
            dimension = entered_dimension;
            vector = (double *)malloc(dimension * sizeof(double));
            if (vector == NULL) {
                exit(1);
            } else {
                // printf("Vector allocated.\n");
            }
        }

        void free_vector() {
            free(vector);
            // printf("Vector freed.\n");
        }

        void print_vector() {
            printf("( ");
            for (int i = 0; i < dimension; ++i) {
                printf("%+2.2lf ", vector[i]);
            }
            printf(")\n");
        }
};


class Matrix {
    public:
        unsigned int dimension_row, dimension_col;
        Vector *matrix;

        void init_matrix(unsigned int n, unsigned int m) {
            dimension_row = n;
            dimension_col = m;

            matrix = (Vector *)malloc(dimension_row * sizeof(Vector));

            for (int i = 0; i < dimension_row; ++i) {
                matrix[i].init_vector(dimension_col);
            }
        } 

        void free_matrix() {
            for (int i = 0; i < dimension_row; ++i) {
                matrix[i].free_vector();
            }
        } 

        void print_matrix() {
            for (int i = 0; i < dimension_row; ++i) {
                matrix[i].print_vector();
            }
        }
};


int main (void) {
    Matrix test;

    test.init_matrix(3, 3);
    test.matrix[0].vector[0] = -3.14;
    test.print_matrix();
    test.free_matrix();
    
    return 0;
}