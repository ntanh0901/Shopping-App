let adminInfo = {
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
};

updateDashboard();

function updateDashboard() {
  $("#adminImage").attr("src", adminInfo.image);
  $("#adminUsername").text(adminInfo.username);
  $("#adminName").text(adminInfo.name);
  $("#adminAge").text(
    new Date().getFullYear() - new Date(adminInfo.dob).getFullYear()
  );
  $("#adminGender").text(adminInfo.gender);
  $("#adminPhone").text(adminInfo.phone);
  $("#adminEmail").text(adminInfo.email);
  $("#adminAddress").text(adminInfo.address);
}

$("#editProfileModal").on("show.bs.modal", function (event) {
  populateEditProfileModal();
});

function populateEditProfileModal() {
  $("#editImage").attr("src", adminInfo.image);
  $("#editUsername").val(adminInfo.username);
  $("#editName").val(adminInfo.name);
  $("#editDob").val(adminInfo.dob);
  $("#editNam").prop(
    "checked",
    adminInfo.gender.toLowerCase() === "nam" ? true : false
  );
  $("#editNu").prop(
    "checked",
    adminInfo.gender.toLowerCase() === "nữ" ? true : false
  );
  $("#editPhone").val(adminInfo.phone);
  $("#editEmail").val(adminInfo.email);
  $("#editAddress").val(adminInfo.address);
}
function submitForm() {
  if (!validateForm()) return;
  adminInfo.image = $("#editImage").attr("src");
  adminInfo.username = $("#editUsername").val();
  adminInfo.name = $("#editName").val();
  adminInfo.dob = $("#editDob").val();
  adminInfo.sex = $('input[name="editGender"]:checked').val();
  adminInfo.phone = $("#editPhone").val();
  adminInfo.email = $("#editEmail").val();
  adminInfo.address = $("#editAddress").val();

  updateDashboard();
  $("#editProfileModal").modal("hide");
}

function validateForm() {
  $(".error-mesage").text("");

  let isValid = true;

  if ($("#editUsername").val() === "") {
    $("#errorUsername").text("Username trống");
    isValid = false;
  }

  if ($("#editName").val() === "") {
    $("#errorName").text("Họ và tên trống");
    isValid = false;
  }

  if ($("#editDob").val() === "") {
    $("#errorAge").text("Tuổi trống");
    isValid = false;
  }

  if ($("#editPhone").val() === "") {
    $("#errorPhone").text("Số điện thoại trống");
    isValid = false;
  }

  if (!/^\d{10}$/.test($("#editPhone").val())) {
    $("#errorPhone").text("Số điện thoại không hợp lệ!");
    isValid = false;
  }

  if ($("#editEmail").val() === "") {
    $("#errorEmail").text("Email trống");
    isValid = false;
  }

  if (!/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm.test($("#editEmail").val())) {
    $("#errorEmail").text("Email không hợp lệ!");
    isValid = false;
  }

  if ($("#editAddress").val() === "") {
    $("#errorAddress").text("Địa chỉ trống!");
    isValid = false;
  }
  if(!validteDob()) isValid = false;

  return isValid;
}

$(
  "#editUsername, #editName, #editDob, #editPhone, #editEmail, #editAddress"
).focus(function () {
  $(`#error${$(this).attr("id").replace("edit", "")}`).text("");
});

function updateImagePreview(input) {
  const imagePreview = document.getElementById("editImage");
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

function validteDob() {
  let isValid = true;
  const dobValue = $("#editDob").val().trim();

  if ($("#editDob").prop("required") && !dobValue) {
    $("#editDobError").text("Ngày sinh trống!");
    isValid = false;
  } else {
    const currentDate = new Date();
    const selectedDate = new Date(dobValue);

    if (selectedDate > currentDate) {
      $("#editDobError").text("Ngày sinh không thể sau ngày hiện tại!");

      isValid = false;
    } else {
      $("#editDobError").text("");
    }
  }
  return isValid;
}
