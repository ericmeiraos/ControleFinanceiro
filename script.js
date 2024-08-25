// Seleciona os elementos do DOM para manipulação
var balanceDisplay = document.getElementById('saldo');
var moneyPlus = document.getElementById('receitas');
var moneyMinus = document.getElementById('despesas');
var transactionsList = document.getElementById('lista-transacoes');
var transactionForm = document.getElementById('form-transacao');
var textInput = document.getElementById('descricao');
var amountInput = document.getElementById('valor');

// Carrega as transações salvas do localStorage ou retorna um array vazio se não houver
var transactions = loadTransactions();

// Função para adicionar uma nova transação
function addTransaction(e) {
    e.preventDefault(); // Previne o envio padrão do formulário
    var text = textInput.value.trim();
    var amount = parseFloat(amountInput.value);
    if (text === '' || isNaN(amount)) {
        alert('Por favor, preencha todos os campos.'); // Alerta se os campos estiverem vazios ou inválidos
        return;
    }
    // Cria uma nova transação
    var newTransaction = {
        id: Date.now(), // Utiliza o timestamp atual como ID único
        text: text,
        amount: amount
    };
    // Adiciona a nova transação ao array e atualiza o armazenamento local e a interface do usuário
    transactions.push(newTransaction);
    saveTransactions();
    updateUI();
}

// Função para remover uma transação pelo ID
function removeTransaction(id) {
    // Filtra as transações para remover a que corresponde ao ID fornecido
    transactions = transactions.filter(function (transaction) { return transaction.id !== id; });
    saveTransactions(); // Atualiza o armazenamento local
    updateUI(); // Atualiza a interface do usuário
}

// Função para atualizar a interface do usuário
function updateUI() {
    transactionsList.innerHTML = ''; // Limpa a lista de transações
    var totalIncome = 0;
    var totalExpense = 0;
    // Itera sobre as transações e cria elementos para cada uma
    transactions.forEach(function (transaction) {
        var listItem = document.createElement('li');
        listItem.className = transaction.amount < 0 ? 'negativo' : 'positivo'; 
        // Cria o conteúdo da transação e o botão de remoção
        listItem.innerHTML = `
            <div class="conteudo-transacao">
                ${transaction.text} <span>${transaction.amount < 0 ? '-' : '+'} R$${Math.abs(transaction.amount).toFixed(2)}</span>
            </div>
            <button class="botao-remover" onclick="removeTransaction(${transaction.id})">X</button>
        `;
        // Adiciona o item da transação à lista
        transactionsList.appendChild(listItem);
        // Calcula o total de receitas e despesas
        if (transaction.amount > 0) {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });
    // Calcula o saldo total
    var total = totalIncome + totalExpense;
    // Atualiza os elementos de exibição com os valores calculados
    balanceDisplay.innerHTML = `R$ ${total.toFixed(2)}`;
    moneyPlus.innerHTML = `+ R$ ${totalIncome.toFixed(2)}`;
    moneyMinus.innerHTML = `- R$ ${Math.abs(totalExpense).toFixed(2)}`;
}

// Função para salvar as transações no localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Função para carregar as transações do localStorage
function loadTransactions() {
    var savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : []; // Retorna transações salvas ou um array vazio
}

// Adiciona um ouvinte de evento para o envio do formulário de transações
transactionForm.addEventListener('submit', addTransaction);

// Atualiza a interface do usuário ao carregar a página
updateUI();
