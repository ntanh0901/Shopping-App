// let categories = [
//   { id: "C104", name: "Đồng hồ" },
//   { id: "C102", name: "Bách hóa" },
//   { id: "C101", name: "Thể thao" },
//   { id: "C103", name: "Nhà cửa và đời sống" },
// ];
/* Fix: cách chỗ sửa được đánh dấu //
  .id -> .MaLoai
  .name -> .TenLoai
  đổi một số function thành async
  thêm hàm showEditForm để tránh sự kiện submitEditForm(index) bị kẹt
  đem sự kiện sửa submitForm() thành submitEditForm(index) vào hàm show showEditForm
  thêm isTaskInProgress vào submit form
  thêm bảng thông báo lỗi ràng buộc khóa ngoại khi xóa
*/

// let isTaskInProgress = false;

async function populateTable() {
  let tableBody = $("#categoryTable tbody").html("");

  // categories.sort((a, b) => a.MaLoai.localeCompare(b.MaLoai));

  categories.forEach((category, index) => {
    let row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${index + 1}</td>
                     <td>${category.MaLoai}</td>
                     <td>${category.TenLoai}</td>
                     <td>
                     <i class='bx bx-edit text-info cursor-pointer' role="button" onclick="editCategory(${index})" title="Edit"></i>
                     <i class='bx bx-trash text-danger cursor-pointer' role="button" onclick="deleteCategory(${index})" title="Delete"></i>
                     </td>`;
  });
}
function addCategories() {
  $("#categoryModalLabel").text("Thêm danh mục");
  $("#categoryModal").modal("show");
  $('#newName').val("");
  $("#submitbtn").attr('onclick', `submitForm()`);
}
function editCategory(index) {
  let category = categories[index];
  $("#categoryModalLabel").text('Đổi tên danh mục');
  $("#newName").val(category.TenLoai);
  $("#categoryModal").modal("show");
  // $("#categoryForm button[type='button']").attr(
  //   "onclick",
  //   `submitEditForm(${index})`
  // );
  $("#submitbtn").attr('onclick', `submitEditForm(${index})`);
}

async function submitEditForm(index) {
  let newname = $("#newName").val().trim();

  if (newname) {
    categories[index].TenLoai = newname;//
    await updateCategories(categories[index].MaLoai, newname);//
    await populateTable();//
    $("#categoryModal").modal("hide");
  }
}

function deleteCategory(index) {
  let categoryName = categories[index].TenLoai;//
  $("#categoryToDelete").text(categoryName);
  $("#deleteCategoryBtn").data("index", index);
  $("#deleteConfirmationModal").modal("show");
}

$("#deleteCategoryBtn").click(async function () {//
  let index = $("#deleteCategoryBtn").data("index");
  if (await deleteCategories(categories[index].MaLoai)) { //
    categories.splice(index, 1);//
    await populateTable();//
  }//
  else {//
    $("#errorDeleteModal").modal('show');
  }//
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

async function submitForm() {//
  let name = $("#newName").val().trim();
  let id = "0";

  $("#newNameError").text("");
  if (!name) {
    $("#newNameError").text("Tên danh mục trống!");
    return;
  }

  if (categories.some((category) => category.TenLoai === name)) {//
    $("#newNameError").text("Tên danh mục đã tồn tại!");
    isValid = false;
    return;
  }
  const result = await addCategory(name);//
  categories.push({ MaLoai: result.MaLoai, TenLoai: result.TenLoai });//
  await populateTable();//

  $("#newName").val("");
  $("#categoryModal").modal("hide");
  resetForm();
}

// function showForm() {
//   isTaskInProgress = true;
//   $("#newName").val("");//
//   $("#btn_add").hide();
//   $("#submitbtn").attr('onclick', `submitForm()`);//
//   $(".form-container").show();
// }

// function cancelForm() {
//   $("#newNameError").text("");
// }
function resetForm() {
  $("#newName").text("");
  $("#newNameError").text("");
}

function showEditForm(index) {
  isTaskInProgress = true;
  $("#btn_add").hide();
  $("#submitbtn").attr('onclick', `submitEditForm(${index})`);
  $(".form-container").show();
}
let categories;
async function main() {
  categories = (await getCategories()).categories;
  await populateTable();
}
main();