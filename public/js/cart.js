let idList = [];
$('.decrease-btn').on('click', async function () {
    const id = $(this).data('id');
    let val = $(`#value-${id}`).val();
    if (val < 2) {
        $(this).prop('disabled', true);
        return;
    }
    val--;
    $(`#value-${id}`).val(val);
    updateCart(id, val);
    updatePrice(id);
});

$('.increase-btn').on('click', async function () {
    const id = $(this).data('id');
    let val = $(`#value-${id}`).val();
    val++;
    if (val >= 2) {
        $(`.decrease-btn[data-id="${id}"]`).prop('disabled', false);
    }
    $(`#value-${id}`).val(val);
    updateCart(id, val);
    updatePrice(id);

});

async function updateCart(id, val) {
    try {
        const response = await $.ajax({
            url: '/client/cart/update',
            method: 'POST',
            data: {
                productId: parseInt(id),
                amount: val
            }
        });
        console.log(response);
    }
    catch (err) {
        console.log(err);
    }
}

function updatePrice(id) {
    const price = parseInt($(`#price-${id}`).data('price'));
    const val = parseInt($(`#value-${id}`).val());

    $(`#total-${id}`).text(price * val);
}

$('.check-cart').on('click', updateTotalPrice);

function updateTotalPrice() {
    let list = [];
    let sum = 0;
    $('.check-cart:checked').each(function () {
        console.log(1);
        const id = parseInt($(this).val());
        console.log(id);
        list.push(id);
        sum += parseInt($(`#total-${id}`).text());

    });
    // id to pass to checkout
    idList = list;
    $('#total-price').text(sum);
}

