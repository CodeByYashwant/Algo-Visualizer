# Algorithm Visualizer

A full-stack web application for visualizing sorting algorithms step-by-step. Built with React (frontend), Node.js + Express (backend), and C++ (algorithm engine).

## Features

- 🎨 **Beautiful UI** - Clean, modern interface with smooth animations
- 📊 **Visual Representation** - Array elements displayed as animated vertical bars
- 🎯 **Multiple Algorithms** - Visualize Bubble Sort, Selection Sort, Insertion Sort, and Merge Sort
- ⚡ **Interactive Controls** - Start, Pause, Reset, and adjust animation speed
- 🎨 **Color Coding**:
  - 🟡 **Yellow** - Elements being compared
  - 🔴 **Red** - Elements being swapped
  - 🟢 **Green** - Elements in sorted position

## Project Structure

```
algo-visualizer/
│
├── frontend/              # React frontend (using src/ folder)
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ArrayVisualizer.jsx
│   │   │   ├── Controls.jsx
│   │   │   └── AlgorithmSelector.jsx
│   │   ├── styles/        # External CSS files
│   │   │   ├── ArrayVisualizer.css
│   │   │   ├── Controls.css
│   │   │   └── AlgorithmSelector.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── backend/               # Node.js + Express backend
│   ├── routes/
│   │   └── sortRoutes.js
│   ├── controllers/
│   │   ├── bubbleController.js
│   │   ├── selectionController.js
│   │   ├── insertionController.js
│   │   └── mergeController.js
│   ├── cpp/
│   │   ├── bubble.cpp
│   │   ├── selection.cpp
│   │   ├── insertion.cpp
│   │   ├── merge.cpp
│   │   ├── build/
│   │   ├── build.bat      # Windows build script
│   │   └── build.sh       # Linux/Mac build script
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **C++ Compiler**:
  - **Windows**: MinGW or Visual Studio (with g++ in PATH)
  - **Linux**: `sudo apt-get install build-essential` (g++)
  - **Mac**: Xcode Command Line Tools (`xcode-select --install`)

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
# Navigate to project root (already has frontend dependencies)
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Compile C++ Algorithms

#### Windows:
```bash
cd backend/cpp
build.bat
cd ../../..
```

#### Linux/Mac:
```bash
cd backend/cpp
chmod +x build.sh
./build.sh
cd ../../..
```

**Note**: Make sure `g++` is installed and accessible from your command line. You can verify by running `g++ --version`.

### 4. Start the Backend Server

```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

Keep this terminal window open.

### 5. Start the Frontend Development Server

Open a new terminal window:

```bash
# From project root
npm run dev
# Frontend will run on http://localhost:5173 (or similar)
```

## Usage

1. **Open the application** in your browser (usually `http://localhost:5173`)
2. **Select an algorithm** from the dropdown menu
3. **Adjust array size** (5-50 elements)
4. **Click "Generate Array"** to create a random array
5. **Click "Start"** to begin visualization
6. **Use controls**:
   - **Pause** - Pause the animation
   - **Reset** - Reset to original array
   - **Speed Slider** - Adjust animation speed (1-100ms)

## API Endpoints

### POST `/api/sort/bubble`
Sort array using Bubble Sort algorithm.

**Request Body:**
```json
{
  "array": [64, 34, 25, 12, 22, 11, 90]
}
```

**Response:**
```json
{
  "steps": [
    {"type": "compare", "i": 0, "j": 1},
    {"type": "swap", "i": 0, "j": 1},
    ...
  ],
  "originalArray": [64, 34, 25, 12, 22, 11, 90]
}
```

Similar endpoints available for:
- `/api/sort/selection`
- `/api/sort/insertion`
- `/api/sort/merge`

## Step Types

The C++ algorithms output JSON steps with the following types:

- **`compare`** - Comparing two elements at indices `i` and `j`
- **`swap`** - Swapping elements at indices `i` and `j`
- **`overwrite`** - Overwriting element at index `i` with `value`
- **`sorted`** - Element at index `i` is in its final sorted position

## Technology Stack

- **Frontend**: React 19, Vite
- **Backend**: Node.js, Express
- **Algorithm Engine**: C++ (compiled to executables)
- **Styling**: External CSS files (no frameworks)

## Development Notes

- All styling is done through external CSS files (no inline styles, no Tailwind)
  - Note: CSS custom properties (CSS variables) are used for dynamic bar heights, which is the standard approach for dynamic values in React
- C++ programs output JSON steps to stdout, which Node.js reads and forwards to the frontend
- The frontend animates these steps with configurable speed
- The project is designed to be beginner-friendly and well-commented

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check that backend dependencies are installed (`cd backend && npm install`)

### C++ compilation fails
- Verify `g++` is installed: `g++ --version`
- On Windows, ensure MinGW or Visual Studio C++ tools are installed
- Check that you're in the `backend/cpp` directory when running build scripts

### Frontend can't connect to backend
- Ensure backend server is running on `http://localhost:5000`
- Check browser console for CORS errors
- Verify the API_BASE_URL in `src/App.jsx` matches your backend URL

### Executables not found
- Make sure you've compiled the C++ files using the build scripts
- Check that executables exist in `backend/cpp/build/`
- On Windows, look for `.exe` files; on Linux/Mac, look for files without extensions

## Future Enhancements

- [ ] Add more sorting algorithms (Quick Sort, Heap Sort, etc.)
- [ ] Add comparison mode (visualize multiple algorithms side-by-side)
- [ ] Add step-by-step explanation text
- [ ] Add algorithm complexity information
- [ ] Add sound effects for better feedback
- [ ] Add dark mode toggle

## License

This project is open source and available for educational purposes.

## Author

Built for CS students to understand sorting algorithms through visualization.
