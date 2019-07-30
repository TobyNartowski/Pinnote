var detailsFocused = false;
var cardLoaded = 0;
var counter = 0;

var eventHandler = function(e) {
   e.preventDefault();
}

// Get youtube video id
function getYoutubeId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}

// Close card details
function closeDetailsContainer() {
    $('.card-container').css('filter', 'blur(0px)');
    $('.details-arrows .arrow-left').removeClass('slideInLeft').addClass('fadeOutLeft');
    $('.details-arrows .arrow-right').removeClass('slideInRight').addClass('fadeOutRight');

    $('.card-details > .note-card').addClass('fadeOut').delay(300).queue(function(next) {
        $('.details-arrows .arrow-left').removeClass('fadeOutLeft').addClass('slideInLeft');
        $('.details-arrows .arrow-right').removeClass('fadeOutRight').addClass('slideInRight');
        $('.details-container').hide();
        $('.card-details > .note-card').removeClass('fadeOut');
        $('#details .card-content').html('');
        next();
    });

    $('.card-container .note-text a').removeClass('disable-blue');
    $('.card-container .note-text i').removeClass('disable-gray');
    $('.card-container .note-img a, .card-container .note-img i').removeClass('disable-white');
    $('.card-container .note-video a, .card-container .note-video i').removeClass('disable-white');
    $('.card-container *').removeClass('disable');
    $('.card-container a').unbind('click', eventHandler);

    detailsFocused = false;
}

// Load card details
function loadDetails(id) {
    var details = $('.details-container');
    var target = $('#' + id);
    var targetTitle = target.find('.card-title').html();
    var targetSubtitle = target.find('.card-subtitle > a').clone(true).append(' ');
    var targetContent;
    targetSubtitle.removeClass('disable disable-white disable-blue');

    if (target.hasClass('note-video')) {
        targetContent = $('<iframe>', {
            width: 640,
            height: 360,
            frameborder: '0',
            src: 'http://www.youtube.com/embed/' + getYoutubeId(target.find('.video-content').attr('href'))
        });
    } else if (target.hasClass('note-img')) {
        targetContent = target.find('.card-img');
    } else {
        targetContent = target.find('.card-text');
    }

    details.find('.card-title').text(targetTitle);
    details.find('.card-subtitle').html(targetSubtitle);
    details.find('.card-content').html(targetContent.clone(false));
}

// Execute when ready
$(document).ready(function() {
    var detailsContainer = $('.details-container');

    $('.details-arrows .arrow-left').on('click', function() {
        moveLeft();
    });

    $('.details-arrows .arrow-right').on('click', function() {
        moveRight();
    });

    $('.details-close').on('click', function() {
        closeDetailsContainer();
        counter++;
    });

    $('.card-container .card-title').on('click', function(e) {
        if (detailsFocused) {
            return;
        }

        cardLoaded = e.target.closest('.note-card').id;

        $('.card-container .note-text a').addClass('disable-blue');
        $('.card-container .note-text i').addClass('disable-gray');
        $('.card-container .note-img a, .card-container .note-img i').addClass('disable-white');
        $('.card-container .note-video a, .card-container .note-video i').addClass('disable-white');
        $('.card-container *').addClass('disable');
        $('.card-container a').bind('click', eventHandler);

        loadDetails(cardLoaded);

        $('.card-details > .note-card').removeClass('fadeInRight fadeInLeft');
        $('.card-container').css('filter', 'blur(6px)');
        detailsContainer.show();
        detailsFocused = true;
    });
});

// Check if card is opened and supposed to be closed
$(document).on('click', function(e) {
    if (document.getElementById('arrows').contains(e.target)
        || document.getElementById('details').contains(e.target)) {
        return;
    }

    if (detailsFocused) {
        counter++;
    }

    if (counter % 2 == 0
        && !document.getElementById('details').contains(e.target)) {
        closeDetailsContainer();
    }
});

// Switch card to the previous one
function moveLeft() {
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
}

// Switch card to the next one
function moveRight() {
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
}

// Arrows handling
$(document).keydown(function(e) {
    if (!detailsFocused) {
        return;
    }

    switch (e.which) {
        case 37:
            moveLeft();
            break;
        case 39:
            moveRight();
            break;
    }
});
