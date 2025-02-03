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
    const studentSelect = document.getElementById("studentSelect");
    const assignmentSelect = document.getElementById("assignmentSelect");
    const startCameraButton = document.getElementById("startCameraButton");
    const captureButton = document.getElementById("captureButton");
    const cameraPreview = document.getElementById("cameraPreview");
    const photoGallery = document.getElementById("photoGallery");

    let stream = null;
    let photos = JSON.parse(localStorage.getItem("photos")) || {};

    function loadPeriods() {
        const students = JSON.parse(localStorage.getItem("students")) || {};
        periodSelect.innerHTML = "<option value=''>Select Period</option>";
        for (const period in students) {
            const option = document.createElement("option");
            option.value = period;
            option.textContent = `Period ${period}`;
            periodSelect.appendChild(option);
        }
    }

    function loadStudentsForPeriod() {
        const students = JSON.parse(localStorage.getItem("students")) || {};
        studentSelect.innerHTML = "<option value=''>Select Student</option>";
        const selectedPeriod = periodSelect.value;
        if (students[selectedPeriod]) {
            students[selectedPeriod].forEach(student => {
                const option = document.createElement("option");
                option.value = student.firstName;
                option.textContent = student.firstName;
                studentSelect.appendChild(option);
            });
        }
    }

    function loadAssignments() {
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignmentSelect.innerHTML = "<option value=''>Select Assignment</option>";
        assignments.forEach(assignment => {
            const option = document.createElement("option");
            option.value = assignment.name;
            option.textContent = assignment.name;
            assignmentSelect.appendChild(option);
        });
    }

    startCameraButton.addEventListener("click", async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            cameraPreview.srcObject = stream;
            captureButton.disabled = false;
        } catch (error) {
            alert("Error accessing camera: " + error.message);
        }
    });

    captureButton.addEventListener("click", () => {
        if (!studentSelect.value || !assignmentSelect.value) {
            alert("Please select a student and assignment before capturing a photo.");
            return;
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;
        context.drawImage(cameraPreview, 0, 0);
        const photoData = canvas.toDataURL("image/jpeg");

        const period = periodSelect.value;
        const studentName = studentSelect.value;
        const assignment = assignmentSelect.value;

        if (!photos[period]) photos[period] = {};
        if (!photos[period][studentName]) photos[period][studentName] = {};
        if (!photos[period][studentName][assignment]) photos[period][studentName][assignment] = [];

        photos[period][studentName][assignment].push(photoData);
        localStorage.setItem("photos", JSON.stringify(photos));
        displayPhotos();
    });

    function displayPhotos() {
        photoGallery.innerHTML = "";
        for (const period in photos) {
            for (const student in photos[period]) {
                for (const assignment in photos[period][student]) {
                    photos[period][student][assignment].forEach((photo, index) => {
                        const img = document.createElement("img");
                        img.src = photo;
                        img.width = 100;
                        img.height = 100;
                        img.style.margin = "5px";
                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "❌";
                        deleteButton.onclick = () => deletePhoto(period, student, assignment, index);
                        const div = document.createElement("div");
                        div.appendChild(img);
                        div.appendChild(deleteButton);
                        photoGallery.appendChild(div);
                    });
                }
            }
        }
    }

    function deletePhoto(period, student, assignment, index) {
        photos[period][student][assignment].splice(index, 1);
        if (photos[period][student][assignment].length === 0) {
            delete photos[period][student][assignment];
        }
        localStorage.setItem("photos", JSON.stringify(photos));
        displayPhotos();
    }

    periodSelect.addEventListener("change", loadStudentsForPeriod);
    loadPeriods();
    loadAssignments();
    displayPhotos();
});
