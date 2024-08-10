function updateMemberFields() {
    const numberOfMembers = document.getElementById("numberOfMembers").value;
    const teamMembersContainer = document.getElementById("teamMembersContainer");
    
    teamMembersContainer.innerHTML = "";  // Clear previous input fields
    
    for (let i = 2; i <= numberOfMembers; i++) {  // Start from 2 since Team Head is member 1
        const memberDiv = document.createElement("div");
        memberDiv.className = "team-member";

        memberDiv.innerHTML = `
            <h4>Team Member ${i} Information</h4>
            <label for="memberName${i}">Name:</label>
            <input type="text" id="memberName${i}" name="memberName${i}" required>
            
            <label for="memberUniversity${i}">University Name:</label>
            <input type="text" id="memberUniversity${i}" name="memberUniversity${i}" required>
            
            <label for="memberCurrentYear${i}">Current Year:</label>
            <input type="text" id="memberCurrentYear${i}" name="memberCurrentYear${i}" required>
            
            <label for="memberFieldOfStudy${i}">Field of Study:</label>
            <input type="text" id="memberFieldOfStudy${i}" name="memberFieldOfStudy${i}" required>
            
            <label for="memberStudentRollNo${i}">Student Roll No:</label>
            <input type="text" id="memberStudentRollNo${i}" name="memberStudentRollNo${i}" required>
        `;

        teamMembersContainer.appendChild(memberDiv);
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("registrationForm");
    const formData = new FormData(form);

    // Convert files to base64 and append with other required fields
    const projectFileInput = document.getElementById("projectFile").files[0];
    const paymentReceiptInput = document.getElementById("paymentReceipt").files[0];

    function readFileAsBase64(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64File = e.target.result.split(',')[1]; // Remove the "data:*/*;base64," prefix
            callback(base64File, file.type, file.name);
        };
        reader.readAsDataURL(file);
    }

    if (projectFileInput) {
        readFileAsBase64(projectFileInput, (base64File, mimeType, fileName) => {
            formData.append("projectFile", base64File);
            formData.append("projectFileMimeType", mimeType);
            formData.append("projectFileFileName", fileName);
        });
    }

    if (paymentReceiptInput) {
        readFileAsBase64(paymentReceiptInput, (base64File, mimeType, fileName) => {
            formData.append("paymentReceipt", base64File);
            formData.append("paymentReceiptMimeType", mimeType);
            formData.append("paymentReceiptFileName", fileName);
        });
    }

    // Collect team members' data
    const numberOfMembers = document.getElementById("numberOfMembers").value;
    for (let i = 2; i <= numberOfMembers; i++) {
        formData.append(`memberName${i}`, document.getElementById(`memberName${i}`).value);
        formData.append(`memberUniversity${i}`, document.getElementById(`memberUniversity${i}`).value);
        formData.append(`memberCurrentYear${i}`, document.getElementById(`memberCurrentYear${i}`).value);
        formData.append(`memberFieldOfStudy${i}`, document.getElementById(`memberFieldOfStudy${i}`).value);
        formData.append(`memberStudentRollNo${i}`, document.getElementById(`memberStudentRollNo${i}`).value);
    }

    setTimeout(() => {
        fetch("https://script.google.com/macros/s/AKfycbwMHnF8a39ZNSsCaPUt6s1dXxRYCf3IHusKtfsva47wgFqhgiPGAJYxYlh9g85158_8Kg/exec", {
            method: "POST",
            body: formData,
            mode: "cors"
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Registration successful!");
            form.reset(); // Reset the form
        })
        .catch(error => {
            console.error(error);
            alert("An error occurred during registration.");
        });
    }, 1000); // Adjust timeout as needed
}
