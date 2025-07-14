export let productos = [];
export let pedidos_realizados = [];
export let pedidos = [];

export async function cargarProductos(ruta) {
  return fetch(ruta)
    .then(res => res.json())
    .then(data => {
      productos = data;
      return data;
    });
}

export async function cargarPedidos(ruta) {
  return fetch(ruta)
    .then(res => res.json());
}

export function renderizarUltimoPedido(lista, container) {
  const ultimo = lista[lista.length - 1];
  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <tr>
      <td><p>${ultimo.nombre}</p></td>
      <td><p>${ultimo.fecha}</p></td>
      <td><p>s/. ${ultimo.precio}</p></td>
    </tr>
  `;
  container.appendChild(tabla);
}

export function renderizarListaPedidos(lista, container) {
  container.innerHTML = "";
  lista.forEach(element => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${element.nombre}</td>
      <td>${element.fecha}</td>
      <td>${element.precio.toFixed(2)}</td>
    `;
    container.appendChild(tr);
  });
}

export function filtrar(texto, base) {
  const t = texto.toLowerCase();
  return base.filter(p => p.nombre.toLowerCase().includes(t) || (p.cat && p.cat.toLowerCase().includes(t)));
}

export function mostrarResultados(text, array_filter, container, callbackAgregar) {
  container.innerHTML = "";
  if (text === "" || array_filter.length === 0) {
    container.innerHTML = "Valores no encontrados";
  } else {
    array_filter.forEach(element => {
      const element_filter = document.createElement("div");
      element_filter.classList.add("producto");

      const info = document.createElement("div");
      info.className = "productos_select";
      info.innerHTML = `
        <p>${element.nombre}</p>
        <p>${element.description}</p>
      `;

      const datos = document.createElement("div");
      datos.className = "producto-datos";
      datos.innerHTML = `
        <p class="producto-stock">Stock: ${element.stock}</p>
        <p class="producto-precio">Precio: S./ ${element.precio}</p>
      `;

      const input = document.createElement("input");
      input.type = "number";

      const button = document.createElement("button");
      button.textContent = "Agregar";
      button.addEventListener("click", () => {
        callbackAgregar(element, element.id, element.nombre, element.precio, input);
      });

      datos.appendChild(input);
      datos.appendChild(button);
      element_filter.appendChild(info);
      element_filter.appendChild(datos);
      container.appendChild(element_filter);
    });
  }
}

export function agregar(elemento, id, name, precio, inputElement) {
  const cantidad = parseInt(inputElement.value);
  if (!cantidad || cantidad <= 0) return;

  const nuevo_pedido = {
    id: id,
    nombre: name,
    precio: precio,
    fecha: "2025-06-14"
  };
  pedidos_realizados.push(nuevo_pedido);

  // 🔧 CORREGIDO: insertamos dentro del <tbody>
  const tbody = document.getElementById("tabla_pedidos");

  const element_factura = document.createElement("tr");
  element_factura.innerHTML = `
    <td>${name}</td>
    <td>${cantidad}</td>
    <td>${(precio * cantidad).toFixed(2)}</td>
  `;

  tbody.appendChild(element_factura); 

  pedidos.push({ id, cantidad });
}


export function enviarPedido() {
  console.log(pedidos);
  fetch("/ruta/backend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(pedidos)
  });
}
