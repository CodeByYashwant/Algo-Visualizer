#include <iostream>
#include <vector>
#include <climits>
#include <sstream>
#include <cstdlib>

using namespace std;

/**
 * Floyd-Warshall Algorithm
 * Input format: <num_nodes> <edge1_u> <edge1_v> <weight> <edge2_u> <edge2_v> <weight> ...
 * Outputs JSON steps for visualization
 */

void outputStep(const string& type, int node1 = -1, int node2 = -1, int node3 = -1, int value = -1) {
    cout << "{";
    cout << "\"type\":\"" << type << "\"";
    if (node1 != -1) {
        cout << ",\"i\":" << node1;
    }
    if (node2 != -1) {
        cout << ",\"j\":" << node2;
    }
    if (node3 != -1) {
        cout << ",\"k\":" << node3;
    }
    if (value != -1) {
        cout << ",\"distance\":" << value;
    }
    cout << "}" << endl;
}

int main(int argc, char* argv[]) {
    if (argc < 4) {
        cerr << "Usage: " << argv[0] << " <num_nodes> <edge1_u> <edge1_v> <weight> ..." << endl;
        return 1;
    }

    int numNodes = atoi(argv[1]);
    
    vector<vector<int>> dist(numNodes, vector<int>(numNodes, INT_MAX));
    
    // Initialize diagonal to 0
    for (int i = 0; i < numNodes; i++) {
        dist[i][i] = 0;
    }
    
    // Parse edges with weights
    for (int i = 2; i < argc; i += 3) {
        if (i + 2 < argc) {
            int u = atoi(argv[i]);
            int v = atoi(argv[i + 1]);
            int weight = atoi(argv[i + 2]);
            if (u >= 0 && u < numNodes && v >= 0 && v < numNodes) {
                dist[u][v] = weight;
            }
        }
    }
    
    outputStep("initialize");
    
    // Floyd-Warshall algorithm
    for (int k = 0; k < numNodes; k++) {
        outputStep("iteration", -1, -1, k);
        
        for (int i = 0; i < numNodes; i++) {
            for (int j = 0; j < numNodes; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX) {
                    int newDist = dist[i][k] + dist[k][j];
                    outputStep("check", i, j, k, newDist);
                    
                    if (newDist < dist[i][j]) {
                        dist[i][j] = newDist;
                        outputStep("update", i, j, -1, dist[i][j]);
                    }
                }
            }
        }
    }
    
    // Output final distances
    outputStep("finalize");
    for (int i = 0; i < numNodes; i++) {
        for (int j = 0; j < numNodes; j++) {
            if (dist[i][j] != INT_MAX) {
                outputStep("final_distance", i, j, -1, dist[i][j]);
            }
        }
    }

    return 0;
}

