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
					
					on = $(options[0]);
					off = $(options[1]);
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

				switchy.data('switchy', { eventHandlers: {} });
				
				$(this.attributes).each(function()
				{
					if(this.name == 'onclick')
						switchy.data('switchy').eventHandlers.onclick = this.value;
					else
						switchy.attr(this.name, this.value);
				});
				
				
				switchy.addClass('switchy');
				$(this).replaceWith(switchy);
				var width = Math.max( switchy.find('.switchy-on .switchy-align').width(),
								  switchy.find('.switchy-off .switchy-align').width() );
				
				switchy.find('.switchy-align').width(width);


				
				function onClick(e)
				{
					if( e.which != 1 || switchy.hasClass('disabled') )
						return false;
					
					e.preventDefault();
					
					if(switchy.data('switchy').skipClick)
					{
						delete switchy.data('switchy').skipClick;
						return;
					}
					
					switchy.removeClass('middle').toggleClass('active');
					
					var onclick = switchy.data('switchy').eventHandlers.onclick;
					
					if(onclick)
						eval(onclick);
				}
				
				function onDragStart(e)
				{
					e.preventDefault();
					
					switchy.data('switchy').skipClick = true;
						
					$(document).off('mousemove').on('mousemove', onDrag);
					
					switchy.find('.switchy-slider').css('transition', 'initial');
										
					$(document).one('mouseup', function(e)
					{
						e.preventDefault();
						
						var slider = switchy.find('.switchy-slider');
						
						if(slider.css('left').slice(0, -2) < -switchy.width()/4)
							switchy.removeClass('active');
						else
							switchy.addClass('active');
						
						slider.css('transition', '').css('left', '');
						
						switchy.one('mousemove', function()
						{
							delete switchy.data('switchy').skipClick;
						});
					});
				}
				
				function onDrag(e)
				{
					e.preventDefault();
					
					var data = switchy.data('switchy');
					
					var dragDelta = e.pageX - data.clickPos + data.initialPos;
					var width = switchy.find('.switchy-slider').width();
					
					dragDelta = Math.max(dragDelta, -width/3);
					dragDelta = Math.min(dragDelta, 0);
					
					switchy.find('.switchy-slider').css('left', dragDelta);
				}
				
				function onMouseDown(e)
				{
					if( e.which != 1 || switchy.hasClass('disabled') )
						return false;
					
					switchy.data('switchy').clickPos = e.pageX;
					switchy.data('switchy').clickOffset = (e.offsetX === undefined) ? e.layerX : e.offsetX;
					switchy.data('switchy').initialPos =
							Number( switchy.find('.switchy-slider').css('left').slice(0, -2) );
					
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