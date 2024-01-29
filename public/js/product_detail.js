// increase button click event
let value = $('#input-value').val();
const maxValue = parseInt($('#left-over-amount').text());
showTotalPrice();
// set button increase button static
if(value >= maxValue) {
    $('#increase-btn').prop('disabled', true)
}

$('#input-value').on('blur', function() {
    value = $(this).val();
    showTotalPrice();
})

$('#increase-btn').on('click', function() {
    value = $('#input-value').val();
    value++;
    if(value >= maxValue) {
        $('#increase-btn').prop('disabled', true)
    }
    if(value > 1) {
        $('#decrease-btn').prop('disabled', false);
    }
    $('#input-value').val(value);
    showTotalPrice()
});

$('#decrease-btn').on('click', function() {
    value = $('#input-value').val();
    value--;
    $('#input-value').val(value);
    if(value < maxValue) {
        $('#increase-btn').prop('disabled', false)
    }
    if(value <= 1) {
        $('#decrease-btn').prop('disabled', true);
    }
    showTotalPrice();
});

function showTotalPrice() {
    const productPrice = parseInt($('#product-price').text());
    const totalPrice = productPrice * value * 1000;
    let vnd = Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
    $('#total-price').text(vnd.format(totalPrice));
}

// add to cart - POST to client/cart
$('#addToCart').on('click', async function() {
    try {
        const id = parseInt($(this).data('id'));
        value = $('#input-value').val();
        const response = await $.ajax({
            url: '/client/cart',
            method: 'POST',
            data: {
                productId: id,
                amount: value
            }
        });
        sessionStorage.setItem("cartLength", response.cartLength);
        $('#cart-value-noti').text(response.cartLength);
    }
    catch(err) {
        console.log(err);
    }
})