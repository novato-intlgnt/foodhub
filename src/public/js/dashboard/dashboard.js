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

const url = window.location.origin

// Datos de productos y categorías
const productsData = {};
const productsOrder = {};
const categoriesMap = new Map();
const categoriesSet = new Set();

const formNewProd = document.getElementById('prod-form')
const formNewOrder = document.getElementById('order-form')
const addedProductsBody = document.getElementById('addedProductsBody');
const prodList = document.getElementById('productsList');
const prodCategorySelect = document.getElementById('prodCategory');
const orderCategorySelect = document.getElementById('orderProdCategory');
const inpQty = document.getElementById('orderProdQuantity');
const inpPrice = document.getElementById('orderProdUnitPrice');
const inpTot = document.getElementById('orderProdTotal');
const orderProductsBody = document.getElementById('orderProductsBody');
const prodName = document.getElementById('orderProdName');

document.addEventListener('DOMContentLoaded', async () => {
  const { data: categoryData } = await fetch(`${url}/stall/categories`, {
    method: 'GET',
  }).then(res => res.json())

  const { data: productsList } = await fetch(`${url}/stall/products`, {
    method: 'GET',
  }).then(res => res.json())


  categoriesMap.clear();
  categoriesSet.clear();
  categoryData.forEach(cat => {
    categoriesMap.set(cat.categoryId, cat.name);
    categoriesSet.add(cat.name)
  });


  const fragment = document.createDocumentFragment();
  productsList.forEach(product => {
    productsData[product.productId] = { prodName: product.name, description: product.description, salePrice: product.salePrice, categoryId: product.categoryId, stock: product.stock, selected: true };
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${categoriesMap.get(product.categoryId)}</td>
      <td>${product.salePrice}</td>
      <td>${product.cost}</td>
      <td>${product.stock}</td>
    `;
    fragment.appendChild(tr);
  });

  addedProductsBody.innerHTML = '';
  addedProductsBody.appendChild(fragment);
  updateCategoryUI()
});

formNewProd.addEventListener('submit', async (e) => {
  e.preventDefault()
  const rawData = new FormData(e.target);
  const data = Object.fromEntries(
    Array.from(rawData.entries()).map(([key, value]) => [
      key, 
      typeof value === 'string' ? value.trim() : value
    ])
  );

  const name = data.nameProd?.trim()
  const description = data.descProd?.trim() 
  const category = data.catProd
  const salePrice = parseFloat(data.salePriceProd)
  const costPrice = parseFloat(data.boughtPriceProd)
  const stock = parseFloat(data.stockProd)
  if (
    !name||
    !description ||
    !category ||         
    category === '__new__' || 
    isNaN(salePrice) ||
    parseFloat(salePrice) <= 0 ||
    isNaN(parseFloat(costPrice)) ||
    parseFloat(costPrice) <= 0 ||
    isNaN(parseInt(stock)) ||
    parseInt(stock) < 0
  ) {
    return Swal.fire({ icon: 'warning', title: 'Por favor complete todos los campos con valores válidos:\n'});
  }

  const result = await fetch(`${url}/stall/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      description,
      category,
      salePrice,
      costPrice,
      stock
    })
  }).then(res => res.json())

  if (!result.success) {
    return Swal.fire({
      icon: result.status,
      title: result.message
    })
  }

  const { productId, categoryId } = result.data
  if (!/^\d+$/.test(category)) {
    categoriesMap.delete(0)
    categoriesMap.set(categoryId, category)
  }

  productsData[productId] = { name, description, salePrice, categoryId, stock };
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${name}</td><td>${category}</td><td>${salePrice.toFixed(2)}</td><td>${costPrice.toFixed(2)}</td><td>${stock}</td>`;
  addedProductsBody.appendChild(tr);
  const opt = document.createElement('option'); 
  opt.value = productId;
  opt.textContent = name;
  form.reset()
})

// Función para actualizar selects de categorías
function updateCategoryUI() {
  prodCategorySelect.innerHTML = '<option value="">--Selecciona--</option>';
  categoriesMap.forEach((name, id) => {
    const opt = document.createElement('option');
    opt.value = id === 0 ? name : id;
    opt.textContent = name;
    prodCategorySelect.appendChild(opt);
  });

  const addOpt = document.createElement('option');
  addOpt.value = '__new__';
  addOpt.textContent = '+ Añadir categoría';
  prodCategorySelect.appendChild(addOpt);

  orderCategorySelect.innerHTML = '<option value="">--Selecciona--</option>';
  categoriesMap.forEach((name, id) => {
    const opt = document.createElement('option');
    opt.value = id === 0 ? name : id;
    opt.textContent = name;
    orderCategorySelect.appendChild(opt);
  });
}

// Agregar nueva categoria en anadir producto
prodCategorySelect.addEventListener('change', () => {
  if (prodCategorySelect.value === '__new__') {
    const name = prompt('Introduce el nombre de la nueva categoría:').trim();
    if (name && !categoriesSet.has(name)) {
      categoriesSet.add(name);
      categoriesMap.set(0, name)
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

// Filtrar productos por categoría en pedido
document.getElementById('orderProdCategory').addEventListener('change', () => {
  const cat = orderCategorySelect.value;
  prodList.innerHTML = '';
  Object.entries(productsData)
    .filter(([_, p]) => p.categoryId == cat && p.stock > 0)
    .forEach(([prodId, data]) => {
      const opt = document.createElement('option'); 
      opt.value = data.prodName;
      opt.id = prodId;
      prodList.appendChild(opt);
    });
  
  prodName.value = '';
  inpPrice.value = '';
  inpTot.value = '';
})

// Asignar precio al seleccionar producto en pedido
prodName.addEventListener('change', e => {
  const name = e.target.value;
  const prod = Object.values(productsData).find(p => p.prodName == name)
  if (prod) { inpPrice.value = prod.salePrice; calcTotal(); }
});

// Agregar línea al pedido
document.getElementById('addProdBtn').addEventListener('click', () => {
  const name = document.getElementById('orderProdName').value.trim();
  const prodId = Object.keys(productsData).find(id => productsData[id].prodName == name);
  const qty = parseFloat(inpQty.value);
  const price = parseFloat(inpPrice.value);
  const total = parseFloat(inpTot.value);
  if (!name || isNaN(qty) || qty < 1) return alert('Completa datos del producto');
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${name}</td><td>${qty}</td><td>${price.toFixed(2)}</td><td>${total.toFixed(2)}</td>`;
  orderProductsBody.appendChild(tr);
  productsOrder[prodId] = qty
  document.getElementById('orderProdName').innerHTML = '';
});

const socket = io()
// Guardar pedido - limpieza de formulario por el momento
formNewOrder.addEventListener('submit', async (e) => {
  e.preventDefault()
  const rawData = new FormData(e.target);
  const data = Object.fromEntries(
    Array.from(rawData.entries()).map(([key, value]) => [
      key, 
      typeof value === 'string' ? value.trim() : value
    ])
  );
  if (Object.keys(productsOrder).length == 0) return alert('Agrega al menos un producto');
  if (!data.payMethod) return alert('Revisa el metodo de pago');
  data['products'] = productsOrder
  socket.emit("stall:order", data, (res) => {
    if (!res.success) {
      return Swal.fire({
        icon: res.status,
        title: res.message
      })
    }
    return Swal.fire({
      icon: res.status,
      title: res.message
    })
  })
  orderProductsBody.innerHTML = '';
  // orderCategorySelect.selectedIndex = 0;
});
