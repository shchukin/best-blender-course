/* Player */

var e_modal = 0;

function size_modal() {
	if (e_modal != 0 && $(window).width() > 800) {
		var r = $(window).height() - $(e_modal).outerHeight(true);

		if (r > 0) {
			$(e_modal).css('top', r / 2);
			$(e_modal + ' .modal_close').addClass('absolute');
		} else {
			$(e_modal + ' .modal_close').removeClass('absolute');
			$(e_modal).css('top', '');
		}
	} else {
		$(e_modal).css('top', '');
	}
}

function open_modal(e) {
	e_modal = e;

	size_modal();
	scroll_modal('open');
	$(e).modal().open();
}

function close_modal(e) {
	$(e).modal().close();

	e_modal = 0;
};

function next_modal(open) {
	$.modal().close();

	e_modal = 0;

	open_modal(open);
}

var scroll_position = 0;

function scroll_modal(func) {
	if (func == 'open') {
		scroll_position = $(window).scrollTop();
	} else if (func == 'close') {
		$(window).scrollTop(scroll_position); 
	}
	
}

$(window).resize(size_modal);

(function($, window, document, undefined) {
	"use strict";
	var pluginNamespace = 'the-modal',
		defaults = {
			overlayClass: 'modal_overlay',
			closeOnEsc: true,
			closeOnOverlayClick: true,
			onClose: null,
			onOpen: null,
			cloning: false
		};

	function lockContainer() {
		$('html,body').addClass('modal_lock');
		$('.wrapper').addClass('blur');
	}

	function unlockContainer() {
		$('html,body').removeClass('modal_lock');
		$('.wrapper').removeClass('blur');
	}

	function init(els, options) {
		var modalOptions = options;
		if (els.length) {
			els.each(function() {
				$(this).data(pluginNamespace + '.options', modalOptions);
			});
		} else {
			$.extend(defaults, modalOptions);
		}
		return {
			open: function(options) {
				var el = els.get(0);
				var localOptions = $.extend({}, defaults, $(el).data(pluginNamespace + '.options'), options);
				if ($('.' + localOptions.overlayClass).length) {
					$.modal().close();
				}
				lockContainer();
				var overlay = $('<div/>').addClass(localOptions.overlayClass).prependTo('body');
				overlay.data(pluginNamespace + '.options', options);
				if (el) {
					if (!localOptions.cloning) {
						overlay.data(pluginNamespace + '.el', el);
						$(el).data(pluginNamespace + '.parent', $(el).parent());
						$(el).appendTo(overlay).show();
					} else {
						$(el).clone(true).appendTo(overlay).show();
					}
				}
				if (localOptions.closeOnEsc) {
					$(document).bind('keyup.' + pluginNamespace, function(e) {
						if (e.keyCode === 27) {
							$.modal().close();
						}
					});
				}
				if (localOptions.closeOnOverlayClick) {
					overlay.children().on('click.' + pluginNamespace, function(e) {
						e.stopPropagation();
					});
					$('.' + localOptions.overlayClass).on('click.' + pluginNamespace, function(e) {
						$.modal().close();
					});
				}
				$(document).bind('touchmove.' + pluginNamespace, function(e) {
					if (!$(e).parents('.' + localOptions.overlayClass)) {
						e.preventDefault();
					}
				});
				if (localOptions.onOpen) {
					localOptions.onOpen(overlay, localOptions);
				}
			},
			close: function() {
				var el = els.get(0);
				var localOptions = $.extend({}, defaults, options);
				var overlay = $('.' + localOptions.overlayClass);
				$.extend(localOptions, overlay.data(pluginNamespace + '.options'));
				if (!localOptions.cloning) {
					if (!el) {
						el = overlay.data(pluginNamespace + '.el');
					}
					$(el).appendTo($(el).data(pluginNamespace + '.parent'));
				}
				overlay.remove();
				unlockContainer();
				if (localOptions.closeOnEsc) {
					$(document).unbind('keyup.' + pluginNamespace);
				}
				if (localOptions.onClose) {
					localOptions.onClose(overlay, localOptions);
				}

				scroll_modal('close');
				$('#yt_player').empty();
				$('.modal').fadeOut(0);
			}
		};
	}
	$.modal = function(options) {
		return init($(), options);
	};
	$.fn.modal = function(options) {
		return init(this, options);
	};
})(jQuery, window, document);

/* Player */