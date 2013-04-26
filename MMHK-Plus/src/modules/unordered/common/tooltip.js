MMHKPLUS.Tooltip = MMHKPLUS.ExtendableElement.extend({
	elementType : "Tooltip",
	
	options : {
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.$elem = $("<div>").addClass("MMHKPLUS_Tooltip");
		
		return this;
	},
	
	setContent : function($parent, contentFunction)
	{
		var self = this; 
		$parent.off("mousemove mouseleave mouseenter");
		$parent.mouseenter(function(event)
			{
				self.$elem.empty();
				contentFunction($parent, self.$elem);
				self.$elem.appendTo($("body"));
			}
		);
		$parent.mousemove(function(event)
			{
				self.$elem.css(
					{
						top : event.pageY + 10 + "px",
						left : event.pageX + 10 + "px"
					}
				);
			}
		);
		$parent.mouseleave(function(event)
			{
				self.$elem.empty().css({width : "", minWidth : "", height : "", minHeight : ""});
				self.$elem.remove();
			}
		);
	},

	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
	}
});
