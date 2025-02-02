document.addEventListener("DOMContentLoaded", function () {
    const assignmentInput = document.getElementById("assignmentName");
    const notesInput = document.getElementById("assignmentNotes");
    const addAssignmentButton = document.getElementById("addAssignmentButton");
    const assignmentList = document.getElementById("assignmentList");
    
    // Load existing assignments from local storage
    function loadAssignments() {
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignmentList.innerHTML = "";
        assignments.forEach((assignment, index) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${assignment.name}</strong><br>${assignment.notes}
                            <button onclick="deleteAssignment(${index})">❌ Delete</button>`;
            assignmentList.appendChild(li);
        });
    }
    
    // Add assignment to local storage
    addAssignmentButton.addEventListener("click", function () {
        const name = assignmentInput.value.trim();
        const notes = notesInput.value.trim();
        if (name === "") {
            alert("Assignment name cannot be empty.");
            return;
        }
        
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignments.push({ name, notes });
        localStorage.setItem("assignments", JSON.stringify(assignments));
        
        assignmentInput.value = "";
        notesInput.value = "";
        loadAssignments();
    });
    
    // Delete assignment
    window.deleteAssignment = function (index) {
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignments.splice(index, 1);
        localStorage.setItem("assignments", JSON.stringify(assignments));
        loadAssignments();
    };
    
    // Initialize
    loadAssignments();
});

