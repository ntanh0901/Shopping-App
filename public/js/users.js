let roles = ["Admin", "Khách hàng"];
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
    isCustomer: false,
    isAdmin: true,
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
    isCustomer: true,
    isAdmin: true,
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
    isCustomer: true,
    isAdmin: false,
  },
  {
    id: 4,
    name: "David",
    phone: "0123456789",
    dob: "1990-08-15",
    email: "david@gmail.com",
    image: "/img/logo_hcmus.png",
    gender: "Nam",
    username: "un4",
    password: "pw4",
    address: "Address 4",
    isCustomer: true,
    isAdmin: false,
  },
  {
    id: 5,
    name: "Eva",
    phone: "0123456789",
    dob: "1985-05-22",
    email: "eva@gmail.com",
    image: "/img/logo_hcmus.png",
    gender: "Nữ",
    username: "un5",
    password: "pw5",
    address: "Address 5",
    isCustomer: true,
    isAdmin: false,
  },
  {
    id: 6,
    name: "Frank",
    phone: "0123456789",
    dob: "1993-11-30",
    email: "frank@gmail.com",
    image: "/img/logo_hcmus.png",
    gender: "Nam",
    username: "un6",
    password: "pw6",
    address: "Address 6",
    isCustomer: false,
    isAdmin: true,
  },
];
let currentPage = 1;
const usersPerPage = 5;
let totalPages;
totalPages = Math.ceil(users.length / usersPerPage);

updateTable();

