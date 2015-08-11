
$(function() {

	app = (function() {

	var init = function () {
		tuneBlocks();
		hookScrollPoints({topElem: $('.navbar-float')});

		// $('.fixed').sometimes({topElem: $('.navbar-float')});

		$(window).resize(function() {
			tuneBlocks();
		});

	};
	
	var hookScrollPoints = function(options) {
		var topPosition = 0;
		if (options.topElem.length) {
        	topPosition = options.topElem.offset().top+options.topElem.height()+10;
        }

		$('a[href^="#"]').on('click', function(event) {
		    var target = $($(this).attr('href'));
		    if( target.length ) {
		        event.preventDefault();
		        $('html, body').animate({
		            scrollTop: target.offset().top-topPosition
		        }, 500);
		    }
		});
	};

	var tuneBlocks = function() {
		// var breakPoints = [768, 992, 1200];
		var breakPoints = [750, 970, 1170];
		var anchorPoints = [1, 2, 3, 3];
		var windowSize = $(window).width();
		var fixPerItems;
		var row=$('.blocks');

		// console.log("tuneBlocks"+Date());
		$.each(row, function() {
			var autoFix = $(this).data("autofix");
			if (autoFix) {
				anchorPoints = autoFix.split(',');
				var len = anchorPoints.length;
				if (len < 4) {
					for (var i = len; i < 4; ++i) anchorPoints.push(anchorPoints[len-1]);
				}
			}

			if (window.matchMedia) {
				if (window.matchMedia( "(min-width: 1200px)" ).matches) fixPerItems = anchorPoints[3];
				else if (window.matchMedia( "(min-width: 992px)" ).matches) fixPerItems = anchorPoints[2];
				else if (window.matchMedia( "(min-width: 768px)" ).matches) fixPerItems = anchorPoints[1];
				else fixPerItems = anchorPoints[0];
			}
			else {
				if (windowSize < breakPoints[0]) fixPerItems = anchorPoints[0];
				else if (windowSize < breakPoints[1]) fixPerItems = anchorPoints[1];
				else if (windowSize < breakPoints[2]) fixPerItems = anchorPoints[2];
				else fixPerItems = anchorPoints[3];
			}


			// console.log(anchorPoints);
			$(this).find('.clearfix').remove();
		    $.each($(this).find('.block'), function(index, elem) {
		    	if ((index+1) % fixPerItems === 0) {
		    		$(elem).parent().after("<div class='clearfix'></div>");
		    		// console.log('clear'+index);
		    	}
		    });
		});
	};

	var handleBlocks = function() {
		var maxHeight=0;
		var row=$('.blocks');
		$.each(row, function() {
		    $.each($(this).find('.block'), function() {
		    	maxHeight = ($(this).height() > maxHeight) ? $(this).height() : maxHeight;
		    });
		    $.each($(this).find('.block'), function() {
		        $(this).height(maxHeight);
		    });
		});

		console.log('handleBlocks:' + maxHeight);
	};

	return {
		init: init,
		tuneBlocks: tuneBlocks
	};

})();

app.init();

});