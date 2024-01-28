let roles = ['Admin', 'Khách hàng']
// let users = [
//   {
//     id: 1,
//     name: "Bob",
//     phone: "0123456789",
//     dob: "1996-12-02",
//     email: "bob@gmail.com",
//     image: "/img/logo_hcmus.png",
//     gender: "Nữ",
//     username: "un1",
//     password: "pw1",
//     address: "Address 1",
//     isCustomer: false,
//     isAdmin: true
//   },
//   {
//     id: 2,
//     name: "Alice",
//     phone: "0123456789",
//     dob: "2020-01-01",
//     email: "alice@gmail.com",
//     image: "/img/logo_hcmus.png",
//     gender: "Nam",
//     username: "un2",
//     password: "pw2",
//     address: "Address 2",
//     isCustomer: true,
//     isAdmin: true
//   },
//   {
//     id: 3,
//     name: "Charlie",
//     phone: "0123456789",
//     dob: "1994-05-11",
//     email: "charlie@gmail.com",
//     image: "/img/logo_hcmus.png",
//     gender: "Nữ",
//     username: "un3",
//     password: "pw3",
//     address: "Address 3",
//     isCustomer: true,
//     isAdmin: false
//   },
// ];
// updateTable();
async function updateTable() {
  let tableBody = $("#userTable tbody").html("");

  // users.sort((a, b) => a.MaND - b.MaND);

  users.forEach((user, index) => {
    if (!user.Anh) {
      user.Anh = "/img/logo_hcmus.png";
    }
    let row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${index + 1}</td>
                       <td>${user.MaND}</td>
                       <td>${user.HoTen}</td>
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
  $("#modalTitle").text(users[index].HoTen);
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
  $("#editNam").prop("disabled", isReadonly);
  $("#editNu").prop("disabled", isReadonly);
}

function populateForm(user) {
  $("#userRole").val(user.LaAdmin ? "Admin" : "Khách hàng");
  $("#userFullName").val(user.HoTen);
  $("#userUsername").val(user.UserName);
  $("#editNam").prop(
    "checked",
    user.GioiTinh.toLowerCase() === "nam" ? true : false
  );
  $("#editNu").prop(
    "checked",
    user.GioiTinh.toLowerCase() === "nữ" ? true : false
  );
  $("#userPhone").val(user.SDT.trim());
  $("#userDob").val(user.NgaySinh);
  $("#userEmail").val(user.Email);
  $("#userAddress").val(user.DiaChi);
  $("#userImage").attr("src", user.Anh);
}

let deletionIndex;
function deleteUser(index) {
  resetForm();
  deletionIndex = index;
  let userName = users[index].HoTen;
  $("#userToDelete").text(userName);
  $("#deleteUserBtn").data("index", index);
  $("#deleteConfirmationModal").modal("show");
  $("#comfirmDeleteUserBtn").attr('onclick', `confirmDeleteUser(${index})`);
}

async function confirmDeleteUser(index) {
  // let index = $("#deleteUserBtn").data("index");
  const result = await deleteAccount(users[index].MaND, users[index].Anh);
  if (result) {
    users.splice(deletionIndex, 1);
    if (users.length === 0 && currentPage > 1) {
      lastPage--; firstPage--;
      loadPage(--currentPage, currentSearch, currentSort);
    }
    await updateTable();
  }
  else {
    // Handle delete error
  }
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

async function submitForm() {
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
      if(! (await saveEdit(index))) {
        // console.log(false);
        return;
      };
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
      index != currentIndex && user.UserName.trim() === newUsername
  );

  if (!isValid) $("#userUsernameError").text("User name đã tồn tại!");
  return isValid;
}

async function addUser() {
  // Upload avt
  const file = $("#uploadUserImage")[0].files[0];
  const filename = (await uploadAvt(file)).filename;
  const path = "/img/users/";
  const imagePath = path + filename;
  // console.log(imagePath);

  let user = {
    MaND: "0",
    HoTen: $("#userFullName").val().trim(),
    UserName: $("#userUsername").val().trim(),
    GioiTinh: $('input[name="userGender"]:checked').val(),
    SDT: $("#userPhone").val().trim(),
    NgaySinh: $("#userDob").val().trim(),
    Email: $("#userEmail").val().trim(),
    DiaChi: $("#userAddress").val().trim(),
    // image: $("#userImage").attr("src") || "",
    Anh: imagePath || "",
    role: $('#userRole').val(),
    MatKhau: $('#userPassword').val()
  };

  const result = await addAccount(user);
  if (!result) {
    // Handle error here
    console.log('error');
    return;
  }
  user.MaND = result.MaND;
  // End of page
  if (users.length < perpage) {
    users.push(user);
  }
  else if (lastPage === totalPages) {
    if (lastPage < maxShowedPages) lastPage++;
    loadPage(currentPage, currentSearch, currentSort);
  }

  // users.push(user);
  await updateTable();
  onAvtChangeFlag = false;
}

async function saveEdit(index) {
  let user = users[index];

  // Get old srcs
  let srcArray = user.Anh;

  if (onAvtChangeFlag && srcArray && srcArray !== "") {   // Remove old images and add new
    await removeAvt(srcArray);
    const file = $("#uploadUserImage")[0].files[0];
    let filename = (await uploadAvt(file)).filename;
    const path = "/img/users/";
    filename = path + filename;
    srcArray = filename;
  }
  else {
    srcArray = $("#userImage").attr("src");
  }

  user.LaAdmin = $("#userRole").val().trim() === "Admin" ? '1' : '0';
  user.LaKhachHang = (user.LaAdmin === '1') ? '0' : '1';
  user.HoTen = $("#userFullName").val().trim();
  user.UserName = $("#userUsername").val().trim();
  user.GioiTinh = $('input[name="userGender"]:checked').val();
  user.SDT = $("#userPhone").val().trim();
  user.NgaySinh = $("#userDob").val().trim();
  user.Email = $("#userEmail").val().trim();
  user.DiaChi = $("#userAddress").val().trim();
  user.Anh = srcArray || "";

  const res = await updateAccount(users[index].MaND, user);
  if (!res) {
    $("#userUsernameError").text("User name đã tồn tại!");
    return false;
  }
  await updateTable();
  onAvtChangeFlag = false;
  return true;
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
  onAvtChangeFlag = true;
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
  roles.forEach(role => {
    roleInput.append(`<option value="${role}">${role}</option>`);
  });
}

populateRole();

let onAvtChangeFlag = false;
let users;

// Pagination
let currentPage = 1;
let totalPages = null;
const maxShowedPages = 3;
let showedPages = 3;
let firstPage = 1;
let lastPage = null;
let perpage = null;
let currentSearch = null;
let currentSort = null;

async function main(searchInput, sortOrder) {
  currentPage = 1;
  totalPages = null;
  showedPages = null;
  firstPage = 1;
  lastPage = null;
  perpage = null;

  data = await getAccounts(1, searchInput, sortOrder);
  // console.log(searchInput, sortOrder);
  users = data.data;
  // console.log(users);
  await updateTable();

  perpage = data.perpage;
  totalPages = data.totalPages;
  showedPages = (totalPages < maxShowedPages) ? totalPages : maxShowedPages;
  lastPage = showedPages;
  firstPage = 1;
  loadPageContainer(firstPage, lastPage);
}
main(null, null);

function loadPageContainer(first, last) {
  // console.log(first, last);
  $('#page-container').empty();
  if (first < 1) first = 1;
  if (last < first) last = first;
  for (let i = first; i <= last; i++) {
    $('#page-container').append(`<button class="page-click ${i == currentPage ? "active" : ""}">${i}</button>`);
  }
  $('.page-click').on('click', function () {
    if ($('.page-active').length) {
      $('.page-active').removeClass('page-active');
    }
    $(this).addClass('page-active');
    currentPage = parseInt($(this).text());
    loadPage(currentPage, currentSearch, currentSort);
  });
}

// next page button click event
$('#next-page').on('click', function () {
  if (currentPage < totalPages) {
    ++currentPage;
    loadPage(currentPage, currentSearch, currentSort);
    if (currentPage > lastPage) {
      firstPage++;
      lastPage++;
    }
  }
});

// previous page button click event
$('#previous-page').on('click', function () {

  if (currentPage > 1) {
    --currentPage;
    loadPage(currentPage, currentSearch, currentSort);
    if (currentPage < firstPage) {
      firstPage--;
      lastPage--;
    }
  }
})

async function loadPage(page, searchInput, sortOrder) {
  // console.log("load page: ", page);
  data = await getAccounts(page, searchInput, sortOrder);
  users = data.data;
  await updateTable();

  currentPage = page;
  perpage = data.perpage;
  totalPages = data.totalPages;

  if (lastPage > totalPages) lastPage = totalPages;

  loadPageContainer(firstPage, lastPage);
}

async function search(input) {
  if (input === "" || input === null) await main(null, currentSort);
  currentSearch = input;
  await main(input, currentSort);
}

$('#searchbtn').on('click', async () => {
  await search($('#searchInput').val().trim());
})


const sortKeys = ["MaND", "HoTen"];

sortKeys.forEach(key => {
  $('#sort').append(`
    <option value="${key}">${key}</option>
  `);
});

$('#sort').change(async function () {
  const selectedValue = $(this).val();
  currentSort = selectedValue;
  await loadPage(1, currentSearch, selectedValue);
})