document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');

    function addPoint(x, y) {
        const point = document.createElement('div');
        point.style.position = 'absolute';
        point.style.width = '10px';
        point.style.height = '10px';
        point.style.backgroundColor = 'red';
        point.style.borderRadius = '50%';
        point.style.left = `calc(${x}% + 30px)`;
        point.style.bottom = `calc(${y}% + 10px)`;
        gridContainer.appendChild(point);
    }

    addPoint(50, 50);
});
