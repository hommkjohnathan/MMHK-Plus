MMHKPLUS.Player = MMHKPLUS.RefreshableElement.extend({
	elementType : "Player",
	
	options : {
		refreshInterval : 5 * 60 * 1000 // 20 minutes
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this._refresh();
		
		return this;
	},
	
	isInAlliance : function()
	{
		return (isDefined(this.allianceId) && this.allianceId != -1);
	},
	
	getCities : function()
	{
		return MMHKPLUS.HOMMK.elementPool.obj.RegionCity.values().sort(function(a,b)
			{
				return a.content.captureDate - b.content.captureDate;
			}
		);
	},
	
	getCity : function(id)
	{
		return MMHKPLUS.HOMMK.elementPool.obj.RegionCity.obj[id] || null;
	},
	
	getHeroes : function()
	{
		var result = [];
		MMHKPLUS.HOMMK.elementPool.obj.Hero.values().forEach(function(h)
			{
				if(!hasProperty(h.content, "capture_playerId") && !hasProperty(h.content, "capture_region_id"))
					result.push(h);
			}
		);
		return result.sort(function(a, b)
			{
				return b._level - a._level;
			}
		);
	},
	
	getHero : function(id)
	{
		return MMHKPLUS.HOMMK.elementPool.obj.Hero.obj[id] || null;
	},
	
	getActions : function()
	{
		if(!MMHKPLUS.HOMMK.elementPool.obj.MasterAction) {
			return [];
		}
		return  MMHKPLUS.HOMMK.elementPool.obj.MasterAction.values().sort(function(a, b)
			{
				return a.content.endDate - b.content.endDate;
			}
		);
	},
	
	getAction : function(id)
	{
		return  MMHKPLUS.HOMMK.elementPool.obj.MasterAction.obj[id] || null;
	},
	
	getRegions : function()
	{
		return MMHKPLUS.HOMMK.elementPool.obj.Region.values();
	},
	
	getRegion : function(id)
	{
		return MMHKPLUS.HOMMK.elementPool.obj.Region.obj[id] || null;
	},
	
	getChatMessages : function()
	{
		return MMHKPLUS.HOMMK.elementPool.obj.Chat.obj[this.playerId].log.values();
	},
	
	getCurrentViewX : function()
	{
		return MMHKPLUS.HOMMK.currentView.regionX || 1;
	},
	
	getCurrentViewY : function()
	{
		return MMHKPLUS.HOMMK.currentView.regionY || 1;
	},
	
	_refresh : function()
	{
		this.playerId = MMHKPLUS.HOMMK.player.content.id;
		this.playerName = MMHKPLUS.HOMMK.player.content.name;
		this.allianceId = MMHKPLUS.HOMMK.player.content.allianceId || -1;
		this.allianceName = MMHKPLUS.HOMMK.player.content.allianceName || "";
		this.color = (this.isInAlliance() ? MMHKPLUS.HOMMK.player.content.allianceColor : MMHKPLUS.HOMMK.player.content.color);
		this.background = MMHKPLUS.HOMMK.player.content.backgroundNb;
		this.pattern = MMHKPLUS.HOMMK.player.content.patternNb;
		this.iconNb = MMHKPLUS.HOMMK.player.content.iconNb;
		
		this.worldId = MMHKPLUS.HOMMK.player.content.worldId;
		this.worldSize = MMHKPLUS.HOMMK.worldMap.content._size || 280;
		this.worldName = MMHKPLUS.HOMMK.WORLD_NAME;
		this.season = MMHKPLUS.HOMMK.WORLD_SEASON_NUMBER;
	}
});
