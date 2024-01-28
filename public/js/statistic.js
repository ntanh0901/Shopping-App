
let revenueOnCategory = [
    { type: "Phụ kiện thời trang", sum: 1000000 },
    { type: "Nhà cửa và đời sống", sum: 3000000 },
    { type: "Thể thao", sum: 2000000 },
    { type: "Bách hóa", sum: 5000000 },
    { type: "Đồng hồ", sum: 6000000 },
];

let aggregatedData = {};
let totalSum = 0;

revenueOnCategory.forEach(item => {
    if (!aggregatedData[item.type]) {
        aggregatedData[item.type] = 0;
    }
    aggregatedData[item.type] += item.sum;
    totalSum += item.sum;
});

let percentages = Object.values(aggregatedData).map(value => Math.floor((value / totalSum) * 100));

let ctx = document.getElementById('revenueChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: Object.keys(aggregatedData),
        datasets: [{
            data: percentages,
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
            ],
            hoverOffset: 4 ,
            borderWidth: 0,
        }]
    },
    options: {
        responsive: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: '\nDoanh thu theo danh mục sản phẩm',
                position: 'bottom',
                lineHeight: 2
            },
            tooltip: {
                mode: 'point',
                callbacks: {
                    label: function (tooltipItem) {
                        if (!tooltipItem) return;
                        let label = tooltipItem.label || '';
                        let value = aggregatedData[label] || '';
                        let percent = tooltipItem.raw;
                        return `${label}: ${value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} (${percent}%)`;
                    },
                },
            },
        },

    },

});

let legendHTML = '<ul> ';
Object.keys(aggregatedData).forEach((label, i) => {
    let value = aggregatedData[label];
    let percent = percentages[i];
    let legendColor = myChart.data.datasets[0].backgroundColor[i];

    let labelPart = `<div style="width: 13rem; ">${label}</div>`;
    let sumPart = `<div style="width: 8rem; ">${value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>`;
    let percentPart = `<div style="width: 5rem; ">${percent}%</div>`;

    legendHTML += `<li style="list-style-type: disc; color: ${legendColor};"> <div class="d-flex my-auto  mt-n2" style="color: black;"> ${labelPart} ${sumPart} ${percentPart} </div></li>`;
});
legendHTML += `</ul>`;
$('#legendChart').html(legendHTML);