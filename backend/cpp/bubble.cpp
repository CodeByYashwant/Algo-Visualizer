#include <iostream>
#include <vector>
#include <sstream>
#include <cstdlib>

using namespace std;

/**
 * Bubble Sort Algorithm
 * Outputs JSON steps for visualization:
 * - compare(i, j): Comparing elements at indices i and j
 * - swap(i, j): Swapping elements at indices i and j
 * - sorted(i): Element at index i is in final sorted position
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
    
    // Parse command line arguments
    for (int i = 1; i < argc; i++) {
        arr.push_back(atoi(argv[i]));
    }

    int n = arr.size();
    
    // Bubble Sort
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            // Compare step
            outputStep("compare", j, j + 1);
            
            if (arr[j] > arr[j + 1]) {
                // Swap step
                outputStep("swap", j, j + 1);
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        
        // Mark the last element as sorted
        outputStep("sorted", n - i - 1);
        
        if (!swapped) {
            // If no swaps occurred, mark remaining elements as sorted
            for (int k = 0; k < n - i - 1; k++) {
                outputStep("sorted", k);
            }
            break;
        }
    }
    
    // Mark first element as sorted if not already marked
    if (n > 0) {
        outputStep("sorted", 0);
    }

    return 0;
}

