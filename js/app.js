// Forms validation
window.addEventListener('load', function() {
    var forms = document.getElementsByClassName('form-validated');
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            for (let item of form.children) {
                if (!item.classList.contains('disable-validation')) {
                    item.classList.add('was-validated');
                }
            }
        }, false);
    });
}, false);

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
        $('#settingsContent').toggle();
        settingsEnabled = !settingsEnabled;
    });

    document.onclick = function(e) {
        if (settingsEnabled === true 
            && e.target.id != 'navbarSettings'
            && !document.getElementById('navbarSettings').contains(e.target)) {
                $('#settingsContent').hide();
                settingsEnabled = false;
        }            
    }
}