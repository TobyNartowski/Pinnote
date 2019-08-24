function closeModal() {
    if (typeof enableBackground !== 'undefined') {
        enableBackground();
    }

    $('.modal-container').addClass('fadeOutUp').delay(300).queue(function() {
        $(this).hide();
        $(this).dequeue();
    });
}

$(document).ready(function() {
    let modalContainer = $('.modal-container')
    if (typeof disableBackground !== 'undefined' && modalContainer.is(':visible')) {
        disableBackground();
    }

    modalContainer.delay(3000).queue(function() {
        closeModal();
        $(this).dequeue();
    });

    $('.modal-container .modal-close').on('click', function() {
        closeModal();
    });
});