#include <iostream>
#include <vector>
#include <sstream>
#include <cstdlib>

using namespace std;

/**
 * Merge Sort Algorithm
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

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    vector<int> L(n1), R(n2);
    
    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }
    
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        // Compare step
        outputStep("compare", left + i, mid + 1 + j);
        
        if (L[i] <= R[j]) {
            outputStep("overwrite", k, -1, L[i]);
            arr[k] = L[i];
            i++;
        } else {
            outputStep("overwrite", k, -1, R[j]);
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        outputStep("overwrite", k, -1, L[i]);
        arr[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        outputStep("overwrite", k, -1, R[j]);
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        merge(arr, left, mid, right);
    }
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
    
    if (n > 0) {
        mergeSort(arr, 0, n - 1);
        
        // Mark all elements as sorted
        for (int i = 0; i < n; i++) {
            outputStep("sorted", i);
        }
    }

    return 0;
}

