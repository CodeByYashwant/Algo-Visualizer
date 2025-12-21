#include <iostream>
#include <vector>
#include <stack>
#include <sstream>
#include <cstdlib>

using namespace std;

/**
 * Depth-First Search (DFS)
 * Input format: <num_nodes> <start_node> <edge1_u> <edge1_v> <edge2_u> <edge2_v> ...
 * Outputs JSON steps for visualization
 */

void outputStep(const string& type, int node1 = -1, int node2 = -1, const string& extra = "") {
    cout << "{";
    cout << "\"type\":\"" << type << "\"";
    if (node1 != -1) {
        cout << ",\"node\":" << node1;
    }
    if (node2 != -1) {
        cout << ",\"target\":" << node2;
    }
    if (!extra.empty()) {
        cout << "," << extra;
    }
    cout << "}" << endl;
}

void outputStack(const stack<int>& s) {
    cout << "{";
    cout << "\"type\":\"stack\",\"stack\":[";
    stack<int> temp = s;
    vector<int> items;
    while (!temp.empty()) {
        items.push_back(temp.top());
        temp.pop();
    }
    for (int i = items.size() - 1; i >= 0; i--) {
        if (i < items.size() - 1) cout << ",";
        cout << items[i];
    }
    cout << "]}" << endl;
}

void dfsRecursive(const vector<vector<int>>& graph, vector<bool>& visited, int node, int parent = -1) {
    visited[node] = true;
    outputStep("visit", node);
    
    if (parent != -1) {
        outputStep("explore", parent, node);
    }
    
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            outputStep("explore", node, neighbor);
            dfsRecursive(graph, visited, neighbor, node);
        } else if (neighbor != parent) {
            outputStep("explore", node, neighbor, "\"backedge\":true");
        }
    }
}

int main(int argc, char* argv[]) {
    if (argc < 4) {
        cerr << "Usage: " << argv[0] << " <num_nodes> <start_node> <edge1_u> <edge1_v> ..." << endl;
        return 1;
    }

    int numNodes = atoi(argv[1]);
    int startNode = atoi(argv[2]);
    
    vector<vector<int>> graph(numNodes);
    
    // Parse edges
    for (int i = 3; i < argc; i += 2) {
        if (i + 1 < argc) {
            int u = atoi(argv[i]);
            int v = atoi(argv[i + 1]);
            if (u >= 0 && u < numNodes && v >= 0 && v < numNodes) {
                graph[u].push_back(v);
                graph[v].push_back(u); // Undirected graph
            }
        }
    }

    vector<bool> visited(numNodes, false);
    
    // Start DFS
    dfsRecursive(graph, visited, startNode);

    return 0;
}

