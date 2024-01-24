function toggleInputVisibility(inputId, iconId) {
    const inputElement = document.getElementById(inputId);
    const iconElement = document.getElementById(iconId);

    if (inputElement.type === 'password') {
        inputElement.type = 'text';
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
    } else {
        inputElement.type = 'password';
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
    }
}

  function previewImage(event) {
    const input = event.target;
    const image = document.getElementById('avatar-image');
    const largeImage = document.getElementById('largeImage');

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Add click event to open the modal with the larger image
    image.addEventListener('click', function () {
        largeImage.src = image.src;
        $('#imageModal').modal('show'); // Using jQuery to open Bootstrap modal
    });
}

function openImageModal() {
    // Function to open the modal when clicking on the profile image
    $('#imageModal').modal('show');
}