function updateTable() {
  let tableBody = $("#userTable tbody").html("");
  users.sort((a, b) => a.id - b.id);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  displayedUsers.forEach((user, index) => {
    if (!user.image) {
      user.image = "/img/logo_hcmus.png";
    }

    let row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${startIndex + index + 1}</td>
                     <td>${user.id}</td>
                     <td>${user.name}</td>
                     <td> 
                       <i class='bx bx-file-find text-dark cursor-pointer' role="button" onclick="viewUser(${
                         startIndex + index
                       })" title="Xem"></i>
                       <i class='bx bx-edit text-info cursor-pointer' role="button" onclick="editUser(${
                         startIndex + index
                       })" title="Sửa"></i>
                       <i class='bx bx-trash text-danger cursor-pointer' role="button" onclick="deleteUser(${
                         startIndex + index
                       })" title="Xóa"></i>
                     </td>`;
  });

  updatePaginationButtons();
}

function resetForm() {
  $("#userForm")[0].reset();
  $(".error-message").text("");
  $("#userImage").attr("src", "");
  $("#uploadUserImage").show();
  $("#userImage").srd = "";
  $(".modal-footer").show();
  $("#password").show();
  $("#repassword").show();
}

function addNewUser() {
  resetForm();
  $("#modalTitle").text("Thêm người dùng");
  $("#confirmBtn").text("Thêm");
  $("#editIndex").val("-1");
  makeReadonly(false);
  showForm();
}

function viewUser(index) {
  resetForm();
  $("#modalTitle").text(users[index].name);
  $("#password").hide();
  $("#repassword").hide();
  $(".modal-footer").hide();
  $("#uploadUserImage").hide();
  $("#editIndex").val(index);

  let user = users[index];

  populateForm(user);
  makeReadonly(true);
  showForm();
}

function editUser(index) {
  resetForm();
  $("#password").hide();
  $("#repassword").hide();
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
  $("#userForm select").prop("disabled", isReadonly);
  $("#userNam").prop("disabled", isReadonly);
  $("#userNu").prop("disabled", isReadonly);
}

function populateForm(user) {
  $("#userRole").val(user.isAdmin ? "Admin" : "Khách hàng");
  $("#userFullName").val(user.name);
  $("#userUsername").val(user.username);
  $("#userNam").prop(
    "checked",
    user.gender.toLowerCase() === "nam" ? true : false
  );
  $("#userNu").prop(
    "checked",
    user.gender.toLowerCase() === "nữ" ? true : false
  );
  $("#userPhone").val(user.phone);
  $("#userDob").val(user.dob);
  $("#userEmail").val(user.email);
  $("#userAddress").val(user.address);
  $("#userImage").attr("src", user.image);
}

let deletionIndex;
function deleteUser(index) {
  resetForm();
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

$("#userPassword, #userRepassword")
  .on("blur", function () {
    validatePassword();
    hideError("#userPasswordError");
  })
  .on("focus", function () {
    hideError("#userPasswordError");
  });

$('input[name="userGender"]')
  .on("blur", function () {
    validateInput(
      'input[name="userGender"]:checked',
      "#userGenderError",
      "Giới tính trống!"
    );
    hideError("#userGenderError");
  })
  .on("click", function () {
    hideError("#userGenderError");
  });

$("#userPhone")
  .on("blur", function () {
    validateInput("#userPhone", "#userPhone", "Số điện thoại trống!");
    hideError("#userPhoneError");
  })
  .on("focus", function () {
    hideError("#userPhoneError");
  });

$("#userDob")
  .on("blur", function () {
    validateInput("#userDob", "#userDobError", "Ngày sinh trống!");
    hideError("#userDobError");
  })
  .on("focus", function () {
    hideError("#userDobError");
  });

$("#userAddress")
  .on("blur", function () {
    validateInput("#userEmail", "#userAddressError", "Địa chỉ không hợp lệ!");
    hideError("#userAddressError");
  })
  .on("focus", function () {
    hideError("#userAddressError");
  });

$("#userEmail")
  .on("blur", function () {
    validateInput("#userEmail", "#userEmailError", "Email trống!");
    hideError("#userEmailError");
  })
  .on("focus", function () {
    hideError("#userEmailError");
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
    validateInput("#userEmail", "#userEmailError", "Email trống!")
  );
  validationResults.push(
    validateInput("#userAddress", "#userAddressError", "Địa chỉ trống!")
  );
  validationResults.push(
    validateInput("#userPhone", "#userPhoneError", "Số điện thoại trống!")
  );
  validationResults.push(validteDob());

  if (!/^\d{10}$/.test($("#userPhone").val())) {
    $("#errorPhone").text("Số điện thoại không hợp lệ!");
    validationResults.push(false);
  }

  if (!/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm.test($("#userEmail").val())) {
    $("#errorEmail").text("Email không hợp lệ!");
    validationResults.push(false);
  }

  const genderChecked = $('input[name="userGender"]:checked').length > 0;
  if (!genderChecked) {
    $("#userGenderError").text("Giới tính trống!");
    validationResults.push(false);
  } else {
    hideError("#userGenderError");
  }

  if (index === "-1") {
    validationResults.push(validateImage());
    validationResults.push(validatePassword());
  }

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
  const fileInput = $("#uploadUserImage")[0];
  const errorElement = $("#userImageError");
  if (fileInput.files.length === 0) {
    $(errorElement).text("Vui lòng chọn một ảnh.");
    return false;
  }
  return true;
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
    dob: $("#userDob").val().trim(),
    email: $("#userEmail").val().trim(),
    address: $("#userAddress").val().trim(),
    image: $("#userImage").attr("src") || "",
  };

  users.push(user);
  updateTable();
}

function saveEdit(index) {
  let user = users[index];

  user.isAdmin = $("#userRole").val().trim() === "Admin" ? true : false;
  user.isCustomer = !user.isAdmin;
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
  $("#userImageError").text("");
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

function togglePasswordVisibility(inputId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = passwordInput.nextElementSibling;

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("bi-eye-slash");
    eyeIcon.classList.add("bi-eye");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("bi-eye");
    eyeIcon.classList.add("bi-eye-slash");
  }
}

function validatePassword() {
  const passwordValue = $("#userPassword").val().trim();
  const repasswordValue = $("#userRepassword").val().trim();

  if (passwordValue !== repasswordValue) {
    $("#userPasswordError").text("Mật khẩu xác nhận không khớp!");
    return false;
  } else {
    hideError("#userRepasswordError");
  }

  if (!passwordValue || !repasswordValue) {
    $("#userPasswordError").text(
      "Mật khẩu và mật khẩu xác nhận không được để trống!"
    );
    return false;
  } else {
    hideError("#userPasswordError");
  }
  return true;
}

function populateRole() {
  let roleInput = $("#userRole");
  roleInput.empty();
  roles.forEach((role) => {
    roleInput.append(`<option value="${role}">${role}</option>`);
  });
}

populateRole();

// pagination
$("#previous-page-user").on("click", function () {
  if (currentPage > 1) {
    currentPage--;
    updateTable();
  }
});

$("#next-page-user").on("click", function () {
  console.log('ne');
  if (currentPage < totalPages) {
    currentPage++;
    updateTable();
  }
});
function updateTable() {
  let tableBody = $("#userTable tbody").html("");
  users.sort((a, b) => a.id - b.id);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  displayedUsers.forEach((user, index) => {
    if (!user.image) {
      user.image = "/img/logo_hcmus.png";
    }

    let row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${startIndex + index + 1}</td>
                     <td>${user.id}</td>
                     <td>${user.name}</td>
                     <td> 
                       <i class='bx bx-file-find text-dark cursor-pointer' role="button" onclick="viewUser(${
                         startIndex + index
                       })" title="Xem"></i>
                       <i class='bx bx-edit text-info cursor-pointer' role="button" onclick="editUser(${
                         startIndex + index
                       })" title="Sửa"></i>
                       <i class='bx bx-trash text-danger cursor-pointer' role="button" onclick="deleteUser(${
                         startIndex + index
                       })" title="Xóa"></i>
                     </td>`;
  });

  updatePaginationButtons();
}

function updatePaginationButtons() {
  totalPages = Math.ceil(users.length / usersPerPage);

  $("#currentPage").text(currentPage);

  const prevPageBtn = $("#previous-page-user");
  const nextPageBtn = $("#next-page-user");
  const pageContainer = $("#page-container-user");

  prevPageBtn.prop("disabled", currentPage === 1);
  nextPageBtn.prop("disabled", currentPage === totalPages);

  pageContainer.empty();

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = $("<button>")
      .addClass("page-link")
      .text(i)
      .on("click", function () {
        changePage(i);
      });

    const pageItem = $("<li>").addClass("page-item").append(pageButton);

    if (i === currentPage) {
      pageItem.addClass("active");
    }

    pageContainer.append(pageItem);
  }
}

function changePage(pageNumber) {
  currentPage = pageNumber;
  updateTable();
}
