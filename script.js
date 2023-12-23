window.addEventListener('load', function() {
    // Animate SVG here if needed

    // After a set time, hide the loader and show the main content
    setTimeout(function() {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('mainContent').style.opacity = 1;
    }, 3000); // Adjust time as needed
});

document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('mainContent');
    container.style.opacity = '1';
    container.style.transform = 'rotateX(0)';
});
