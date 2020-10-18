(function ($) {
"use strict";

    // BEGIN: 03 Portfolio Isotope
    var portfolioIsotope = function() {
        if ( $().isotope ) {
            var $container = $('.portfolio-wrap');
            $container.imagesLoaded(function(){
                $container.isotope({
                    itemSelector: '.isotope-item',
                    transitionDuration: '0.5s',
                });
            });
            $('.nav-tabs .nav-filter').on('click',function() {
                var selector = $(this).attr('data-filter');
                $('.nav-tabs .nav-filter').removeClass('active');
                $(this).addClass('active');
                $container.isotope({ filter: selector });
                return false;
            });
        }
    };
    // END: Portfolio Isotope
	










$(document).ready(function(){
  
  var owl_1 = $('#owl-1');
  var owl_2 = $('#owl-2');
  
  owl_1.owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    items: 1,
    dots: false
  });
  
  owl_2.owlCarousel({
    margin:10,
    nav: false,
    items: 5,
    dots: false
  });
  
  owl_2.find(".item").click(function(){
    var slide_index = owl_2.find(".item").index(this);
    owl_1.trigger('to.owl.carousel',[slide_index,300]);
  });
  
  // Custom Button
  $('.customNextBtn').click(function() {
    owl_1.trigger('next.owl.carousel',500);
  });
  $('.customPreviousBtn').click(function() {
    owl_1.trigger('prev.owl.carousel',500);
  }); 
});














	

