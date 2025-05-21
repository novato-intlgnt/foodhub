import { createNavbar } from "./components/navbar.js";
import { createCard } from "./components/card.js";

document.addEventListener("DOMContentLoaded", () => {
  document.body.prepend(createNavbar());

  const contenedor = document.getElementById("contenedor-cartas");
  const movimientos = document.querySelector(".movimientos");

  const nuevaCarta = createCard();
  contenedor.insertBefore(nuevaCarta, movimientos); 


  // ==== Lógica del botón de movimientos ====
  const toggleBtn = document.getElementById("toggleMovimientos");
  const lista = document.getElementById("listaMovimientos");
  let visible = false;

  toggleBtn.addEventListener("click", () => {
    visible = !visible;
    lista.style.display = visible ? "block" : "none";
    toggleBtn.textContent = visible ? "Ocultar movimientos" : "Mostrar movimientos";
  });

  fetch("/js/dashboardCli/compras.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(compra => {
        const item = document.createElement("div");
        item.innerHTML = `
        <div >
          <p id="producto" ><strong>${compra.producto}</strong></p>
          <p id="precio" >S/${compra.precio.toFixed(2)}</p>
        </div>
          <div  id="fecha"><p>${compra.fecha}</p> </div><hr>
        `;
        lista.appendChild(item);
      }
    );
    })
    .catch(err => console.error("Error al cargar compras:", err));
});
