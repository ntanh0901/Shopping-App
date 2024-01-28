let adminInfo = {
  id: 1,
  name: "Bob",
  phone: "0123456789",
  dob: "1996-12-02",
  email: "bob@gmail.com",
  image: "/img/logo_hcmus.png",
  gender: "Nữ",
  username: "un1",
  // password: "pw1",
  address: "Address 1",
  isCustomer: false,
  isAdmin: true,
};

// updateDashboard();

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
  $("#editPhone").val(adminInfo.phone.trim());
  $("#editEmail").val(adminInfo.email);
  $("#editAddress").val(adminInfo.address);
}
async function submitForm() {
  if (!validateForm()) return;

  let srcArray = adminInfo.image;

  if (onChangeFlag && srcArray && srcArray !== "") {   // Remove old images and add new
    await removeAvt(srcArray);
    const file = $("#productImage")[0].files[0];
    let filename = (await uploadAvt(file)).filename;
    const path = "/img/users/";
    filename = path + filename;
    srcArray = filename;
  }
  else {
    srcArray = $("#editImage").attr("src");
  }
  adminInfo.image = srcArray;
  // adminInfo.image = $("#editImage").attr("src");
  adminInfo.username = $("#editUsername").val();
  adminInfo.name = $("#editName").val();
  adminInfo.dob = $("#editDob").val();
  adminInfo.gender = $('input[name="editGender"]:checked').val();
  adminInfo.phone = $("#editPhone").val();
  adminInfo.email = $("#editEmail").val();
  adminInfo.address = $("#editAddress").val();

  const res = await updateAccount(adminInfo.id, {
    HoTen : adminInfo.name, SDT: adminInfo.phone, 
    NgaySinh: adminInfo.dob, Email: adminInfo.email, 
    Anh: adminInfo.image, GioiTinh: adminInfo.gender || "Nam", 
    UserName: adminInfo.username, LaKhachHang: '0', LaAdmin: '1', DiaChi: adminInfo.address });
  if (!res) {
    $("#errorUsername").text("Username đã tồn tại");
    return;
  }
  onChangeFlag = false;

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
  if (!validteDob()) isValid = false;

  return isValid;
}

$(
  "#editUsername, #editName, #editDob, #editPhone, #editEmail, #editAddress"
).focus(function () {
  $(`#error${$(this).attr("id").replace("edit", "")}`).text("");
});

function updateImagePreview(input) {
  const imagePreview = document.getElementById("editImage");
  const imgSidebar = document.getElementById("imgSidebar");
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imgSidebar.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
  }
  onChangeFlag = true;
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


//-------------------------------
async function getCurrentUser() {
  try {
    const response = await $.ajax({
      url: `/currentUser`,
      method: 'GET'
    });
    return response;
  }
  catch (err) {
    console.error('Error fetching data:', err);
  }
}

let onChangeFlag = false;

async function main() {
  const user = await getCurrentUser();
  // Parse dob
  const dateObject = new Date(user.NgaySinh);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  user.NgaySinh = formattedDate;

  if (!adminInfo.image) {
    adminInfo.image = '/img/logo_hcmus.png';
  }
  
  // Set info
  adminInfo = {
    id: user.MaND,
    name: user.HoTen,
    phone: user.SDT,
    dob: user.NgaySinh,
    email: user.Email,
    image: user.Anh,
    gender: user.GioiTinh,
    username: user.UserName,
    address: user.DiaChi,
    isCustomer: (user.LaKhachHang === '1') ? true : false,
    isAdmin: (user.LaAdmin === '1') ? true : false,
  };

  updateDashboard();
}

main()