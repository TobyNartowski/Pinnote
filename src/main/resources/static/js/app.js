var tagEnabled = null;

// Navbar tags
var navbarTagsWidth = 0;
function checkTagsWidth() {
    var navbarFilter = $('.navbar-filter');
    var navbarTags = $('.tags-wrapper');

    if ($(window).width() <= 768) {
        checkTagNumber();
        $('.tags-wrapper span').appendTo($('#filterContent .btn-dropdown'));
        navbarFilter.show();
        navbarTags.hide();
    } else {
        if (navbarTagsWidth === 0 && navbarTags.is(':visible')) {
            navbarTagsWidth = navbarTags.width();
        }

        if ((navbarTagsWidth + 305.0) > $(window).width() - 150.0) {
            $('.tags-wrapper span').appendTo($('#filterContent .btn-dropdown'));
            checkTagNumber();
            navbarFilter.show();
            navbarTags.hide();
        } else {
            $('#filterContent .btn-dropdown span').appendTo($('.tags-wrapper'));
            navbarFilter.hide();
            navbarTags.show();
        }
    }
}

function toggleDropdown(e, b, c) {
    if (b == true) {
        $(window).width() <= 768 ? e.addClass('animated fadeOut') : e.addClass('animated lightSpeedOut');
        c.removeClass('fa-times');
        setTimeout(function() {
            $(window).width() <= 768 ? e.removeClass('animated fadeOut').hide() : e.removeClass('animated lightSpeedOut').hide();
        }, 300);
    } else {
        e.show();
        c.addClass('fa-times');
    }
}

function checkTagNumber() {
    if (tagEnabled == null) {
        $('#navbarFilter .number').hide();
    } else {
        $('#navbarFilter .number').show();
    }
}

function checkTags(e) {
    let button = $(e.target);
    if (button.hasClass('btn-tag-clicked')) {
        button.removeClass('btn-tag-clicked');
        tagEnabled = null;
    } else {
        button.addClass('btn-tag-clicked');
        if (tagEnabled != null) {
            $('#' + tagEnabled).removeClass('btn-tag-clicked');
        }
        tagEnabled = e.target.id;
    }
    checkTagNumber();
}

$(document).ready(function() {
    checkTagsWidth();
    $(window).resize(checkTagsWidth);

    // Labels selection
    $('label').mousedown(function() {
        return false;
    });

    // Settings button
    let settingsEnabled = false;
    $('#settingsButton').click(function() {
        toggleDropdown($('#settingsContent'), settingsEnabled, $('#settingsIcon'));
        settingsEnabled = !settingsEnabled;
    });

    let settingsContentDelay = 0.15;
    $('#settingsContent .btn-dropdown-item').each(function() {
        $(this).css('animation-delay', settingsContentDelay.toString() + 's');
        settingsContentDelay += 0.10;
    });

    // Filter button
    let filterEnabled = false;
    $('#filterButton').click(function() {
        toggleDropdown($('#filterContent'), filterEnabled, $('#filterIcon'));
        filterEnabled = !filterEnabled;
    });

    $(document).on('click', function(e) {
        // Settings button
        if (settingsEnabled === true
            && e.target.id !== 'navbarSettings'
            && !document.getElementById('navbarSettings').contains(e.target)) {
                toggleDropdown($('#settingsContent'), settingsEnabled, $('#settingsIcon'));
                settingsEnabled = !settingsEnabled;
        }

        // Filter button
        if (filterEnabled === true
            && e.target.id !== 'navbarFilter'
            && !document.getElementById('navbarFilter').contains(e.target)) {
                toggleDropdown($('#filterContent'), filterEnabled, $('#filterIcon'));
                filterEnabled = !filterEnabled;
        }
    });

    // Tags buttons
    $('.tags-wrapper .btn').on('click', function(e) {
        checkTags(e);
    });

    $('.btn-dropdown .btn').on('click', function(e) {
        checkTags(e);
    });

    // Logout
    $('#logoutButton').on('click', function() {
        $(this).closest($('.form-logout')).submit();
    });
});
