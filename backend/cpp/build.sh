#!/bin/bash
# Build script for Linux/Mac to compile C++ algorithms

mkdir -p build

echo "Compiling bubble sort..."
g++ -o build/bubble bubble.cpp -std=c++11

echo "Compiling selection sort..."
g++ -o build/selection selection.cpp -std=c++11

echo "Compiling insertion sort..."
g++ -o build/insertion insertion.cpp -std=c++11

echo "Compiling merge sort..."
g++ -o build/merge merge.cpp -std=c++11

echo "Compiling BFS..."
g++ -o build/bfs bfs.cpp -std=c++11

echo "Compiling DFS..."
g++ -o build/dfs dfs.cpp -std=c++11

echo "Compiling Dijkstra..."
g++ -o build/dijkstra dijkstra.cpp -std=c++11

echo "Compiling Bellman-Ford..."
g++ -o build/bellman_ford bellman_ford.cpp -std=c++11

echo "Compiling Floyd-Warshall..."
g++ -o build/floyd_warshall floyd_warshall.cpp -std=c++11

echo "Build complete!"
chmod +x build/*

