#!/usr/bin/gnuplot

set xrange [-1:3]
set yrange [-1:3]
set offset 1,1,1,1

plot 'edges.dat' u 1:2 with lines lc rgb "black" lw 2 notitle, \
	'edges.dat' u 1:2:(0.05) with circles fill solid lc rgb "black" notitle, \
	'edges.dat' using ($1 + 0.3):($2):3:(sprintf("%lf"), $3) with labels \
	tc rgb "black" font 'Arial Bold' notitle

set term png size 1000,800
set output 'output.png'
replot
set term x11