let categories = [
  { id: "C104", name: "Đồng hồ" },
  { id: "C102", name: "Bách hóa" },
  { id: "C101", name: "Thể thao" },
  { id: "C103", name: "Nhà cửa và đời sống" },
];

let products = [
  { id: "SP002", name: "Đồng hồ sp" , price: 100000, stock: 20, image: " " , categoryId: "C101"},
  { id: "SP001", name: "Bách hóa sp" , price: 100000, stock: 20, image: "  " , categoryId: "C103"},
  { id: "SP004", name: "Thể thao sp" , price: 100000, stock: 20, image: "  " , categoryId: "C101"},
  { id: "SP003", name: "Nhà cửa và đời sống sp", price: 100000, stock: 20, image: "  " , categoryId: "C104" },
];
let isTaskInProgress = false;

function populateTable() {
  let tableBody = $("#productTable tbody").html("");

  products.sort((a, b) => a.id.localeCompare(b.id));

  products.forEach((product, index) => {
    let row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${index + 1}</td>
                     <td>${product.id}</td>
                     <td>${product.name}</td>
                     <td>${product.price}</td>
                     <td>${product.stock}</td>
                     <td>${getCategoryNameById(product.categoryId)}</td>
                     <td><img src="/img/logo_hcmus.png" alt="" class = "product_img"></td>
                     <td> 
                        <i class='bx bx-edit text-info cursor-pointer' role="button" onclick="editProduct(${index})" title="Edit"></i>
                        <i class='bx bx-trash text-danger cursor-pointer' role="button" onclick="deleteProduct(${index})" title="Delete"></i>
                     </td>`;
  });
}

function getCategoryNameById(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : 'N/A';
}

function editProduct(index) {
  if (!isTaskInProgress) {
    let category = categories[index];
    $("#name").val(category.name);
    showForm();
    $("#categoryForm button[type='button']").attr('onclick', `submitEditForm(${index})`);
    isTaskInProgress = true;
  }
}

function submitEditForm(index) {
  let newname = $("#newName").val().trim();

  if (newname) {
    categories[index].name = newname;
    populateTable();
    cancelForm();
    isTaskInProgress = false;
  }
}

function deleteProduct(index) {
  if (!isTaskInProgress) {
    let productName = products[index].name;
    $("#productToDelete").text(productName);
    $("#deleteProductBtn").data("index", index);
    $("#deleteConfirmationModal").modal('show');
    isTaskInProgress = false;
  }
}

$("#deleteProductBtn").click(function () {
  let index = $("#deleteProductBtn").data("index");
  products.splice(index, 1);
  populateTable();
  $("#deleteConfirmationModal").modal('hide');
  isTaskInProgress = false;
});

function validateInput(inputId, errorId, errorMessage) {
  let value = $(inputId).val().trim();
  let errorElement = $(errorId);

  errorElement.text("");

  if ($(inputId).prop("required") && !value) {
    errorElement.text(errorMessage);
    return false;
  }

  return true;
}

$("#newName").focus(function () {
  $("#newNameError").text("");
});

function submitForm() {
  let name = $("#newName").val().trim();
  let id = "0";

  $("#newNameError").text("");
  if (!name) {
    $("#newNameError").text("Tên danh mục trống!");
    return;
  }

  if (categories.some((category) => category.name === name)) {
    $("#newNameError").text("Tên danh mục đã tồn tại!");
    isValid = false;
    return;
  }

  categories.push({ id: id, name: name });

  populateTable();

  $("#newName").val("");

  $("#btn_add").show();
  $(".form-container").hide();
}

function showForm() {
  isTaskInProgress = true;
  $("#btn_add").hide();
  $("#productFormModal").modal('show');
}

function cancelForm() {
  $("#btn_add").show();
  $("#productFormModal").modal('hide');
  isTaskInProgress = false;
}

populateTable();
