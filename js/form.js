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

window.onload = function() {
    $('label').mousedown(function() {
        return false;
    });    
}
