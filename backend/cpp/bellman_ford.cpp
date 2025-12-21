#include <iostream>
#include <vector>
#include <climits>
#include <sstream>
#include <cstdlib>

using namespace std;

/**
 * Bellman-Ford Algorithm
 * Input format: <num_nodes> <start_node> <edge1_u> <edge1_v> <weight> <edge2_u> <edge2_v> <weight> ...
 * Outputs JSON steps for visualization
 */

void outputStep(const string& type, int node1 = -1, int node2 = -1, int value = -1, const string& extra = "") {
    cout << "{";
    cout << "\"type\":\"" << type << "\"";
    if (node1 != -1) {
        cout << ",\"node\":" << node1;
    }
    if (node2 != -1) {
        cout << ",\"target\":" << node2;
    }
    if (value != -1) {
        cout << ",\"distance\":" << value;
    }
    if (!extra.empty()) {
        cout << "," << extra;
    }
    cout << "}" << endl;
}

struct Edge {
    int u, v, weight;
};

int main(int argc, char* argv[]) {
    if (argc < 5) {
        cerr << "Usage: " << argv[0] << " <num_nodes> <start_node> <edge1_u> <edge1_v> <weight> ..." << endl;
        return 1;
    }

    int numNodes = atoi(argv[1]);
    int startNode = atoi(argv[2]);
    
    vector<Edge> edges;
    
    // Parse edges with weights
    for (int i = 3; i < argc; i += 3) {
        if (i + 2 < argc) {
            int u = atoi(argv[i]);
            int v = atoi(argv[i + 1]);
            int weight = atoi(argv[i + 2]);
            if (u >= 0 && u < numNodes && v >= 0 && v < numNodes) {
                edges.push_back({u, v, weight});
            }
        }
    }

    vector<int> dist(numNodes, INT_MAX);
    dist[startNode] = 0;
    
    outputStep("initialize", startNode, -1, 0);
    
    // Relax edges (V-1) times
    for (int i = 0; i < numNodes - 1; i++) {
        outputStep("iteration", -1, -1, i + 1);
        
        for (const Edge& e : edges) {
            outputStep("relax", e.u, e.v, e.weight);
            
            if (dist[e.u] != INT_MAX && dist[e.u] + e.weight < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.weight;
                outputStep("update_distance", e.v, -1, dist[e.v]);
            }
        }
    }
    
    // Check for negative cycles
    outputStep("check_negative_cycle");
    for (const Edge& e : edges) {
        if (dist[e.u] != INT_MAX && dist[e.u] + e.weight < dist[e.v]) {
            outputStep("negative_cycle", e.u, e.v);
        }
    }
    
    // Output final distances
    for (int i = 0; i < numNodes; i++) {
        if (dist[i] != INT_MAX) {
            outputStep("final_distance", i, -1, dist[i]);
        }
    }

    return 0;
}

