// Import Firebase SDKs & Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js"; // Import Firebase config from Netlify

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Now write your functions below

document.addEventListener("DOMContentLoaded", function () {
    const periodSelect = document.getElementById("periodSelect");
    const assignmentSelect = document.getElementById("assignmentSelect");
    const studentSelect = document.getElementById("studentSelect");
    const gradeInput = document.getElementById("gradeInput");
    const saveGradeButton = document.getElementById("saveGradeButton");

    let grades = JSON.parse(localStorage.getItem("grades")) || {};

    function loadPeriods() {
        const students = JSON.parse(localStorage.getItem("students")) || {};
        periodSelect.innerHTML = "<option value=''>Select Period</option>";

        if (Object.keys(students).length === 0) {
            periodSelect.innerHTML += "<option disabled>No periods available</option>";
            return;
        }

        for (const period in students) {
            const option = document.createElement("option");
            option.value = period;
            option.textContent = `Period ${period}`;
            periodSelect.appendChild(option);
        }
    }

    function loadAssignmentsForPeriod() {
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignmentSelect.innerHTML = "<option value=''>Select Assignment</option>";

        if (assignments.length === 0) {
            assignmentSelect.innerHTML += "<option disabled>No assignments available</option>";
            return;
        }

        assignments.forEach(assignment => {
            const option = document.createElement("option");
            option.value = assignment.name;
            option.textContent = `${assignment.name} (${assignment.points} pts)`;
            option.dataset.points = assignment.points;
            assignmentSelect.appendChild(option);
        });

        loadStudentsForAssignment();
    }

    function loadStudentsForAssignment() {
        const period = periodSelect.value;
        const assignment = assignmentSelect.value;
        const photos = JSON.parse(localStorage.getItem("photos")) || {};
        
        studentSelect.innerHTML = "<option value=''>Select Student</option>";

        if (!period || !assignment || !photos[period]) return;

        for (const student in photos[period]) {
            if (photos[period][student][assignment]) {
                const option = document.createElement("option");
                option.value = student;
                option.textContent = student;
                studentSelect.appendChild(option);
            }
        }

        if (studentSelect.children.length === 1) {
            studentSelect.innerHTML += "<option disabled>No students found</option>";
        }
    }

    function saveGrade() {
        const period = periodSelect.value;
        const assignment = assignmentSelect.value;
        const student = studentSelect.value;
        const grade = parseFloat(gradeInput.value);

        if (!period || !assignment || !student) {
            alert("Please select a period, assignment, and student.");
            return;
        }

        const maxPoints = parseInt(assignmentSelect.options[assignmentSelect.selectedIndex].dataset.points);
        if (isNaN(grade) || grade < 0 || grade > maxPoints) {
            alert(`Please enter a valid grade between 0 and ${maxPoints}.`);
            return;
        }

        if (!grades[period]) grades[period] = {};
        if (!grades[period][assignment]) grades[period][assignment] = {};
        grades[period][assignment][student] = grade;

        localStorage.setItem("grades", JSON.stringify(grades));
        alert(`Grade saved for ${student}: ${grade}/${maxPoints}`);
        gradeInput.value = "";
    }

    periodSelect.addEventListener("change", loadAssignmentsForPeriod);
    assignmentSelect.addEventListener("change", loadStudentsForAssignment);
    saveGradeButton.addEventListener("click", saveGrade);

    loadPeriods();
});
