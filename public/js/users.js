let users = [
  {
    id: 1,
    name: "Bob",
    phone: "0123456789",
    dob: "1996-12-02",
    email: "bob@gmail.com",
    image: "/img/logo_hcmus.png",
    gender: "Nữ",
    username: "un1",
    password: "pw1",
    address: "Address 1",
  },
  {
    id: 2,
    name: "Alice",
    phone: "0123456789",
    dob: "2020-01-01",
    email: "alice@gmail.com",
    image: "/img/logo_hcmus.png",
    gender: "Nam",
    username: "un2",
    password: "pw2",
    address: "Address 2",
  },
  {
    id: 3,
    name: "Charlie",
    phone: "0123456789",
    dob: "1994-05-11",
    email: "charlie@gmail.com",
    image: "/img/logo_hcmus.png",
    gender: "Nữ",
    username: "un3",
    password: "pw3",
    address: "Address 3",
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
  $("#userImage").attr("src", "");
  $(".modal-footer").show();
}

function viewUser(index) {
  resetForm();
  $("#modalTitle").text(users[index].name);
  $(".modal-footer").hide();
  $("#editIndex").val(index);

  let user = users[index];

  populateForm(user);
  $("#uploadUserImage").hide();
  makeReadonly(true);
  showForm();
}

function editUser(index) {
  resetForm();
  $("#modalTitle").text("Chỉnh sửa người dùng");
  $("#confirmBtn").text("Lưu");
  $("#editIndex").val(index);

  let user = users[index];
  populateForm(user);
  $("#uploadUserImage").show();
  makeReadonly(false);
  showForm();
}

function makeReadonly(isReadonly) {
  $("#userForm :input").prop("readonly", isReadonly);
  $("#editNam").prop("disabled", isReadonly);
  $("#editNu").prop("disabled", isReadonly);
}

function populateForm(user) {
  $("#userFullName").val(user.name);
  $("#userUsername").val(user.username);
  $("#editNam").prop(
    "checked",
    user.gender.toLowerCase() === "nam" ? true : false
  );
  $("#editNu").prop(
    "checked",
    user.gender.toLowerCase() === "nữ" ? true : false
  );
  $("#userPhone").val(user.phone);
  $("#userDob").val(user.dob);
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

let deletionIndex;
function deleteUser(index) {
  deletionIndex = index;
  let userName = users[index].name;
  $("#userToDelete").text(userName);
  $("#deleteUserBtn").data("index", index);
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
    $(errorElement).text(errorMessage);
    return false;
  } else {
    hideError(errorElement);
    return true;
  }
}

function validteDob() {
  let isValid = true;
  const dobValue = $("#userDob").val().trim();
  const dobErrorElement = $("#userDobError");

  if ($("#userDob").prop("required") && !dobValue) {
    $("#userDobError").text("Ngày sinh trống!");
    isValid = false;
  } else {
    const currentDate = new Date();
    const selectedDate = new Date(dobValue);

    if (selectedDate > currentDate) {
      $("#userDobError").text("Ngày sinh không thể sau ngày hiện tại!");

      isValid = false;
    } else {
      $("#userDobError").text("");
    }
  }
  return isValid;
}

function hideError(errorElement) {
  $(errorElement).text("");
}

$("#userFullName")
  .on("blur", function () {
    validateInput("#userFullName", "#userFullNameError", "Họ tên trống!");
    hideError("#userFullNameError");
  })
  .on("focus", function () {
    hideError("#userFullNameError");
  });

  $("#userUsername")
  .on("blur", function () {
    validateInput("#userUsername", "#userUsernameError", "Username trống!");
    hideError("#userUsernameError");
  })
  .on("focus", function () {
    hideError("#userUsernameError");
  });

  $("#userGender")
  .on("blur", function () {
    validateInput('input[name="userGender"]:checked', "#userGenderError", "Giới tính trống!");
    hideError("#userGenderError");
  })
  .on("click", function () {
    hideError("#userGenderError");
  });

$("#userPhone")
  .on("blur", function () {
    validateInput("#userPhone", "#errorPhone", "Số điện thoại trống!");
    hideError("#errorPhone");
  })
  .on("focus", function () {
    hideError("#errorPhone");
  });

$("#userDob")
  .on("blur", function () {
    validateInput("#userDob", "#userDobError", "Số điện thoại trống!");
    hideError("#userDobError");
  })
  .on("focus", function () {
    hideError("#userDobError");
  });

$("#userEmail")
  .on("blur", function () {
    validateInput("#userEmail", "#errorEmail", "Email không hợp lệ!");
    hideError("#errorEmail");
  })
  .on("focus", function () {
    hideError("#errorEmail");
  });

$("#userAddress")
  .on("blur", function () {
    validateInput("#userAddress", "#errorAddress", "Địa chỉ trống!");
    hideError("#errorAddress");
  })
  .on("focus", function () {
    hideError("#errorAddress");
  });
function submitForm() {
  let index = $("#editIndex").val();

  const validationResults = [];

  validationResults.push(
    validateInput("#userFullName", "#userFullNameError", "Họ tên trống!")
  );
  validationResults.push(
    validateInput("#userUsername", "#userUsernameError", "Username trống!")
  );
  validationResults.push(
    validateInput("#userEmail", "#errorEmail", "Email trống!")
  );
  validationResults.push(
    validateInput("#userAddress", "#errorAddress", "Địa chỉ trống!")
  );
  validationResults.push(
    validateInput("#userPhone", "#errorPhone", "Số điện thoại trống!")
  );
  validationResults.push(
    validateInput("#userAddress", "#errorAddress", "Địa chỉ trống!")
  );
  validationResults.push(validteDob());

  if (!/^\d{10}$/.test($("#userPhone").val())) {
    $("#errorPhone").text("Số điện thoại không hợp lệ");
    validationResults.push(false);
  }

  if (!/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm.test($("#userEmail").val())) {
    $("#errorEmail").text("Email không hợp lệ");
    validationResults.push(false);
  }

  const genderChecked = $('input[name="userGender"]:checked').length > 0;
  if (!genderChecked) {
    $("#userGenderError").text("Giới tính trống!");
    validationResults.push(false);
  } else {
    hideError("#userGenderError");
  }

  const imageValid = validateImage();
  validationResults.push(imageValid);

  validationResults.push(validateUsername($("#userUsername").val(), index));

  const isValid = validationResults.every((result) => result);

  if (isValid) {
    if (index === "-1") {
      addUser();
    } else {
      saveEdit(index);
    }
    $("#userFormModal").modal("hide");
  }
}

function validateImage() {
  const imagePreview = document.getElementById("userImage");
  const imageSrc = imagePreview.src;

  if (!imageSrc || imageSrc === "") {
    $("#userImageError").text("Vui lòng chọn ảnh!");
    return false;
  } else {
    hideError("#userImageError");
    return true;
  }
}


function validateUsername(newUsername, currentIndex) {
  let isValid = !users.some(
    (user, index) =>
      index != currentIndex && user.username.trim() === newUsername
  );

  if (!isValid) $("#userUsernameError").text("User name đã tồn tại!");
  return isValid;
}

function addUser() {
  let user = {
    id: "0",
    name: $("#userFullName").val().trim(),
    username: $("#userUsername").val().trim(),
    gender: $('input[name="userGender"]:checked').val(),
    phone: $("#userPhone").val().trim(),
    email: $("#userEmail").val().trim(),
    address: $("#userAddress").val().trim(),
    image: $("#userImage").attr("src") || "",
  };

  users.push(user);
  updateTable();
}

function saveEdit(index) {
  console.log(index);

  let user = users[index];

  user.name = $("#userFullName").val().trim();
  user.username = $("#userUsername").val().trim();
  user.gender = $('input[name="userGender"]:checked').val();
  user.phone = $("#userPhone").val().trim();
  user.dob = $("#userDob").val().trim();
  user.email = $("#userEmail").val().trim();
  user.address = $("#userAddress").val().trim();
  user.image = $("#userImage").attr("src") || "";

  updateTable();
}

function showForm() {
  $("#userFormModal").modal("show");
}

function hideForm() {
  $("#userFormModal").modal("hide");
}

function updateImagePreview(input) {
  const imagePreview = document.getElementById("userImage");
  const file = input.files[0];

  if (file) {
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
