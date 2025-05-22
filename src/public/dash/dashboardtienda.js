document.addEventListener('DOMContentLoaded', () => {
  const agregarBtn = document.querySelector('.btn-secondary');
  const guardarBtn = document.querySelector('.btn-primary');
  const tbody = document.querySelector('table tbody');

  const [inputProducto, inputCantidad, inputPrecio, inputTotal] = document.querySelectorAll('.product-inputs input');


  inputCantidad.addEventListener('input', calcularTotal);
  inputPrecio.addEventListener('input', calcularTotal);

  function calcularTotal() {
    const cantidad = parseFloat(inputCantidad.value) || 0;
    const precio = parseFloat(inputPrecio.value) || 0;
    inputTotal.value = (cantidad * precio).toFixed(2);
  }

  agregarBtn.addEventListener('click', () => {
    const producto = inputProducto.value.trim();
    const cantidad = parseFloat(inputCantidad.value);
    const precio = parseFloat(inputPrecio.value);
    const total = parseFloat(inputTotal.value);

    if (!producto || isNaN(cantidad) || isNaN(precio)) {
      alert("Por favor completa todos los campos del producto.");
      return;
    }

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto}</td>
      <td>${cantidad}</td>
      <td>${precio.toFixed(2)}</td>
      <td>${total.toFixed(2)}</td>
    `;
    tbody.appendChild(fila);


    inputProducto.value = '';
    inputCantidad.value = '';
    inputPrecio.value = '';
    inputTotal.value = '';
  });

  guardarBtn.addEventListener('click', () => {
    alert("Datos guardados.");
  });
});
