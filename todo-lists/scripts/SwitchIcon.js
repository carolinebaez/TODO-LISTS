const moonIcon = document.getElementById('moon');
const sunIcon = document.getElementById('sun');
const bodyElement = document.body;

// Obtener el tema guardado en el local storage, si existe
const savedTheme = localStorage.getItem('theme');

moonIcon.addEventListener('click', () => {
  bodyElement.classList.remove('light-theme');
  bodyElement.classList.add('dark-theme');
  switchToDarkMode();
  localStorage.setItem('theme', 'dark'); // Guardar el tema 'dark' en el local storage
});

sunIcon.addEventListener('click', () => {
  bodyElement.classList.remove('dark-theme');
  bodyElement.classList.add('light-theme');
  switchToLightMode();
  localStorage.setItem('theme', 'light'); // Guardar el tema 'light' en el local storage
});

// Verificar el tema guardado y aplicarlo al cargar la página
if (savedTheme === 'dark') {
  switchToDarkMode();
} else {
  switchToLightMode();
}

function changeTheme(theme) {
  if (theme === 'dark') {
    bodyElement.classList.remove('light-theme');
    bodyElement.classList.add('dark-theme');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'inline';
  } else if (theme === 'light') {
    bodyElement.classList.remove('dark-theme');
    bodyElement.classList.add('light-theme');
    moonIcon.style.display = 'inline';
    sunIcon.style.display = 'none';
  }
}

function switchToDarkMode() {
  changeTheme('dark');
}

function switchToLightMode() {
  changeTheme('light');
}
