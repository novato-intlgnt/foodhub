// Navbar: Navegación suave entre secciones
document.querySelectorAll('.nav-btn').forEach(btn =>
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.target).scrollIntoView({ behavior: 'smooth' });
  })
);

// Cerrar sesión
document.getElementById('signOutBtn').addEventListener('click', () => {
  window.location.href = 'main.html';
});

// Datos de productos y categorías
const productsData = {};
const categoriesSet = new Set();


const addedProductsBody = document.getElementById('addedProductsBody');
const prodList = document.getElementById('productsList');
const prodCategorySelect = document.getElementById('prodCategory');
const orderCategorySelect = document.getElementById('orderProdCategory');
const inpQty = document.getElementById('orderProdQuantity');
const inpPrice = document.getElementById('orderProdUnitPrice');
const inpTot = document.getElementById('orderProdTotal');
const orderProductsBody = document.getElementById('orderProductsBody');

document.addEventListener('DOMContentLoaded', () => {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  document.getElementById('orderDate').value = `${yyyy}-${mm}-${dd}`;
  Array.from(prodCategorySelect.options)
    .map(opt => opt.value).filter(Boolean)
    .forEach(cat => categoriesSet.add(cat));
  updateCategoryUI();
});

// Función para actualizar selects de categorías
function updateCategoryUI() {
  prodCategorySelect.innerHTML = '<option value="">Selecciona</option>';
  Array.from(categoriesSet).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    prodCategorySelect.appendChild(opt);
  });

  orderCategorySelect.innerHTML = '<option value="">Selecciona</option>';
  Array.from(categoriesSet).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    orderCategorySelect.appendChild(opt);
  });
}

// Agregar nueva cateegoria en anadir producto
// Botón para añadir una nueva categoría usando prompt
document.getElementById('addCategoryBtn').addEventListener('click', () => {
  const nueva = prompt('Introduce el nombre de la nueva categoría:');
  if (!nueva) return;

  const nombre = nueva.trim();
  if (!nombre) return alert('El nombre no puede estar vacío');
  if (categoriesSet.has(nombre)) return alert('La categoría ya existe');

  categoriesSet.add(nombre);

  // Agregar a <select> de añadir producto
  const opt1 = document.createElement('option');
  opt1.value = nombre;
  opt1.textContent = nombre;
  document.getElementById('prodCategory').appendChild(opt1);

  // Agregar a <select> de registrar pedido
  const opt2 = document.createElement('option');
  opt2.value = nombre;
  opt2.textContent = nombre;
  document.getElementById('orderProdCategory').appendChild(opt2);

  // Seleccionarla automáticamente
  document.getElementById('prodCategory').value = nombre;
});


// Cálculo del total a pagar
function calcTotal() {
  const q = parseFloat(inpQty.value) || 0;
  const p = parseFloat(inpPrice.value) || 0;
  inpTot.value = (q * p).toFixed(2);
}
inpQty.addEventListener('input', calcTotal);
inpPrice.addEventListener('input', calcTotal);

