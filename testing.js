// Function to handle navigation
function navigate(path) {
    history.pushState(null, null, path);
    loadContent(path);
}

// Function to load content based on the current path
function loadContent(path) {
    const content = document.getElementById('content');
    switch (path) {
        case '/home':
            content.innerHTML = '<h1>Home</h1><p>Welcome to the Home page!</p>';
            break;
        case '/about':
            content.innerHTML = '<h1>About</h1><p>This is the About page.</p>';
            break;
        case '/contact':
            content.innerHTML = '<h1>Contact</h1><p>Get in touch with us!</p>';
            break;
        default:
            content.innerHTML = '<h1>404</h1><p>Page not found.</p>';
            break;
    }
}

// Event listener to handle the back/forward buttons
window.addEventListener('popstate', () => {
    loadContent(location.pathname);
});

// Initial content load based on the current URL
document.addEventListener('DOMContentLoaded', () => {
    loadContent(location.pathname);
});
