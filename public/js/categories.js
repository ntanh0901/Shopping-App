let categories = [
  { id: "C104", name: "Đồng hồ" },
  { id: "C102", name: "Bách hóa" },
  { id: "C101", name: "Thể thao" },
  { id: "C103", name: "Nhà cửa và đời sống" },
];

function populateTable() {
  let tableBody = $("#categoryTable tbody").html("");

  categories.sort((a, b) => a.id.localeCompare(b.id));

  categories.forEach((category, index) => {
    let row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${index + 1}</td>
                     <td>${category.id}</td>
                     <td>${category.name}</td>
                     <td>
                     <i class='bx bx-edit text-info cursor-pointer' role="button" onclick="editCategory(${index})" title="Edit"></i>
                     <i class='bx bx-trash text-danger cursor-pointer' role="button" onclick="deleteCategory(${index})" title="Delete"></i>
                     </td>`;
  });
}
function addCategories() {
  $("#categoryModalLabel").text("Thêm danh mục");
  $("#categoryModal").modal("show");
}
function editCategory(index) {
  let category = categories[index];
  $("#categoryModalLabel").text('Đổi tên danh mục');
  $("#newName").val(category.name);
  $("#categoryModal").modal("show");
  $("#categoryForm button[type='button']").attr(
    "onclick",
    `submitEditForm(${index})`
  );
}

function submitEditForm(index) {
  let newname = $("#newName").val().trim();

  if (newname) {
    categories[index].name = newname;
    populateTable();
  }
}

function deleteCategory(index) {
  let categoryName = categories[index].name;
  $("#categoryToDelete").text(categoryName);
  $("#deleteCategoryBtn").data("index", index);
  $("#deleteConfirmationModal").modal("show");
}

$("#deleteCategoryBtn").click(function () {
  let index = $("#deleteCategoryBtn").data("index");
  categories.splice(index, 1);
  populateTable();
  $("#deleteConfirmationModal").modal("hide");
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
  $("#categoryModal").modal("hide");
  resetForm();
}

function resetForm() {
  $("#newName").text("");
  $("#newNameError").text("");
}

populateTable();
