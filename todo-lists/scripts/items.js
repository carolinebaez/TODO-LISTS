
document.addEventListener("DOMContentLoaded", function() {
  let listItems = Array.from(document.querySelectorAll('.control__container ul li'));

  listItems.forEach(function(item) {
    item.addEventListener("click", function() {
      // Reiniciar todos los elementos de la lista
      listItems.forEach(function(item) {
        item.classList.remove('active');
      });

      // Establecer el elemento seleccionado en azul
      this.classList.add('active');

      // Guardar el índice del elemento seleccionado en el almacenamiento local
      let activeIndex = listItems.indexOf(this);
      localStorage.setItem('activeIndex', activeIndex.toString());
    });
  });

  // Recuperar el índice del elemento activo guardado en el almacenamiento local al cargar la página
  let activeIndex = localStorage.getItem('activeIndex');
  if (activeIndex !== null) {
    listItems.forEach(function(item) {
      item.classList.remove('active');
    });

    // Establecer el elemento guardado como activo
    let activeElement = listItems[parseInt(activeIndex)];
    if (activeElement) {
      activeElement.classList.add('active');
    }
  }
});
