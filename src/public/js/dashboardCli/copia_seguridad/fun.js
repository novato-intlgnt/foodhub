  export let productos = [];
  export let pedidos_realizados = [];
  export let pedidos = [];

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

  export function renderizarUltimoPedido(lista, container) {
    const ultimo = lista[lista.length - 1];
    const tabla = document.createElement("div");
    tabla.innerHTML = `

        <div class="last_name"><p>${ultimo.nombre}</p></div>
        <div class="duo_last">
          <div class="last_date"><p>${ultimo.fecha}</p></div>
          <div class="last_precio"><p>s/. ${ultimo.precio}</p></div>
        </div>

    `;
    container.appendChild(tabla);
  }

  export function renderizarListaPedidos(lista, container) {
    container.innerHTML = "";
    lista.forEach(element => {
      const tr = document.createElement("div");
      tr.className = "tabla"
      tr.innerHTML = `
        <div>
          <p>${element.nombre}</p>
          <p>${element.fecha}</p>
        </div>
        <div><p>s/. ${element.precio.toFixed(2)}<p></div>
      `;
      const hr = document.createElement("hr");
      container.appendChild(tr);
      container.appendChild(hr);
      
    });
  }

  export function filtrar(texto, base) {
    const t = texto.toLowerCase();
    //primero buca
    return base.filter(p => p.nombre.toLowerCase().includes(t) || (p.cat && p.cat.toLowerCase().includes(t)));
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
        <p>${element.nombre}</p>
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
          <p class="producto-precio">Precio: S./ ${element.precio}</p>
        </div>
        `;
        
        const input = document.createElement("input");
        input.type = "number";
        input.setAttribute('placeholder', 'Cantidad...')
        
        const button = document.createElement("button");
        button.innerHTML = "<img src='assets/images/imgDashCli/plus.svg'>";
        button.addEventListener("click", () => {
          callbackAgregar(element, element.id, element.nombre, element.precio, input);
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












      const toggleBtn = document.getElementById("toggleBtn");
      const contenido = document.getElementById("contenido");
      let visible = false;

      function despligue() {
        visible = !visible;
        contenido.style.display = visible ? "table" : "none";
        toggleBtn.textContent = visible ? "Ocultar" : "Desplegar";
      }
      toggleBtn.addEventListener("click", despligue);


      const toggleBtn_1 = document.getElementById("toggleBtn_factura");
      const factura = document.getElementById("factura");
      let visibble_factura = false ;
      function despligue_factura(){
        visibble_factura = !visibble_factura;
        factura.style.display = visibble_factura ? "flex " : "none";
      }
      toggleBtn_1.addEventListener("click", despligue_factura)

      const toggleBtn_1_negative = document.getElementById("toggleBtn_factura_negative");
      const factura_negative = document.getElementById("factura");
      let visibble_factura_negative = true ;
      function despligue_factura_negative(){
        factura_negative.style.display = visibble_factura_negative ? "none " : "flex";
      }
      toggleBtn_1_negative.addEventListener("click", despligue_factura_negative)