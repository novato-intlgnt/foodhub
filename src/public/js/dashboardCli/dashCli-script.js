import {
  cargarProductos,
  cargarPedidos,
  renderizarUltimoPedido,
  renderizarListaPedidos,
  filtrar,
  mostrarResultados,
  pedidos_realizados,
  pedidos,
  productos,
  agregar,
  enviarPedido,
  renderizarListaPedidos_std,
  renderizarNumEstado,
} from "/src/public/js/dashboardCli/components/funciones.js";



// Función debounce para evitar búsquedas innecesarias mientras el usuario escribe
function debounce(callback, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const pedidosData = await cargarPedidos("/src/public/js/dashboardCli/compras.json");
  const last_order = document.getElementById("last_order");
  const list_order = document.getElementById("list_order_table");
  const search = document.getElementById("busqueda");
  const results = document.getElementById("resultados");
  const factura = document.getElementById("tabla_pedidos");
  const std_pedidos = document.getElementById("contenido_std")

  //FUNCION ENCARGADA DE CARGAR LOS PENDIENTES(ESTADOS DE CADA PEDIDO) 
  //EN ESTE CASO 0 ---> MAS ADELANTE SE ACTUALIZA O SE VUEVE ACTUALIZAR
  // EN LA FUNCION DE MOSTRAR PEDIDO SE SUMA CADA PENDIENTE
  // SE RESTA EN LAFUCNION ED VER QUE ESTADO PASA ---> actualizarEstadoBolid
  renderizarNumEstado();
    
  
  renderizarUltimoPedido(pedidosData, last_order);
  renderizarListaPedidos(pedidosData, list_order);

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CARGAR CATEGORIA <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<{
  const productosData = await cargarProductos("/src/public/js/dashboardCli/productos.json");
  const categoriaSelect = document.getElementById("categoriaSelect");
  let categoriaSeleccionada = null;

  //  Cargar y mostrar categorías en el select
  const categoriasData = await fetch("/src/public/js/dashboardCli/categorias.json").then(r => r.json());
  categoriasData.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.category_id;
    option.textContent = cat.name;
    categoriaSelect.appendChild(option);
  });

  //  Cuando se cambia la categoría
  categoriaSelect.addEventListener("change", () => {
    const id = parseInt(categoriaSelect.value);
    categoriaSeleccionada = categoriasData.find(c => c.category_id === id) || null;
    const text = search.value.trim();
    mostrarResultados(text, filtrar(text, productosData, categoriaSeleccionada), results, agregar);
  });

  //  Búsqueda por texto + categoría
  search.addEventListener("input", debounce(() => {
    const text = search.value.trim();
    mostrarResultados(text, filtrar(text, productosData, categoriaSeleccionada), results, agregar);
  }, 300));

  search.addEventListener("focus", () => {
    const text = search.value.trim();
    mostrarResultados(text, filtrar(text, productosData, categoriaSeleccionada), results, agregar);
  });



  document.getElementById("btn-pagar").addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
  });

  document.getElementById("btn-confirmar").addEventListener("click", () => {
    // Ocultar modal y factura
    const modal = document.getElementById("modal");
    modal.style.display = "none";

    
    // Limpiar tabla visual
    const tbody = document.getElementById("tabla_pedidos");
    tbody.innerHTML = "";
    
    // Actualizar visual
    last_order.innerHTML = "<h1>Ultimo pedido: </h1>";
    const pedidosCompletos = [...pedidosData, ...pedidos_realizados];
    renderizarUltimoPedido(pedidosCompletos, last_order);
    renderizarListaPedidos(pedidosCompletos, list_order);
    renderizarListaPedidos_std(pedidos_realizados ,std_pedidos );

    renderizarNumEstado();
    
    // Enviar y limpiar datos
    enviarPedido();
    pedidos_realizados.length = 0;
    pedidos.length = 0;
    
    alert("¡Pedido confirmado!");
  });


});
