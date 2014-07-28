(function($)
{
	$.fn.switchy = function()
	{
		if(typeof arguments[0] == 'string')
			return this.switchy[arguments[0]].apply(this, Array.prototype.slice.apply(arguments).slice(1));
		else
			return this.each(function()
			{
				var on = '';
				var off = '';

				if( $(this).children().hasClass('switchy-slider') )
				{
					var options = $(this).find('.switchy-align');

					on = $(options[0]).children();
					off = $(options[1]).children();
				}
				else
				{
					var options = $(this).children();

					if(options[0])
						on = $(options[0]);

					if(options[1])
						off = $(options[1]);
				}
				
				var switchy = $(
						'<span tabindex="0">' +
						    '<span class="switchy-slider">' +
						    	'<span class="switchy-on"><span class="switchy-align"></span></span>' +
								'<span class="switchy-handle">&nbsp;</span>' +
								'<span class="switchy-off"><span class="switchy-align"></span></span>' +
						    '</span>' +
						'</span>');

				var aligns = switchy.find('.switchy-align');

				$(aligns[0]).append(on);
				$(aligns[1]).append(off);

				switchy.data( 'switchy', {} );

				$(this.attributes).each(function()
				{
					switchy.attr(this.name, this.value);
				});
				
				switchy.on('show', function(){"console.log('resize')"});
				

				switchy.addClass('switchy');
				
				var hidden = $('<div style="visibility:hidden">');
				hidden.append(switchy);
				$('body').append(hidden);
				
				var width = Math.max( switchy.find('.switchy-on .switchy-align').width(),
								  switchy.find('.switchy-off .switchy-align').width() );
				
				hidden.remove();
				
				switchy.find('.switchy-align').width(width);
				
				$(this).replaceWith(switchy);
				
				function onClick(e)
				{
					if( e.which != 1 || switchy.hasClass('disabled') )
						return false;
					
					e.preventDefault();
					e.stopPropagation();
					
					if(switchy.data('switchy').skipClick)
					{
						delete switchy.data('switchy').skipClick;
						return;
					}
					
					switchy.removeClass('middle').toggleClass('active');
					
					switchy.trigger('change.switchy');
				}

				function onDragStart(e)
				{
					e.preventDefault();
					e.stopPropagation();
					
					switchy.data('switchy').skipClick = true;
					
					$(document).off('mousemove').on('mousemove', onDrag);
					
					switchy.find('.switchy-slider').css('transition', 'initial');
					
					$(document).one('mouseup', function(e)
					{
						e.preventDefault();
						
						var slider = switchy.find('.switchy-slider');
						var hasClassActive = switchy.hasClass('active');
						
						var x = switchy.find('.switchy-slider').css('transform').match(/-?[0-9\.]+/g)[4];
						if(x < -switchy.width()/4)
							switchy.removeClass('active');
						else
							switchy.addClass('active');
						
						if(switchy.hasClass('active') != hasClassActive)
							switchy.trigger('change.switchy');
						
						
						slider.css('transition', '').css('transform', '');
						
						switchy.one('mousemove', function()
						{
							delete switchy.data('switchy').skipClick;
						});
					});
				}
				
				function onDrag(e)
				{
					e.preventDefault();
					e.stopPropagation();
					
					var data = switchy.data('switchy');
					
					var dragDelta = e.pageX - data.clickPos;
					var width = switchy.find('.switchy-slider').width();
					
					if( !switchy.hasClass('active') )
						dragDelta -= width/3;

					dragDelta = Math.max(dragDelta, -width/3);
					dragDelta = Math.min(dragDelta, 0);
					
					switchy.find('.switchy-slider').css('transform', 'translateX(' + dragDelta + 'px)');
				}
				
				function onMouseDown(e)
				{
					if( e.which != 1 || switchy.hasClass('disabled') )
						return false;
					
					switchy.data('switchy').clickPos = e.pageX;
					switchy.data('switchy').clickOffset = (e.offsetX === undefined) ? e.layerX : e.offsetX;
					
					var slider = switchy.find('.switchy-slider');
					
					$(document).on('mousemove', onDragStart);
					
					$(document).one('mouseup', function(e)
					{
						$(document).off('mousemove');
					});
				}
				
				switchy.find('.switchy-slider').on('mousedown', onMouseDown);
				switchy.on('click', onClick);
			});
	};

	$.fn.switchy.set = function(set)
	{
		if(set === true || set === 'on')
			this.removeClass('middle').addClass('active');
		else if(set === false || set === 'off')
			this.removeClass('active middle');
		else if(set === 'middle')
			this.removeClass('active').addClass('middle');
	};

	$('[data-provide=switchy]').switchy();
}(jQuery));
