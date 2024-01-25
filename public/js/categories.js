// let categories = [
//   { maDanhMuc: "D100", tenDanhMuc: "Đồng hồ" },
//   { maDanhMuc: "D101", tenDanhMuc: "Bách hóa" },
//   { maDanhMuc: "D105", tenDanhMuc: "Thể thao" },
//   { maDanhMuc: "D103", tenDanhMuc: "Nhà cửa và đời sống" },
// ];
// function populateTable() {
//   let tableBody = $("#categoryTable tbody").html("");

//   categories.sort((a, b) => a.maDanhMuc.localeCompare(b.maDanhMuc));

//   categories.forEach((category, index) => {
//     let row = tableBody[0].insertRow(index);
//     row.innerHTML = `<td>${index + 1}</td>
//                      <td>${category.maDanhMuc}</td>
//                      <td>${category.tenDanhMuc}</td>
// 					 <td>
// 					 <i class='bx bx-edit text-info cursor-pointer'role="button" onclick="editCategory(${index})" title="Edit"></i>
// 					 <i class='bx bx-trash text-danger cursor-pointer' role="button"onclick="deleteCategory(${index})" title="Delete"></i>
// 				 </td>`;
//   });
// }
// function editCategory(index) {
// 	let category = categories[index];
  
// 	$("#tenDanhMuc").val(category.tenDanhMuc);
  
// 	showForm();
	
// 	$("#categoryForm button[type='button']").attr('onclick', `submitEditForm(${index})`);
//   }
  
//   function submitEditForm(index) {
// 	let newTenDanhMuc = $("#tenDanhMuc").val().trim();
  
// 	if (newTenDanhMuc) {
// 	  categories[index].tenDanhMuc = newTenDanhMuc;
// 	  populateTable();
// 	  cancelForm();
// 	} else {
// 	}
//   }
  
//   function deleteCategory(index) {
// 	let categoryName = categories[index].tenDanhMuc;
// 	$("#categoryToDelete").text(categoryName);
// 	$("#deleteCategoryBtn").data("index", index);
// 	$("#deleteConfirmationModal").modal('show');
//   }
  
//   $("#deleteCategoryBtn").click(function () {
//     let index = $("#deleteCategoryBtn").data("index");
//     categories.splice(index, 1);
//     populateTable();
//     $("#deleteConfirmationModal").modal('hide');
//   });  
  
// function validateInput(inputId, errorId, errorMessage) {
//   let value = $(inputId).val().trim();
//   let errorElement = $(errorId);

//   errorElement.text("");

//   if ($(inputId).prop("required") && !value) {
//     errorElement.text(errorMessage);
//     return false;
//   }

//   return true;
// }

// $("#tenDanhMuc").focus(function () {
//   $("#tenDanhMucError").text("");
// });

// function submitForm() {
//   let tenDanhMuc = $("#tenDanhMuc").val().trim();
//   let maDanhMuc = "0";

//   $("#tenDanhMucError").text("");
//   if (!tenDanhMuc) {
//     $("#tenDanhMucError").text("Tên danh mục trống!");
//     return;
//   }

//   if (categories.some((category) => category.tenDanhMuc === tenDanhMuc)) {
//     $("#tenDanhMucError").text("Tên danh mục đã tồn tại!");
//     isValid = false;
//     return;
//   }

//   categories.push({ maDanhMuc: maDanhMuc, tenDanhMuc: tenDanhMuc });

//   populateTable();

//   $("#tenDanhMuc").val("");

//   $("#btn_add").show();
//   $(".form-container").hide();
// }

// function showForm() {
//   $("#btn_add").hide();
//   $(".form-container").show();
// }

// function cancelForm() {
//   $("#tenDanhMucError").text("");
//   $("#btn_add").show();
//   $(".form-container").hide();
// }

// populateTable();
let categories = [
  { maDanhMuc: "D100", tenDanhMuc: "Đồng hồ" },
  { maDanhMuc: "D101", tenDanhMuc: "Bách hóa" },
  { maDanhMuc: "D105", tenDanhMuc: "Thể thao" },
  { maDanhMuc: "D103", tenDanhMuc: "Nhà cửa và đời sống" },
];

let isTaskInProgress = false;

function populateTable() {
  let tableBody = $("#categoryTable tbody").html("");

  categories.sort((a, b) => a.maDanhMuc.localeCompare(b.maDanhMuc));

  categories.forEach((category, index) => {
    let row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${index + 1}</td>
                     <td>${category.maDanhMuc}</td>
                     <td>${category.tenDanhMuc}</td>
					 <td>
					 <i class='bx bx-edit text-info cursor-pointer' role="button" onclick="editCategory(${index})" title="Edit"></i>
					 <i class='bx bx-trash text-danger cursor-pointer' role="button" onclick="deleteCategory(${index})" title="Delete"></i>
				 </td>`;
  });
}

function editCategory(index) {
  if (!isTaskInProgress) {
    let category = categories[index];
    $("#tenDanhMuc").val(category.tenDanhMuc);
    showForm();
    $("#categoryForm button[type='button']").attr('onclick', `submitEditForm(${index})`);
    isTaskInProgress = true;
  }
}

function submitEditForm(index) {
  let newTenDanhMuc = $("#tenDanhMuc").val().trim();

  if (newTenDanhMuc) {
    categories[index].tenDanhMuc = newTenDanhMuc;
    populateTable();
    cancelForm();
    isTaskInProgress = false;
  }
}

function deleteCategory(index) {
  if (!isTaskInProgress) {
    let categoryName = categories[index].tenDanhMuc;
    $("#categoryToDelete").text(categoryName);
    $("#deleteCategoryBtn").data("index", index);
    $("#deleteConfirmationModal").modal('show');
    isTaskInProgress = false;
  }
}

$("#deleteCategoryBtn").click(function () {
  let index = $("#deleteCategoryBtn").data("index");
  categories.splice(index, 1);
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

$("#tenDanhMuc").focus(function () {
  $("#tenDanhMucError").text("");
});

function submitForm() {
  let tenDanhMuc = $("#tenDanhMuc").val().trim();
  let maDanhMuc = "0";

  $("#tenDanhMucError").text("");
  if (!tenDanhMuc) {
    $("#tenDanhMucError").text("Tên danh mục trống!");
    return;
  }

  if (categories.some((category) => category.tenDanhMuc === tenDanhMuc)) {
    $("#tenDanhMucError").text("Tên danh mục đã tồn tại!");
    isValid = false;
    return;
  }

  categories.push({ maDanhMuc: maDanhMuc, tenDanhMuc: tenDanhMuc });

  populateTable();

  $("#tenDanhMuc").val("");

  $("#btn_add").show();
  $(".form-container").hide();
}

function showForm() {
  isTaskInProgress = true;
  $("#btn_add").hide();
  $(".form-container").show();
}

function cancelForm() {
  $("#tenDanhMucError").text("");
  $("#btn_add").show();
  $(".form-container").hide();
  isTaskInProgress = false;
}

populateTable();
