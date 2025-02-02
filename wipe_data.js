document.addEventListener("DOMContentLoaded", function () {
    const wipeButton = document.getElementById("wipeButton");

    if (wipeButton) {
        wipeButton.addEventListener("click", function () {
            if (confirm("Are you sure you want to wipe all student data? This action cannot be undone.")) {
                localStorage.removeItem("students");
                document.getElementById("studentList").innerHTML = "";
                alert("All student data has been wiped.");
            }
        });
    }
});
