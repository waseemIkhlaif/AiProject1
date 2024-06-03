document.getElementById('optimizeButton').addEventListener('click', async () => {
    const response = await fetch('/api/vrp/optimize');
    const result = await response.json();
    document.getElementById('result').innerText = JSON.stringify(result, null, 2);
});
