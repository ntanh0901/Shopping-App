//const { search } = require("../../src/routes/home.r");

$(document).ready(function () {
    let currentPage = 1;
    let currentType = 'Tất cả';
    let searchInput = '';
    let showedPages = null;
    let firstPage = 1;
    let lastPage = null;
    loadPage(currentType, 1, 1);
    // Xử lí chọn loại
    $('input[name="categories"]').on('click', function () {
        loadPage($(this).val(), 1, 1);
    });

    //search bar
    $('#searchButton').on('click', function (event) {
        event.preventDefault();
        const searchTerm = $('#searchInput').val();
        console.log(searchTerm);

        loadPage(searchTerm, 1, 2);
    });

    // reload page container
    function loadPageContainer(first, last) {
        console.log(first, last);
        for (let i = first; i <= last; i++) {
            $('#page-container').append(`<button class="page-item ${i == currentPage ? "page-active" : ""}">${i}</button>`);
        }
        $('.page-item').on('click', function () {
            if ($('.page-active').length) {
                $('.page-active').removeClass('page-active');
            }
            $(this).addClass('page-active');
            currentPage = parseInt($(this).text());
            loadPage(currentType, currentPage);
        });
    }


    function loadPage(type, page, flag) {
        let url;
        console.log(flag);
        if (flag === 1) {
            if (searchInput != '') {
                url = `/client/page?type=${type}&page=${page}&search=${searchInput}`;
            } else {
                url = `/client/page?type=${type}&page=${page}`;
            }
        } else {
            url = `/client/search?input=${type}&page=${page}`;
        }
        $.ajax({
            url: url,
            method: 'GET',
            success: function (data) {
                console.log(data);
                currentPage = page;
                if (flag === 1) {
                    currentType = type;
                } else {
                    currentType = 'Tất cả';
                    searchInput = type;
                }
                const pages = Math.ceil(data.total / data.perpage);
                //pagination
                $('#pagination').empty();
                const pageContainer = $('#pagination');
                for (let i = 1; i <= pages; i++) {
                    pageContainer.append($(`<button class="page-click btn ${i == currentPage ? "page-active" : ""}">${i}</button>`));
                }
                $('.page-click').on('click', function () {
                    if(flag === 1) {
                        loadPage(currentType, parseInt($(this).text()), 1);
                    } else {
                        loadPage(searchInput, parseInt($(this).text()), 2);
                    }
                })

                //console.log(data);
                // //----------------------
                // // next page button click event
                // $('#next-page').on('click', function () {
                //     if (currentPage < totalPages) {
                //         ++currentPage;
                //         loadPage(currentType, currentPage);
                //         if (currentPage > lastPage) {
                //             firstPage++;
                //             lastPage++;
                //         }
                //         $('#page-container').empty();
                //         loadPageContainer(firstPage, lastPage);
                //     }
                // });

                // // previous page button click event
                // $('#previous-page').on('click', function () {
                //     if (currentPage > 1) {
                //         --currentPage;
                //         loadPage(currentType, currentPage);
                //         if (currentPage < firstPage) {
                //             firstPage--;
                //             lastPage--;
                //         }
                //         $('#page-container').empty();
                //         loadPageContainer(firstPage, lastPage);
                //     }
                // })
                // $('#page-container').empty();
                // const totalPages = Math.ceil(data.total / data.perpage);
                // showedPages = (totalPages < 3) ? totalPages : 3;
                // firstPage = 1;
                // lastPage = showedPages;
                // loadPageContainer(firstPage, lastPage);


                //----------------------card-container-------------------------
                let dataHtml = ``;
                for (let i = 0; i < data.perpage && i < data.data.length; i++) {
                    dataHtml += `
                    <div class="card-item rounded border">
                        <a href="/client/products/${data.data[i].MaSP}" class="item-link">
                            <div class="img-container">
                                <img class="rounded" src="${data.data[i].Anh[0]}" alt="">
                            </div>
                        </a>
                        <div class="content">
                            <a href="/client/products/${data.data[i].MaSP}" class="item-link">
                                ${data.data[i].Ten}
                            </a>
                            <p class="fw-bold mt-2 mb-0">${data.data[i].DonGia}.000Đ</p>
                            <div class="subcontent">
                                <p class="mb-0">Số lượng còn: ${data.data[i].SoLuongTon}</p>
                                <div class="star-rating">
                                    <i class='bx bxs-star'></i>
                                    <span>5.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                }
                $('#card-container').html(dataHtml);
                // sự kiện click add-btn

                // for (let i = 0; i < data.perpage && i < data.data.length; i++) {
                //     console.log('#' + data.data[i].MaSP + '.add-btn');

                //     $('#' + data.data[i].MaSP + '.add-btn').on('click', function () {
                //         console.log(data.data[i].MaSP);
                //         if (!orderArr.some(order => order.MaSP === data.data[i].MaSP)) {
                //             orderArr.push({
                //                 MaSP: data.data[i].MaSP,
                //                 DonGia: data.data[i].DonGia,
                //                 SoLuong: 1
                //             });
                //             $('#tong-value').text(money() / 1000 + ".000Đ");
                //             $('#order-content').append($(`
                //             <div class="item">
                //                 <div class="row-1">
                //                     <img
                //                         src="/img/logo_hcmus.png"
                //                         class="img-fluid rounded-top"
                //                         alt=""
                //                     />

                //                     <div class="name-price">
                //                         <div class="name">
                //                             ${data.data[i].Ten}
                //                         </div>

                //                         <div class="price">
                //                             ${data.data[i].DonGia}
                //                         </div>
                //                     </div>

                //                     <div class="qty">
                //                         <input id='${data.data[i].MaSP}' class='sl'
                //                             type="number"
                //                             min="1"
                //                             value="1"
                //                             onkeyup="if(value<0) value=0;"
                //                         />

                //                     </div>
                //                 </div>

                //                 <div class="row-2">

                //                     <div class="input-text">
                //                         <input type="text" name="note" />
                //                     </div>
                //                     <div class="trash">
                //                         <i class="bx bx-trash delete-order" id='${data.data[i].MaSP}'></i>
                //                     </div>

                //                 </div>

                //             </div>
                //             `));
                //             $('#' + data.data[i].MaSP + ".delete-order").on("click", (event) => {
                //                 $(event.target).closest(".item").remove();
                //                 let index = orderArr.findIndex(item => item.MaSP === data.data[i].MaSP);
                //                 if (index !== -1) orderArr.splice(index, 1);
                //                 $('#tong-value').text(money() / 1000 + ".000Đ");
                //                 checkOrderConditions();
                //             });
                //             $('#' + data.data[i].MaSP + ".sl").on('input', function () {
                //                 let index = orderArr.findIndex(item => item.MaSP === data.data[i].MaSP);
                //                 orderArr[index].SoLuong = parseInt($(this).val());
                //                 $('#tong-value').text(money() / 1000 + ".000Đ");
                //             })
                //         }
                //     });
                // }
            },
            error: function (err) {
                console.error('Error fetching data:', err);
            }
        });
    }
})
