import {
  cargarPedidos,
  renderizarUltimoPedido,
  renderizarListaPedidos,
  mostrarResultados,
  pedidos_realizados,
  agregar,
  enviarPedido
} from "/js/dashboardCli/components/funciones.js";


const url = window.location.origin

const productsData = {};
const productsOrder = {};
const categoriesMap = new Map();
const categoriaSelect = document.getElementById("categoriaSelect");
const search = document.getElementById("busqueda");

const last_order = document.getElementById("last_order");
const list_order = document.getElementById("list_order_table");
const results = document.getElementById("resultados");
const factura = document.getElementById("tabla_pedidos");

function debounce(callback, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

document.addEventListener('DOMContentLoaded', async () => {
 const { data: categoryData } = await fetch(`${url}/client/categories`, {
    method: 'GET',
  }).then(res => res.json())

  categoriesMap.clear();
  categoryData.forEach(cat => {
    categoriesMap.set(cat.categoryId, cat.name);
    const option = document.createElement("option");
    option.value = cat.categoryId;
    option.textContent = cat.name;
    categoriaSelect.appendChild(option);
  });

  document.getElementById("btn-pagar").addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
  });

  document.getElementById("btn-confirmar").addEventListener("click", () => {
    // Ocultar modal y factura
    const modal = document.getElementById("modal");
    const payMethod = document.querySelector('input[name="metodo"]:checked').value;

    modal.style.display = "none";
    factura.style.display = "none";
    
    // Limpiar tabla visual
    const tbody = document.getElementById("tabla_pedidos");
    tbody.innerHTML = "";
    
    // Actualizar visual
    last_order.innerHTML = "<h1>Ultimo pedido: </h1>";
    // const pedidosCompletos = [...pedidosData, ...pedidos_realizados];
    // renderizarUltimoPedido(pedidosCompletos, last_order);
    // renderizarListaPedidos(pedidosCompletos, list_order);
    
    // Enviar y limpiar datos
    enviarPedido(payMethod);
    pedidos_realizados.length = 0;
    pedidos.length = 0;
    
    alert("¡Pedido confirmado!");
  });
});


//  Búsqueda por texto + categoría
search.addEventListener("input", debounce(async () => {
  const text = search.value.trim();
  const id = parseInt(categoriaSelect.value);

  const { data: productsList } = await fetch(`${url}/client/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      categoryId: id,
      str: text
    })
  }).then(res => res.json())
  console.log(productsList)
  mostrarResultados(text, productsList, results, agregar);
}, 300));

  

renderizarUltimoPedido(pedidosData, last_order);
renderizarListaPedidos(pedidosData, list_order);


socket.emit('join:clients')
socket.on('client:new-order', (info) => {
  console.log(info.message);
});
