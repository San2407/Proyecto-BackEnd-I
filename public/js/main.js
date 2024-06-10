const socket = io();

const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productosTbody');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProduct = {
        title: e.target.title.value.trim(),
        description: e.target.description.value.trim(),
        code: e.target.code.value.trim(),
        price: parseFloat(e.target.price.value),
        stock: parseFloat(e.target.stock.value),
        status: e.target.status.value.trim() || true,
        category: e.target.category.value.trim(),
        thumbnails: e.target.thumbnails.value.split(',').map(thumbnail => thumbnail.trim())
    }
    socket.emit('newProduct', newProduct);
    e.target.reset();
});
socket.on('products', (producto) => {
    productTableBody.innerHTML = '';
    producto.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.code}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.status !== undefined ? product.status : "true"}</td>
        <td>${product.category}</td>
        <td>${product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails.join(',') : "no se agregaron imágenes"} </td>
        `;
        productTableBody.appendChild(row);
    });
});