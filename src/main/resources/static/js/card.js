const CARD_NONE = 0;
const CARD_DETAILS = 1;
const CARD_NEW = 2;

var which = CARD_NONE;
var cardLoaded = CARD_NONE;
var cardSwitchMutex = false;

// Get youtube video id
function getYoutubeId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length === 11) {
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

function createTextLinks(text) {
    return (text || "").replace(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi, function(match, space, url) {
        let hyperlink = url;
        if (!hyperlink.match('^https?:\/\/')) {
            hyperlink = 'http://' + hyperlink;
        }
        return space + '<a href="' + hyperlink + '">' + url + '</a>';
    });
}

function loadDetailsData(id) {
    let details = $('.details-container');
    let target = $('#' + id);
    let targetTitle = target.find('.card-title').html();
    let targetSubtitle = target.find('.card-subtitle > a').clone(true).append(' ');
    let targetText = target.find('.card-text');
    let targetMedia = null;

    if (target.hasClass('note-video')) {
        targetMedia = $('<iframe>', {
            width: 640,
            height: 360,
            frameborder: '0',
            src: 'http://www.youtube.com/embed/' + getYoutubeId(target.find('.video-content').attr('href'))
        });
    } else if (target.hasClass('note-img')) {
        targetMedia = target.find('.card-img');
    }

    details.find('.card-title').text(targetTitle);
    details.find('.card-subtitle').html(targetSubtitle);
    details.find('.card-content > .card-text').html(createTextLinks(targetText.clone(false).text()));
    if (targetMedia) {
        details.find('.card-content > .card-media').html(targetMedia.clone(false));
    } else {
        details.find('.card-content > .card-media').html('');
    }
}

// Switch card to the previous one
function moveDetailsLeft() {
    if (cardSwitchMutex) {
        return;
    }
    cardSwitchMutex = true;

    cardLoaded--;
    if (cardLoaded === 0) {
        cardLoaded = $('.card-container .card-title').length;
    }
    $('.card-details > .note-card').addClass('fadeOutRight')
        .delay(200).queue(function(next) {
            $(this).removeClass('fadeOutLeft fadeOutRight');
            loadDetailsData(cardLoaded);
            $(this).addClass('fadeInLeft').delay(300).promise().done(function() {
                $(this).removeClass('fadeIn fadeInLeft');
            });
            cardSwitchMutex = false;
            next();
        });
}

// Switch card to the next one
function moveDetailsRight() {
    if (cardSwitchMutex) {
        return;
    }
    cardSwitchMutex = true;

    cardLoaded++;
    if (cardLoaded === $('.card-container .card-title').length + 1) {
        cardLoaded = 1;
    }
    $('.card-details > .note-card').addClass('fadeOutLeft')
        .delay(200).queue(function(next) {
            $(this).removeClass('fadeOutLeft fadeOutRight');
            loadDetailsData(cardLoaded);
            $(this).addClass('fadeInRight').delay(300).promise().done(function() {
                $(this).removeClass('fadeIn fadeInRight');
            });
            cardSwitchMutex = false;
            next();
        });
}

// Toggle container
function openContainer() {
    disableBackground();
    hideNewButton();

    switch (which) {
        case CARD_DETAILS:
            $('.card-details > .note-card').removeClass('fadeInRight fadeInLeft').addClass('fadeIn');
            $('.details-container').show();
            break;
        case CARD_NEW:
            let textArea = $('#new textarea');
            $('.new-container').show();
            textArea.focus().select();
            checkNewContent(textArea.val());
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
                $('#details .card-content .card-media').html('');
                $('#details .card-content .card-text').html('');
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
    $('#new-media').val('');
    $('#new-type').val('TEXT');
    $('#new .img-wrapper').hide();
    $('#new .img-wrapper .img-input').attr('src', '').attr('value', '');
}

// Check for image or video content
function checkNewContent(content) {
    let imageUrl = getImage(content);
    let videoUrl = getVideo(content);

    if (imageUrl) {
        $('#new .img-wrapper .img-input')
            .attr('src', imageUrl[0])
            .attr('value', imageUrl[0])
            .on('load', function(e) {
                $('#new .img-wrapper').show();
                $('#new-type').val('IMG');
                $('#new-media').val(imageUrl[0]);
            }).on('error', function() {
                hideNewImage();
            });
    } else if (videoUrl) {
            let img = new Image();
            img.src = 'http://img.youtube.com/vi/' + videoUrl[2] + '/mqdefault.jpg';
            img.onload = function() {
                if (img.width === 320) {
                    $('#new .img-wrapper .img-input')
                        .attr('src', img.src)
                        .attr('value', videoUrl[0])
                        .on('load', function() {
                            $('#new .img-wrapper').show();
                            $('#new-type').val('VIDEO');
                            $('#new-media').val(videoUrl[0]);
                        });
                } else {
                    hideNewImage();
                }
            }
    } else {
        $('#new-type').val('TEXT');
        $('#new-media').val('');
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
    // Load video thumbnails
    $('.note-video').each(function() {
        let path = 'http://img.youtube.com/vi/' +
            getYoutubeId($(this).find('.video-content').attr('href'))
            + '/mqdefault.jpg';
        $(this).find('.card-img').attr('src', path);
    });

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

    $('#new input[type=submit]').on('click', function(e) {
        let content = $('#new textarea')

        checkNewContent(content.val());
        if (!content.val().replace(/\s/g, '').length) {
            content.addClass('is-invalid was-validated');
            e.preventDefault();
        }
    });

    $(document).on('click', function(e) {
        if (which !== CARD_NONE) {
            let target = $(e.target);
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

    if (e.which === 27) {
        closeContainer();
    }
});

$(document).on('paste', function(e) {
    if (e.originalEvent.clipboardData && e.originalEvent.target.type === 'textarea') {
        let clipboardContent = e.originalEvent.clipboardData.getData('text/plain');
        checkNewContent($('#new textarea').val() + clipboardContent);
    }
});