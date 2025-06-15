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
  Array.from(prodCategorySelect.options)
    .map(opt => opt.value).filter(Boolean)
    .forEach(cat => categoriesSet.add(cat));
  updateCategoryUI();
});

// Función para actualizar selects de categorías
function updateCategoryUI() {
  prodCategorySelect.innerHTML = '<option value="">--Selecciona--</option>';
  Array.from(categoriesSet).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    prodCategorySelect.appendChild(opt);
  });

  const addOpt = document.createElement('option');
  addOpt.value = '__new__';
  addOpt.textContent = '+ Añadir categoría';
  prodCategorySelect.appendChild(addOpt);

 
  orderCategorySelect.innerHTML = '<option value="">--Selecciona--</option>';
  Array.from(categoriesSet).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    orderCategorySelect.appendChild(opt);
  });
}

// Agregar nueva cateegoria en anadir producto
prodCategorySelect.addEventListener('change', () => {
  if (prodCategorySelect.value === '__new__') {
    const name = prompt('Introduce el nombre de la nueva categoría:').trim();
    if (name && !categoriesSet.has(name)) {
      categoriesSet.add(name);
      updateCategoryUI();
      prodCategorySelect.value = name;
    } else {
      prodCategorySelect.value = '';
    }
  }
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

// Guardar pedido - limpieza de formulario por el momento
document.getElementById('saveOrderBtn').addEventListener('click', () => {
  if (!orderProductsBody.children.length) return alert('Agrega al menos un producto');
  alert('Pedido registrado correctamente');
  orderProductsBody.innerHTML = '';
  orderCategorySelect.selectedIndex = 0;
  ['orderDate','clientName','paymentMode'].forEach(id => document.getElementById(id).value = id === 'clientName' ? 'Varios' : '');
});
