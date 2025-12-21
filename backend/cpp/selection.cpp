#include <iostream>
#include <vector>
#include <sstream>
#include <cstdlib>
#include <algorithm>

using namespace std;

/**
 * Selection Sort Algorithm
 * Outputs JSON steps for visualization
 */

void outputStep(const string& type, int i, int j = -1, int value = -1) {
    cout << "{";
    cout << "\"type\":\"" << type << "\"";
    cout << ",\"i\":" << i;
    if (j != -1) {
        cout << ",\"j\":" << j;
    }
    if (value != -1) {
        cout << ",\"value\":" << value;
    }
    cout << "}" << endl;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cerr << "Usage: " << argv[0] << " <numbers>" << endl;
        return 1;
    }

    vector<int> arr;
    
    for (int i = 1; i < argc; i++) {
        arr.push_back(atoi(argv[i]));
    }

    int n = arr.size();
    
    // Selection Sort
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        
        // Find minimum element in unsorted portion
        for (int j = i + 1; j < n; j++) {
            // Compare step
            outputStep("compare", minIdx, j);
            
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        
        // Swap if minimum is not at current position
        if (minIdx != i) {
            outputStep("swap", i, minIdx);
            swap(arr[i], arr[minIdx]);
        }
        
        // Mark current position as sorted
        outputStep("sorted", i);
    }
    
    // Mark last element as sorted
    if (n > 0) {
        outputStep("sorted", n - 1);
    }

    return 0;
}

