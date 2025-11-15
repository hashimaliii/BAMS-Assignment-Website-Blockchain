const API_BASE = '/api';
const outputDiv = document.getElementById('output');
const validationDiv = document.getElementById('validationOutput');

// --- UTILITY FUNCTIONS ---

function updateSelect(selectId, items, valueKey, textKey, defaultText, changeFn) {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">-- ${defaultText} --</option>`;
    if (items && items.length > 0) {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueKey];
            option.textContent = item[textKey] || item[valueKey];
            select.appendChild(option);
        });
    }
    if (changeFn) select.onchange = changeFn;
}

function displayOutput(data, isError = false) {
    outputDiv.innerHTML = `<pre class="${isError ? 'error' : 'success'}">${JSON.stringify(data, null, 2)}</pre>`;
}

// --- DEPARTMENT (LAYER 1) CRUD ---

async function addDepartment() {
    const deptId = document.getElementById('deptId').value.toUpperCase();
    const name = document.getElementById('deptName').value;
    
    try {
        const response = await fetch(`${API_BASE}/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deptId, name })
        });
        const data = await response.json();
        displayOutput(data, !response.ok);
        if (response.ok) viewAllDepartments();
    } catch (e) {
        displayOutput({ error: 'Network error during department creation.' }, true);
    }
}

async function viewAllDepartments() {
    try {
        const response = await fetch(`${API_BASE}/departments`);
        const departments = await response.json();
        
        // Update the output
        outputDiv.innerHTML = '<h2>Active Departments</h2>';
        departments.forEach(dept => {
            outputDiv.innerHTML += `
                <div class="dept-item" onclick="loadClasses('${dept.id}')">
                    <strong>[${dept.id}] - ${dept.name}</strong> 
                    (Hash: <span class="block-hash">${dept.currentHash.substring(0, 15)}...</span>)
                </div>
            `;
        });

        // Update the select dropdowns
        updateSelect('selectDept', departments, 'id', 'name', 'Select Department', loadClasses);
        
    } catch (e) {
        displayOutput({ error: 'Failed to fetch departments.' }, true);
    }
}

// --- CLASS (LAYER 2) CRUD ---

async function loadClasses(deptId) {
    const selectedDeptId = deptId || document.getElementById('selectDept').value;
    if (!selectedDeptId) return;

    try {
        const response = await fetch(`${API_BASE}/departments/${selectedDeptId}/classes`);
        const classes = await response.json();

        // Update the output with Class list
        const deptName = document.getElementById('selectDept').options[document.getElementById('selectDept').selectedIndex].text;
        outputDiv.innerHTML = `<h2>Classes in ${deptName} (${selectedDeptId})</h2>`;
        classes.forEach(cls => {
            outputDiv.innerHTML += `
                <div class="class-item" onclick="loadStudents('${selectedDeptId}', '${cls.id}')">
                    [${cls.id}] - ${cls.name} 
                    (Genesis Hash Link: <span class="block-hash">${cls.currentHash.substring(0, 15)}...</span>)
                </div>
            `;
        });
        
        // Update the select dropdowns
        updateSelect('selectClass', classes, 'id', 'name', 'Select Class', loadStudents);
        updateSelect('selectStudent', [], 'id', 'name', 'Select Student'); // Clear students
    } catch (e) {
        displayOutput({ error: `Failed to fetch classes for ${selectedDeptId}.` }, true);
    }
}

async function addClass() {
    const deptId = document.getElementById('selectDept').value;
    if (!deptId) return alert('Please select a Department first.');

    const classId = prompt("Enter Class ID (e.g., C1):");
    const name = prompt("Enter Class Name:");

    if (!classId || !name) return;

    try {
        const response = await fetch(`${API_BASE}/departments/${deptId}/classes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classId: classId.toUpperCase(), name })
        });
        const data = await response.json();
        displayOutput(data, !response.ok);
        if (response.ok) loadClasses(deptId);
    } catch (e) {
        displayOutput({ error: 'Network error during class creation.' }, true);
    }
}

// --- STUDENT (LAYER 3) CRUD & ATTENDANCE ---

