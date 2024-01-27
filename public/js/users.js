let users = [
    {
      id: 1,
      name: "Bob",
      phone: "0123456789",
      dob: "11/11/2000",
      email: "bob@gmail.com",
      image: "/img/logo_hcmus.png",
      gender: 'Nữ',
      username: "un1",
      password: "pw1",
      address: "Address 1"
    },
    {
      id: 2,
      name: "Alice",
      phone: "0123456789",
      dob: "05/20/1995",
      email: "alice@gmail.com",
      image: "/img/logo_hcmus.png",
      gender: 'Nam',
      username: "un2",
      password: "pw2",
      address: "Address 2"
    },
    {
      id: 3,
      name: "Charlie",
      phone: "0123456789",
      dob: "08/15/1988",
      email: "charlie@gmail.com",
      image: "/img/logo_hcmus.png",
      gender: 'Nữ',
      username: "un3",
      password: "pw3",
      address: "Address 3"
    },
  ];
  

function updateTable() {
  let tableBody = $("#userTable tbody").html("");

  users.sort((a, b) => a.id - b.id);

  users.forEach((user, index) => {
    if (!user.image) {
      user.image = "/img/logo_hcmus.png";
    }
    let row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${index + 1}</td>
                       <td>${user.id}</td>
                       <td>${user.name}</td>
                       <td> 
                          <i class='bx bx-file-find text-dark cursor-pointer' role="button" onclick="viewUser(${index})" title="Xem"></i>
                          <i class='bx bx-edit text-info cursor-pointer' role="button" onclick="editUser(${index})" title="Sửa"></i>
                          <i class='bx bx-trash text-danger cursor-pointer' role="button" onclick="deleteUser(${index})" title="Xóa"></i>
                       </td>`;
  });
}

function resetForm() {
  $("#userForm")[0].reset();
  $(".error-message").text("");
}

function viewUser(index) {
  resetForm();
  $("#modalTitle").text(users[index].name);
  $(".modal-footer").hide();
  $("#editIndex").val(index);
  
  let user = users[index];

  populateForm(user);
  $("#uploadUserImage").hide();
  showForm();
}

function editUser(index) {
  resetForm();
  $("#modalTitle").text("Chỉnh sửa người dùng");
  $("#confirmBtn").text("Lưu");
  $("#editIndex").val(index);
  let user = users[index];
  populateForm(user)
  showForm();
}

function populateForm(user){
    $("#userFullName").val(user.name);
    $("#userUsername").val(user.username);
    $("#editNam").prop("checked",user.gender.toLowerCase() === "nam" ? true : false);
    $("#editNu").prop("checked",user.gender.toLowerCase() === "nữ" ? true : false);
    $("#userPhone").val(user.phone);
    $("#userEmail").val(user.email);
    $("#userAddress").val(user.address);
    $("#userImage").attr("src", user.image);
}
function addNewUser() {
    $("#modalTitle").text("Thêm người dùng");
    $("#confirmBtn").text("Thêm");
    resetForm();
    $("#editIndex").val("-1");
    showForm();
  }

  
function submitEditForm(index) {
  let newname = $("#newName").val().trim();

  if (newname) {
    categories[index].name = newname;
    updateTable();
    hideForm();
  }
}

let deletionIndex;
function deleteUser(index) {
  deletionIndex = index;
  let userName = users[index].name;
  $("#userToDelete").text(userName);
  $("#deleteUserBtn").data("index", index);
  console.log(index);
  $("#deleteConfirmationModal").modal("show");
}

function confirmDeleteUser() {
  let index = $("#deleteUserBtn").data("index");
  users.splice(deletionIndex, 1);
  updateTable();
}

function validateInput(inputId, errorId, errorMessage) {
  let value = $(inputId).val().trim();
  let errorElement = $(errorId);

  if ($(inputId).prop("required") && !value) {
    displayError(errorElement, errorMessage);
    return false;
  } else {
    hideError(errorElement);
    return true;
  }
}

function displayError(errorElement, errorMessage) {
  errorElement.text(errorMessage);
}

function hideError(errorElement) {
  $(errorElement).text("");
}

$("#userName")
  .on("blur", function () {
    validateInput("#userName", "#userNameError", "Tên người dùng trống!");
    hideError("#userNameError");
  })
  .on("focus", function () {
    hideError("#userNameError");
  });

$("#productPrice")
  .on("blur", function () {
    validateInput("#productPrice", "#productPriceError", "Giá trống!");
    hideError("#productPriceError");
  })
  .on("focus", function () {
    hideError("#productPriceError");
  });

$("#productStock")
  .on("blur", function () {
    validateInput("#productStock", "#productStockError", "Số lượng tồn trống!");
    hideError("#productStockError");
  })
  .on("focus", function () {
    hideError("#productStockError");
  });

$("#productCategory")
  .on("blur", function () {
    validateInput("#productCategory", "#productCategoryError", "Loại trống!");
    hideError("#productCategoryError");
  })
  .on("focus", function () {
    hideError("#productCategoryError");
  });

function submitForm() {
  let isValid = true;

  isValid =
    validateInput("#userName", "#userNameError", "Tên người dùng trống!") &&
    isValid;
  isValid =
    validateInput("#productPrice", "#productPriceError", "Giá trống!") &&
    isValid;
  isValid =
    validateInput(
      "#productStock",
      "#productStockError",
      "Số lượng tồn trống!"
    ) && isValid;
  isValid =
    validateInput("#productCategory", "#productCategoryError", "Loại trống!") &&
    isValid;

  if (isValid) {
    let index = $("#editIndex").val();
    let newName = $("#userName").val().trim();

    if (isUsernameExist(newName, index)) {
      displayError($("#userNameError"), "người dùng đã tồn tại!");
      return;
    } else {
      hideError("#userNameError");
    }
    if (index === "-1") {
      addUser();
    } else {
      editExistingUser(index);
    }

    $("#userFormModal").modal("hide");
  }
}

function isUsernameExist(newName, currentIndex) {
  return users.some(
    (user, index) => index != currentIndex && user.name.trim() === newName
  );
}

function addUser() {
  let user = {
    id: "0",
    name: $("#userName").val().trim(),
    price: $("#productPrice").val(),
    stock: $("#productStock").val(),
    categoryId: $("#productCategory").val(),
    image: $("#imagePreview").attr("src") || "",
  };

  users.push(user);
  updateTable();
}

function editExistingUser(index) {
  let user = users[index];

  user.name = $("#productName").val().trim();
  user.price = $("#productPrice").val();
  user.stock = $("#productStock").val();
  user.categoryId = $("#productCategory").val();
  user.image = $("#imagePreview").attr("src") || "";
  updateTable();
}
function showForm() {
  $("#userFormModal").modal("show");
}

function hideForm() {
  $("#userFormModal").modal("hide");
}

function updateImagePreview(input) {
  const imagePreview = document.getElementById("imagePreview");
  const file = input.files[0];

  if (file) {
    console.log("ne");
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
  }
}

updateTable();
