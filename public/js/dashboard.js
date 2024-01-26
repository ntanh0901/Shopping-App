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

function updateDashboard(){
	$("#adminImage").text(adminInfo.image);
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
  $("#editImage").val(adminInfo.image);
  $("#editUsername").val(adminInfo.username);
  $("#editName").val(adminInfo.name);
  $("#editAge").val(adminInfo.age);
  $("#editNam").prop("checked",adminInfo.sex.toLowerCase() === "nam" ? true : false);
  $("#editNu").prop("checked", adminInfo.sex.toLowerCase() === "nữ" ? true : false);
  $("#editPhone").val(adminInfo.phone);
  $("#editEmail").val(adminInfo.email);
  $("#editAddress").val(adminInfo.address);
}
function submitForm() {
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

