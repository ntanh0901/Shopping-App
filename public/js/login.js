const icon = document.querySelector('.show-hide-pass');
const passInput = document.getElementById('password');
const loginForm = document.getElementById('login-form');
let isHide = true;

icon.addEventListener('click', function() {
    if(isHide) {
        icon.classList.remove('bi-eye-slash'); 
        icon.classList.add('bi-eye');
        passInput.type = 'text';
    }
    else {
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
        passInput.type = 'password';
    }
    isHide = !isHide;
});

loginForm.addEventListener('submit', function(e) {
    if(!loginForm.checkValidity()) {
        e.preventDefault();
    }
    loginForm.classList.add('was-validated');
})