#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <sstream>
#include <cstdlib>

using namespace std;

/**
 * Dijkstra's Algorithm
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

void outputQueue(const priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>>& pq) {
    cout << "{";
    cout << "\"type\":\"priority_queue\",\"queue\":[";
    auto temp = pq;
    bool first = true;
    while (!temp.empty()) {
        if (!first) cout << ",";
        cout << "{\"node\":" << temp.top().second << ",\"dist\":" << temp.top().first << "}";
        temp.pop();
        first = false;
    }
    cout << "]}" << endl;
}

int main(int argc, char* argv[]) {
    if (argc < 5) {
        cerr << "Usage: " << argv[0] << " <num_nodes> <start_node> <edge1_u> <edge1_v> <weight> ..." << endl;
        return 1;
    }

    int numNodes = atoi(argv[1]);
    int startNode = atoi(argv[2]);
    
    vector<vector<pair<int, int>>> graph(numNodes); // {neighbor, weight}
    
    // Parse edges with weights
    for (int i = 3; i < argc; i += 3) {
        if (i + 2 < argc) {
            int u = atoi(argv[i]);
            int v = atoi(argv[i + 1]);
            int weight = atoi(argv[i + 2]);
            if (u >= 0 && u < numNodes && v >= 0 && v < numNodes && weight >= 0) {
                graph[u].push_back({v, weight});
                graph[v].push_back({u, weight}); // Undirected graph
            }
        }
    }

    vector<int> dist(numNodes, INT_MAX);
    vector<bool> visited(numNodes, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    dist[startNode] = 0;
    pq.push({0, startNode});
    outputStep("enqueue", startNode, -1, 0);
    outputQueue(pq);
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        if (visited[u]) continue;
        
        visited[u] = true;
        outputStep("visit", u, -1, dist[u]);
        
        for (auto& edge : graph[u]) {
            int v = edge.first;
            int weight = edge.second;
            
            outputStep("explore", u, v, weight);
            
            if (!visited[v] && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
                outputStep("update_distance", v, -1, dist[v]);
                outputStep("enqueue", v, -1, dist[v]);
            }
        }
        
        if (!pq.empty()) {
            outputQueue(pq);
        }
    }
    
    // Output empty queue at the end
    outputQueue(pq);

    return 0;
}

