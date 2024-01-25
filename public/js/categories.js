var categories = [
  { maDanhMuc: "D100", tenDanhMuc: "Đồng hồ" },
  { maDanhMuc: "D101", tenDanhMuc: "Bách hóa" },
  { maDanhMuc: "D105", tenDanhMuc: "Thể thao" },
  { maDanhMuc: "D103", tenDanhMuc: "Nhà cửa và đời sống" },
];

function populateTable() {
  var tableBody = $("#categoryTable tbody").html("");

  categories.sort((a, b) => a.maDanhMuc.localeCompare(b.maDanhMuc));

  categories.forEach((category, index) => {
    var row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${index + 1}</td><td>${category.maDanhMuc}</td><td>${
      category.tenDanhMuc
    }</td>`;
  });
}

function validateInput(inputId, errorId, errorMessage) {
  var value = $(inputId).val().trim();
  var errorElement = $(errorId);

  errorElement.text("");

  if ($(inputId).prop("required") && !value) {
    errorElement.text(errorMessage);
    return false;
  }

  return true;
}

function validateTenDanhMuc() {
  return validateInput("#tenDanhMuc", "#tenDanhMucError", "Tên danh mục trống");
}

$("#tenDanhMuc").blur(function () {
  validateInput(`#${this.id}`, `#${this.id}Error`, `${this.name} trống`);
});

function submitForm() {
  var tenDanhMuc = $("#tenDanhMuc").val().trim();
  var maDanhMuc = "0";

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
  $("#btn_add").hide();
  $(".form-container").show();
}

function cancelForm() {
  $("#btn_add").show();
  $(".form-container").hide();
}

populateTable();