// INCLUDE JQUERY & JQUERY UI 1.12.1
jQuery( function() {
	
(function() {
 
  window.inputNumber = function(el) {

    var min = el.attr('min') || false;
    var max = el.attr('max') || false;

    var els = {};

    els.dec = el.prev();
    els.inc = el.next();

    el.each(function() {
      init($(this));
    });

    function init(el) {

      els.dec.on('click', decrement);
      els.inc.on('click', increment);

      function decrement() {
        var value = el[0].value;
        value--;
        if(!min || value >= min) {
          el[0].value = value;
        }
      }

      function increment() {
        var value = el[0].value;
        value++;
        if(!max || value <= max) {
          el[0].value = value++;
        }
      }
    }
  }
})();


} );
	
	
	
  // BEGIN: 03 Portfolio Isotope
    var portfolioIsotope = function() {
        if ( $().isotope ) {
            var $container = $('.portfolio-wrap');
            $container.imagesLoaded(function(){
                $container.isotope({
                    itemSelector: '.isotope-item',
                    transitionDuration: '0.5s',
                });
            });
            $('.nav-tabs .nav-filter').on('click',function() {
                var selector = $(this).attr('data-filter');
                $('.nav-tabs .nav-filter').removeClass('active');
                $(this).addClass('active');
                $container.isotope({ filter: selector });
                return false;
            });
        }
    };
    // END: Portfolio Isotope	
	

	
    // BEGIN: 08 Sticky bar
    var stickyBar = function() {

        if($(".sticky-element").length) {
          var $stickyElement = $(".sticky-element");
          if ($(window).width() <= 1024) {
              $stickyElement.trigger('sticky_kit:detach');
          }
          else {
              $stickyElement.stick_in_parent({
                  offset_top: 100
              });
          }
        }
    };
    // END: Sticky bar
	

    // BEGIN: Sticky Header
    var stickyHeader = function() {
        var sticky = $('.navbar-sticky'),
        stickyStatic = $('.header-static');
            $(window).scroll(function () {
                var scTop = $(document).scrollTop();
                if (scTop > 400) {
                    if (!$(".sticky-space").length) {
                        stickyStatic.after('<div class="sticky-space"></div>');
                        $(".sticky-space").css({'height': sticky.height() + 'px'});
                    }
                    sticky.addClass('navbar-sticky-on');
                } 
                else {
                    $(".sticky-space").remove();
                    sticky.removeClass('navbar-sticky-on');
            }
        });
    };
    // END: Sticky Header
	
	
	


    // BEGIN: 05 Owl Carousel
    var owlCarousel = function() {
        var $carousel = $('.owl-carousel');
        if( $carousel.length < 1 ){
            return true;
        }
        $carousel.each( function(){
            var slider = $(this);
            var sliderArrow = slider.attr('data-arrow') == 'false' ? false : true; //option: true or false
            var sliderDots = slider.attr('data-dots') == 'false' ? false :true; //option: true or false
            var sliderAutoPlay = slider.attr('data-autoplay') ? false : true; //option: number in ms
            var sliderAutoPlayTime = slider.attr('data-autoplay') ? Number(sliderAutoPlay) : 4000;
            var sliderSpeed = slider.attr('data-speed') ? slider.attr('data-speed') : 800; //option: number in ms (Smart speed)
            var sliderMargin = slider.attr('data-margin') ? slider.attr('data-margin') : 30; //option: number in px
            var sliderLoop = slider.attr('data-loop') == 'false' ? false : true; //option: true or false
            var sliderStart = slider.attr('data-start') ? slider.attr('data-start') : 0; //option: number
            var sliderSlideBy = slider.attr('data-slideby') ? sliderSlideBy == 'page' ? 'page' : Number(slider.attr('data-slideby')) : Number(1); //option: number
            var sliderHoverPause = slider.attr('data-pause') == 'false' ? false : true; //option: true or false
            var sliderMerge = slider.attr('data-merge') == 'true' ? true : false; //option: number (use in slider items DIV)
            var sliderDrag = slider.attr('data-drag') == 'false' ? false : true; //option: true or false
            var sliderRewind = slider.attr('data-rewind') == 'true' ? true : false; //option: true or false
            var sliderCenter = slider.attr('data-center') == 'true' ? true : false; //option: true or false
            var sliderVideo = slider.attr('data-video') == 'true' ? true : false; //option: true or false
            var sliderLazy = slider.attr('data-lazyload') == 'true' ? true : false; //option: true or false
            var sliderRTL = slider.attr('data-rtl'); //option: true (false by default)
            var sliderItems = slider.attr('data-items') ? slider.attr('data-items') : 4; //option: number (items in all device)
            var sliderItemsXl = slider.attr('data-items-xl')? slider.attr('data-items-xl') : Number(sliderItems) ; //option: number (items in 1200 to end )
            var sliderItemsLg = slider.attr('data-items-lg')? slider.attr('data-items-lg') : Number(sliderItemsXl) ; //option: number (items in 992 to 1199 )
            var sliderItemsMd = slider.attr('data-items-md')? slider.attr('data-items-md') : Number(sliderItemsLg) ; //option: number (items in 768 to 991 )
            var sliderItemsSm = slider.attr('data-items-sm')? slider.attr('data-items-sm') : Number(sliderItemsMd) ; //option: number (items in 576 to 767 )
            var sliderItemsXs = slider.attr('data-items-xs') ? slider.attr('data-items-xs') : Number(sliderItemsSm) ; //option: number (items in start to 575 )
            slider.owlCarousel({
                margin: Number(sliderMargin),
                loop: sliderLoop,
                merge: sliderMerge,
                mouseDrag: sliderDrag,
                startPosition: Number(sliderStart),
                rewind: sliderRewind,
                slideBy: sliderSlideBy,
                center: sliderCenter,
                lazyLoad: sliderLazy,
                nav: sliderArrow,
                navText: [
                            '<i class="ti-angle-left"></i>',
                            '<i class="ti-angle-right"></i>'
                ],
                autoplay: sliderAutoPlay,
                autoplayTimeout: sliderAutoPlayTime,
                autoplayHoverPause: sliderHoverPause,
                dots: sliderDots,
                smartSpeed: Number(sliderSpeed),
                video: sliderVideo,
                rtl: sliderRTL,
                responsive:{
                   0:{ items:Number(sliderItemsXs) },
                  576:{ items:Number(sliderItemsSm) },
                  768:{ items:Number(sliderItemsMd) },
                  992:{ items:Number(sliderItemsLg) },
                  1200:{ items:Number(sliderItemsXl) }
                },
            });
        });
    };
    // END: Owl Carousel	
	
	
	

    // BEGIN: 15 Mega Menu
    $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
        if (!$(this).next().hasClass('show')) {
          $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');

        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
          $('.dropdown-submenu .show').removeClass("show");
        });

        return false;
    });

    // END: Mega Menu



// INCLUDE JQUERY & JQUERY UI 1.12.1
jQuery( function() {

    // =====================================================
    //      Items slider
    // =====================================================

    var guidesSlider = new Swiper('.guides-slider', {
        slidesPerView: 3,
        spaceBetween: 15,
        loop: true,
        roundLengths: true,
        breakpoints: {
            1200: {
                slidesPerView: 3
            },
            991: {
                slidesPerView: 2
            },
            768: {
                slidesPerView: 1
            },
            400: {
                slidesPerView: 1
            }
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
    });
	
} );

	
	

    //Document ready functions
    $(document).ready(function () {
          stickyHeader();
          portfolioIsotope();
          owlCarousel();
    });

})(jQuery);