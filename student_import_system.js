document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("csvFileInput");
    const uploadButton = document.getElementById("uploadButton");
    const studentList = document.getElementById("studentList");
    const addStudentButton = document.getElementById("addStudentButton");
    const periodInput = document.getElementById("periodInput");
    const firstNameInput = document.getElementById("firstNameInput");
    const lastNameInput = document.getElementById("lastNameInput");
    const wipeButton = document.getElementById("wipeButton");

    uploadButton.addEventListener("click", function () {
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a CSV file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            processCSV(text);
        };
        reader.readAsText(file);
    });

    addStudentButton.addEventListener("click", function () {
        const period = periodInput.value.trim();
        const firstName = firstNameInput.value.trim() || "Unknown";
        const lastName = lastNameInput.value.trim() || "Unknown";

        if (!period || isNaN(period)) {
            alert("Please enter a valid numeric period.");
            return;
        }

        const students = JSON.parse(localStorage.getItem("students")) || {};
        if (!students[period]) {
            students[period] = [];
        }

        students[period].push({ period: period, firstName: firstName, lastName: lastName });
        students[period].sort((a, b) => a.lastName.localeCompare(b.lastName));
        localStorage.setItem("students", JSON.stringify(students));
        displayStudents(students);
    });

    function processCSV(csvText) {
        const rows = csvText.split("\n").map(row => row.trim()).filter(row => row);
        const students = [];

        rows.forEach((row, index) => {
            const columns = row.split(",").map(col => col.trim());
            if (index === 0 && columns[0].toLowerCase() === "period") {
                return; // Skip header row
            }
            if (columns.length !== 3) {
                alert(`Error in row ${index + 1}: Incorrect format.`);
                return;
            }

            const period = columns[0].trim();
            const firstName = columns[1].replace(/"/g, "").trim() || "Unknown";
            const lastName = columns[2].replace(/"/g, "").trim() || "Unknown";

            if (isNaN(period)) {
                alert(`Error in row ${index + 1}: Period must be a number.`);
                return;
            }

            students.push({ period: period, firstName: firstName, lastName: lastName });
        });

        students.sort((a, b) => a.lastName.localeCompare(b.lastName));

        const groupedStudents = {};
        students.forEach(student => {
            if (!groupedStudents[student.period]) {
                groupedStudents[student.period] = [];
            }
            groupedStudents[student.period].push(student);
        });

        localStorage.setItem("students", JSON.stringify(groupedStudents));
        displayStudents(groupedStudents);
    }

    function displayStudents(groupedStudents) {
        studentList.innerHTML = "";
        for (const period in groupedStudents) {
            const section = document.createElement("div");
            section.innerHTML = `<h3>Period ${period}</h3>`;
            const ul = document.createElement("ul");
            groupedStudents[period].forEach(student => {
                const li = document.createElement("li");
                li.textContent = `${student.lastName}, ${student.firstName}`;
                ul.appendChild(li);
            });
            section.appendChild(ul);
            studentList.appendChild(section);
        }
    }

    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
        displayStudents(JSON.parse(savedStudents));
    }
});
