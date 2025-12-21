@echo off
REM Build script for Windows to compile C++ algorithms

if not exist build mkdir build

echo Compiling bubble sort...
g++ -o build/bubble.exe bubble.cpp -std=c++11

echo Compiling selection sort...
g++ -o build/selection.exe selection.cpp -std=c++11

echo Compiling insertion sort...
g++ -o build/insertion.exe insertion.cpp -std=c++11

echo Compiling merge sort...
g++ -o build/merge.exe merge.cpp -std=c++11

echo Compiling BFS...
g++ -o build/bfs.exe bfs.cpp -std=c++11

echo Compiling DFS...
g++ -o build/dfs.exe dfs.cpp -std=c++11

echo Compiling Dijkstra...
g++ -o build/dijkstra.exe dijkstra.cpp -std=c++11

echo Compiling Bellman-Ford...
g++ -o build/bellman_ford.exe bellman_ford.cpp -std=c++11

echo Compiling Floyd-Warshall...
g++ -o build/floyd_warshall.exe floyd_warshall.cpp -std=c++11

echo Build complete!

