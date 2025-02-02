document.addEventListener("DOMContentLoaded", function () {
    const assignmentInput = document.getElementById("assignmentName");
    const pointsInput = document.getElementById("assignmentPoints");
    const notesInput = document.getElementById("assignmentNotes");
    const addAssignmentButton = document.getElementById("addAssignmentButton");
    const assignmentList = document.getElementById("assignmentList");

    function loadAssignments() {
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignmentList.innerHTML = "";
        assignments.forEach((assignment, index) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${assignment.name}</strong> - <b>${assignment.points} pts</b><br>
                            <i>${assignment.notes}</i><br>
                            <button onclick="deleteAssignment(${index})">❌ Delete</button>`;
            assignmentList.appendChild(li);
        });
    }

    addAssignmentButton.addEventListener("click", function () {
        const name = assignmentInput.value.trim();
        const points = pointsInput.value.trim();
        const notes = notesInput.value.trim();

        if (name === "") {
            alert("Assignment name cannot be empty.");
            return;
        }

        if (!points || isNaN(points) || points < 1) {
            alert("Please enter a valid number of points.");
            return;
        }

        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignments.push({ name, points, notes });
        localStorage.setItem("assignments", JSON.stringify(assignments));

        assignmentInput.value = "";
        pointsInput.value = "";
        notesInput.value = "";
        loadAssignments();
    });

    window.deleteAssignment = function (index) {
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignments.splice(index, 1);
        localStorage.setItem("assignments", JSON.stringify(assignments));
        loadAssignments();
    };

    loadAssignments();
});
