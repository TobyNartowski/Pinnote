const CARD_NONE = 0;
const CARD_DETAILS = 1;
const CARD_NEW = 2;

var which = CARD_NONE;
var cardLoaded = CARD_NONE;

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

// Check if url is a image
function getImage(url) {
    return url.match(/(http:\/\/|https:\/\/)(.*)\.(jpeg|jpg|gif|png)/m);
}

function getVideo(url) {
    return url.match(/(http:\/\/|https:\/\/)www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11}\b)/m);
}

// Toggle background
function disableBackground() {
    $('.card-container').addClass('disable');
}

function enableBackground() {
    $('.card-container').removeClass('disable');
}

// Toggle new button
function hideNewButton() {
    var button = $('.new-card-button');
    button.removeClass('fadeInUp');

    button.addClass('fadeOut').delay(200).queue(function(next) {
        button.hide();
        button.removeClass('fadeOut');
        next();
    });
}

function showNewButton() {
    var button = $('.new-card-button');
    button.addClass('fadeInUp').show().delay(200).queue(function(next) {
        button.show();
        next();
    });
}

function loadDetailsData(id) {
    var details = $('.details-container');
    var target = $('#' + id);
    var targetTitle = target.find('.card-title').html();
    var targetSubtitle = target.find('.card-subtitle > a').clone(true).append(' ');
    var targetContent;

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

// Switch card to the previous one
function moveDetailsLeft() {
    cardLoaded--;
    if (cardLoaded === 0) {
        cardLoaded = $('.card-container .card-title').length;
    }
    $('.card-details > .note-card').addClass('fadeOutRight')
        .delay(200).queue(function(next) {
            $(this).removeClass('fadeOutRight fadeInRight');
            loadDetailsData(cardLoaded);
            $(this).addClass('fadeInLeft');
            next();
        });
}

// Switch card to the next one
function moveDetailsRight() {
    cardLoaded++;
    if (cardLoaded === $('.card-container .card-title').length + 1) {
        cardLoaded = 1;
    }
    $('.card-details > .note-card').addClass('fadeOutLeft')
        .delay(200).queue(function(next) {
            $(this).removeClass('fadeOutLeft fadeInLeft');
            loadDetailsData(cardLoaded);
            $(this).addClass('fadeInRight');
            next();
        });
}

// Toggle container
function openContainer() {
    disableBackground();
    hideNewButton();

    switch (which) {
        case CARD_DETAILS:
            $('.card-details > .note-card').removeClass('fadeInRight fadeInLeft');
            $('.details-container').show();
            break;
        case CARD_NEW:
            $('.new-container').show();
            $('#new textarea').focus().select();
            break;
    }
}

function closeContainer() {
    enableBackground();
    showNewButton();

    switch (which) {
        case CARD_DETAILS:
            $('.details-arrows .arrow-left').removeClass('slideInLeft').addClass('fadeOutLeft');
            $('.details-arrows .arrow-right').removeClass('slideInRight').addClass('fadeOutRight');
            $('.card-details > .note-card').addClass('fadeOut').delay(300).queue(function(next) {
                $('.details-arrows .arrow-left').removeClass('fadeOutLeft').addClass('slideInLeft');
                $('.details-arrows .arrow-right').removeClass('fadeOutRight').addClass('slideInRight');
                $('.details-container').hide();
                $('.card-details > .note-card').removeClass('fadeOut');
                $('#details .card-content').html('');
                which = CARD_NONE;
                next();
            });
            break;
        case CARD_NEW:
            $('#new > .card').addClass('fadeOut').delay(300).queue(function(next) {
                $('#new').hide();
                $('#new > .card').removeClass('fadeOut');
                which = CARD_NONE;
                next();
            });
            break;
    }

}

// Hide new image or video
function hideNewImage() {
    $('#new .img-wrapper').hide();
    $('#new .img-wrapper .img-input').attr('src', '').attr('value', '');
}

// Check for image or video content
function checkNewContent(content) {
    if (imageUrl = getImage(content)) {
        $('#new .img-wrapper .img-input')
            .attr('src', imageUrl[0])
            .attr('value', imageUrl[0])
            .on('load', function(e) {
                $('#new .img-wrapper').show();
            }).on('error', function(e) {
                hideNewImage();
            });
    } else if (videoUrl = getVideo(content)) {
            var img = new Image();
            img.src = 'http://img.youtube.com/vi/' + videoUrl[2] + '/mqdefault.jpg';
            img.onload = function() {
                if (img.width === 320) {
                    $('#new .img-wrapper .img-input')
                        .attr('src', img.src)
                        .attr('value', videoUrl[0])
                        .on('load', function() {
                            $('#new .img-wrapper').show();
                        });
                } else {
                    hideNewImage();
                }
            }
    } else {
        hideNewImage();
    }
}

function openNewCardContainer() {
    if (which === CARD_NONE) {
        which = CARD_NEW;
        openContainer();
    }
}

function openDetailsContainer(id) {
    if (which === CARD_NONE) {
        which = CARD_DETAILS;
        cardLoaded = id;

        loadDetailsData(cardLoaded);
        openContainer();
    }
}

$(document).ready(function() {
    // Details handlers
    $('.card-container .card-title').on('click', function(e) {
        if ($(window).width() <= 768) {
            return;
        }

        openDetailsContainer(e.target.closest('.note-card').id);
    });

    $('.details-arrows .arrow-left').on('click', function() {
        moveDetailsLeft();
    });

    $('.details-arrows .arrow-right').on('click', function() {
        moveDetailsRight();
    });

    $('.details-close').on('click', function() {
        closeContainer();
    });

    // New card handlers
    $('.new-card-button').on('click', function(e) {
        openNewCardContainer();
    });

    $('#new textarea').keydown(function(e) {
        if (e.keyCode === 9) {
            checkNewContent($('#new textarea').val());
            $('#new .h3-input').focus();
            e.preventDefault();
        }
    });

    $('#new .img-wrapper').on('click', function() {
        hideNewImage();
    });

    $(document).on('click', function(e) {
        if (which !== CARD_NONE) {
            var target = $(e.target);
            if (target.hasClass('preloader-site')
                || target.is('html') || target.is('body')) {
                    closeContainer();
            }
        }
    });
});

// Keyboard handling
$(document).keydown(function(e) {
    if (e.which >= 65 && e.which <= 90 && !$('.search-box input').is(':focus')) {
        openNewCardContainer();
    }

    if (which === CARD_DETAILS) {
        switch (e.which) {
            case 37:
                moveDetailsLeft();
                break;
            case 39:
                moveDetailsRight();
                break;
        }
    }

    switch (e.which) {
        case 27:
            closeContainer();
            break;
    }
});

$(document).on('paste', function(e) {
    if (e.originalEvent.clipboardData) {
        var cliboardContent = e.originalEvent.clipboardData.getData('text/plain');
        checkNewContent(cliboardContent);
    }
});
