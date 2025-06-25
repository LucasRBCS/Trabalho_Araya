const PRODUCTS_API_URL = 'http://localhost:3000/api/products';

async function fetchProducts() {
    try {
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const products = await response.json();
        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${product.name} (R$ ${parseFloat(product.price).toFixed(2)}) - Estoque: ${product.stock}</span>
                <div>
                    <button class="edit" onclick="editProduct(${product.id}, '${product.name}', '${product.description || ''}', ${parseFloat(product.price)}, ${product.stock})">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Excluir</button>
                </div>
            `;
            productList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        alert('Não foi possível carregar os produtos. Verifique se o backend está rodando.');
    }
}

async function addOrUpdateProduct(event) {
    event.preventDefault();
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);

    // Validação básica para garantir que preço e estoque são números válidos
    if (isNaN(price) || isNaN(stock)) {
        alert('Preço e Estoque devem ser números válidos.');
        return;
    }

    const productData = { name, description, price, stock };

    try {
        let response;
        if (id) {
            response = await fetch(`${PRODUCTS_API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            response = await fetch(PRODUCTS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }

        if (response.ok) {
            await fetchProducts();
            clearProductForm();
        } else {
            const errorData = await response.json();
            alert('Erro ao salvar produto: ' + (errorData.message || errorData.error || response.statusText));
        }
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao conectar com o servidor. Verifique o console para mais detalhes.');
    }
}

function editProduct(id, name, description, price, stock) {
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = name;
    document.getElementById('productDescription').value = description;
    document.getElementById('productPrice').value = price;
    document.getElementById('productStock').value = stock;
}

async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
        const response = await fetch(`${PRODUCTS_API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await fetchProducts();
        } else {
            const errorData = await response.json();
            alert('Erro ao excluir produto: ' + (errorData.message || errorData.error || response.statusText));
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao conectar com o servidor. Verifique o console para mais detalhes.');
    }
}

function clearProductForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

document.addEventListener('DOMContentLoaded', fetchProducts);
document.getElementById('productForm').addEventListener('submit', addOrUpdateProduct);