import { createNavbar } from "../components/navbar.js";

document.addEventListener("DOMContentLoaded", () => {
  document.body.prepend(createNavbar());

  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("nombre");
  const disponibilidad = parseInt(params.get("disponibilidad"));

  const titulo = document.getElementById("titulo-producto");
  const info = document.getElementById("disponibilidad-info");
  const content = document.getElementById("contenedor");

  titulo.textContent = `Producto: ${nombre}`;
  info.textContent = `Disponible en ${disponibilidad} tienda(s)`;

  const tiendas = [
    { nombre: "Tienda A", precio: 1.5, imagen: "../assets/tienda.png" },
    { nombre: "Tienda B", precio: 1.6, imagen: "../assets/tienda.png" },
    { nombre: "Tienda C", precio: 1.7, imagen: "../assets/tienda.png" },
    { nombre: "Tienda D", precio: 1.55, imagen: "../assets/tienda.png" }
  ];

  tiendas.slice(0, disponibilidad).forEach((tienda, i) => {
    const tiendaDiv = document.createElement("div");
    tiendaDiv.className = "tienda";
    tiendaDiv.style.marginLeft = "80px";

    tiendaDiv.innerHTML = `
      <img src="../assets/tienda.png" width="100">
      <h2>${tienda.nombre}</h2>
      <h3>Precio: S/. ${tienda.precio}</h3>
      <button id="seleccionar-${i}"  
      style="width:100%";
      border-radius:20px;
      >Seleccionar</button>
    `;

    content.appendChild(tiendaDiv);

    document.getElementById(`seleccionar-${i}`).addEventListener("click", () => {
      content.innerHTML = "";

      const tarjetaPago = document.createElement("div");
      tarjetaPago.className = "tarjeta-pago";
      tarjetaPago.style.margin = "40px";
      tarjetaPago.style.border = "1px solid #ccc";
      tarjetaPago.style.padding = "20px";
      tarjetaPago.style.borderRadius = "12px";

      tarjetaPago.innerHTML = `
        <h2>Resumen de Compra</h2>
        <img src="${tienda.imagen}" width="150">
        <h3>Producto: ${nombre}</h3>
        <h3>Tienda: ${tienda.nombre}</h3>
        <h3>Precio: S/. ${tienda.precio}</h3>
        <button id="pagar-ahora">Pagar ahora</button>
      `;

      content.appendChild(tarjetaPago);

      // Redirección al hacer clic en "Pagar ahora"
      document.getElementById("pagar-ahora").addEventListener("click", () => {
        // Puedes pasar datos si quieres: ?producto=Oreo&precio=1.5
        window.location.href = `pago.html?producto=${encodeURIComponent(nombre)}&tienda=${encodeURIComponent(tienda.nombre)}&precio=${tienda.precio}`;
      });
    });
  });
});
