#include <iostream>
#include <vector>
#include <sstream>
#include <cstdlib>

using namespace std;

/**
 * Insertion Sort Algorithm
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
    
    // Insertion Sort
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Compare and shift elements
        while (j >= 0) {
            // Compare step
            outputStep("compare", j, i);
            
            if (arr[j] > key) {
                // Overwrite step (shifting element)
                outputStep("overwrite", j + 1, -1, arr[j]);
                arr[j + 1] = arr[j];
                j--;
            } else {
                break;
            }
        }
        
        // Insert key at correct position
        if (j + 1 != i) {
            outputStep("overwrite", j + 1, -1, key);
            arr[j + 1] = key;
        }
    }
    
    // Mark all elements as sorted
    for (int i = 0; i < n; i++) {
        outputStep("sorted", i);
    }

    return 0;
}

