const CUSTOMERS_API_URL = 'http://localhost:3000/api/customers';

// Função para buscar e exibir todos os clientes
async function fetchCustomers() {
    try {
        const response = await fetch(CUSTOMERS_API_URL);
        if (!response.ok) { // Verifica se a resposta HTTP foi bem-sucedida
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const customers = await response.json();
        const customerList = document.getElementById('customerList');
        customerList.innerHTML = ''; // Limpa a lista antes de adicionar os novos itens

        customers.forEach(customer => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${customer.name} - ${customer.email} (${customer.phone || 'N/A'})</span>
                <div>
                    <button class="edit" onclick="editCustomer(${customer.id}, '${customer.name}', '${customer.email}', '${customer.phone}')">Editar</button>
                    <button onclick="deleteCustomer(${customer.id})">Excluir</button>
                </div>
            `;
            customerList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        alert('Não foi possível carregar os clientes. Verifique se o backend está rodando.');
    }
}

// Função para adicionar ou atualizar um cliente
async function addOrUpdateCustomer(event) {
    event.preventDefault(); // Impede o recarregamento da página ao enviar o formulário
    const id = document.getElementById('customerId').value;
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;

    const customerData = { name, email, phone };

    try {
        let response;
        if (id) { // Se houver um ID, é uma atualização (PUT)
            response = await fetch(`${CUSTOMERS_API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });
        } else { // Se não houver ID, é uma criação (POST)
            response = await fetch(CUSTOMERS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });
        }

        if (response.ok) { // Se a requisição foi bem-sucedida
            await fetchCustomers(); // Recarrega a lista
            clearCustomerForm(); // Limpa o formulário
        } else {
            const errorData = await response.json(); // Tenta pegar a mensagem de erro do backend
            alert('Erro ao salvar cliente: ' + (errorData.message || errorData.error || response.statusText));
        }
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        alert('Erro ao conectar com o servidor. Verifique o console para mais detalhes.');
    }
}

// Função para aplicar a máscara de telefone
function applyPhoneMask(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    if (value.length > 0) {
        value = '(' + value;
    }
    if (value.length > 3) {
        value = value.substring(0, 3) + ') ' + value.substring(3);
    }
    if (value.length > 10) { // Para números de 9 dígitos (celular)
        value = value.substring(0, 10) + '-' + value.substring(10, 15);
    } else if (value.length > 9) { // Para números de 8 dígitos (fixo)
        value = value.substring(0, 9) + '-' + value.substring(9, 14);
    }

    input.value = value;
}

// Adiciona o event listener ao campo de telefone quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const customerPhoneInput = document.getElementById('customerPhone');
    if (customerPhoneInput) {
        customerPhoneInput.addEventListener('input', applyPhoneMask);
    }
    // Garante que o fetchCustomers seja chamado após o DOM estar pronto
    fetchCustomers(); 
});

// Certifique-se de que a linha abaixo esteja presente para o formulário
document.getElementById('customerForm').addEventListener('submit', addOrUpdateCustomer);

// Função para preencher o formulário com dados de um cliente para edição
function editCustomer(id, name, email, phone) {
    document.getElementById('customerId').value = id;
    document.getElementById('customerName').value = name;
    document.getElementById('customerEmail').value = email;
    document.getElementById('customerPhone').value = phone;
}

// Função para excluir um cliente
async function deleteCustomer(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return; // Confirmação antes de excluir

    try {
        const response = await fetch(`${CUSTOMERS_API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await fetchCustomers(); // Recarrega a lista após exclusão
        } else {
            const errorData = await response.json();
            alert('Erro ao excluir cliente: ' + (errorData.message || errorData.error || response.statusText));
        }
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao conectar com o servidor. Verifique o console para mais detalhes.');
    }
}

// Função para limpar o formulário
function clearCustomerForm() {
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = ''; // Garante que o ID oculto seja limpo
}

// Adiciona os event listeners quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', fetchCustomers);
document.getElementById('customerForm').addEventListener('submit', addOrUpdateCustomer);