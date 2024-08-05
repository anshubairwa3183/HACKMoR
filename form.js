const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7Yuzg6ej31z4u7O3pZCcaaxti8ybGsIhf4IE8IkZaZ6e0vtT7jRT-tz_SogoG7yLGYg/exec';

function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);

    // Get the payment receipt file
    const paymentReceipt = document.getElementById('paymentReceipt').files[0];

    // Create a FileReader to read the file as a Base64 string
    const reader = new FileReader();
    reader.onloadend = function() {
        // Set the Base64 string in the form data
        formData.set('paymentReceipt', reader.result);

        // Prepare the URL-encoded data
        const urlEncodedData = new URLSearchParams();
        formData.forEach((value, key) => {
            urlEncodedData.append(key, value);
        });

        // Send the form data to the Google Apps Script
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

    // Read the file as a Base64 string
    reader.readAsDataURL(paymentReceipt);
    return false;
}

function updateMemberFields() {
    const numberOfMembers = document.getElementById('numberOfMembers').value;
    const memberDetailsContainer = document.getElementById('memberDetailsContainer');
    memberDetailsContainer.innerHTML = ''; // Clear existing fields

    for (let i = 2; i <= numberOfMembers; i++) { // Start from 2 because 1 is the team head
        memberDetailsContainer.innerHTML += `
            <div>
                <h3>Team Member ${i}</h3>
                <label for="teamMember${i}Name">Name:</label>
                <input type="text" id="teamMember${i}Name" name="teamMember${i}Name" required>

                <label for="teamMember${i}Email">Email:</label>
                <input type="email" id="teamMember${i}Email" name="teamMember${i}Email" required>

                <label for="teamMember${i}College">College:</label>
                <input type="text" id="teamMember${i}College" name="teamMember${i}College" required>

                <label for="teamMember${i}Phone">Phone:</label>
                <input type="tel" id="teamMember${i}Phone" name="teamMember${i}Phone" required>
            </div>
        `;
    }
}

// Event listeners
document.getElementById('numberOfMembers').addEventListener('input', updateMemberFields);
document.getElementById('registrationForm').addEventListener('submit', handleSubmit);
