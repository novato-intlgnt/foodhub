  const toggleBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  toggleBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
  });