let revenueOnCategory = [
  { type: "Phụ kiện thời trang", sum: 1000000 },
  { type: "Nhà cửa và đời sống", sum: 3000000 },
  { type: "Thể thao", sum: 2000000 },
  { type: "Bách hóa", sum: 5000000 },
  { type: "Đồng hồ", sum: 6000000 },
];

let aggregatedData = {};
let totalSum = 0;

revenueOnCategory.forEach((item) => {
  if (!aggregatedData[item.type]) {
    aggregatedData[item.type] = 0;
  }
  aggregatedData[item.type] += item.sum;
  totalSum += item.sum;
});

$("#sumRevenue").text(
  `${totalSum.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
);

let percentages = Object.values(aggregatedData).map((value) =>
  Math.floor((value / totalSum) * 100)
);

let ctx = document.getElementById("revenueChart").getContext("2d");
let myChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        data: percentages,
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "\nDoanh thu theo danh mục sản phẩm",
        position: "bottom",
        lineHeight: 2,
      },
      tooltip: {
        mode: "point",
        callbacks: {
          label: function (tooltipItem) {
            if (!tooltipItem) return;
            let label = tooltipItem.label || "";
            let value = aggregatedData[label] || "";
            let percent = tooltipItem.raw;
            return `${label}: ${value.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })} (${percent}%)`;
          },
        },
      },
    },
  },
});

let legendHTML = "<ul> ";
Object.keys(aggregatedData).forEach((label, i) => {
  let value = aggregatedData[label];
  let percent = percentages[i];
  let legendColor = myChart.data.datasets[0].backgroundColor[i];

  let labelPart = `<div style="width: 13rem; ">${label}</div>`;
  let sumPart = `<div style="width: 8rem; ">${value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  })}</div>`;
  let percentPart = `<div style="width: 5rem; ">${percent}%</div>`;

  legendHTML += `<li style="list-style-type: disc; color: ${legendColor};"> <div class="d-flex my-auto  mt-n2" style="color: black;"> ${labelPart} ${sumPart} ${percentPart} </div></li>`;
});
legendHTML += `</ul>`;
$("#legendChart").html(legendHTML);

// Top 5 best seller
const top5 = [
  { name: "Đồng hồ nam dây da Skmei 90TCK58", sold: 150 },
  { name: "Thảm Tập Yoga TPE", sold: 120 },
  { name: "Ủng Bọc Giày", sold: 90 },
  { name: "Mắt Kính Râm Mát Nam", sold: 80 },
  { name: "Cà phê G7 3in1", sold: 70 },
];

top5.forEach((product, index) => {
  const listItem = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <span class="badge bg-light text-primary me-2 mb-2">${index + 1}</span>
                ${product.name}
            </div>
            <span class="badge bg-success">${product.sold} sold</span>
        </li>`;
  $("#topProductsList").append(listItem);
});
