# BAMS - Blockchain Attendance Management System

A sophisticated three-layer blockchain-based attendance management system for educational institutions. This system uses proof-of-work consensus and cryptographic linkage to maintain an immutable, hierarchical record of departments, classes, and student attendance.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Usage Guide](#usage-guide)
7. [API Documentation](#api-documentation)
8. [System Architecture](#system-architecture)
9. [Blockchain Validation](#blockchain-validation)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The BAMS system implements a **three-layer blockchain hierarchy** where:
- **Layer 1**: Department chains
- **Layer 2**: Class chains (linked to parent departments)
- **Layer 3**: Student attendance chains (linked to parent classes)

Each layer is cryptographically linked through genesis block hashes, ensuring complete data integrity and auditability. All transactions are permanently recorded in individual blockchains using proof-of-work consensus.

### Key Innovation

Unlike traditional databases, BAMS ensures that:
- ✅ No attendance record can be tampered with retroactively
- ✅ All linkages are cryptographically verified
- ✅ Complete audit trail is maintained
- ✅ System integrity can be validated at any time

---

## Architecture

### Three-Layer Blockchain Structure

```
┌─────────────────────────────────────────────────┐
│         Department Chains (Layer 1)             │
│  COMP Department    →    SE Department          │
│  (Genesis Block)          (Genesis Block)       │
│         ↓                        ↓              │
│  ┌──────────────┐          ┌──────────────┐   │
│  │ Class Chains │          │ Class Chains │   │
│  │  (Layer 2)   │          │  (Layer 2)   │   │
│  │ C1, C2, C3.. │          │ C1, C2, C3.. │   │
│  │  (linked to  │          │  (linked to  │   │
│  │   COMP Gen)  │          │   SE Gen)    │   │
│  └──────────────┘          └──────────────┘   │
│         ↓                        ↓              │
│  ┌──────────────┐          ┌──────────────┐   │
│  │   Students   │          │   Students   │   │
│  │  (Layer 3)   │          │  (Layer 3)   │   │
│  │ S1, S2, S3.. │          │ S1, S2, S3.. │   │
│  │  (linked to  │          │  (linked to  │   │
│  │   Class Gen) │          │   Class Gen) │   │
│  └──────────────┘          └──────────────┘   │
└─────────────────────────────────────────────────┘
```

### Linkage Model

- **Class Genesis Block** → References Department Genesis Block Hash
- **Student Genesis Block** → References Class Genesis Block Hash
- This creates an immutable cryptographic chain across all layers

---

## Features

### Core Functionality

1. **Department Management**
   - Create, read, update, and delete departments
   - Each department has its own blockchain

2. **Class Management**
   - Create classes within departments
   - Each class is a separate blockchain layer
   - Cryptographically linked to parent department

3. **Student Management**
   - Add students to classes
   - Each student has their own attendance blockchain
   - Cryptographically linked to parent class

4. **Attendance Tracking**
   - Mark students present, absent, or on leave
   - Each attendance mark creates a new block in student's blockchain
   - Timestamp and proof-of-work for all entries

5. **Global Search**
   - Real-time search across all layers
   - Search by name, ID, or roll number
   - Instant results with direct navigation

6. **3D Visualization**
   - Interactive 3D hierarchy tree
   - Visualize all departments, classes, and students
   - Drag to rotate, scroll to zoom
   - Color-coded: Green (Departments), Blue (Classes), Orange (Students)

7. **System Integrity Validation**
   - Verify all blockchains are valid
   - Check all cryptographic linkages
   - Generate comprehensive validation reports

---

## Installation

### Prerequisites

- **Node.js** v14 or higher
- **npm** (Node Package Manager)
- **Git** (optional, for cloning)

### Setup Steps

1. **Clone or Download the Repository**
   ```bash
   cd d:\Blockchain\BAMS-Assignment-Website-Blockchain
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Installation**
   ```bash
   node --version
   npm --version
   ```

### Project Structure

```
BAMS-Assignment-Website-Blockchain/
├── backend/
│   ├── index.js                 # Express server entry point
│   ├── data/
│   │   ├── bams_structure.json  # Persisted hierarchy data
│   │   └── bams_state.json      # State file
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── core/                # Blockchain core (Block, Blockchain, HierarchyManager)
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic
│   │   └── utils/               # Utilities (crypto, file I/O)
│   └── package.json
├── frontend/
│   └── index.html               # Single-page dashboard application
├── package.json
└── README.md
```

---

## Running the Application

### Start the Server

```bash
cd d:\Blockchain\BAMS-Assignment-Website-Blockchain
node backend/index.js
```

**Expected Output:**
```
Mining block 0...
Block 0 mined! Hash: 00abc123..., Nonce: 150
...
[SERVER] Started successfully!
[SERVER] Listening on http://localhost:3000
[SERVER] Open http://localhost:3000 in your browser.
```

### Access the Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

### Stop the Server

Press `Ctrl+C` in the terminal where the server is running.

---

## Usage Guide

### Main Dashboard

When you first load the application, you'll see:

1. **Header** with logo and action buttons
2. **Search bar** for finding departments, classes, or students
3. **Departments grid** showing all available departments
4. **Navigation buttons** for exploring the hierarchy

### Navigation Through Layers

#### Layer 1: Departments
- Click "View Classes (Layer 2)" on any department card
- See all classes in that department

#### Layer 2: Classes
- Click "View Students (Layer 3)" on any class card
- See all students in that class

#### Layer 3: Students
- Click "View Ledger" on any student
- See complete attendance history and blockchain

### Viewing Attendance Ledger

For any student:
1. Navigate to their profile in a class
2. Click "View Ledger"
3. See all attendance records:
   - Green = Present
   - Red = Absent
   - Yellow = Leave
4. View complete blockchain with block hashes and timestamps
5. Click "View Chain" to see the entire student blockchain

### Using Search

1. **Search Box** appears at the top of the page
2. **Type any search term**:
   - Department name: "Computing"
   - Class ID: "COMP-C1"
   - Student name: "Aarav Patel"
   - Roll number: "1005"

3. **Results Display** organized by layer:
   - Matching departments
   - Matching classes
   - Matching students

4. **Quick Actions** from search results:
   - View Classes / View Students / View Ledger buttons
   - Click to navigate directly to that resource

### 3D Hierarchy Visualization

1. Click **"🎯 3D Hierarchy Tree"** button
2. **Interactive Controls**:
   - **Drag** with mouse to rotate
   - **Scroll** to zoom in/out
   - **Right-click + drag** to pan
3. **Color Legend**:
   - 🟢 Green = Departments
   - 🔵 Blue = Classes
   - 🟠 Orange = Students
4. **Gray lines** show hierarchy relationships

### Managing Data

#### Add Department
1. Navigate to Departments view
2. Click "+ Add Department" card at the bottom
3. Enter department name and click "Add"

#### Add Class
1. Navigate to Classes in a department
2. Click "+ Add Class" card at the bottom
3. Enter class name and click "Add"

#### Add Student
1. Navigate to Students in a class
2. Click "+ Add Student" card at the bottom
3. Enter student name and roll number, click "Add"

#### Edit/Delete
- Click **Edit** button on any card to update
- Click **Delete** button to remove (with confirmation)

### Mark Attendance

1. Navigate to a student's ledger (View Ledger)
2. In the **Attendance Form**, select:
   - **Status**: Present, Absent, or Leave
   - **Date**: Select date (auto-filled with today)
3. Click **"Mark Attendance"**
4. New block is added to student's blockchain
5. Ledger updates immediately

### System Integrity Check

1. Click **"🛡️ Run System Integrity Check"** in header
2. System validates:
   - All department chains
   - All class chains (linkage to parent departments)
   - All student chains (linkage to parent classes)
   - Proof-of-work for all blocks
3. Results show:
   - ✅ VALID (all systems intact)
   - ❌ INVALID (compromised chains with details)

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Departments

**Get All Departments**
```
GET /departments
Response: [{ id, name, currentHash }]
```

**Get Department**
```
GET /departments/{deptId}
Response: { id, name, currentHash, classCount }
```

**Create Department**
```
POST /departments
Body: { id, name }
Response: { success, message, data }
```

**Update Department**
```
PUT /departments/{deptId}
Body: { name }
Response: { success, message }
```

**Delete Department**
```
DELETE /departments/{deptId}
Response: { success, message }
```

---

#### Classes

**Get All Classes in Department**
```
GET /departments/{deptId}/classes
Response: [{ id, name, currentHash }]
```

**Get Class**
```
GET /departments/{deptId}/classes/{classId}
Response: { id, name, currentHash, studentCount }
```

**Create Class**
```
POST /departments/{deptId}/classes
Body: { id, name }
Response: { success, message, data }
```

**Update Class**
```
PUT /departments/{deptId}/classes/{classId}
Body: { name }
Response: { success, message }
```

**Delete Class**
```
DELETE /departments/{deptId}/classes/{classId}
Response: { success, message }
```

---

#### Students

**Get All Students in Class**
```
GET /departments/{deptId}/classes/{classId}/students
Response: [{ id, name, rollNumber }]
```

**Get Student**
```
GET /departments/{deptId}/classes/{classId}/students/{studentId}
Response: { id, name, rollNumber, currentHash }
```

**Create Student**
```
POST /departments/{deptId}/classes/{classId}/students
Body: { id, name, rollNumber }
Response: { success, message, data }
```

**Update Student**
```
PUT /departments/{deptId}/classes/{classId}/students/{studentId}
Body: { name, rollNumber }
Response: { success, message }
```

**Delete Student**
```
DELETE /departments/{deptId}/classes/{classId}/students/{studentId}
Response: { success, message }
```

---

#### Attendance

**Mark Attendance**
```
POST /departments/{deptId}/classes/{classId}/students/{studentId}/attendance
Body: { status, date }
Response: { success, message, block }
```

**Get Student History**
```
GET /departments/{deptId}/classes/{classId}/students/{studentId}/history
Response: [{ status, date, blockHash }]
```

**Get Student Chain**
```
GET /departments/{deptId}/classes/{classId}/students/{studentId}/chain
Response: { chainId, blocks: [{ index, hash, timestamp, ... }] }
```

---

#### System Validation

**Validate System Integrity**
```
GET /api/validate
Response: {
  status: "VALID" | "INVALID",
  message: "...",
  report: { ... }
}
```

---

## System Architecture

### Technology Stack

- **Backend**: Express.js (Node.js)
- **Frontend**: Vanilla JavaScript + HTML5 + Tailwind CSS
- **Blockchain**: Custom PoW implementation
- **Visualization**: Three.js (3D graphics)
- **Persistence**: JSON file-based

### Core Components

#### 1. Block.js
- Implements individual blockchain blocks
- Proof-of-work mining with adjustable difficulty
- Block structure: index, timestamp, transactions, prev_hash, nonce, hash

#### 2. Blockchain.js
- Manages chains of blocks
- Validates chain integrity
- Implements mining consensus
- Tracks difficulty and nonce

#### 3. HierarchyManager.js
- Orchestrates three-layer hierarchy
- Manages department, class, and student creation
- Handles cryptographic linkage between layers
- Validates complete system integrity
- Serializes/deserializes state for persistence

#### 4. Services Layer
- DepartmentService: Department operations
- ClassService: Class operations
- StudentService: Student operations
- BAMSService: Validation and reporting

#### 5. Controllers
- Request validation and response formatting
- Error handling
- Logging

---

## Blockchain Validation

### How Validation Works

The system performs three-level validation:

#### Level 1: Department Chains
✓ Each block has valid proof-of-work
✓ Hash chain is unbroken
✓ Genesis block is properly formed

#### Level 2: Class Chains
✓ Each class chain is internally valid (Level 1)
✓ Class genesis block's `prev_hash` matches department genesis block hash
✓ Linkage to parent is cryptographically correct

#### Level 3: Student Chains
✓ Each student chain is internally valid (Level 1)
✓ Student genesis block's `prev_hash` matches class genesis block hash
✓ Linkage to parent is cryptographically correct

### Running Validation

```javascript
// Frontend - Click "🛡️ Run System Integrity Check"
// This calls the /api/validate endpoint

// Backend - Manual validation
const validation = Hierarchy.validateAllChains();
console.log(validation);
```

### Validation Report Example

```json
{
  "status": "VALID",
  "message": "✅ System Integrity Check: All chains are valid and cryptographically linked.",
  "report": {
    "departments": [
      {
        "id": "COMP",
        "valid": true,
        "blockCount": 1,
        "classes": [
          {
            "id": "COMP-C1",
            "valid": true,
            "linkageValid": true,
            "students": [
              {
                "id": "COMP-C1-S01",
                "valid": true,
                "linkageValid": true
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## Default Data Structure

When the system initializes, it creates:

- **2 Departments**:
  - `COMP` - School of Computing
  - `SE` - School of Software Engineering

- **Per Department: 5 Classes**
  - `COMP-C1`, `COMP-C2`, `COMP-C3`, `COMP-C4`, `COMP-C5`
  - `SE-C1`, `SE-C2`, `SE-C3`, `SE-C4`, `SE-C5`

- **Per Class: 35 Students**
  - IDs: `COMP-C1-S01`, `COMP-C1-S02`, ... `COMP-C1-S35`
  - Roll Numbers: 1001-1035
  - Names: Diverse realistic names (Aarav Patel, Ananya Singh, etc.)

---

## Troubleshooting

### Server Won't Start

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Kill existing Node process on port 3000
# Windows PowerShell:
Get-Process -Name node | Stop-Process -Force

# Then restart:
node backend/index.js
```

---

### Search Not Working

**Problem**: Search returns no results even for known items

**Solution**:
1. Wait 2-3 seconds after loading page for search data to cache
2. Refresh the page (F5)
3. Try searching by exact ID instead of name

---

### Attendance Not Marking

**Problem**: "Mark Attendance" button doesn't work

**Solution**:
1. Ensure you're viewing a student's ledger (View Ledger button)
2. Select a status (Present, Absent, or Leave)
3. Check browser console for errors (F12)
4. Verify server is running

---

### 3D Visualization Not Loading

**Problem**: 3D Hierarchy Tree shows blank canvas

**Solution**:
1. Click "🎯 3D Hierarchy Tree" button again
2. Wait 2-3 seconds for Three.js to initialize
3. Ensure JavaScript is enabled in browser
4. Check browser console (F12) for errors

---

### Data Corruption / Invalid Chains

**Problem**: System Integrity Check shows INVALID status

**Solution**:
1. **Backup data**: Copy `backend/data/` folder
2. **Clear corrupted data**:
   ```bash
   # Stop the server (Ctrl+C)
   # Delete the data files
   rm backend/data/bams_*.json
   ```
3. **Restart server** - Fresh data will be generated
   ```bash
   node backend/index.js
   ```
4. **Verify**: Run System Integrity Check again

---

### Performance Issues

**Problem**: App is slow or unresponsive

**Solution**:
1. **Reduce data**: Delete student records or reset system
2. **Clear browser cache**: Ctrl+Shift+Delete
3. **Restart server and browser**
4. **Check system resources**: Task Manager - ensure sufficient RAM/CPU

---

## Database Reset

To completely reset the system:

1. **Stop the server** (Ctrl+C in terminal)

2. **Delete data files**:
   ```bash
   cd backend/data
   rm bams_structure.json bams_state.json
   ```

3. **Restart server**:
   ```bash
   node backend/index.js
   ```

4. **Refresh browser** (Ctrl+F5)

The system will regenerate fresh default data.

---

## Advanced Configuration

### Adjust Blockchain Difficulty

Edit `backend/src/core/Blockchain.js`:
```javascript
this.difficulty = "00"; // Requires 2 leading zeros
// Change to "000" for more difficulty (slower mining)
// Change to "0" for less difficulty (faster mining)
```

### Change Default Department Names

Edit `backend/src/core/HierarchyManager.js`, line 28-31:
```javascript
this.addDepartment('COMP', 'School of Computing'); 
this.addDepartment('SE', 'School of Software Engineering'); 
// Modify names here
```

### Modify Student Names Pool

Edit `backend/src/core/HierarchyManager.js`, lines 33-45:
```javascript
const studentNames = [
    'Aarav Patel', 'Ananya Singh', ... // Add/remove names
];
```

---

## Performance Metrics

- **Server Startup**: ~30-60 seconds (mining genesis blocks)
- **Search**: <100ms across 350 students
- **Attendance Mark**: ~1-2 seconds (PoW mining)
- **Validation Check**: ~2-5 seconds (entire system)
- **3D Visualization Load**: ~1-2 seconds

---

## Security Considerations

1. **Proof-of-Work**: Prevents tampering by requiring computational effort
2. **Cryptographic Linkage**: Hash chain ensures immutability
3. **File Persistence**: State saved securely after each operation
4. **No Database**: Eliminates SQL injection and database vulnerabilities
5. **Local Operation**: No external APIs or cloud dependencies

---

## Future Enhancements

- [ ] Export attendance reports (PDF/CSV)
- [ ] Multi-user authentication
- [ ] Role-based access control (Admin, Teacher, Student)
- [ ] Bulk import from CSV
- [ ] Attendance statistics and analytics
- [ ] Email notifications for absences
- [ ] Mobile app
- [ ] Distributed consensus across multiple servers

---

## License

Educational Project - Free to use and modify

---

## Support

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review logs in server console output
3. Check browser console (F12) for JavaScript errors
4. Verify all dependencies are installed: `npm install`

---

## Acknowledgments

Built as an educational system demonstrating blockchain concepts in real-world application (attendance management).

**Key Technologies Used**:
- Proof-of-Work Consensus
- Cryptographic Hashing (SHA-256)
- Three-Layer Blockchain Hierarchy
- RESTful API Design
- Single-Page Application (SPA)
- 3D Data Visualization

---

**Happy Using! 🎓**
