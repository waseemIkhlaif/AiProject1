document.getElementById('optimizeButton').addEventListener('click', async () => {
    const response = await fetch('/api/vrp/optimize');
    const result = await response.json();
    document.getElementById('result').innerText = JSON.stringify(result, null, 2);
});


document.getElementById('deliveryPointForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        location: document.getElementById('location').value,
        demand: document.getElementById('demand').value,
        x: parseFloat(document.getElementById('x').value),
        y: parseFloat(document.getElementById('y').value)
    };

    try {
        const response = await fetch('/api/vrp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('response').textContent = `Success: Added Data`;
        } else {
            document.getElementById('response').textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        document.getElementById('response').textContent = `Error: ${error.message}`;
    }
});