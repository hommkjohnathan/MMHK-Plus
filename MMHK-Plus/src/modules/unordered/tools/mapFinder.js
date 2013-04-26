MMHKPLUS.MapFinder = MMHKPLUS.PanelElement.extend({
	elementType : "MapFinder",
	
	options : {
		title : "",
		resizable : false,
		opened : false,
		x : "center",
		y : "center",
		w : 460,
		h : 490,
		savePos : true,
		saveWidth : false,
		saveHeight : false,
		saveOpened : true,
		url : "http://www.hommk.net/index.php"
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("MAPFINDER");
		this.$elem = $("<div>");
		this._setupPanel();
		
		return this;
	},
	
	onSetup : function()
	{
		var self = this;
		this.$elem.dialog(
			{
				minWidth : self.options.w,
				maxWidth: self.options.w,
                minHeight : self.options.h,
				maxHeight : self.options.h
			}
		);
		this.$elem.css(
			{
				overflow : "hidden"
			}
		);
	},
	
	onOpen : function()
	{
		this._createView();
	},
	
	_createView : function()
	{
		var player = MMHKPLUS.getElement("Player");
		var worldId = player.get("worldId");
		var curX = player.getCurrentViewX();
		var curY = player.getCurrentViewY();
		var link = this.options.url 
						+ "?SERVER=" + worldId
						+ "&ID="+ MMHKPLUS.getRegionId(curX, curY);
		$("<iframe>").attr("src", link).css(
			{
				position : "relative",
				top : "-200px",
				left : "-150px",
				width : "750px",
				height : "830px"
			}
		).appendTo(this.$elem);
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
	}
});
