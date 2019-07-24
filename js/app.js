// Navbar tags
var navbarTagsWidth = 0;
function checkTagsWidth() {
    var navbarFilter = $('.navbar-filter');
    var navbarTags = $('.tags-wrapper');

    if ($(window).width() <= 768) {
        navbarFilter.show();
        navbarTags.hide();
    } else {
        if (navbarTagsWidth === 0) {
            navbarTagsWidth = navbarTags.width();
        }

        if ((navbarTagsWidth + 310.0) > $(window).width() - 150.0) {
            navbarFilter.show();
            navbarTags.hide();
        } else {
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

window.onload = function() {
    //  TODO: check after new tag
    checkTagsWidth();
    $(window).resize(checkTagsWidth);

    // Labels selection
    $('label').mousedown(function() {
        return false;
    });

    // Settings button
    var settingsEnabled = false;
    $('#settingsButton').click(function() {
        toggleDropdown($('#settingsContent'), settingsEnabled, $('#settingsIcon'));
        settingsEnabled = !settingsEnabled;
    });

    var settingsContentDelay = 0.15;
    $('#settingsContent .btn-dropdown-item').each(function() {
        $(this).css('animation-delay', settingsContentDelay.toString() + 's');
        settingsContentDelay += 0.10;
    });

    // Filter button
    var filterEnabled = false;
    $('#filterButton').click(function() {
        toggleDropdown($('#filterContent'), filterEnabled, $('#filterIcon'));
        filterEnabled = !filterEnabled;
    });

    var filterContentDelay = 0.05;
    $('#filterContent .btn-dropdown-item').each(function() {
        $(this).css('animation-delay', filterContentDelay.toString() + 's');
        filterContentDelay += 0.10;
    });


    document.onclick = function(e) {
        // Settings button
        if (settingsEnabled === true 
            && e.target.id != 'navbarSettings'
            && !document.getElementById('navbarSettings').contains(e.target)) {
                toggleDropdown($('#settingsContent'), settingsEnabled, $('#settingsIcon'));
                settingsEnabled = !settingsEnabled;
        }

        // Filter button
        if (filterEnabled === true 
            && e.target.id != 'navbarFilter'
            && !document.getElementById('navbarFilter').contains(e.target)) {
                toggleDropdown($('#filterContent'), filterEnabled, $('#filterIcon'));
                filterEnabled = !filterEnabled;
        }
    }

}