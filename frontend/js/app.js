// Expense Tracker - frontend logic

// PHASE 2
// Your backend from Phase 1 is already running, with real expenses in the
// database (from schema.sql). Build this page directly against it with
// fetch and async/await - there is no in-memory or localStorage stage
// this time, and no sample data file.
//
// A possible structure (change it if you have a better idea):
//   - async function getExpenses()          fetch(API_URL), return the JSON
//   - async function addExpense(data)       fetch(API_URL, { method: "POST", ... })
//   - async function updateExpense(id,data) fetch(API_URL + "/" + id, { method: "PUT", ... })
//   - async function deleteExpense(id)      fetch(API_URL + "/" + id, { method: "DELETE" })
//   - async function refresh()              get the list, then call renderTable and renderSummary
//   - renderTable(list)                     build the table rows from the array the API returned
//   - renderSummary(list)                   update the summary cards
//   - applyFilter()                         re-render with the list filtered by category
//
// Don't forget:
//   - Show a Bootstrap spinner while a request is in flight.
//   - Wrap every fetch call in try/catch, and show a Bootstrap alert on failure.
//   - After add, edit, or delete, call refresh() so the page always shows
//     what the server actually saved - never update the table by hand.
//   - The API is at http://localhost:3000/api/expenses (see the Roadmap).

const API_URL = "http://localhost:3000/api/expenses";

async function getExpenses() {
    try{
        showLoading(true);
        const response =await fetch(API_URL);

        if(!response.ok){
            throw new Error(`Falid to load expenses status:${response.status}`);
        }
        
        const expenses = await response.json();
        return expenses;
        
    }
    catch(error){
        showAlert(error.message,"danger")
        return[];
    }
    finally{
        showLoading(false)
    }
    
}

function renderSummary(expenses) {
    const totalAmountElement = document.getElementById("totalAmount");
    const expensesCountElement = document.getElementById("expensesCount");
    const highestExpenseElement = document.getElementById("highestExpense");

    const totalAmount = expenses.reduce((sum, expense) => {
        return sum + Number(expense.amount);
    }, 0);

    const expensesCount = expenses.length;

    const highestExpense = expenses.length > 0
        ? Math.max(...expenses.map(expense => Number(expense.amount)))
        : 0;

    totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
    expensesCountElement.textContent = expensesCount;
    highestExpenseElement.textContent = `$${highestExpense.toFixed(2)}`;
}

async function refresh() {
    const expenses = await getExpenses();

    renderSummary(expenses);

}

document.addEventListener("DOMContentLoaded", refresh);

function showLoading(isLoading) {
    const spinner = document.getElementById("loadingSpinner");

    if (isLoading) {
        spinner.classList.remove("d-none");
    } else {
        spinner.classList.add("d-none");
    }
}

function showAlert(message, type = "danger") {
    const alertContainer = document.getElementById("alertContainer");

    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close">
            </button>
        </div>
    `;
}
