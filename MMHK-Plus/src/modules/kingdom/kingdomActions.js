MMHKPLUS.KingdomActions = MMHKPLUS.PanelElement.extend({
	elementType : "KingdomActions",
	
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
		this.options.title = MMHKPLUS.localize("ACTIONS");
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
	
	_createView : function()
	{
		var self = this;
		this.$elem.empty();
		var $table = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(this.$elem);
		$(
			"<tr>\
				<th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("ACTION") + "</th>\
				<th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("END_DATE") + "</th>\
				<th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("END_IN") + "</th>\
			</tr>"
		).appendTo($table);
		
		var actions = MMHKPLUS.getElement("Player").getActions();
		
		actions.forEach(function(action)
			{
				action = action.content;
				var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
				var d1 = new Date(); d1.setTime(action.endDate * 1000);
				var d2 = new Date(); d2.setTime(d1.getTime() - d2.getTime());
				
				$("<td class='MMHKPLUS_KingdomActionsCell'>")
					.append(
						MMHKPLUS.getCssSprite("TimeLineAction", action.type)
							.css({"float" : "left", "margin-right" : "10px"}))
					.append(
						$("<p>")
							.html("<a href='#' class='MMHKPLUS_Link'>" + action.actionDescription + "</a>"))
					.click(function()
						{
							$(".MMHKPLUS_Action_" + action.id).toggleClass("hidden");
						}
					).appendTo($line);
				$("<td class='MMHKPLUS_KingdomActionsCell MMHKPLUS_TextCenter' style='width:170px;'/>")
					.append(
						$("<p>")
							.html(d1.toShortFrenchFormat()))
					.appendTo($line);
				$("<td class='MMHKPLUS_KingdomActionsCell MMHKPLUS_TextCenter' style='width:100px;'/>")
					.append(
						$("<p>")
							.html(d2.countDown()))
					.appendTo($line);
				
				if(hasProperty(action, "attachedSlaveActionList") && action.attachedSlaveActionList.length > 0)
				{
					action.attachedSlaveActionList.forEach(function(slave)
						{
							if((slave.endDate * 1000) > new Date().getTime())
							{
								var $specificContent = "";
								if(slave.type == "CARAVAN_DELIVERY_MOVE")
								{
									$specificContent = $("<div/>");
					    			for(var i = 1; i <=7; i++)
					    			{
					    				$specificContent
					    					.append(
					    							MMHKPLUS.getCssSprite("Ressources", MMHKPLUS.resources[i-1]).addClass("MMHKPLUS_KingdomResourcesImage").css("display", "inline-block").css("margin-bottom", "10px").css("margin-left", "10px"))
					    					.append(
					    						$("<span/>")
					    							.html(formatNumber(parseInt(slave.paramList[i])))
					    							.css("padding-left", "4px").css("top", "-4px").css("position", "relative"));
					    			}
								}
								var $lineS = $("<tr style='color:lightgray;' class='MMHKPLUS_Action_" + action.id + "'/>").appendTo($table);
								var d3 = new Date(); d3.setTime(slave.endDate * 1000 - new Date().getTime());
								var d4 = new Date(); d4.setTime(slave.endDate * 1000);
								$("<td style='padding-left:45px;border-top:1px solid gray;'/>").append($("<p/>").html(slave.typeName).append($specificContent)).appendTo($lineS);
								$("<td style='width:170px;border-top:1px solid gray;' class='MMHKPLUS_TextCenter'/>")
									.html(d4.toShortFrenchFormat())
									.appendTo($lineS);
								$("<td style='width:100px;border-top:1px solid gray;' class='MMHKPLUS_TextCenter'/>")
									.append(
										$("<p/>")
											.html(d3.countDown()))
									.appendTo($lineS);
								$lineS.addClass("hidden");
							}
						}
					);
				}
			}
		);
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
	}
});
