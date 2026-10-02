const API_URL = "http://localhost:3000/api/expenses";

// In-memory expenses cache
let expenses = [];

// Fetch all expenses from backend API
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

// Add a new expense (POST)
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

// Update an existing expense (PUT)
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

    // Close the edit modal
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

// Delete an expense (DELETE)
async function deleteExpense(id) {
  // Update browser URL to show delete ID (e.g. ?delete=5)
  const url = new URL(window.location);
  if (url.searchParams.get("delete") !== String(id)) {
    url.searchParams.set("delete", id);
    window.history.pushState({ deleteId: id }, "", url);
  }

  const confirmDelete = confirm("Are you sure you want to delete this expense?");

  // Remove delete ID from URL once confirmed or cancelled
  const clearUrl = new URL(window.location);
  clearUrl.searchParams.delete("delete");
  window.history.pushState({}, "", clearUrl);

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

// Calculate and render summary stats
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

// Render expense rows in the table
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

// Get badge color class for category
function getBadgeClass(category) {
  if (category === "Food") return "bg-success";
  if (category === "Transport") return "bg-info text-dark";
  if (category === "Bills") return "bg-warning text-dark";
  if (category === "Entertainment") return "bg-primary";
  return "bg-secondary";
}

// Filter expenses by category, search text, and month
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

// Open modal and pre-fill data for editing
function openEditModal(id) {
  const item = expenses.find(exp => exp.id === id);
  if (!item) return;

  document.getElementById("editId").value = item.id;
  document.getElementById("editTitle").value = item.title;
  document.getElementById("editCategory").value = item.category;
  document.getElementById("editAmount").value = item.amount;
  document.getElementById("editDate").value = item.date;

  // Update browser URL to show edit ID (e.g. ?edit=5)
  const url = new URL(window.location);
  if (url.searchParams.get("edit") !== String(id)) {
    url.searchParams.set("edit", id);
    window.history.pushState({ editId: id }, "", url);
  }

  const modalElement = document.getElementById("editModal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  modal.show();
}

// Check URL query parameters for edit or delete ID on load
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("edit");
  const deleteId = urlParams.get("delete");

  if (editId) {
    openEditModal(Number(editId));
  } else if (deleteId) {
    deleteExpense(Number(deleteId));
  }
}

// Fetch latest data and update UI
async function refresh() {
  const data = await getExpenses();
  renderSummary(data);
  applyFilter();
  checkUrlParams();
}

// Initialize application on DOM load
document.addEventListener("DOMContentLoaded", () => {
  refresh();

  // Set today as default date in add form
  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }

  // Handle add expense form submit
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

  // Handle edit expense form submit
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

  // Remove edit ID from URL when modal is closed
  const editModalEl = document.getElementById("editModal");
  if (editModalEl) {
    editModalEl.addEventListener("hidden.bs.modal", () => {
      const url = new URL(window.location);
      if (url.searchParams.has("edit")) {
        url.searchParams.delete("edit");
        window.history.pushState({}, "", url);
      }
    });
  }

  // Handle browser back and forward navigation
  window.addEventListener("popstate", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("edit");
    const deleteId = urlParams.get("delete");
    const modalEl = document.getElementById("editModal");
    const modal = bootstrap.Modal.getInstance(modalEl);

    if (editId) {
      openEditModal(Number(editId));
    } else if (deleteId) {
      deleteExpense(Number(deleteId));
    } else if (modal) {
      modal.hide();
    }
  });

  // Filter and search event listeners
  document.getElementById("filterCategory").addEventListener("change", applyFilter);
  document.getElementById("searchTitle").addEventListener("input", applyFilter);
  document.getElementById("filterMonth").addEventListener("change", applyFilter);

  // Clear filters button
  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    document.getElementById("searchTitle").value = "";
    document.getElementById("filterCategory").value = "All";
    document.getElementById("filterMonth").value = "";
    applyFilter();
  });

  // Download CSV button
  document.getElementById("downloadCsvBtn").addEventListener("click", downloadCSV);
});

// Export expenses to CSV file
function downloadCSV() {
  if (expenses.length === 0) {
    showAlert("No expenses to download.", "warning");
    return;
  }

  const header = "Title,Amount,Category,Date";

  const rows = expenses.map(item =>
    `"${item.title.replace(/"/g, '""')}",${item.amount},${item.category},${item.date}`
  );

  const csvContent = [header, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();

  URL.revokeObjectURL(url);
}

// Toggle loading spinner visibility
function showLoading(show) {
  const spinner = document.getElementById("loadingSpinner");
  if (!spinner) return;
  if (show) spinner.classList.remove("d-none");
  else spinner.classList.add("d-none");
}

// Display temporary alert message
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