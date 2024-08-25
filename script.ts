// Define o tipo Transaction com id, texto e valor
type Transaction = {
    id: number;
    text: string;
    amount: number;
};

// Seleciona os elementos do DOM para manipulação
const balanceDisplay = document.getElementById('saldo') as HTMLParagraphElement;
const moneyPlus = document.getElementById('receitas') as HTMLParagraphElement;
const moneyMinus = document.getElementById('despesas') as HTMLParagraphElement;
const transactionsList = document.getElementById('lista-transacoes') as HTMLUListElement;
const transactionForm = document.getElementById('form-transacao') as HTMLFormElement;
const textInput = document.getElementById('descricao') as HTMLInputElement;
const amountInput = document.getElementById('valor') as HTMLInputElement;

// Carrega as transações salvas do localStorage ou retorna um array vazio se não houver
let transactions: Transaction[] = loadTransactions();

// Função para adicionar uma nova transação
function addTransaction(e: Event) {
    e.preventDefault(); // Previne o envio padrão do formulário

    // Obtém e valida os valores do formulário
    const text = textInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (text === '' || isNaN(amount)) {
        alert('Por favor, preencha todos os campos.'); // Alerta se os campos estiverem vazios ou inválidos
        return;
    }

    // Cria uma nova transação
    const newTransaction: Transaction = {
        id: Date.now(), // Utiliza o timestamp atual como ID único
        text,
        amount
    };

    // Adiciona a nova transação ao array e atualiza o armazenamento local e a interface do usuário
    transactions.push(newTransaction);
    saveTransactions();
    updateUI();
}

// Função para remover uma transação pelo ID
function removeTransaction(id: number) {
    // Filtra as transações para remover a que corresponde ao ID fornecido
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions(); // Atualiza o armazenamento local
    updateUI(); // Atualiza a interface do usuário
}

// Função para atualizar a interface do usuário
function updateUI() {
    transactionsList.innerHTML = ''; // Limpa a lista de transações

    let totalIncome = 0;
    let totalExpense = 0;

    // Itera sobre as transações e cria elementos para cada uma
    transactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.className = transaction.amount < 0 ? 'negativo' : 'positivo'; // Define a classe com base no tipo de transação
        
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
    const total = totalIncome + totalExpense;

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
function loadTransactions(): Transaction[] {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : []; // Retorna transações salvas ou um array vazio
}

// Adiciona um ouvinte de evento para o envio do formulário de transações
transactionForm.addEventListener('submit', addTransaction);

// Atualiza a interface do usuário ao carregar a página
updateUI();
