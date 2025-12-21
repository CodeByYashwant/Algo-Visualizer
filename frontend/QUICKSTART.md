# Quick Start Guide

## 1. Install Dependencies

```bash
# Frontend (from project root)
npm install

# Backend
cd backend
npm install
cd ..
```

## 2. Compile C++ Algorithms

### Windows:
```bash
cd backend/cpp
build.bat
```

### Linux/Mac:
```bash
cd backend/cpp
chmod +x build.sh
./build.sh
```

**Important**: Make sure `g++` is installed. Test with: `g++ --version`

## 3. Start Backend Server

```bash
cd backend
npm start
```

Server runs on: `http://localhost:5000`

## 4. Start Frontend (New Terminal)

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173` (or similar)

## 5. Use the Application

1. Open browser to frontend URL
2. Select an algorithm
3. Click "Generate Array"
4. Click "Start" to visualize!

## Troubleshooting

- **Backend won't start**: Check if port 5000 is available
- **C++ compilation fails**: Install g++ compiler
- **Frontend can't connect**: Ensure backend is running first
- **Executables not found**: Run the build scripts in `backend/cpp/`

