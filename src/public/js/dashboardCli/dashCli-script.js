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
} from "/js/dashboardCli/components/funciones.js";

const socket = io()

document.addEventListener("DOMContentLoaded", async () => {
  const productosData = await cargarProductos("/js/dashboardCli/productos.json");
  const pedidosData = await cargarPedidos("/js/dashboardCli/compras.json");

  const last_order = document.getElementById("last_order");
  const list_order = document.getElementById("list_order_table");
  const search = document.getElementById("busqueda");
  const results = document.getElementById("resultados");
  const factura = document.getElementById("tabla_pedidos");

  renderizarUltimoPedido(pedidosData, last_order);
  renderizarListaPedidos(pedidosData, list_order);

  search.addEventListener("input", () => {
    const text = search.value.trim();
    mostrarResultados(text, filtrar(text, productosData), results, agregar);
  });

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

socket.emit('join:clients')
socket.on('client:new-order', (info) => {
  console.log(info.message);
});















// import { createNavbar } from "./components/navbar.js";
// import { createCard, createCard_1 } from "./components/card.js";

// document.addEventListener("DOMContentLoaded", () => {
//   // Generar el navbar
//   document.body.prepend(createNavbar());

//   // Cuerpo del main principal
//   const contenedor = document.getElementById("contenedor-cartas");
//   const zonaCartas = document.getElementById("zona-cartas"); // NUEVO: solo para las cartas
//   const movimientos = document.querySelector(".movimientos");
//   const toggleBtn = document.getElementById("toggleMovimientos");
//   const lista = document.getElementById("listaMovimientos");

//  // ESTA PARTE SE VEA EL PEDIDO ULTIMO QUE REALIZODO
//  // CON FETCH A COMPRAS.JSON , OBTENGO ARRAY Y SOLO IMPRIMO EL PRIMERO MODIFICAND CARDA 


//   // Creación de una carta inicial

//   const nuevaCarta = createCard();

//   zonaCartas.appendChild(nuevaCarta);

//   const cartasOriginales = zonaCartas.innerHTML; // Guardar las cartas iniciales




//   // Lógica del botón de movimientos
//   let visible = false;
//   toggleBtn.addEventListener("click", () => {
//     visible = !visible;
//     lista.style.display = visible ? "block" : "none";
//     toggleBtn.textContent = visible ? "Ocultar movimientos" : "Mostrar movimientos";
//   });

//   // Cargar compras.json y generar la lista de movimientos
//   fetch("/js/dashboardCli/compras.json")
//     .then(res => res.json())
//     .then(data => {
//       data.forEach(compra => {
//         const item = document.createElement("div");
//         item.innerHTML = `
//           <div>
//             <p id="producto"><strong>${compra.producto}</strong></p>
//             <p id="precio">S/${compra.precio.toFixed(2)}</p>
//           </div>
//           <div id="fecha"><p>${compra.fecha}</p></div><hr>
//         `;
//         lista.appendChild(item);
//       });
//     })
//     .catch(err => console.error("Error al cargar compras:", err));

//   // Buscador de objetos
//   document.addEventListener("input", () => {
//     const valor = document.getElementById("busqueda").value.toLowerCase();

//     // Restaurar contenido original si está vacío
//     if (valor.length === 0) {
//       zonaCartas.innerHTML = cartasOriginales;
//       return;
//     }

//     fetch("/js/dashboardCli/productos.json")
//       .then(res => res.json())
//       .then(data => {
//         let resultados = [];
//         zonaCartas.innerHTML = ''; // Limpiar solo las cartas, no los movimientos

//         // 1️⃣ Buscar por clase exacta
//         if (data[valor]) {
//           resultados = data[valor];
//         } else {
//           // 2️⃣ Buscar por nombre de producto dentro de todas las clases
//           for (const clase in data) {
//             const filtrados = data[clase].filter(producto =>
//               producto.nombre.toLowerCase().includes(valor)
//             );
//             resultados = resultados.concat(filtrados);
//           }
//         }

//         // 3️⃣ Mostrar resultados
//         if (resultados.length > 0) {
//           resultados.forEach(producto => {
//             const carta = createCard_1(
//               producto.nombre,
//               producto.descripcion,
//               producto.precio,
//               producto.disponibilidad,
//               producto.imagen
//             );
//             zonaCartas.appendChild(carta);
//           });
//         } else {
//           zonaCartas.innerHTML = "<p>No se encontraron resultados.</p>";
//         }
//       })
//       .catch(error => {
//         console.error("Error al cargar productos:", error);
//         zonaCartas.innerHTML = "<p>Error al buscar productos.</p>";
//       });
//   });
// });
