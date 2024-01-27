document.addEventListener('DOMContentLoaded', function () {
    var tooltips = document.querySelectorAll('[data-toggle="tooltip"]');
    tooltips.forEach(function (tooltip) {
        new bootstrap.Tooltip(tooltip);
    });
});
const rows = document.querySelectorAll("tbody tr"); rows.forEach(function
    (row) {
    const statusCell = row.querySelector("td:nth-child(4)"); const status
        = statusCell.textContent.trim(); switch (status) {
            case "Đã thanh toán":
                statusCell.classList.toggle("paid"); break; case "Chưa thanh toán":
                statusCell.classList.toggle("pending"); break; case "Hủy":
                statusCell.classList.toggle("canceled"); break;
        }
});

$("#btn-edit").on("click", function () {
    $(".dashboard-container, .edit-profile-container").toggle();	
	$(".edit-profile-container").toggleClass("d-flex");
});
