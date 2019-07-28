var detailsFocused = false;
var cardLoaded = 0;
var counter = 0;

function closeDetailsContainer() {
    $('.card-container').css('filter', 'blur(0px)');
    $('.card-details > .note-card').addClass('fadeOut').delay(300).queue(function(next) {
        $('.details-container').hide();
        $('.card-details > .note-card').removeClass('fadeOut');
        next();
    });

    detailsFocused = false;
}

function loadDetails(id) {
    var details = $('.details-container');
    var target = $('#' + id);
    var targetTitle = target.find('.card-title').html();
    var targetSubtitle = target.find('.card-subtitle > a');
    var targetContent = target.find('.card-text').html();

    details.find('.card-title').text(targetTitle);
    details.find('.card-subtitle').html(targetSubtitle.clone(true).append(' '));
    details.find('.card-text').text(targetContent == null ? 'None' : targetContent);
}

$(document).ready(function() {
    var detailsContainer = $('.details-container');

    $('.details-close').on('click', function() {
        closeDetailsContainer();
    });

    $('.card-container .card-title').on('click', function(e) {
        cardLoaded = e.target.closest('.note-card').id;
        loadDetails(cardLoaded);
        $('.card-details > .note-card').removeClass('fadeInRight fadeInLeft');
        $('.card-container').css('filter', 'blur(6px)');
        detailsContainer.show();
        detailsFocused = true;
    });
});

$(document).on('click', function(e) {
    if (detailsFocused) {
        counter++;
    }

    if (counter % 2 === 0
        && !document.getElementById('details').contains(e.target)) {
        closeDetailsContainer();
    }
});

$(document).keydown(function(e) {
    if (!detailsFocused) {
        return;
    }

    switch (e.which) {
        case 37:
            cardLoaded--;
            if (cardLoaded === 0) {
                cardLoaded = $('.card-container .card-title').length;
            }
            $('.card-details > .note-card').addClass('fadeOutRight')
                .delay(200).queue(function(next) {
                    $(this).removeClass('fadeOutRight fadeInRight');
                    loadDetails(cardLoaded);
                    $(this).addClass('fadeInLeft');
                    next();
                });
            break;
        case 39:
            cardLoaded++;
            if (cardLoaded === $('.card-container .card-title').length + 1) {
                cardLoaded = 1;
            }
            $('.card-details > .note-card').addClass('fadeOutLeft')
                .delay(200).queue(function(next) {
                    $(this).removeClass('fadeOutLeft fadeInLeft');
                    loadDetails(cardLoaded);
                    $(this).addClass('fadeInRight');
                    next();
                });
        break;
    }
});
