MMHKPLUS.KingdomRecruitment = MMHKPLUS.ArmiesPanelElement.extend({
	elementType : "KingdomRecruitment",
	cities : [],
	
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
		images : MMHKPLUS.URL_IMAGES + "ressources/"
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("RECRUITMENT");
		this.$elem = $("<div>");
		this._setupPanel();
		
		return this;
	},
	
	pushStack : function(stack, armies)
	{
		var rank = -1; var i = 0;
		armies.forEach(function(army)
			{
				if(army.tier == stack.tier && army.factionEntityTagName == stack.factionEntityTagName)
				{
					rank = i;
				}
				i++;
			}
		);
		if(rank == -1)
		{
			armies.push(
				{
					factionEntityTagName : stack.factionEntityTagName,
					unitEntityName : stack.unitEntityName,
					type : stack.type,
					tier : stack.tier,
					avail : stack.avail,
					power : stack.power,
					baseDuration : stack.baseDuration,
					baseIncome : stack.baseIncome,
					income : stack.income,
					goldCost : stack.goldCost || 0,
					mercuryCost : stack.mercuryCost || 0,
					crystalCost : stack.crystalCost || 0,
					sulfurCost : stack.sulfurCost || 0,
					gemCost : stack.gemCost || 0
					
				}
			);
		}
		else
		{
			armies[rank].avail += stack.avail;
			armies[rank].baseIncome += stack.baseIncome;
			armies[rank].income += stack.income;
		}
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
	
	_createView : function()
	{
		var self = this;
		var params = $.map(MMHKPLUS.getElement("Player").getCities(), function(elem, i) { return [[elem.content.id]] ; });
		this.setProgressContent(this, MMHKPLUS.getElement("Ajax").getCityRecruitmentFrame, params, self._pushCity, self._createViewContent, self._abort);
	},
	
	_pushCity : function(json)
	{
		var key = Object.keys(json.d)[0];
		var cityId = key.replace("RecruitmentFrame", "");
		var city = MMHKPLUS.getElement("Player").getCity(cityId);
		
		this.cities.push(
			{
				id : city.content.id,
				name : city.content.cityName,
				date : city.content.captureDate,
				content : json.d[key].recruitableUnitList || []
			}
		);
	},
	
	_resourceImageText : function(resource)
	{
		return "<img src='" + this.options.images + resource + ".png' style='width:14px;height:14px;padding-left:3px;padding-right:3px;'/>";
	},
	
	_createLineContent : function(self, $parent, toRecruit, isTotal)
	{
		for(var i = 1 ; i < 9 ; i++)
		{
			var units = self.getStacks(i, toRecruit);
			var textIncome = "";
			var textAvail = "";
			var $tUnits = $("<td>").addClass("MMHKPLUS_KingdomResourcesCell").appendTo($parent);
			var $inlineTable = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo($tUnits);
			var $inlineLine = $("<td>").addClass("MMHKPLUS_100Width").appendTo($("<tr>").addClass("MMHKPLUS_100Width").appendTo($inlineTable));
			var first = true;
			units.forEach(function (u)
				{
					var $t = $("<div/>").addClass((isTotal ? "MMHKPLUS_KingdomRecruitmentCellImageTotal" : "MMHKPLUS_KingdomArmiesCellImage")).appendTo($inlineLine);
					first = false;
					var $img = MMHKPLUS.getCssSprite("UnitStack_" + u.factionEntityTagName, u.tier).appendTo($t);
					var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($img, function($container, $tip)
						{
							var time = new Date(); time.setTime(u.baseDuration * 1000);
							var time2 = new Date(); time2.setTime(u.baseDuration * u.avail * 1000);
							var time3 = new Date(); time3.setTime(u.baseDuration * Math.ceil(u.income) * 1000);
							var unitPrice = "";
							var dayPrice = "";
							var totalPrice = "";
							if(u.goldCost != 0)
							{
								var img = self._resourceImageText("gold");
								unitPrice += img + formatNumber(u.goldCost);
								totalPrice += img + formatNumber(u.avail * u.goldCost);
								dayPrice += img + formatNumber(Math.ceil(u.income) * u.goldCost);
							}
							if(u.mercuryCost != 0)
							{
								var img = self._resourceImageText("mercury");
								unitPrice += img + formatNumber(u.mercuryCost);
								totalPrice += img + formatNumber(u.avail * u.mercuryCost);
								dayPrice += img + formatNumber(Math.ceil(u.income) * u.mercuryCost);
							}
							if(u.crystalCost != 0)
							{
								var img = self._resourceImageText("crystal");
								unitPrice += img + formatNumber(u.crystalCost);
								totalPrice += img + formatNumber(u.avail * u.crystalCost);
								dayPrice += img + formatNumber(Math.ceil(u.income) * u.crystalCost);
							}
							if(u.sulfurCost != 0)
							{
								var img = self._resourceImageText("sulfure");
								unitPrice += img + formatNumber(u.sulfurCost);
								totalPrice += img + formatNumber(u.avail * u.sulfurCost);
								dayPrice += img + formatNumber(Math.ceil(u.income) * u.sulfurCost);
							}
							if(u.gemCost != 0)
							{
								var img = self._resourceImageText("gem");
								unitPrice += img + formatNumber(u.gemCost);
								totalPrice += img + formatNumber(u.avail * u.gemCost);
								dayPrice += img + formatNumber(Math.ceil(u.income) * u.gemCost);
							}
							
							MMHKPLUS.getCssSprite("UnitStack_types", u.type).appendTo($tip);
							$("<p/>").html(u.unitEntityName).addClass("MMHKPLUS_KingdomArmiesCellTooltipName").appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("UNIT_AMOUNT") + " : " + formatNumber(u.avail)).appendTo($tip);
							$("<br/>").appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("UNIT_POWER") + " : "  + formatNumber(u.power)).appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("DAILY_POWER") + " : " + formatNumber(u.power * Math.ceil(u.income))).appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("STACK_POWER") + " : " + formatNumber(u.avail * u.power)).appendTo($tip);
							$("<br/>").appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("UNIT_COST") + " : " + unitPrice).appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("DAILY_COST") + " : " + dayPrice).appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("STACK_COST") + " : " + totalPrice).appendTo($tip);
							$("<br/>").appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("UNIT_RECRUIT") + " : " + time.countDown()).appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("DAILY_RECRUIT") + " : " + time3.countDown()).appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("STACK_RECRUIT") + " : " + time2.countDown()).appendTo($tip);
							$("<br/>").appendTo($tip);
							$("<p/>").html(MMHKPLUS.localize("DAILY_PROD") + " : " + u.income + " / " + u.baseIncome).appendTo($tip);
						}
					);
								
								
								
					textIncome = "+ " + Math.ceil(u.income);
					textAvail = u.avail;
					if(isTotal)
						$("<div style='font-weight:bold;text-align:center;font-size:90%;'/>")
							.html(u.avail + " <span style='font-weight:normal;font-size:80%;text-decoration:italic;'><br/>" + "+ " + Math.ceil(u.income) + "</span>")
							.appendTo($t);
				}
			);
			if(!isTotal && textIncome.trim() != "")
				$("<div style='font-weight:bold;text-align:left;'/>")
					.html(textAvail + "&nbsp;&nbsp;<span style='font-weight:normal;font-size:80%;text-decoration:italic;'>(" + textIncome + ")</span>")
					.appendTo(
						$("<td>").addClass("MMHKPLUS_100Width")
							.appendTo($("<tr>").addClass("MMHKPLUS_100Width")
							.appendTo($inlineTable)
					)
				);
		}
	},
	
	_createViewContent : function()
	{
		var self = this;
		var $table = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(this.$elem);	
		this.cities.sort(function(a, b)
			{
				return a.date - b.date;
			}
		);
		
		var totalRecruitments = [];
		
		this.cities.forEach(function(city)
			{
				var toRecruit = [];
				city.content.forEach(function(unit)
					{
						if(unit.available || (unit.avail > 0 && hasProperty(unit, "power")))
						{
							self.pushStack(unit, toRecruit);
							self.pushStack(unit, totalRecruitments);
						}
						if(unit.upgraded.available || (unit.upgraded.avail > 0 && hasProperty(unit.upgraded, "power")))
						{
							self.pushStack(unit.upgraded, toRecruit);
							self.pushStack(unit.upgraded, totalRecruitments);
						}
					}
				);
				
				var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
				$("<td>")
					.addClass("MMHKPLUS_KingdomArmiesCell MMHKPLUS_TextCenter")
					.html("<b>" + city.name + "</b><br/><i>" + formatNumber(self.getPower(toRecruit)) + "</i>")
					.appendTo($line);
				
				self._createLineContent(self, $line, toRecruit, false);
			}
		);
		
		var $totalLine = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
		$("<td>")
			.addClass("MMHKPLUS_KingdomArmiesCell MMHKPLUS_TextCenter")
			.html("<b style='text-transform:uppercase;'>" + MMHKPLUS.localize("TOTAL") + "</b><br/><i>" + formatNumber(this.getPower(totalRecruitments)) + "</i>")
			.appendTo($totalLine);
		
		self._createLineContent(self, $totalLine, totalRecruitments, true);
		
		this.cities = null;
		this.cities = [];
	},
	
	_abort : function()
	{
		this.cities = null;
		this.cities = [];
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
		destroy(this.cities); this.cities = null;
	}
});
