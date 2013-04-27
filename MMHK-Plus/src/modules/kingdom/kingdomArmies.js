MMHKPLUS.KingdomArmies = MMHKPLUS.ArmiesPanelElement.extend({
	elementType : "KingdomArmies",
	
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
		saveOpened : true
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("ARMIES");
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
		this._createView();
	},
	
	_createCellContent : function(units, totalArmies, $parent)
	{
		var self = this;
		units.forEach(function (u)
			{
				if(totalArmies != null)
				{
					self.pushStack(u, totalArmies);
				}
				var $t = $("<div>").addClass("MMHKPLUS_KingdomArmiesCellImage").appendTo($parent);
				var $img = MMHKPLUS.getCssSprite("UnitStack_" + u.factionEntityTagName, u.tier).appendTo($t);
				var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($img, function($container, $tip)
					{
						MMHKPLUS.getCssSprite("UnitStack_types", u.unitEntityType).appendTo($tip);
						$("<p/>").html(u.unitEntityName).addClass("MMHKPLUS_KingdomArmiesCellTooltipName").appendTo($tip);
						$("<p/>").html(MMHKPLUS.localize("UNIT_POWER") + " : " + formatNumber(u.unitEntityPower)).appendTo($tip);
						$("<p/>").html(MMHKPLUS.localize("UNIT_AMOUNT") + " : "  + formatNumber(u.quantity)).appendTo($tip);
						$("<br/>").appendTo($tip);
						$("<p/>").html(MMHKPLUS.localize("STACK_POWER") + " : " + formatNumber(u.quantity * u.unitEntityPower)).appendTo($tip);
						
						$tip = null;
						$container = null;
					}
				);
							
				$("<div>").addClass("MMHKPLUS_KingdomArmiesCellAmount").html(u.quantity).appendTo($t);
			}
		);
	},
	
	_createView : function()
	{
		this.$elem.empty();
		var self = this;
		var table = $("<table/>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(this.$elem);
		
		var totalArmies = [];
		var cities = MMHKPLUS.getElement("Player").getCities();
		
		cities.forEach(function(city)
			{
				var armies = [];
				for(var i = 1 ; i < 8; i++)
				{
					var stack = city.completeView_unitStackList.getUnitStackByPosition(i);
					if(stack)
						self.pushStack(stack.content, armies);
				}

				city.content.attachedHeroList.forEach(function (hero)
					{
						if(hasProperty(hero, "attachedUnitStackList"))
                        {
                            MMHKPLUS.getElement("Player").getHero(hero.id).unitStackList.getContent().forEach (function(stack)
                            // hero.attachedUnitStackList.forEach (function(stack)
                                {
                                    self.pushStack(stack, armies);
                                }
                            );
                        }
					}
				);

				var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo(table);
				$("<td>").addClass("MMHKPLUS_KingdomArmiesCell MMHKPLUS_TextCenter")
					.html("<b>" + city.content.cityName + "</b><br/><i>" + formatNumber(self.getPower(armies)) + "</i>")
					.appendTo($line);
				for(var i = 1 ; i < 9 ; i++)
				{
					var units = self.getStacks(i, armies);
					var $tUnits = $("<td>").addClass("MMHKPLUS_KingdomResourcesCell").appendTo($line);
					self._createCellContent(units, totalArmies, $tUnits);
				}
			}
		);
		
		totalArmies.sort(self.sortStack);
		
		var $totalLine = $("<tr>").addClass("MMHKPLUS_100Width").appendTo(table);
		$("<td>").addClass("MMHKPLUS_KingdomArmiesCell MMHKPLUS_TextCenter")
			.html("<b style='text-transform:uppercase;'>" + MMHKPLUS.localize("TOTAL") + "</b><br/><i>" + formatNumber(self.getPower(totalArmies)) + "</i>")
			.appendTo($totalLine);
		for(var i = 1 ; i < 9 ; i++)
		{
			var units = self.getStacks(i, totalArmies);
            var $tUnits = $("<td>").addClass("MMHKPLUS_KingdomResourcesCell").appendTo($totalLine);
			self._createCellContent(units, null, $tUnits);
		}
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
	}
});
