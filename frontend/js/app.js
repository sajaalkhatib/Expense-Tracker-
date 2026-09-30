const API_URL = "http://localhost:3000/api/expenses";

let expenses = [];

async function getExpenses() {
  try {
    showLoading(true);
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to load expenses status: ${response.status}`);
    }

    expenses = await response.json();
    return expenses;

  } catch (error) {
    showAlert("Could not connect to the server. Please make sure the backend is running.", "danger");
    expenses = [];
    return [];

  } finally {
    showLoading(false);
  }
}

async function addExpense(data) {
  try {
    showLoading(true);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add expense");
    }

    showAlert("Expense added successfully!", "success");
    await refresh();

  } catch (error) {
    showAlert(error.message, "danger");

  } finally {
    showLoading(false);
  }
}

async function updateExpense(id, data) {
  try {
    showLoading(true);

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update expense");
    }

    showAlert("Expense updated successfully!", "success");

    const modalElement = document.getElementById("editModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }

    await refresh();

  } catch (error) {
    showAlert(error.message, "danger");

  } finally {
    showLoading(false);
  }
}

async function deleteExpense(id) {
  const confirmDelete = confirm("Are you sure you want to delete this expense?");
  if (!confirmDelete) return;

  try {
    showLoading(true);

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete expense");
    }

    showAlert("Expense deleted successfully!", "success");
    await refresh();

  } catch (error) {
    showAlert(error.message, "danger");

  } finally {
    showLoading(false);
  }
}

function renderSummary(list) {
  const total = list.reduce((sum, item) => sum + Number(item.amount), 0);
  const count = list.length;
  const highest = list.length > 0
    ? Math.max(...list.map(item => Number(item.amount)))
    : 0;

  document.getElementById("totalAmount").textContent = `$${total.toFixed(2)}`;
  document.getElementById("expensesCount").textContent = count;
  document.getElementById("highestExpense").textContent = `$${highest.toFixed(2)}`;
}

function renderTable(list) {
  const tableBody = document.getElementById("expensesTableBody");
  const noExpensesMsg = document.getElementById("noExpensesMessage");

  tableBody.innerHTML = "";

  if (list.length === 0) {
    noExpensesMsg.classList.remove("d-none");
    return;
  }
  noExpensesMsg.classList.add("d-none");

  list.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="ps-3 fw-semibold">${item.title}</td>
      <td>$${Number(item.amount).toFixed(2)}</td>
      <td><span class="badge ${getBadgeClass(item.category)}">${item.category}</span></td>
      <td>${item.date}</td>
      <td class="text-end pe-3">
        <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditModal(${item.id})">
          <i class="bi bi-pencil"></i> Edit
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteExpense(${item.id})">
          <i class="bi bi-trash"></i> Delete
        </button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function getBadgeClass(category) {
  if (category === "Food") return "bg-success";
  if (category === "Transport") return "bg-info text-dark";
  if (category === "Bills") return "bg-warning text-dark";
  if (category === "Entertainment") return "bg-primary";
  return "bg-secondary";
}

function applyFilter() {
  const selectedCategory = document.getElementById("filterCategory").value;
  const searchTerm = document.getElementById("searchTitle").value.trim().toLowerCase();
  const selectedMonth = document.getElementById("filterMonth").value;

  let filtered = expenses;

  if (selectedCategory !== "All") {
    filtered = filtered.filter(item => item.category === selectedCategory);
  }

  if (searchTerm) {
    filtered = filtered.filter(item => item.title.toLowerCase().includes(searchTerm));
  }

  if (selectedMonth) {
    filtered = filtered.filter(item => item.date.startsWith(selectedMonth));
  }

  renderTable(filtered);
}

function openEditModal(id) {
  const item = expenses.find(exp => exp.id === id);
  if (!item) return;

  document.getElementById("editId").value = item.id;
  document.getElementById("editTitle").value = item.title;
  document.getElementById("editCategory").value = item.category;
  document.getElementById("editAmount").value = item.amount;
  document.getElementById("editDate").value = item.date;

  const modal = new bootstrap.Modal(document.getElementById("editModal"));
  modal.show();
}

async function refresh() {
  const data = await getExpenses();
  renderSummary(data);
  applyFilter();
}

document.addEventListener("DOMContentLoaded", () => {
  refresh();

  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }

  document.getElementById("expenseForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    if (amount <= 0) {
      showAlert("Amount must be greater than 0", "danger");
      return;
    }

    await addExpense({ title, category, amount, date });

    document.getElementById("expenseForm").reset();
    document.getElementById("date").value = new Date().toISOString().split("T")[0];
  });

  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editId").value;
    const title = document.getElementById("editTitle").value.trim();
    const category = document.getElementById("editCategory").value;
    const amount = Number(document.getElementById("editAmount").value);
    const date = document.getElementById("editDate").value;

    if (amount <= 0) {
      showAlert("Amount must be greater than 0", "danger");
      return;
    }

    await updateExpense(id, { title, category, amount, date });
  });

  document.getElementById("filterCategory").addEventListener("change", applyFilter);
  document.getElementById("searchTitle").addEventListener("input", applyFilter);
  document.getElementById("filterMonth").addEventListener("change", applyFilter);

  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    document.getElementById("searchTitle").value = "";
    document.getElementById("filterCategory").value = "All";
    document.getElementById("filterMonth").value = "";
    applyFilter();
  });

  document.getElementById("downloadCsvBtn").addEventListener("click", downloadCSV);
});

function downloadCSV() {
  if (expenses.length === 0) {
    showAlert("No expenses to download.", "warning");
    return;
  }

  const header = "Title,Amount,Category,Date";

  const rows = expenses.map(item =>
    `${item.title},${item.amount},${item.category},${item.date}`
  );

  const csvContent = [header, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();

  URL.revokeObjectURL(url);
}

function showLoading(show) {
  const spinner = document.getElementById("loadingSpinner");
  if (!spinner) return;
  if (show) spinner.classList.remove("d-none");
  else spinner.classList.add("d-none");
}

function showAlert(message, type = "danger") {
  const alertBox = document.getElementById("alertContainer");
  if (!alertBox) return;

  alertBox.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}