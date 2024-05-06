function changePage(page) {
    var content = document.getElementById('content');
    switch(page) {
      case 'home':
        content.innerHTML = '<h1>Welcome to the Home Page</h1><p>This is the content of the home page.</p>';
        break;
      case 'about':
        content.innerHTML = '<h1>About Us</h1><p>Learn more about our company.</p>';
        break;
      case 'services':
        content.innerHTML = '<h1>Our Services</h1><p>Explore the services we offer.</p>';
        break;
      case 'contact':
        content.innerHTML = '<h1>Contact Us</h1><p>Get in touch with us.</p>';
        break;
      default:
        content.innerHTML = '<h1>Welcome to the Home Page</h1><p>This is the content of the home page.</p>';
    }
  }
  function toggleMenu() {
    var menu = document.getElementById('menu');
    if (menu.style.left === '-350px') {
      menu.style.left = '0';
    } else {
      menu.style.left = '-350px';
    }
  }