MMHKPLUS.KingdomResources = MMHKPLUS.PanelElement.extend({
	elementType : "KingdomResources",
	intervalResourcesUpdate : null,
	
	options : {
		title : "",
		resizable : true,
		opened : false,
		x : "center",
		y : "center",
		w : 800,
		h : 350,
		savePos : true,
		saveWidth : true,
		saveHeight : true,
		saveOpened : true,
		refresh : 30000
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("RESOURCES");
		this.$elem = $("<div>");
		this._setupPanel();
		
		return this;
	},
	
	onSetup : function()
	{
		this.$elem.dialog(
			{
				minWidth : 650,
                minHeight : 120
			}
		);
	},
	
	onOpen : function()
	{
		this.intervalResourcesUpdate = setInterval((function(self) { return function() { self._createView(); } })(this), this.options.refresh);
		this._createView();
	},

	onClose : function()
	{
		MMHKPLUS.clearInterval(this.intervalResourcesUpdate); 
		this.intervalResourcesUpdate = null;
	},
	
	_getResourceColorDisplay : function(quantity, max)
	{
		if(quantity >= max)
		{
			return "#FF0000";
		}
		else if(quantity >= max * 0.8)
		{
			return "#FDBA1A";
		}
		else
		{
			return "#FFFFFF";
		}
	},

	_createResourceCell : function(self, $cell, tag, amount, income, storage)
	{	
		var color = (storage != null ? self._getResourceColorDisplay(amount, storage) : "#FFFFFF");
		var ressourceImage = MMHKPLUS.getCssSprite("Ressources", tag)
			.addClass("MMHKPLUS_KingdomResourcesImage")
			.appendTo($cell);
		$("<p/>").html(formatNumber(Math.floor(amount)))
			.addClass("MMHKPLUS_KingdomResourcesCellAmount")
			.css({ color : color })
			.appendTo($cell);
		$("<p/>").html((income >= 0 ? "+ " : "") + formatNumber(Math.floor(income / 24 * 100) / 100) + " / " + MMHKPLUS.localize("HOUR_SMALL"))
			.addClass("MMHKPLUS_KingdomResourcesCellAmountSmall")
			.css({ color : color })
			.appendTo($cell);
		$("<p/>").html((income >= 0 ? "+ " : "") + formatNumber(Math.floor(income)) + " / " + MMHKPLUS.localize("DAY_SMALL"))
			.addClass("MMHKPLUS_KingdomResourcesCellAmountSmall")
			.css({ color : color })
			.appendTo($cell);
	},
	
	_createView : function()
	{
		this.$elem.empty();
		var self = this;
		var table = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(this.$elem);
		
		var totalRessources = [0, 0, 0, 0, 0, 0, 0];
		var totalIncomeRessources = [0, 0, 0, 0, 0, 0, 0];
		
		var cities = MMHKPLUS.getElement("Player").getCities();
		cities.forEach(function(city)
			{
				var line = $("<tr/>").addClass("MMHKPLUS_100Width MMHKPLUS_5000ZIndex").appendTo(table);
				$("<td>")
					.addClass("MMHKPLUS_TextCenter MMHKPLUS_KingdomResourcesCell")
					.html("<b>" + city.content.cityName + "</b>")
					.appendTo(line);
				
				city.content.attachedRessourceStackList.forEach(function(ressource)
					{
						totalRessources[MMHKPLUS.resources.indexOf(ressource.ressourceEntityTagName)] += city.getRessourceQuantity(ressource.ressourceEntityTagName);
						totalIncomeRessources[MMHKPLUS.resources.indexOf(ressource.ressourceEntityTagName)] += ressource.income;
						
						var $block = $("<td>").addClass("MMHKPLUS_KingdomResourcesCell").appendTo(line);
						var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($block, function($container, $tip)
							{
								var amount = formatNumber(Math.floor(city.getRessourceQuantity(ressource.ressourceEntityTagName)));
								var maintenance = formatNumber(Math.floor(city.getResourceStack(MMHKPLUS.HOMMK.RESOURCE_GOLD).content.maintenanceGoldCost));
								var hIncome = (ressource.income >= 0 ? "+ " : "") + formatNumber(Math.floor(ressource.income));
								var dIncome = (ressource.income >= 0 ? "+ " : "") + formatNumber(Math.floor(ressource.income / 24 * 100) / 100);
								var storage = formatNumber(ressource._storageLimit);
								
								$("<p>").html(MMHKPLUS.localize("AMOUNT") + " : " + amount).appendTo($tip);
								if(ressource.ressourceEntityTagName == MMHKPLUS.HOMMK.RESOURCE_GOLD)
									$("<p>").html(MMHKPLUS.localize("MAINTENANCE") + " : "  + maintenance).appendTo($tip);
								$("<p>").html(MMHKPLUS.localize("DAILY_INCOME") + " : "  + hIncome).appendTo($tip);
								$("<p>").html(MMHKPLUS.localize("HOURLY_INCOME") + " : "  + dIncome).appendTo($tip);
								$("<p>").html(MMHKPLUS.localize("STORAGE") + " : "  + storage).appendTo($tip);
								$("<br>").appendTo($tip);
								
								if(ressource.income == 0)
								{
									$("<p/>").html(MMHKPLUS.localize("FULL_IN") + " : --").appendTo($tip);
								}
								else
								{
									var result = "";
									var need = (ressource.income >= 0 ? (ressource._storageLimit - city.getRessourceQuantity(ressource.ressourceEntityTagName)) : (city.getRessourceQuantity(ressource.ressourceEntityTagName)));
									var time = (need / ressource.income) * 24 * 3600;
									
									var d = new Date(); d.setTime(Math.abs(time * 1000));
									$("<p/>").html((time > 0 ? MMHKPLUS.localize("FULL_IN"): MMHKPLUS.localize("EMPTY_IN")) + " : " + d.longCountDown()).appendTo($tip);
									
								}
								$tip = null;
								$container = null;
							}
						);

						self._createResourceCell(self, $block, 
												 ressource.ressourceEntityTagName, city.getRessourceQuantity(ressource.ressourceEntityTagName), 
												 ressource.income, ressource._storageLimit);
					}
				);
			}
		);
		
		var $totalLine = $("<tr>").addClass("MMHKPLUS_100Width MMHKPLUS_5000ZIndex").appendTo(table);
		$("<td>").addClass("MMHKPLUS_KingdomResourcesCell MMHKPLUS_TextCenter").html("<b style='text-transform:uppercase;'>" + MMHKPLUS.localize("TOTAL") + "</b>").appendTo($totalLine);
		for(var i = 0 ; i < 7 ; i++)
		{
			var $block = $("<td>").addClass("MMHKPLUS_KingdomResourcesCell").appendTo($totalLine);
			self._createResourceCell(self, $block, 
									 MMHKPLUS.resources[i], totalRessources[i], 
									 totalIncomeRessources[i], null);
		}
	},
	
	unload : function()
	{
		MMHKPLUS.clearInterval(this.intervalResourcesUpdate); 
		this.intervalResourcesUpdate = null;
		MMHKPLUS.resetElement(this.$elem);
	}
});
