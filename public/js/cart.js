let idList = [];

$(document).ready(function() {
    $('.price-value').each(function() {
        let priceValue = $(this).text();
        priceValue += '000';
        let formattedTotal = addThousandSeparator(priceValue);
        $(this).text(formattedTotal);
    });
    initFormatPrice();
});

function initFormatPrice() {

    $('.total-value').each(function() {
        let totalValue = $(this).text();
        totalValue += '000';

        const formattedTotal = addThousandSeparator(totalValue);

        $(this).text(formattedTotal);
    });
}

function formatPrice(id) {
    let totalValue = $(`#total-${id}`).text();
    totalValue += '000';
    const formattedTotal = addThousandSeparator(totalValue);
    $(`#total-${id}`).text(formattedTotal);
}

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

async function updateChecked(id) {
    try {
        const response = await $.ajax({
            url: '/client/cart/updateChecked',
            method: 'POST',
            data: {
                productId: parseInt(id)
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
    formatPrice(id);
}

$('.check-cart').on('click', updateTotalPrice);

function updateTotalPrice() {
    let list = [];
    let sum = 0;
    $('.check-cart:checked').each(function () {
        console.log(1);
        const id = parseInt($(this).val());
        updateChecked(id);
        console.log(id);
        list.push(id);
        let price = $(`#total-${id}`).text();
        let parsedPrice = price.replace(/\./g, '');
        sum += parseInt(parsedPrice);
    });
    // id to pass to checkout
    idList = list;
    $('#totalPrice').val(sum);
    $('#total-price').text(addThousandSeparator(sum));
}

function addThousandSeparator(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}