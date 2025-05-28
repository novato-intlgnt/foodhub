export function createCard() {
  const card = document.createElement("div");
  card.className = "carta";
  card.innerHTML = `
    <img src="/assets/images/imgDashCli/broster.jpg" style="width:100%">
    <div class="info-comida">
        <h1 style="text-align: center">Pollo broster</h1>
        <p >Pollo servido con papas y cremas </p>
        <p>s /.11.00 </p>
        <button class="estado-pedido">dame</button>
    </div>
  `;
  return card;
}



// export function createCard() {
//   return fetch("js/dashboardCli/compras.json")
//     .then(res => res.json())
//     .then(data => {
//       const compra = data[0]; // Solo el primer pedido
//       if (compra) {
//         const item = document.createElement("div");
//         item.className = "carta";
//         item.innerHTML = `
//           <div>
//             <p id="producto"><strong>${compra.producto}</strong></p>
//             <p id="precio">S/${compra.precio.toFixed(2)}</p>
//           </div>
//           <div id="fecha"><p>${compra.fecha}</p></div><hr>
//         `;
//         return item; // Devolver la carta
//       }
//       return null;
//     })
//     .catch(err => {
//       console.error("Error al cargar compras:", err);
//       return null;
//     });
// }

export function createCard_1(nombre, descripcion, precio, disponibilidad,imagen){
  const card = document.createElement("div");
  card.className = "carta";
  card.innerHTML = `
    <img src="${imagen}" style="width:100%">
    <div class="info-comida">
        <h1 style="text-align: center">${nombre}</h1>
        <p>${descripcion}</p>
        <p>s/.${precio.toFixed(2)}</p>
        <button class="estado-pedido">Disponible en ${disponibilidad} tiendas</button>
    </div>
  `;

  // 🎯 Agregar listener al botón
  const boton = card.querySelector("button");
  boton.addEventListener("click", () => {
    // Redirigir con datos en la URL
    const url = new URL("src/public/js/dashboardCli/pages/store_selection.html", window.location.origin);
    url.searchParams.set("nombre", nombre);
    url.searchParams.set("disponibilidad", disponibilidad);
    window.location.href = url.toString();
  });

  return card;
}