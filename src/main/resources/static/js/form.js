function checkPasswordsConsistency() {
    let passwordRepeat = $('#password-repeat');

    if ($('#password').val() === passwordRepeat.val()) {
        passwordRepeat.removeClass('is-invalid');
        passwordRepeat.closest('.form-group').addClass('was-validated');
        return true;
    } else {
        passwordRepeat.removeClass('is-valid').addClass('is-invalid');
        passwordRepeat.closest('.form-group').removeClass('was-validated').addClass('disable-validation');
        return false;
    }
}

function checkInput(element) {
    if (!$(element).hasClass('disable-validation')) {
        $(element).addClass('was-validated');
    }
}

$(document).ready(function() {
    $('label').mousedown(function() {
        return false;
    });

    $('.form-validated').on('submit', function(e) {
        let form = $(this)[0];
        if (form.checkValidity() === false || checkPasswordsConsistency() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        for (let item of form.children) {
            if (!item.classList.contains('disable-validation')) {
                item.classList.add('was-validated');
            }
        }
    });

    $('#password, #password-repeat').on('keyup', function() {
        checkPasswordsConsistency();
        checkInput($(this).closest('.form-group'));
    });

    $('#email').on('keyup', function() {
        checkInput($(this).closest('.form-group'));
    });
});
