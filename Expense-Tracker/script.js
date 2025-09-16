// DOM Elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const listEl = document.getElementById('list');
const form = document.getElementById('form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');

// Transactions Array
let transactions = getLocalStorageData();

// Get data from localStorage
function getLocalStorageData() {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Generate unique ID
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Add new transaction
function addTransaction(e) {
    e.preventDefault();
    
    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);
    const type = typeEl.value;
    
    // Validation
    if (!description || !amount || !type) {
        alert('Please fill all fields');
        return;
    }
    
    // Create transaction object
    const transaction = {
        id: generateID(),
        description: description,
        amount: amount,
        type: type
    };
    
    // Add to array
    transactions.push(transaction);
    
    // Update UI and localStorage
    displayTransactions();
    updateBalance();
    saveToLocalStorage();
    
    // Clear form
    form.reset();
}

// Display all transactions
function displayTransactions() {
    listEl.innerHTML = '';
    
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('transaction', transaction.type);
        
        const sign = transaction.type === 'income' ? '+' : '-';
        
        li.innerHTML = `
            <div class="transaction-info">
                <div class="desc">${transaction.description}</div>
                <div class="amount ${transaction.type}">${sign}₹${transaction.amount}</div>
            </div>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">×</button>
        `;
        
        listEl.appendChild(li);
    });
}

// Update balance
function updateBalance() {
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });
    
    const balance = totalIncome - totalExpense;
    
    // Update DOM
    balanceEl.textContent = balance.toFixed(2);
    incomeEl.textContent = totalIncome.toFixed(2);
    expenseEl.textContent = totalExpense.toFixed(2);
    
    // Change balance color
    const balanceContainer = document.querySelector('.balance');
    if (balance >= 0) {
        balanceContainer.style.background = '#4CAF50';
    } else {
        balanceContainer.style.background = '#f44336';
    }
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    displayTransactions();
    updateBalance();
    saveToLocalStorage();
}

// Initialize app
function init() {
    displayTransactions();
    updateBalance();
}

// Event listener
form.addEventListener('submit', addTransaction);

// Start app
init();