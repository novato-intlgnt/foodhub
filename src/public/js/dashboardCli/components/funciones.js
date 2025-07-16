  export let productos = [];
  export let pedidos_realizados = [];
  export let pedidos = [];
  export let contador_pendientes = 0;


  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>RENDERIZADOS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  export function cargarProductos(ruta) {
    return fetch(ruta)
    .then(res => res.json())
    .then(data => {
      productos = data;
      return data;
    });
  }
  export function cargarPedidos(ruta) {
    return fetch(ruta)
    .then(res => res.json());
  }
  
  export function renderizarNumEstado(container) {
    const despligue_contenedor = document.getElementById("circulo");
    despligue_contenedor.innerHTML = `
    <p>${contador_pendientes}</p>
  `;
}
export function renderizarUltimoPedido(lista, container) {
  const ultimo = lista[lista.length - 1];
  const tabla = document.createElement("div");
  
  const nombre = ultimo.items.map(i => i.name).join(", ");
  
  tabla.innerHTML = `
  <div class="last_name"><p>${nombre}</p></div>
  <div class="duo_last">
  <div class="last_date"><p>${ultimo.date}</p></div>
  <div class="last_precio"><p>s/. ${ultimo.totalAmount.toFixed(2)}</p></div>
  </div>
  `;
  
  container.appendChild(tabla);
}
export function renderizarListaPedidos_std(lista, container) {
  container.innerHTML = "";
  
  lista.forEach(element => {
    const nombres = element.items.map(i => i.name).join(", ");
    const cant = element.items.map(i => i.quantity).join(", ");
    
    const tr = document.createElement("div");
    tr.className = "tabla";
    tr.innerHTML = `
    <div>   
    <p>${nombres} (x${cant})</p>
        <p>${element.date}</p>
        </div>
        <div class="std_right" style="margin-right:20px">
        <p class="p_amarilla" id="text_std">Preparandose</p>  
        <button class="bolita_amarilla"></button>
        
        </div>
        `;
        
        const hr = document.createElement("hr");
        
        container.insertBefore(hr, container.firstChild);
        container.insertBefore(tr, container.firstChild);
      });
    }
    export function renderizarListaPedidos(lista, container) {
      container.innerHTML = "";
      
      lista.forEach(element => {
        const nombres = element.items.map(i => i.name).join(", ");
        const cant = element.items.map(i => i.quantity).join(", ");
        
        const tr = document.createElement("div");
        tr.className = "tabla";
        tr.innerHTML = `
        <div>   
        <p>${nombres} (x${cant})</p>
        <p>${element.date}</p>
        </div>
        <div><p>s/. ${element.totalAmount.toFixed(2)}</p></div>
        `;
        
        const hr = document.createElement("hr");
        
        container.insertBefore(hr, container.firstChild);
        container.insertBefore(tr, container.firstChild);
      });
    }
    
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>BUSQUEDA Y FILTRO>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    
    export function filtrar(texto, base, categoria = null) {
      const t = texto.toLowerCase();
      
      return base.filter(p => {
        const coincideNombre = p.name.toLowerCase().includes(t);
        const coincideCategoria = !categoria || p.category_id === categoria.category_id;
        return coincideNombre && coincideCategoria;
      });
    }
    export function mostrarResultados(text, array_filter, container, callbackAgregar) {
      container.innerHTML = "";
      
      if (text === "" || array_filter.length === 0) {
        container.innerHTML = "<div class='result_negative'><p>Valores no encontrados</p></div>";
        container.classList.remove("visible");
  } else {
    container.classList.add("visible");
    array_filter.forEach(element => {
      const general_filter = document.createElement("div");
      general_filter.classList.add("general_filter");

      const element_filter = document.createElement("div");
      element_filter.classList.add("producto");

      const info = document.createElement("div");
      info.className = "producto_select";
      info.innerHTML = `
        <div class="info_text_nombre">
          <p>${element.name}</p>
        </div>
        <div class="info_text_description">
          <p>${element.description}</p>
        </div>
      `;

      const datos = document.createElement("div");
      datos.className = "producto-datos";
      datos.innerHTML = `
        <div class="cuadro-stock"> 
          <p class="producto-stock">Stock: ${element.stock}</p>
        </div>
        <div class="cuadro-precio"> 
          <p class="producto-precio">Precio: S/. ${element.price}</p>
        </div>
      `;

      const input = document.createElement("input");
      input.type = "number";
      input.setAttribute("placeholder", "Cantidad...");

      const button = document.createElement("button");
      button.innerHTML = "<img src='assets/images/imgDashCli/plus.svg'>";
      button.addEventListener("click", () => {
        callbackAgregar(element, element.product_id, element.name, element.price, input);
      });

      const entrega = document.createElement("div");
      entrega.className = "producto_entrega";
      entrega.appendChild(input);
      entrega.appendChild(button);

      general_filter.appendChild(info);
      general_filter.appendChild(datos);
      element_filter.appendChild(general_filter);
      element_filter.appendChild(entrega);
      container.appendChild(element_filter);
    });
  }
}
export function agregar(elemento, id, name_1, price, inputElement) {
  const cantidad = parseInt(inputElement.value);
  if (!cantidad || cantidad <= 0) return;

  const subtotal = price * cantidad;

  const venta = {
    sale_id: Date.now(), // Genera un ID único por tiempo
    client_id: 1,
    stall_id: 1,
    date: new Date().toISOString().split("T")[0],
    totalAmount: subtotal,
    items: [
      {
        name: name_1,
        product_id: id,
        quantity: cantidad,
        unit_price: price
      }
    ]
  };

  pedidos_realizados.push(venta);
  contador_pendientes++;


  // Mostrar en tabla visual
  const tbody = document.getElementById("tabla_pedidos");
  const element_factura = document.createElement("tr");
  element_factura.innerHTML = `
    <td>${name_1} (x${cantidad})</td>
    <td>${cantidad}</td>
    <td>${subtotal.toFixed(2)}</td>
  `;
  tbody.appendChild(element_factura);

  // También registramos pedido simple para el backend
  pedidos.push({
    product_id: id,
    quantity: cantidad,
    unit_price: price
  });
  console.log("Estado actual de pedidos:", pedidos);
  console.log("Estado actual de pedidos:", pedidos_realizados);
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




    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>FUNCIONES DE DEPLIEGUE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



const toggleBtn = document.getElementById("toggleBtn");
const contenido = document.getElementById("contenido");
let visible = false;

function despligue() {
  visible = !visible;
  contenido.style.display = visible ? "table" : "none";
  toggleBtn.textContent = visible ? "Ocultar" : "Desplegar";
}
toggleBtn.addEventListener("click", despligue);



const toggleBtn_std = document.getElementById("toggleBtn_std");
const contenido_std = document.getElementById("contenido_std");
let visible_1 = false;
function despligue_1(){
  visible_1 = !visible_1;
  contenido_std.style.display = visible_1? "block":"none";  
}
toggleBtn_std.addEventListener("click", despligue_1);
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

const toggleBtn_1 = document.getElementById("toggleBtn_factura");
const factura = document.getElementById("factura");
let visibble_factura = false ;
function despligue_factura(){
  visibble_factura = !visibble_factura;
  factura.style.display = visibble_factura ? "flex " : "none";
}
toggleBtn_1.addEventListener("click", despligue_factura)
//----------------------------------------------------------------------------------------------------------------------------------------------------------

const toggleBtn_1_negative = document.getElementById("toggleBtn_factura_negative");
const factura_negative = document.getElementById("factura");
let visibble_factura_negative = true ;
function despligue_factura_negative(){
  factura_negative.style.display = visibble_factura_negative ? "none " : "flex";
}
toggleBtn_1_negative.addEventListener("click", despligue_factura_negative)




    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PARTE AGREGADA PA ALEJANDRO>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export function consultarEstado() {
  fetch('/estado')
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("estado");

      // Eliminar clases anteriores
      div.classList.remove("no_pagado", "sirviendo", "listo_entregar");

      // Agregar clase nueva
      div.classList.add(data.estado);
    })
    .catch(err => console.error("Error al obtener el estado:", err));
}

export function actualizarEstadoBolita(boton, estado, element_P) {
  boton.classList.remove("bolita_roja", "bolita_amarilla", "bolita_verde");

  if (estado === "sirviendo") {
    boton.classList.add("bolita_amarilla");
    element_P.classList.add("p_amarilla")
    element_P.innerHTML =`  
    Preparando
    `
  } else if (estado === "listo_entregar") {
    boton.classList.add("bolita_verde");
    element_P.classList.add("p_verde");
    element_P.innerHTML =`  
    Listo para recoger
    `;
  }else if ( estado === "entragado") {
    boton.classList.add("bolita_gray");
    element_P.classList.add("p_gray");
    element_P.innerHTML = `
      Entregado
    `
    contador_pendientes--;
  }

}





