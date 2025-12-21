#include <iostream>
#include <vector>
#include <queue>
#include <sstream>
#include <cstdlib>
#include <cstring>

using namespace std;

/**
 * Breadth-First Search (BFS)
 * Input format: <num_nodes> <start_node> <edge1_u> <edge1_v> <edge2_u> <edge2_v> ...
 * Outputs JSON steps for visualization:
 * - visit(node): Visiting a node
 * - enqueue(node): Adding node to queue
 * - dequeue(node): Removing node from queue
 * - explore(u, v): Exploring edge from u to v
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

void outputQueue(const queue<int>& q) {
    cout << "{";
    cout << "\"type\":\"queue\",\"queue\":[";
    queue<int> temp = q;
    bool first = true;
    while (!temp.empty()) {
        if (!first) cout << ",";
        cout << temp.front();
        temp.pop();
        first = false;
    }
    cout << "]}" << endl;
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
    vector<int> parent(numNodes, -1);
    queue<int> q;
    
    // Start BFS
    q.push(startNode);
    visited[startNode] = true;
    parent[startNode] = -1; // Start node has no parent
    outputStep("enqueue", startNode);
    outputQueue(q);
    
    while (!q.empty()) {
        int current = q.front();
        q.pop();
        
        outputStep("dequeue", current);
        outputStep("visit", current);
        
        // Explore neighbors
        for (int neighbor : graph[current]) {
            outputStep("explore", current, neighbor);
            
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                parent[neighbor] = current; // Track parent for path reconstruction
                q.push(neighbor);
                outputStep("enqueue", neighbor);
            }
        }
        
        if (!q.empty()) {
            outputQueue(q);
        }
    }
    
    // Output empty queue at the end
    outputQueue(q);
    
    // Output parent information for path reconstruction
    for (int i = 0; i < numNodes; i++) {
        if (visited[i]) {
            cout << "{";
            cout << "\"type\":\"parent\",\"node\":" << i << ",\"parent\":" << parent[i];
            cout << "}" << endl;
        }
    }

    return 0;
}