// Añadir producto al inventario
document.getElementById('addProductBtn').addEventListener('click', () => {
  const name = document.getElementById('prodName').value.trim();
  const category = prodCategorySelect.value;
  const price = parseFloat(document.getElementById('prodPrice').value);
  const stock = parseInt(document.getElementById('prodStock').value, 10);
  if (!name || !category || category === '__new__' || isNaN(price) || isNaN(stock)) {
    return alert('Completa los campos de producto con una categoría válida');
  }
  productsData[name] = { price, category, stock };
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${name}</td><td>${category}</td><td>${price.toFixed(2)}</td><td>${stock}</td>`;
  addedProductsBody.appendChild(tr);
  const opt = document.createElement('option'); opt.value = name;
  prodList.appendChild(opt);
  ['prodName', 'prodPrice', 'prodStock'].forEach(id => document.getElementById(id).value = '');
});

// Filtrar productos por categoría en pedido
document.getElementById('orderProdCategory').addEventListener('change', () => {
  const cat = orderCategorySelect.value;
  prodList.innerHTML = '';
  Object.entries(productsData).filter(([_, p]) => p.category === cat)
    .forEach(([name]) => {
      const opt = document.createElement('option'); opt.value = name;
      prodList.appendChild(opt);
    });
  document.getElementById('orderProdName').value = '';
  inpPrice.value = '';
  inpTot.value = '';
});

// Asignar precio al seleccionar producto en pedido
document.getElementById('orderProdName').addEventListener('change', e => {
  const prod = productsData[e.target.value];
  if (prod) { inpPrice.value = prod.price.toFixed(2); calcTotal(); }
});

// Agregar línea al pedido
document.getElementById('addOrderProdBtn').addEventListener('click', () => {
  const name = document.getElementById('orderProdName').value.trim();
  const qty = parseFloat(inpQty.value);
  const price = parseFloat(inpPrice.value);
  const total = parseFloat(inpTot.value);
  const payMode = document.getElementById('paymentMode').value.trim();
  if (!name || isNaN(qty) || isNaN(price) || !payMode) return alert('Completa datos del producto y modo de pago');
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${name}</td><td>${qty}</td><td>${price.toFixed(2)}</td><td>${total.toFixed(2)}</td>`;
  orderProductsBody.appendChild(tr);
  ['orderProdName','orderProdQuantity','orderProdUnitPrice','orderProdTotal']
    .forEach(id => document.getElementById(id).value = '');
});

document.getElementById('saveOrderBtn').addEventListener('click', () => {
  if (orderProductsBody.children.length === 0) {
    return alert('Agrega al menos un producto al pedido antes de guardarlo');
  }

  alert('Pedido registrado correctamente');

  // Obtener productos del pedido actual
  let products = [];
  for (let row of orderProductsBody.children) {
    const cells = row.children;
    products.push(`${cells[1].textContent} ${cells[0].textContent}`);
  }

  // Calcular total del pedido
  const totalPedido = Array.from(orderProductsBody.children).reduce((acc, row) => {
    return acc + parseFloat(row.children[3].textContent);
  }, 0);

  // Confirmar entrega
  function confirmarEntrega(callback) {
    const confirmado = confirm("¿Estás seguro de que deseas marcar este pedido como ENTREGADO?");
    if (confirmado && typeof callback === 'function') {
      callback(); // Ejecuta la acción final
    }
  }

  // Estado card
  const card = document.createElement('div');
  card.className = 'card';
  let estado = 'pendiente';

  const btnEstado = document.createElement('button');
  btnEstado.className = 'btn-estado';
  btnEstado.textContent = 'Preparar';
  btnEstado.style.backgroundColor = '#e67e22'; // naranja

  btnEstado.addEventListener('click', () => {
    if (estado === 'pendiente') {
      estado = 'preparando';
      btnEstado.textContent = 'Listo para entregar';
      btnEstado.style.backgroundColor = '#0a843dff'; // verde
    } else if (estado === 'preparando') {
      estado = 'listo';
      btnEstado.textContent = 'Entregar';
      btnEstado.style.backgroundColor = '#e74c3c'; // rojo
    } else if (estado === 'listo') {
      confirmarEntrega(() => {
        estado = 'entregado';
        card.remove();
      });
    }
  });

  card.innerHTML = `
    <p class="user">Usuario: varios <span class="total">TOTAL: ${totalPedido.toFixed(2)}</span></p>
    <p>${products.join('<br>')}</p>
  `;
  card.appendChild(btnEstado);
  document.getElementById('pendingCards').appendChild(card);

  // Vaciar tabla de productos del pedido
  orderProductsBody.innerHTML = '';
  catSelect.selectedIndex = 0;

  // Incrementar contador y refrescar número
  orderCounter++;
  refreshOrderNumber();

  // Limpiar formulario
  document.getElementById('orderDate').value = '';
  document.getElementById('clientName').value = 'Varios';
  document.getElementById('paymentMode').value = '';
});

