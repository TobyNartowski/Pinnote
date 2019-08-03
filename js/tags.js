var tagList = [];

function addNewTag(value) {
    var input = $('.tags-input');
    var prepend = $('.tags-prepend');

    value = value.split(' ').join('_');

    // Starts with hashtag
    if (value.startsWith('#')) {
        value = value.substring(1, value.length);
    }

    // Tag already exists
    if (tagList.includes(value)) {
        if (input.val().endsWith(' ')) {
            input.val(input.val().substring(0, input.val().length - 1));
        }

        $('.tags-prepend button').each(function() {
            if ($(this).text() === '#' + value) {
                console.log('xd');
                $(this).addClass('already-exists').delay(200).queue(function(next) {
                    $(this).removeClass('already-exists');
                    next();
                });
            }
        });
        return;
    }

    // Create new button tag
    var newTag = $('<button>', {
        'class': 'btn btn-outline-dark btn-sm mr-1 mb-1',
        text: '#' + value
    });

    // Add delete handler
    newTag.on('click', function() {
        this.remove();
        var index = tagList.indexOf(value);
        tagList.splice(index, 1);
    })

    // Append to prepend div and clear input
    newTag.appendTo(prepend);
    tagList.push(value);
    input.val('');
}

$(document).ready(function() {
    var input = $('.tags-input');
    var prepend = $('.tags-prepend');

    $('.tags-input-wrapper').on('click', function() {
        input.select();
    });

    $('.tags-input').on('input', function(e) {
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
    });

    $('.tags-input').on('keydown', function(e) {
        // Tab clicked
        if (e.originalEvent.keyCode === 9 && input.val() !== '') {
            addNewTag(input.val());
        }

        // First backspace
        if (input.val() === '' && tagList.length !== 0 && e.originalEvent.keyCode === 8) {
            $('.tags-prepend .btn').last().remove();
            tagList.pop();
        }
    });
});
