const menuBtn = document.getElementById('menu-btn');
const sideBar = document.querySelector('.sidebar');

menuBtn.addEventListener('click', () => {
    sideBar.classList.toggle('collapse1');
})