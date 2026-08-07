const menuToggle = document.getElementById('menu-toggle');
const menuLinks = document.getElementById('menu-links');

menuToggle.addEventListener('click', () => {
  menuLinks.classList.toggle('opacity-0');
  menuLinks.classList.toggle('-translate-y-4');
  menuLinks.classList.toggle('pointer-events-none');
});

const links = menuLinks.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('click', () => {
    menuLinks.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
  });
});