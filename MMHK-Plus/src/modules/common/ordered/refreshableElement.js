MMHKPLUS.RefreshableElement = MMHKPLUS.ExtendableElement.extend({
	elementType : "RefreshableElement",
	
	options : {
		refreshInterval : 60000, // 60 seconds
		lastRefreshTime : null,
		nextRefreshTime : null
	},
	
	get : function(property)
	{
		this._update();
		if(!this.isset(property))
			return null;
		return this[property];
	},
	
	set : function(property, value)
	{
		this[property] = value;
	},
	
	_update : function()
	{
		var now = $.now();
		if(!this.options.nextRefreshTime || this.options.nextRefreshTime < now)
		{
			this.options.lastRefreshTime = now;
			this.options.nextRefreshTime = this.options.lastRefreshTime + this.options.refreshInterval;
			this._refresh();
		}
	},

	_refresh : function()
	{
		// Nothing
	}
});
