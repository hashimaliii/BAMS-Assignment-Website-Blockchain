# BAMS System - Usage Screenshots & Feature Guide

This guide provides step-by-step visual walkthroughs of key features in the BAMS system.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Dashboard Overview](#dashboard-overview)
3. [Exploring the Hierarchy](#exploring-the-hierarchy)
4. [Search Functionality](#search-functionality)
5. [Attendance Management](#attendance-management)
6. [Viewing Blockchain Data](#viewing-blockchain-data)
7. [3D Visualization](#3d-visualization)
8. [System Validation](#system-validation)
9. [CRUD Operations](#crud-operations)

---

## Initial Setup

### Step 1: Start the Server

**Command:**
```bash
cd d:\Blockchain\BAMS-Assignment-Website-Blockchain
node backend/index.js
```

**Expected Output in Terminal:**
```
Mining block 0...
Block 0 mined! Hash: 00abc123def..., Nonce: 150
Mining block 0...
Block 0 mined! Hash: 00def456ghi..., Nonce: 312
...
Default structure creation complete.
BAMS Hierarchy Manager Initialized.
[DEPT_ROUTES] All department routes registered successfully
[API_ROUTES] API routes mounted successfully
[SERVER] Started successfully!
[SERVER] Listening on http://localhost:3000
[SERVER] Open http://localhost:3000 in your browser.
```

### Step 2: Open Browser

Navigate to: `http://localhost:3000`

**You should see the BAMS Dashboard loading with:**
- Header with logo
- Action buttons (System Check, Home, 3D Tree)
- Search bar
- Department cards loading

---

## Dashboard Overview

### Home Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  BAMS Hierarchy Dashboard                                   │
│  [🛡️ Check] [🏠 Home] [🎯 3D Tree]                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Search departments, classes, or students...      [Clear]│
│                                                             │
│  Departments (Layer 1 Chains)                              │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ COMP         │  │ SE           │  │ + Add Dept   │    │
│  │ School of    │  │ School of    │  │              │    │
│  │ Computing    │  │ Software Eng │  │              │    │
│  │              │  │              │  │              │    │
│  │ [View Classes]  │ [View Classes]  │              │    │
│  │ [Edit] [Del] │  │ [Edit] [Del] │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Elements

- **Header**: Logo, title, and quick action buttons
- **Search Bar**: Real-time search across all layers
- **Department Cards**: Shows all departments with navigation buttons
- **Add Buttons**: To create new items at each layer
- **Edit/Delete**: Modify or remove existing items

---

## Exploring the Hierarchy

### Navigation Flow: Departments → Classes → Students → Ledger

#### Step 1: View Departments

**Initial State**: Home page shows all departments

**Screenshot Description:**
```
Two department cards visible:
- COMP (School of Computing)
- SE (School of Software Engineering)

Each has:
- Department name and full name
- Latest hash value (truncated)
- "View Classes (Layer 2)" button
- Edit and Delete buttons
```

#### Step 2: Click "View Classes" on a Department

**Action**: Click "View Classes (Layer 2)" button on COMP department

**New Screen Shows:**
```
┌─────────────────────────────────────────────────────────────┐
│  Classes in COMP (Layer 2 Chains)                           │
│  Home > COMP                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Search...                                               │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ COMP-C1      │  │ COMP-C2      │  │ COMP-C3      │    │
│  │ Class 1      │  │ Class 2      │  │ Class 3      │    │
│  │              │  │              │  │              │    │
│  │ Latest Hash: │  │ Latest Hash: │  │ Latest Hash: │    │
│  │ 000ed93dd... │  │ 000ab45cd... │  │ 000xy78zk... │    │
│  │              │  │              │  │              │    │
│  │[View Students] │[View Students] │[View Students] │    │
│  │ [Edit][Del]  │  │ [Edit][Del]  │  │ [Edit][Del]  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  [More classes...]  [+ Add Class]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Breadcrumb shows**: `COMP / Class List`

#### Step 3: Click "View Students" on a Class

**Action**: Click "View Students (Layer 3)" button on COMP-C1

**New Screen Shows:**
```
┌─────────────────────────────────────────────────────────────┐
│  Students in COMP-C1 (Layer 3 Chains)                       │
│  Home > COMP > COMP-C1                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Search...                                               │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Aarav Patel     │ Roll: 1001 │ [View Ledger]     │   │
│  │ ID: COMP-C1-S01 │            │ [Edit] [Delete]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Ananya Singh    │ Roll: 1002 │ [View Ledger]     │   │
│  │ ID: COMP-C1-S02 │            │ [Edit] [Delete]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Arjun Kumar     │ Roll: 1003 │ [View Ledger]     │   │
│  │ ID: COMP-C1-S03 │            │ [Edit] [Delete]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  [More students...]  [+ Add Student]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Notes:**
- Students displayed in a compact list format
- Each row shows: Name, Roll Number, and action buttons
- Scroll to see all 35 students in class

#### Step 4: Click "View Ledger" on a Student

**Action**: Click "View Ledger" button next to Aarav Patel

**New Screen Shows:**
```
┌─────────────────────────────────────────────────────────────┐
│  Attendance Ledger for Aarav Patel                          │
│  Home > COMP > COMP-C1 > Aarav Patel (Ledger)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Student: Aarav Patel (COMP-C1-S01) | Roll: 1001          │
│                                                             │
│  ┌─────────────────────────────────────┐                  │
│  │ Mark Attendance for Today            │                  │
│  ├─────────────────────────────────────┤                  │
│  │ Status: [▼ Select Status]            │                  │
│  │         - Present                    │                  │
│  │         - Absent                     │                  │
│  │         - Leave                      │                  │
│  │                                      │                  │
│  │ Date: 2025-11-16                     │                  │
│  │                                      │                  │
│  │ [Mark Attendance]                    │                  │
│  └─────────────────────────────────────┘                  │
│                                                             │
│  Blockchain Ledger (Student Chain)                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📅 2025-11-16 09:30  │ ✅ PRESENT                   │  │
│  │ Block Hash: 00abc123... │ [View Details]            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📅 2025-11-15 10:15  │ ❌ ABSENT                    │  │
│  │ Block Hash: 00def456... │ [View Details]            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [View Chain] - See complete blockchain with hashes       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Search Functionality

### Basic Search

#### Step 1: Click Search Box

**Initial State**: Search bar at top of page
```
🔍 Search departments, classes, or students...
```

#### Step 2: Type Search Term

**Example Searches:**

**Search 1: By Student Name**
```
Type: "Aarav"
```

**Results Display:**
```
Search Results for "Aarav"

Students (1)
┌──────────────────────────────────────┐
│ Aarav Patel                          │
│ ID: COMP-C1-S01 | Roll: 1001        │
│ Class: COMP-C1                       │
│ [View Ledger]                        │
└──────────────────────────────────────┘
```

---

**Search 2: By Roll Number**
```
Type: "1005"
```

**Results Display:**
```
Search Results for "1005"

Students (1)
┌──────────────────────────────────────┐
│ Akshay Sharma                        │
│ ID: COMP-C1-S05 | Roll: 1005        │
│ Class: COMP-C1                       │
│ [View Ledger]                        │
└──────────────────────────────────────┘
```

---

**Search 3: By Class ID**
```
Type: "COMP-C1"
```

**Results Display:**
```
Search Results for "COMP-C1"

Classes (1)
┌──────────────────────────────────────┐
│ Class 1                              │
│ ID: COMP-C1                          │
│ Dept: COMP                           │
│ [View Students]                      │
└──────────────────────────────────────┘

Students (35)
┌──────────────────────────────────────┐
│ Aarav Patel | Roll: 1001             │
│ [View Ledger]                        │
└──────────────────────────────────────┘

[More students...]
```

---

**Search 4: By Department Name**
```
Type: "Computing"
```

**Results Display:**
```
Search Results for "Computing"

Departments (1)
┌──────────────────────────────────────┐
│ School of Computing                  │
│ ID: COMP                             │
│ [View Classes]                       │
└──────────────────────────────────────┘
```

---

### Clear Search

**Click [Clear] Button** to reset and return to departments view

---

## Attendance Management

### Marking Attendance

#### Step 1: Navigate to Student Ledger

- Go to Departments → Classes → Students
- Click "View Ledger" for any student

#### Step 2: Select Status

**Form Appears:**
```
Mark Attendance for Today

Status: [▼]
Options:
✅ Present
❌ Absent
🚫 Leave
```

Select any option.

#### Step 3: Verify Date

**Auto-filled with today's date:**
```
Date: 2025-11-16
```

Can be changed by clicking date field.

#### Step 4: Click "Mark Attendance"

**After clicking:**
1. Status shows "Marking..." (loading)
2. New block is mined (PoW consensus)
3. Block added to student's blockchain
4. Ledger updates with new entry
5. New entry shows at top with color indicator

**Success Feedback:**
```
✅ Attendance marked successfully
New block hash: 00abc123def456...
```

---

### Viewing Attendance History

**After marking attendance, you see:**

```
Blockchain Ledger (Student Chain)

Recent Entries:

📅 2025-11-16 14:22  │ ✅ PRESENT
Block: 00xyz789...   │ [Details]

📅 2025-11-16 09:30  │ ✅ PRESENT
Block: 00abc123...   │ [Details]

📅 2025-11-15 10:15  │ ❌ ABSENT
Block: 00def456...   │ [Details]

📅 2025-11-14 11:45  │ 🚫 LEAVE
Block: 00ghi789...   │ [Details]
```

**Color Legend:**
- 🟢 Green background = Present
- 🔴 Red background = Absent
- 🟡 Yellow background = Leave

---

## Viewing Blockchain Data

### Student Blockchain Details

#### Step 1: From Ledger, Click "View Chain"

**New View Shows Complete Blockchain:**

```
Student Blockchain: Aarav Patel (COMP-C1-S01)

Genesis Block (Block 0):
┌──────────────────────────────────────────────────────┐
│ Index: 0                                             │
│ Timestamp: 2025-11-16 09:30:00                      │
│ Type: STUDENT_METADATA                              │
│ Student ID: COMP-C1-S01                             │
│ Student Name: Aarav Patel                           │
│ Roll Number: 1001                                   │
│ Linked to Class Genesis: 000ed93dd...              │
│ Previous Hash: 000ed93dd...                        │
│ Block Hash: 00df0b49df...                          │
│ Nonce: 7                                            │
│ Status: ✅ VALID                                    │
└──────────────────────────────────────────────────────┘

Attendance Block 1:
┌──────────────────────────────────────────────────────┐
│ Index: 1                                             │
│ Timestamp: 2025-11-16 09:30:15                      │
│ Status: PRESENT                                      │
│ Date: 2025-11-16                                    │
│ Previous Hash: 00df0b49df...                        │
│ Block Hash: 00abc123def...                          │
│ Nonce: 42                                           │
│ Status: ✅ VALID                                    │
└──────────────────────────────────────────────────────┘

Attendance Block 2:
┌──────────────────────────────────────────────────────┐
│ Index: 2                                             │
│ Timestamp: 2025-11-16 10:15:22                      │
│ Status: PRESENT                                      │
│ Date: 2025-11-16                                    │
│ Previous Hash: 00abc123def...                        │
│ Block Hash: 00ghi789jkl...                          │
│ Nonce: 156                                          │
│ Status: ✅ VALID                                    │
└──────────────────────────────────────────────────────┘

Chain Validation: ✅ VALID (3 blocks, all linked correctly)
```

#### Step 2: Analyze Chain Properties

Each block shows:
- **Index**: Position in chain (0 = genesis)
- **Timestamp**: When block was created
- **Previous Hash**: Hash of previous block (creates linkage)
- **Block Hash**: Current block's hash
- **Nonce**: Proof-of-work iterations
- **Status**: VALID/INVALID indicator

---

## 3D Visualization

### Launching 3D Hierarchy

#### Step 1: Click "🎯 3D Hierarchy Tree" Button

**From any page**, click the 3D button in the header.

**Loading Message:**
```
Loading 3D data... (2-3 seconds)
Initializing Three.js scene...
Rendering hierarchy visualization...
```

#### Step 2: 3D View Renders

**You see an interactive 3D scene:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│        🟢 COMP (Green - Department)                │
│          ├─ 🔵 COMP-C1 (Blue - Class)             │
│          │   ├─ 🟠 S01 (Orange - Student)         │
│          │   ├─ 🟠 S02                             │
│          │   ├─ 🟠 S03                             │
│          │   └─ 🟠 S04...                          │
│          ├─ 🔵 COMP-C2                             │
│          │   └─ 🟠 S01-S35                         │
│          └─ 🔵 COMP-C3...                          │
│                                                     │
│        🟢 SE (Green - Department)                  │
│          ├─ 🔵 SE-C1 (Blue - Class)               │
│          │   └─ 🟠 S01-S35 (Orange - Students)   │
│          └─ 🔵 SE-C2...                            │
│                                                     │
│        [Gray lines show hierarchy connections]    │
│                                                     │
│  3D Hierarchy Controls:                            │
│  • Drag to rotate                                  │
│  • Scroll to zoom                                  │
│  • Right-click + drag to pan                       │
│  • Green = Departments                             │
│  • Blue = Classes                                  │
│  • Orange = Students                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Step 3: Interact with 3D View

**Drag to Rotate:**
- Click and drag left/right: Rotate around Y-axis
- Click and drag up/down: Rotate around X-axis

**Scroll to Zoom:**
- Scroll up: Zoom in
- Scroll down: Zoom out

**Right-Click to Pan:**
- Right-click and drag: Move view around

---

## System Validation

### Running Integrity Check

#### Step 1: Click "🛡️ Run System Integrity Check"

**Button Location**: Header, top-right

#### Step 2: Validation Runs

**Progress Message:**
```
🔄 Validating system integrity...
   Checking 2 departments
   Checking 10 classes
   Checking 350 students
   Verifying all linkages...
   (2-5 seconds)
```

#### Step 3: Results Display

**Success Result:**
```
┌─────────────────────────────────────────────────────┐
│ ✅ System Integrity Check PASSED                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Status: VALID                                      │
│                                                     │
│ Message: ✅ System Integrity Check: All chains     │
│ are valid and cryptographically linked.            │
│                                                     │
│ Report:                                            │
│                                                     │
│ COMP Department:                                   │
│   ✅ Valid (1 genesis block)                       │
│   Classes:                                         │
│   ├─ ✅ COMP-C1: Valid, Linkage: VALID           │
│   ├─ ✅ COMP-C2: Valid, Linkage: VALID           │
│   ├─ ✅ COMP-C3: Valid, Linkage: VALID           │
│   ├─ ✅ COMP-C4: Valid, Linkage: VALID           │
│   └─ ✅ COMP-C5: Valid, Linkage: VALID           │
│                                                     │
│   Students (all classes):                          │
│   ├─ ✅ 175 students: Valid & Linked              │
│   ├─ ❌ 0 students: Invalid                        │
│   └─ ❌ 0 linkage failures                         │
│                                                     │
│ SE Department:                                     │
│   ✅ Valid (1 genesis block)                       │
│   Classes:                                         │
│   ├─ ✅ SE-C1: Valid, Linkage: VALID             │
│   ├─ ✅ SE-C2: Valid, Linkage: VALID             │
│   ├─ ✅ SE-C3: Valid, Linkage: VALID             │
│   ├─ ✅ SE-C4: Valid, Linkage: VALID             │
│   └─ ✅ SE-C5: Valid, Linkage: VALID             │
│                                                     │
│   Students (all classes):                          │
│   ├─ ✅ 175 students: Valid & Linked              │
│   ├─ ❌ 0 students: Invalid                        │
│   └─ ❌ 0 linkage failures                         │
│                                                     │
│ Overall System Status: ✅ VALID                   │
│                                                     │
└─────────────────────────────────────────────────────┘

[Close Report]
```

---

**If Invalid (Example):**
```
┌─────────────────────────────────────────────────────┐
│ ❌ System Integrity Check FAILED                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Status: INVALID                                    │
│                                                     │
│ Message: ❌ WARNING: System Integrity compromised!│
│                                                     │
│ COMP Department:                                   │
│   ✅ Valid (1 genesis block)                       │
│   SE-C1 Class:                                     │
│   ❌ INVALID: Genesis block linkage failed         │
│      Expected parent hash: 00abc123...             │
│      Got parent hash: 00xyz789...                  │
│                                                     │
│ Recommendation: Reset system data or investigate  │
│                                                     │
└─────────────────────────────────────────────────────┘

[Fix Database]
```

---

## CRUD Operations

### Create Operations

#### Add Department

1. **Navigate to**: Home page
2. **Click**: "+ Add Department" card at bottom
3. **Form appears:**
   ```
   Department Name: [________________]
   
   [Create Department] [Cancel]
   ```
4. **Fill in name**: e.g., "School of Arts"
5. **Click**: "Create Department"
6. **Result**: New department appears in list, genesis block created

#### Add Class

1. **Navigate to**: Classes view for any department
2. **Click**: "+ Add Class" card at bottom
3. **Form appears:**
   ```
   Class Name: [________________]
   
   [Create Class] [Cancel]
   ```
4. **Fill in name**: e.g., "Class 6"
5. **Click**: "Create Class"
6. **Result**: New class appears, linked to department genesis

#### Add Student

1. **Navigate to**: Students view for any class
2. **Click**: "+ Add Student" card at bottom
3. **Form appears:**
   ```
   Student Name: [________________]
   Roll Number: [________________]
   
   [Add Student] [Cancel]
   ```
4. **Fill in details**: e.g., "Priya Sharma", 1036
5. **Click**: "Add Student"
6. **Result**: New student appears, blockchain created and linked

---

### Read Operations

#### View Single Item

**Navigate using:**
- Department → Click "View Classes"
- Class → Click "View Students"  
- Student → Click "View Ledger"

**Or use Search:**
- Type name/ID
- Click "View" button in results

---

### Update Operations

#### Edit Department

1. **On department card**: Click "Edit" button
2. **Form appears** with current name
3. **Modify name** as needed
4. **Click**: "Save Changes"
5. **Result**: Department name updated

#### Edit Class

1. **On class card**: Click "Edit" button
2. **Form appears** with current name
3. **Modify name** as needed
4. **Click**: "Save Changes"
5. **Result**: Class name updated

#### Edit Student

1. **On student row**: Click "Edit" button
2. **Form appears** with current name and roll number
3. **Modify as needed**
4. **Click**: "Save Changes"
5. **Result**: Student record updated

---

### Delete Operations

#### Delete Department

1. **On department card**: Click "Delete" button
2. **Confirmation dialog appears:**
   ```
   ⚠️ Delete Department?
   
   This will remove: COMP and all its classes (5)
   and students (175). This cannot be undone.
   
   [Delete Permanently] [Cancel]
   ```
3. **Click**: "Delete Permanently"
4. **Result**: Department, all classes, and all students removed

#### Delete Class

1. **On class card**: Click "Delete" button
2. **Confirmation dialog appears:**
   ```
   ⚠️ Delete Class?
   
   This will remove: COMP-C1 and all its students (35)
   
   [Delete Permanently] [Cancel]
   ```
3. **Click**: "Delete Permanently"
4. **Result**: Class and all students removed

#### Delete Student

1. **On student row**: Click "Delete" button
2. **Confirmation dialog appears:**
   ```
   ⚠️ Delete Student?
   
   This will remove: Aarav Patel's entire blockchain
   All attendance records will be lost.
   
   [Delete Permanently] [Cancel]
   ```
3. **Click**: "Delete Permanently"
4. **Result**: Student and blockchain removed

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+F5` | Hard refresh browser (clear cache) |
| `F12` | Open Developer Console |
| `Ctrl+F` | Browser find (not app search) |
| `Home` | Scroll to top |
| `Ctrl+L` | Focus address bar |

---

## Common Workflows

### Workflow 1: Check a Student's Attendance

1. Go to Home
2. Search for student name
3. Click "View Ledger"
4. See all attendance entries in ledger
5. Click "View Chain" for complete blockchain

**Time**: ~10 seconds

---

### Workflow 2: Mark Daily Attendance for a Class

1. Navigate: Home → COMP → COMP-C1
2. For each student:
   - Click "View Ledger"
   - Select status (Present/Absent/Leave)
   - Click "Mark Attendance"
   - Back to student list
3. Repeat for all 35 students

**Time**: ~5 minutes

---

### Workflow 3: Verify System Integrity

1. Click "🛡️ Run System Integrity Check"
2. Wait for validation
3. Review report
4. Check each section for ✅ VALID
5. If issues found, see Troubleshooting guide

**Time**: ~5 seconds

---

### Workflow 4: Add New Department and Students

1. Click "+ Add Department"
2. Enter name, create
3. Navigate to new department
4. Click "+ Add Class"
5. Enter class name, create
6. Click "+ Add Student" (35 times) or copy existing

**Time**: ~5 minutes for 35 students

---

### Workflow 5: Visualize Entire Hierarchy

1. Click "🎯 3D Hierarchy Tree"
2. Drag to rotate, scroll to zoom
3. Observe color-coded visualization
4. Identify departments, classes, students
5. Understand relationships visually

**Time**: ~2 minutes exploration

---

## Tips & Best Practices

### General Tips

✅ **Do:**
- Use search for quick navigation
- Review validation regularly
- Backup data before mass deletions
- Use the breadcrumb to navigate back
- Hover over hashes to see full values

❌ **Don't:**
- Close browser during long operations
- Delete parent items without reviewing children
- Modify data files directly (use app instead)
- Run multiple servers on same port

### Performance Tips

- Clear browser cache monthly: `Ctrl+Shift+Delete`
- Restart server if app becomes slow
- Limit search results by being specific
- Close 3D view if not using (saves GPU)

### Data Integrity Tips

- Run validation check weekly
- Keep backups of data files
- Document any manual data changes
- Test add/delete operations on test data first

---

## Getting Help

**Problem**: Feature not working?

**Steps to troubleshoot:**

1. Check browser console: `F12 → Console`
2. Look for error messages
3. Review Terminal output where server runs
4. Try refresh: `Ctrl+F5`
5. Restart server: `Ctrl+C` then `node backend/index.js`
6. Check README.md Troubleshooting section

---

**End of Screenshots & Feature Guide**

For more detailed information, see the main [README.md](README.md)
