function closeModal() {
    $('.modal-container').addClass('fadeOutUp').delay(300).queue(function() {
        $(this).hide();
        $(this).dequeue();
    });
}

$(document).ready(function() {
    $('.modal-container').delay(3000).queue(function() {
        closeModal();
        $(this).dequeue();
    });

    $('.modal-container .modal-close').on('click', function() {
        closeModal();
    });
});