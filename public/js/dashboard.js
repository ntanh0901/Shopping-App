let adminInfo = {
  image: "/img/logo_hcmus.png",
  username: "Admin",
  name: "Nguyễn Admin",
  age: 24,
  sex: "nam",
  phone: "0867564837",
  email: "admin@example.com",
  address: "Admin address",
};

updateDashboard();

function updateDashboard() {
  $("#adminImage").attr("src", adminInfo.image);
  $("#adminUsername").text(adminInfo.username);
  $("#adminName").text(adminInfo.name);
  $("#adminAge").text(adminInfo.age);
  $("#adminSex").text(adminInfo.sex);
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
  $("#editAge").val(adminInfo.age);
  $("#editNam").prop(
    "checked",
    adminInfo.sex.toLowerCase() === "nam" ? true : false
  );
  $("#editNu").prop(
    "checked",
    adminInfo.sex.toLowerCase() === "nữ" ? true : false
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
  adminInfo.age = $("#editAge").val();
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

  if ($("#editAge").val() === "") {
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

  if (!/\S+@\S+\.\S+/.test($("#editEmail").val())) {
    $("#errorEmail").text("Email không hợp lệ!");
    isValid = false;
  }

  if ($("#editAddress").val() === "") {
    $("#errorAddress").text("Địa chỉ trống!");
    isValid = false;
  }

  return isValid;
}

$("#editUsername, #editName, #editAge, #editPhone, #editEmail, #editAddress").focus(function () {
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