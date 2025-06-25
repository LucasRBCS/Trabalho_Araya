const SALES_API_URL = 'http://localhost:3000/api/sales';
const CUSTOMERS_API_URL_FOR_SALES = 'http://localhost:3000/api/customers';
const PRODUCTS_API_URL_FOR_SALES = 'http://localhost:3000/api/products';

async function fetchSales() {
    try {
        const response = await fetch(SALES_API_URL);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const sales = await response.json();
        const saleList = document.getElementById('saleList');
        saleList.innerHTML = '';

        sales.forEach(sale => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>Venda ID: ${sale.id} - Cliente: ${sale.customer_name} - Produto: ${sale.product_name} (Qtde: ${sale.quantity}) - Total: R$ ${parseFloat(sale.total_amount).toFixed(2)} (${getPaymentMethodName(sale.payment_method)})</span>
                <div>
                    <button onclick="deleteSale(${sale.id})">Excluir</button>
                </div>
            `;
            saleList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        alert('Não foi possível carregar as vendas. Verifique se o backend está rodando.');
    }
}

// Função para popular os selects de cliente e produto no formulário de vendas
async function populateSaleForms() {
    const customerSelect = document.getElementById('saleCustomer');
    const productSelect = document.getElementById('saleProduct');

    // Limpa os selects
    customerSelect.innerHTML = '<option value="">Selecione um Cliente</option>';
    productSelect.innerHTML = '<option value="">Selecione um Produto</option>';

    try {
        // Busca clientes
        const customersResponse = await fetch(CUSTOMERS_API_URL_FOR_SALES);
        const customers = await customersResponse.json();
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            customerSelect.appendChild(option);
        });

        // Busca produtos
        const productsResponse = await fetch(PRODUCTS_API_URL_FOR_SALES);
        const products = await productsResponse.json();
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (Estoque: ${product.stock})`; // Mostra o estoque atual
            productSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao popular selects de venda:', error);
        alert('Erro ao carregar clientes/produtos para a venda. Verifique o backend.');
    }
}

async function createSale(event) {
    event.preventDefault();
    const customer_id = document.getElementById('saleCustomer').value;
    const product_id = document.getElementById('saleProduct').value;
    const quantity = parseInt(document.getElementById('saleQuantity').value);
    const payment_method = document.getElementById('salePaymentMethod').value;

    // Validação básica dos campos
    if (!customer_id || !product_id || isNaN(quantity) || quantity <= 0 || !payment_method) {
        alert('Por favor, preencha todos os campos e certifique-se de que a quantidade é válida.');
        return;
    }

    const saleData = { customer_id, product_id, quantity, payment_method };

    try {
        const response = await fetch(SALES_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });

        if (response.ok) {
            alert('Venda registrada com sucesso!');
            await fetchSales(); // Atualiza a lista de vendas
            document.getElementById('saleForm').reset(); // Limpa o formulário
            populateSaleForms(); // Repopula os selects para atualizar o estoque visível
        } else {
            const errorData = await response.json();
            alert('Erro ao registrar venda: ' + (errorData.message || errorData.error || response.statusText));
        }
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        alert('Erro ao conectar com o servidor. Verifique o console para mais detalhes.');
    }
}

async function deleteSale(id) {
    // Aviso importante: a exclusão de venda não restaura o estoque neste exemplo simples.
    if (!confirm('Tem certeza que deseja excluir esta venda? Esta operação não pode ser desfeita e NÃO restaurará o estoque do produto.')) return;

    try {
        const response = await fetch(`${SALES_API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await fetchSales(); // Atualiza a lista de vendas
        } else {
            const errorData = await response.json();
            alert('Erro ao excluir venda: ' + (errorData.message || errorData.error || response.statusText));
        }
    } catch (error) {
        console.error('Erro ao excluir venda:', error);
        alert('Erro ao conectar com o servidor. Verifique o console para mais detalhes.');
    }
}

// Função auxiliar para mostrar nomes de métodos de pagamento mais amigáveis
function getPaymentMethodName(method) {
    switch (method) {
        case 'credit_card': return 'Cartão de Crédito';
        case 'debit_card': return 'Cartão de Débito';
        case 'cash': return 'Dinheiro';
        case 'pix': return 'Pix';
        default: return method;
    }
}

// Adiciona os event listeners quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    fetchSales();
    populateSaleForms();
});
document.getElementById('saleForm').addEventListener('submit', createSale);