async function loadStudents(deptId, classId) {
    const selectedDeptId = deptId || document.getElementById('selectDept').value;
    const selectedClassId = classId || document.getElementById('selectClass').value;
    
    if (!selectedDeptId || !selectedClassId) return;

    try {
        const response = await fetch(`${API_BASE}/departments/${selectedDeptId}/classes/${selectedClassId}/students`);
        const students = await response.json();
        
        // Update the output with Student list
        outputDiv.innerHTML = `<h2>Students in ${selectedClassId}</h2>`;
        students.forEach(student => {
            outputDiv.innerHTML += `
                <div class="student-item" onclick="viewStudentMetadata('${selectedDeptId}', '${selectedClassId}', '${student.id}')">
                    Roll No: ${student.rollNumber} - ${student.name} (${student.id})
                    (Chain Hash: <span class="block-hash">${student.currentHash.substring(0, 15)}...</span>)
                </div>
            `;
        });

        // Update the select dropdown
        updateSelect('selectStudent', students, 'id', 'name', 'Select Student');

    } catch (e) {
        displayOutput({ error: `Failed to fetch students for ${selectedClassId}.` }, true);
    }
}

async function addStudent() {
    const deptId = document.getElementById('selectDept').value;
    const classId = document.getElementById('selectClass').value;
    if (!deptId || !classId) return alert('Please select a Department and Class first.');

    const studentId = prompt("Enter Student ID (e.g., S01):");
    const name = prompt("Enter Student Name:");
    const rollNumber = prompt("Enter Roll Number (e.g., 1001):");

    if (!studentId || !name || !rollNumber) return;

    try {
        const response = await fetch(`${API_BASE}/departments/${deptId}/classes/${classId}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                studentId: studentId.toUpperCase(), 
                name, 
                rollNumber: parseInt(rollNumber) 
            })
        });
        const data = await response.json();
        displayOutput(data, !response.ok);
        if (response.ok) loadStudents(deptId, classId);
    } catch (e) {
        displayOutput({ error: 'Network error during student creation.' }, true);
    }
}

async function markAttendance() {
    const deptId = document.getElementById('selectDept').value;
    const classId = document.getElementById('selectClass').value;
    const studentId = document.getElementById('selectStudent').value;
    const status = document.getElementById('attendanceStatus').value;

    if (!deptId || !classId || !studentId || !status) return alert('Select Dept, Class, Student, and enter Status (Present/Absent/Leave).');

    try {
        const response = await fetch(`${API_BASE}/departments/${deptId}/classes/${classId}/students/${studentId}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        displayOutput(data, !response.ok);
    } catch (e) {
        displayOutput({ error: 'Network error during attendance marking.' }, true);
    }
}

async function viewAttendanceHistory() {
    const deptId = document.getElementById('selectDept').value;
    const classId = document.getElementById('selectClass').value;
    const studentId = document.getElementById('selectStudent').value;

    if (!deptId || !classId || !studentId) return alert('Select Dept, Class, and Student.');

    try {
        const response = await fetch(`${API_BASE}/departments/${deptId}/classes/${classId}/students/${studentId}/attendance`);
        const data = await response.json();

        if (response.ok) {
            let historyHtml = `<h2>Attendance History for ${studentId}</h2>`;
            data.history.forEach(block => {
                historyHtml += `
                    <div class="block-display">
                        <strong>Block #${block.index} (${block.date})</strong><br>
                        Status: <span style="color: ${block.status === 'Present' ? 'green' : (block.status === 'Absent' ? 'red' : 'orange')}">${block.status}</span><br>
                        Prev Hash: <span class="block-hash">${block.prev_hash.substring(0, 15)}...</span><br>
                        Hash: <span class="block-hash">${block.hash}</span>
                    </div>
                `;
            });
            outputDiv.innerHTML = historyHtml;
        } else {
            displayOutput(data, true);
        }
    } catch (e) {
        displayOutput({ error: 'Network error fetching history.' }, true);
    }
}

// --- SYSTEM VALIDATION ---

async function runValidation() {
    validationDiv.innerHTML = 'Running full system validation... This may take a moment due to PoW checks.';
    try {
        const response = await fetch(`${API_BASE}/validate`);
        const data = await response.json();
        
        // Color code the main status message
        const statusClass = data.status === 'VALID' ? 'success' : 'error';
        let output = `<p class="${statusClass}"><strong>${data.message}</strong></p>`;
        
        // Display the detailed report
        output += '<h3>Detailed Report:</h3>';
        output += `<pre>${JSON.stringify(data.report, null, 2)}</pre>`;
        
        validationDiv.innerHTML = output;
        
    } catch (e) {
        validationDiv.innerHTML = `<p class="error">Network error during validation check.</p>`;
    }
}

// Helper for viewing student metadata (can be expanded for update forms)
function viewStudentMetadata(deptId, classId, studentId) {
    // For simplicity, we can just show the details fetched earlier
    alert(`Viewing metadata for ${studentId}. Full CRUD (Update/Delete) functionality is available via API calls.`);
}