(function ($) {
    $.fn.sometimes = function(options) {
        var didScroll = false;
        var $element = $(this);
        var elementWidth;
        var stopPosition = 0;
        var elementOffset = $element.offset().top;

        if (options.topElem) {
        	stopPosition = options.topElem.offset().top+options.topElem.height()+10;
        }

        $(window).scroll(function() {
            didScroll = true;
        });

        $(window).resize(function() {
            didScroll = true;
            $element.removeAttr('style');
        });

        setInterval(function() {
            if (didScroll) {

                didScroll = false;

                // If the window has scrolled to the top of the element
                if ($(window).scrollTop() >= elementOffset-stopPosition) {
        			elementWidth = $element.width();
                    $element.css({"position":"fixed","top":stopPosition});
                    $element.width(elementWidth);

                    // If additional styles were passed in, apply them now
                    if (typeof(options.styles) === 'object') { $element.css(options.styles); }
                } else {
                    $element.removeAttr('style');
                }
            }
        }, 250);

        return this;
    };
}(jQuery));
