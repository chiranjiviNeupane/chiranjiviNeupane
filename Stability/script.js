/* ======================== JQUERY INTERACTIONS FOR STABILITYCARE ======================== */

$(document).ready(function() {
    // ========== Mobile Menu Toggle ==========
    $('#mobile-menu-btn').click(function() {
        $('#mobile-menu').slideToggle(300);
        // Toggle icon between bars and times
        const icon = $(this).find('i');
        if (icon.hasClass('fa-bars')) {
            icon.removeClass('fa-bars').addClass('fa-times');
        } else {
            icon.removeClass('fa-times').addClass('fa-bars');
        }
    });
    
    // Close mobile menu when a link is clicked
    $('#mobile-menu a').click(function() {
        $('#mobile-menu').slideUp(300);
        $('#mobile-menu-btn i').removeClass('fa-times').addClass('fa-bars');
    });
    
    // ========== Smooth Scroll for Navigation Links ==========
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80 // Offset for fixed header
            }, 1000);
        }
    });
    
    // ========== Fade-in Animation on Scroll ==========
    function checkFadeIn() {
        $('.fade-in').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            // Check if element is in viewport
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('visible');
            }
        });
    }
    
    // Check on page load and scroll
    checkFadeIn();
    $(window).scroll(function() {
        checkFadeIn();
    });
    
    // ========== Header Shadow on Scroll ==========
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('#header').addClass('shadow-lg');
        } else {
            $('#header').removeClass('shadow-lg');
        }
    });
    
    // ========== Contact Form Submission ==========
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        
        // Get form data
        const name = $('#name').val();
        const email = $('#email').val();
        const phone = $('#phone').val();
        const message = $('#message').val();
        
        // Basic validation
        if (name && email && message) {
            // Show success message (in production, this would send to a server)
            alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} as soon as possible.`);
            
            // Reset form
            $(this)[0].reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });
    
    // ========== Service Card Hover Effect ==========
    $('.service-card').hover(
        function() {
            $(this).find('i').addClass('fa-bounce');
        },
        function() {
            $(this).find('i').removeClass('fa-bounce');
        }
    );
    
    // ========== Active Navigation Link Highlighting ==========
    $(window).scroll(function() {
        const scrollPos = $(window).scrollTop() + 100;
        
        $('.nav-link').each(function() {
            const currLink = $(this);
            const refElement = $(currLink.attr('href'));
            
            if (refElement.length && refElement.position().top <= scrollPos && 
                refElement.position().top + refElement.height() > scrollPos) {
                $('.nav-link').removeClass('text-blue-600 font-bold');
                currLink.addClass('text-blue-600 font-bold');
            }
        });
    });
});

