const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7Yuzg6ej31z4u7O3pZCcaaxti8ybGsIhf4IE8IkZaZ6e0vtT7jRT-tz_SogoG7yLGYg/exec';

function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);

    // Get the project PDF file
    const projectFile = document.getElementById('projectFile').files[0];
    const paymentReceipt = document.getElementById('paymentReceipt').files[0];

    // Create a FileReader to read the files as Base64 strings
    const reader = new FileReader();
    reader.onloadend = function() {
        formData.set('projectFile', reader.result);
        formData.set('paymentReceipt', reader.result);

        const urlEncodedData = new URLSearchParams();
        formData.forEach((value, key) => {
            urlEncodedData.append(key, value);
        });

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: urlEncodedData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => response.json())
        .then(result => {
            if (result.result === 'success') {
                alert('Registration successful!');
                form.reset();
                updateMemberFields(); // Reset member fields to default
            } else {
                alert('There was an error with your registration. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error in registration.');
        });
    };

    reader.readAsDataURL(paymentReceipt);
    return false;
}

function updateMemberFields() {
    const numberOfMembers = document.getElementById('numberOfMembers').value;
    const teamMembersContainer = document.getElementById('teamMembersContainer');
    teamMembersContainer.innerHTML = '';

    for (let i = 2; i <= numberOfMembers; i++) {
        teamMembersContainer.innerHTML += `
            <div>
                <h3>Team Member ${i}</h3>
                <label for="teamMember${i}Name">Name:</label>
                <input type="text" id="teamMember${i}Name" name="teamMember${i}Name" required>

                <label for="teamMember${i}Email">Email:</label>
                <input type="email" id="teamMember${i}Email" name="teamMember${i}Email" required>

                <label for="teamMember${i}University">University Name:</label>
                <input type="text" id="teamMember${i}University" name="teamMember${i}University" required>

                <label for="teamMember${i}CurrentYear">Current Year:</label>
                <input type="text" id="teamMember${i}CurrentYear" name="teamMember${i}CurrentYear" required>

                <label for="teamMember${i}FieldOfStudy">Field of Study:</label>
                <input type="text" id="teamMember${i}FieldOfStudy" name="teamMember${i}FieldOfStudy" required>

                <label for="teamMember${i}RollNo">Student Roll No:</label>
                <input type="text" id="teamMember${i}RollNo" name="teamMember${i}RollNo" required>
            </div>
        `;
    }
}

// Event listeners
document.getElementById('numberOfMembers').addEventListener('input', updateMemberFields);
document.getElementById('registrationForm').addEventListener('submit', handleSubmit);
