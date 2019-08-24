const MAX_SIZE = 6;
let tagList = [];
let tagsTransitionDelay = 2;
let cardWidth = 0;

function showErrorValue(text) {
    $('.tags-info').text(text);
    $('.tags-info-wrapper').show();
}

function closeErrorValue() {
    $('.tags-info-wrapper').hide();
}

function addNewTag(value) {
    let input = $('.tags-input');

    value = value.split(' ').join('_');

    // Starts with hashtag
    if (value.startsWith('#')) {
        value = value.substring(1, value.length);
    }

    // Max size reached
    if (tagList.length >= MAX_SIZE) {
        showErrorValue('Tag list is limited to ' + MAX_SIZE);

        $('.tags-prepend input').each(function() {
            $(this).addClass('already-exists').delay(200).queue(function(next) {
                $(this).removeClass('already-exists');
                next();
            });
        });
        return;
    }

    // Tag already exists
    if (tagList.includes(value)) {
        if (input.val().endsWith(' ')) {
            input.val(input.val().substring(0, input.val().length - 1));
        }

        $('.tags-prepend input').each(function() {
            showErrorValue('Tag already exists');

            if ($(this).val() === '#' + value) {
                $(this).addClass('already-exists').delay(200).queue(function(next) {
                    $(this).removeClass('already-exists');
                    next();
                });
            }
        });
        return;
    }


    let tagTarget = $('#new .tags-prepend input:nth-child(1)');
    $($('#new .tags-prepend input').get().reverse()).each(function() {
        if ($(this).val() === '') {
            tagTarget = $(this);
        }
    });

    tagTarget.val('#' + value);
    tagTarget.show();
    tagTarget.width(tagTarget.val().length * 12);

    tagTarget.on('click', function(e) {
        $(this).hide().val('');
        tagTarget.appendTo($('#new .tags-prepend'));

        e.preventDefault();
        closeErrorValue();

        let index = tagList.indexOf(value);
        if (index >= 0) {
            tagList.splice(index, 1);
        }
    });

    tagList.push(value);
    input.val('');

    closeErrorValue();
}

function tagsCollapse(element, totalWidth) {
    element.style.transform = "translateX(0)";
    element.style.transitionDuration = "1s";

    setTimeout(function() {
        tagsScroll(element, totalWidth);
    }, 5000);
}

function tagsScroll(element, totalWidth) {
    element.style.transform = 'translateX(-' + (totalWidth - cardWidth / 1.25) + 'px)';
    element.style.transitionDelay = tagsTransitionDelay + 's';
    element.style.transitionDuration = Math.sqrt(totalWidth) / 2 + 's';

    setTimeout(function() {
        tagsCollapse(element, totalWidth);
    }, tagsTransitionDelay + Math.sqrt(totalWidth) / 2 * 1000 + 2000);
}

function animateTag(element, totalWidth) {
    element.style.transitionTimingFunction = "linear";
    tagsScroll(element, totalWidth);
}

$(document).ready(function() {
    cardWidth = $('.card-text').width();
    $(window).resize(function() {
        cardWidth = $('.card-text').width();
    });

    let input = $('.tags-input');

    $('.tags-input-wrapper').on('click', function() {
        input.select();
    });

    input.on('input', function(e) {
        // Space clicked
        if (e.originalEvent.data === ' ') {
            // There is only a space or tag already exists
            if (input.val() === ' ') {
                input.val(input.val().substring(0, input.val().length - 1));
                return;
            }

            // Space is clicked from other position that the end
            if (!input.val().endsWith(' ')) {
                return;
            }

            addNewTag(input.val().substring(0, input.val().length - 1));
        }
    }).on('keydown', function(e) {
        // Tab clicked
        if (e.originalEvent.keyCode === 9 && input.val() !== '') {
            addNewTag(input.val());
        }

        // First backspace
        if (input.val() === '' && tagList.length !== 0 && e.originalEvent.keyCode === 8) {
            let tagTarget = $('#new .tags-prepend input:nth-child(' + MAX_SIZE + ')');
            $('#new .tags-prepend input').each(function() {
                if ($(this).val() !== '') {
                    tagTarget = $(this);
                }
            });
            tagTarget.hide().val('');

            tagList.pop();
            closeErrorValue();
        }
    });

    // Tags scrolling
    $('.card-container .card-subtitle').each(function() {
        let totalWidth = 0;
        $(this).children().each(function() {
            totalWidth += $(this).width();
        });

        if (totalWidth - (cardWidth + 20) > 0) {
            animateTag($(this)[0], totalWidth);
        }
    });
});
