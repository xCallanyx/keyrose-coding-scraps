document.addEventListener("DOMContentLoaded", function () {
    const studentSelect = document.getElementById("studentSelect");
    const assignmentSelect = document.getElementById("assignmentSelect");
    const startCameraButton = document.getElementById("startCameraButton");
    const captureButton = document.getElementById("captureButton");
    const cameraPreview = document.getElementById("cameraPreview");
    const photoGallery = document.getElementById("photoGallery");
    const exportByPeriodButton = document.getElementById("exportByPeriod");
    const exportByAssignmentButton = document.getElementById("exportByAssignment");
    
    let stream = null;
    let photos = JSON.parse(localStorage.getItem("photos")) || {};

    function loadStudentsAndAssignments() {
        const students = JSON.parse(localStorage.getItem("students")) || {};
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        
        studentSelect.innerHTML = "<option value=''>Select Student</option>";
        assignmentSelect.innerHTML = "<option value=''>Select Assignment</option>";
        
        for (const period in students) {
            students[period].forEach(student => {
                const option = document.createElement("option");
                option.value = `${period}-${student.firstName} ${student.lastName}`;
                option.textContent = `${student.lastName}, ${student.firstName} (Period ${period})`;
                studentSelect.appendChild(option);
            });
        }
        
        assignments.forEach(assignment => {
            const option = document.createElement("option");
            option.value = assignment.name;
            option.textContent = assignment.name;
            assignmentSelect.appendChild(option);
        });
    }
    
    startCameraButton.addEventListener("click", async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
        
        const [period, studentName] = studentSelect.value.split("-");
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
    
    loadStudentsAndAssignments();
    displayPhotos();
});
