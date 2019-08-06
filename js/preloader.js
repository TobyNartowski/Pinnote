$(document).ready(function() {
	$('body').addClass('preloader-site');
});

$(window).on('load', function() {
	$('.preloader-site').css('overflow', 'auto');
    $('.preloader-wrapper').addClass('animated fadeOut').delay(200).queue(function(next) {
    	$(this).hide();
    	next();
    });

    $('body').removeClass('preloader-site');
});
