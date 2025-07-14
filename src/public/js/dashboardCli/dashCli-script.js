import {
  cargarProductos,
  cargarPedidos,
  renderizarUltimoPedido,
  renderizarListaPedidos,
  filtrar,
  mostrarResultados,
  pedidos_realizados,
  agregar,
  enviarPedido
} from "./components/funciones.js";





// ./components/funciones.js
// 💡 Función debounce para evitar búsquedas innecesarias mientras el usuario escribe
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
  const productosData = await cargarProductos("./js/dashboardCli/productos.json");
  const pedidosData = await cargarPedidos("./js/dashboardCli/compras.json");

  const last_order = document.getElementById("last_order");
  const list_order = document.getElementById("list_order_table");
  const search = document.getElementById("busqueda");
  const results = document.getElementById("resultados");
  const factura = document.getElementById("tabla_pedidos");

  renderizarUltimoPedido(pedidosData, last_order);
  renderizarListaPedidos(pedidosData, list_order);

  search.addEventListener("input", debounce(() => {
    const text = search.value.trim();
    mostrarResultados(text, filtrar(text, productosData), results, agregar);
  }, 300)); 


  search.addEventListener("focus", () => {
    const text = search.value.trim();
    mostrarResultados(text, filtrar(text, productosData), results, agregar);
  });

  document.addEventListener("click", (e) => {
    if (!results.contains(e.target) && !search.contains(e.target)) {
      results.classList.remove("visible");
    }
  });

  document.getElementById("btn-confirmar").addEventListener("click", () => {
    factura.innerHTML = "";
    last_order.innerHTML = "<h1>Ultimo pedido: </h1>";

    const pedidosCompletos = [...pedidosData, ...pedidos_realizados];

    renderizarUltimoPedido(pedidosCompletos, last_order);
    renderizarListaPedidos(pedidosCompletos, list_order);
    enviarPedido();
  });
  
});



