import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js"; // Import Firebase config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("csvFileInput");
    const uploadButton = document.getElementById("uploadButton");
    const studentList = document.getElementById("studentList");

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

    async function processCSV(csvText) {
        const rows = csvText.split("\n").map(row => row.trim()).filter(row => row);
        const students = {};

        rows.forEach((row, index) => {
            const columns = row.split(",").map(col => col.trim());
            if (index === 0 && columns[0].toLowerCase() === "period") {
                return; // Skip header row
            }
            if (columns.length !== 2) {
                alert(`Error in row ${index + 1}: Incorrect format.`);
                return;
            }

            const period = columns[0].trim();
            const firstName = columns[1].trim() || "Unknown";

            if (isNaN(period)) {
                alert(`Error in row ${index + 1}: Period must be a number.`);
                return;
            }

            if (!students[period]) students[period] = [];
            students[period].push({ firstName });
        });

        await saveStudentsToFirebase(students);
        loadStudentsFromFirebase(); // Reload after saving
    }

    async function saveStudentsToFirebase(students) {
        for (const period in students) {
            for (const student of students[period]) {
                await addDoc(collection(db, "students"), {
                    period: parseInt(period),
                    firstName: student.firstName
                });
            }
        }
    }

    async function loadStudentsFromFirebase() {
        const studentsSnapshot = await getDocs(collection(db, "students"));
        const students = {};

        studentsSnapshot.forEach((doc) => {
            const data = doc.data();
            if (!students[data.period]) {
                students[data.period] = [];
            }
            students[data.period].push({ firstName: data.firstName });
        });

        displayStudents(students);
    }

    function displayStudents(students) {
        studentList.innerHTML = "";
        for (const period in students) {
            const section = document.createElement("div");
            section.innerHTML = `<h3>Period ${period}</h3>`;
            const ul = document.createElement("ul");
            students[period].forEach(student => {
                const li = document.createElement("li");
                li.textContent = `${student.firstName}`;
                ul.appendChild(li);
            });
            section.appendChild(ul);
            studentList.appendChild(section);
        }
    }

    loadStudentsFromFirebase(); // Load students on page load
});
