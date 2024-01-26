let categories = [
  { id: "C104", name: "Đồng hồ" },
  { id: "C102", name: "Bách hóa" },
  { id: "C101", name: "Thể thao" },
  { id: "C103", name: "Nhà cửa và đời sống" },
];

let products = [
  {
    id: "SP002",
    name: "Đồng hồ sp",
    price: 100000,
    stock: 20,
    image: "",
    categoryId: "C101",
  },
  {
    id: "SP001",
    name: "Bách hóa sp",
    price: 100000,
    stock: 20,
    image: "",
    categoryId: "C103",
  },
  {
    id: "SP004",
    name: "Thể thao sp",
    price: 100000,
    stock: 20,
    image: "",
    categoryId: "C101",
  },
  {
    id: "SP003",
    name: "Nhà cửa và đời sống sp",
    price: 100000,
    stock: 20,
    image: "",
    categoryId: "C104",
  },
];

function updateTable() {
  let tableBody = $("#productTable tbody").html("");

  products.sort((a, b) => a.id.localeCompare(b.id));

  products.forEach((product, index) => {
    if (!product.image) {
      product.image = '/img/logo_hcmus.png';
  }
    let row = tableBody[0].insertRow(index);
    row.innerHTML = `<td>${index + 1}</td>
                     <td>${product.id}</td>
                     <td>${product.name}</td>
                     <td>${product.price}</td>
                     <td>${product.stock}</td>
                     <td>${getCategoryNameById(product.categoryId)}</td>
                     <td><img src="${product.image}" alt="" class = "product_img"></td>
                     <td> 
                        <i class='bx bx-edit text-info cursor-pointer' role="button" onclick="editProduct(${index})" title="Edit"></i>
                        <i class='bx bx-trash text-danger cursor-pointer' role="button" onclick="deleteProduct(${index})" title="Delete"></i>
                     </td>`;
  });
}

function getCategoryNameById(categoryId) {
  const category = categories.find((c) => c.id === categoryId);
  return category ? category.name : "N/A";
}


function populateCategoryOptions() {
	let categorySelect = $("#productCategory");
	categorySelect.empty();
	categories.forEach(category => {
		categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
	});
}
populateCategoryOptions();

function addNewProduct() {
	$("#modalTitle").text("Thêm sản phẩm");
	resetForm();
	$("#editIndex").val("-1");
	showForm();
}

function resetForm(){
	$("#productForm")[0].reset();
	$(".error-message").text("");
  $("#imagePreview").attr("src", "");

}

function editProduct(index) {
	resetForm();
	$("#modalTitle").text("Chỉnh sửa sản phẩm");
	$("#editIndex").val(index);
	let product = products[index];
	$("#productName").val(product.name);
	$("#productPrice").val(product.price);
	$("#productStock").val(product.stock);
	$("#productCategory").val(product.categoryId);
	console.log(product.image);
	if (product.image) {
		$("#imagePreview").attr("src", product.image);
	} else {
		$("#imagePreview").attr("src", "");
	}
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
function deleteProduct(index) {
	deletionIndex = index;
    let productName = products[index].name;
    $("#productToDelete").text(productName);
    $("#deleteProductBtn").data("index", index);
	console.log(index);
    $("#deleteConfirmationModal").modal("show");
}

function confirmDeleteProduct() {
  let index = $("#deleteProductBtn").data("index");
  products.splice(deletionIndex, 1);
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
  
  $("#productName").on("blur", function() {
    validateInput("#productName", "#productNameError", "Tên sản phẩm trống!");
	hideError("#productNameError");
  }).on("focus", function() {
    hideError("#productNameError");
  });

  $("#productPrice").on("blur", function() {
    validateInput("#productPrice", "#productPriceError", "Giá trống!");
	hideError("#productPriceError");
  }).on("focus", function() {
    hideError("#productPriceError");
  });

  $("#productStock").on("blur", function() {
    validateInput("#productStock", "#productStockError", "Số lượng tồn trống!");
	hideError("#productStockError");
  }).on("focus", function() {
    hideError("#productStockError");
  });

  $("#productCategory").on("blur", function() {
    validateInput("#productCategory", "#productCategoryError", "Loại trống!");
	hideError("#productCategoryError");
  }).on("focus", function() {
    hideError("#productCategoryError");
  });


function submitForm() {
	let isValid = true;

	isValid = validateInput("#productName", "#productNameError", "Tên sản phẩm trống!") && isValid;
	isValid = validateInput("#productPrice", "#productPriceError", "Giá trống!") && isValid;
	isValid = validateInput("#productStock", "#productStockError", "Số lượng tồn trống!") && isValid;
	isValid = validateInput("#productCategory", "#productCategoryError", "Loại trống!") && isValid;

	if (isValid) {
		let index = $("#editIndex").val();
    let newName = $("#productName").val().trim();

    if (isProductNameExist(newName, index)) {
      displayError($("#productNameError"), "Sản phẩm đã tồn tại!");
      return;
  } else {
      hideError("#productNameError");
  }
		if (index === "-1") {
			addProduct();
		} else {
			editExistingProduct(index);
		}

		$("#productFormModal").modal("hide");
	}
}

function isProductNameExist(newName, currentIndex) {
  return products.some((product, index) => 
     index != currentIndex && product.name.trim() === newName ); 
   ;
}

function addProduct() {
	
	let product = {
		id: "0",
		name: $("#productName").val().trim(),
		price: $("#productPrice").val(),
		stock: $("#productStock").val(),
		categoryId: $("#productCategory").val(),
		image: $("#imagePreview").attr("src") || "",
	};

	products.push(product);
	updateTable();
}

function editExistingProduct(index) {
	let product = products[index];

	product.name = $("#productName").val().trim();
	product.price = $("#productPrice").val();
	product.stock = $("#productStock").val();
	product.categoryId = $("#productCategory").val();
	product.image = $("#imagePreview").attr("src") || ""; 
	updateTable();
}
function showForm() {
  $("#productFormModal").modal("show");
}

function hideForm() {
  $("#productFormModal").modal("hide");
}

function updateImagePreview(input) {
  const imagePreview = document.getElementById("imagePreview");
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
