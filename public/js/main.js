/*global $ */
let currentSlide = 1;
const totalSlides = 3;
let slideInterval;

$(function () {
    'use strict';

    let setLocation = function() { 
        
        let elemenetHeight = document.querySelector('#carousel').offsetHeight; 
        let prev = document.querySelector('.prev');
        let next = document.querySelector('.next');
        prev.style.top = `calc((${elemenetHeight}px /2 ) - 15px)`
        next.style.top = `calc((${elemenetHeight}px /2 ) - 15px)`
    }

    setLocation() 

    window.addEventListener("resize", function() { 
        setLocation() 
    })

    $('.next').click(function () {
        showNextSlide();
    });

    $('.prev').click(function () {
        showPreviousSlide();
    });

    // Function to show the next slide
    function showNextSlide() {
        let currentSlideElement = $('#slide-' + currentSlide);
        currentSlideElement.removeClass('active');

        currentSlide = (currentSlide % totalSlides) + 1;

        let nextSlideElement = $('#slide-' + currentSlide);
        nextSlideElement.addClass('active');
    }

    // Function to show the previous slide
    function showPreviousSlide() {
        let currentSlideElement = $('#slide-' + currentSlide);
        currentSlideElement.removeClass('active');

        currentSlide = (currentSlide - 2 + totalSlides) % totalSlides + 1;

        let prevSlideElement = $('#slide-' + currentSlide);
        prevSlideElement.addClass('active');
    }

    // Function to start the automatic slide
    function startCarousel() {
        slideInterval = setInterval(showNextSlide, 3000); // Adjust the interval as needed (e.g., 3000ms = 3 seconds)
    }

    // Function to stop the automatic slide
    function stopCarousel() {
        clearInterval(slideInterval);
    }

    // Call the startCarousel function to begin automatic sliding
    startCarousel();

    // Pause the automatic slide when hovering over the carousel
    $('.carousel').hover(
        function () {
            stopCarousel();
        },
        function () {
            startCarousel();
        }
    );

    $(document).ready(function() {
        var acc = $(".controls .accordion");
    
        acc.on("click", function() {
          var panel = $(this).parent().next(".panel");
          var isActive = panel.hasClass("show");
    
          // Close all panels
          $(".panel").removeClass("show");
    
          // Toggle the clicked panel
          if (!isActive) {
            panel.addClass("show");
          }
        });
      });
});


