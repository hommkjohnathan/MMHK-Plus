MMHKPLUS.Lookout = MMHKPLUS.PanelElement.extend({
	elementType : "Lookout",
	intervalUpdate : null,
	moves : [],
	cachePlayers : {},
	cacheAlliances : {},
	cacheMoves : {},
    currentPlot : "",
	
	options : {
		title : "",
		resizable : true,
		opened : false,
		x : "center",
		y : "center",
		w : 880,
		h : 350,
		savePos : true,
		saveWidth : false,
		saveHeight : true,
		saveOpened : true,
		refresh : 30000,
		size : 30,
		images : MMHKPLUS.URL_IMAGES + "vigie/"
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("LOOKOUT");
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
                minHeight : 150
			}
		);
	},
	
	onOpen : function()
	{
		var self = this;
		var $filters = $("<div style='padding:5px;text-align:center;'/>").appendTo(this.$elem);
		$("<label>").html(MMHKPLUS.localize("FILTER") + " : ").appendTo($filters);
		$("<input>").css({marginRight : "25px"}).keyup(function() {self._createView.call(self);}).appendTo($filters);

		$("<input>").css({marginTop : "3px", marginRight : "5px"}).attr("type", "checkbox").change(function() {self._createView.call(self);}).appendTo($filters);
		$("<label>").html(MMHKPLUS.localize("HIDE_ALLIANCE")).appendTo($filters);
		
		this.intervalUpdate = setInterval((function(self) { return function() { self._request(); } })(this), this.options.refresh);
		this._request();
	},
	
	onClose : function()
	{
		MMHKPLUS.clearInterval(this.intervalUpdate); this.intervalUpdate = null;
	},
	
	_request : function()
	{
		var player = MMHKPLUS.getElement("Player");
		var worldId = player.get("worldId");
		var s = player.get("worldSize");
		var x = parseInt(((player.getCurrentViewX() - ((this.options.size - 1)/2)) % s) + 1); if(x < 1) x += s;
		var y = parseInt(((player.getCurrentViewY() - ((this.options.size - 1)/2)) % s) + 1); if(y < 1) y += s;
		MMHKPLUS.getElement("Ajax").getHeroMove(worldId, x, y, this.options.size, this.options.size, (function(self) { return function(json) { self._requestAnswer(json); } })(this));
	},
	
	_requestAnswer : function(json)
	{
		this.moves = null;
		this.moves = json.d[Object.keys(json.d)[0]] || [];
		this._createView();
	},
	
	_createView : function()
	{
		var self = this;
		
		this.$elem.find("table").remove();
		
		var player = MMHKPLUS.getElement("Player");
		var filterText = this.$elem.find("input[type!=checkbox]").val().toUpperCase();
		var filterAlliance = this.$elem.find("input[type=checkbox]").is(":checked");
		var filterMoves = $.grep(this.moves, function(item, index)
			{
				return (!player.isInAlliance() 
							|| (player.isInAlliance() && !filterAlliance) 
							/*|| (player.isInAlliance() && filterAlliance && self._getPlayerInfo(item.masterHeroMove.playerId).allianceName != player.get("allianceName"))*/)
						/*&& ((self._getPlayerInfo(item.masterHeroMove.playerId).playerName.toUpperCase().indexOf(filterText) != -1)
								|| (self._getPlayerInfo(item.masterHeroMove.playerId).allianceName.toUpperCase().indexOf(filterText) != -1)
								|| (filterText == ""))*/;
			}
		);
		filterMoves.sort(function(m, n)
			{
				return m.endDate - n.endDate;
			}
		);
		
		var movementsToCheck = $.grep(filterMoves, function(item, index)
			{
				return !hasProperty(self.cacheMoves, item.id) ||
						(hasProperty(self.cacheMoves, item.id) 
								&& self.cacheMoves[item.id].playerId == undefined 
								&& (self.cacheMoves[item.id].coord1 == undefined || self.cacheMoves[item.id].coord2 == undefined));
			}
		);
		
		self._findPlayerIdsFromMovements(movementsToCheck);
		
		var $table = $("<table>").addClass("MMHKPLUS_Table").appendTo(this.$elem);
		$(
			"<tr>\
				<th class='MMHKPLUS_CellHeader' style='width:200px;'>" + MMHKPLUS.localize("ALLIANCE") + "</th>\
				<th class='MMHKPLUS_CellHeader' style='width:120px;'>" + MMHKPLUS.localize("PLAYER") + "</th>\
				<th class='MMHKPLUS_CellHeader' style='width:80px;'>" + MMHKPLUS.localize("FROM") + "</th>\
				<th class='MMHKPLUS_CellHeader' style='width:80px;'>" + MMHKPLUS.localize("TO") + "</th>\
				<th class='MMHKPLUS_CellHeader' style='width:80px;'>" + MMHKPLUS.localize("NEXT_HALT") + "</th>\
				<th class='MMHKPLUS_CellHeader' style='width:150px;'>" + MMHKPLUS.localize("END") + "</th>\
				<th class='MMHKPLUS_CellHeader' style='width:80px;'>" + MMHKPLUS.localize("HERO") + "</th>\
				<th class='MMHKPLUS_CellHeader' style='width:50px;'>" + MMHKPLUS.localize("SPEED") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:50px;'>" + "" + "</th>\
			</tr>"
		).appendTo($table);
		
		filterMoves.forEach(function(move)
			{
				var playerId = -1.
				if(hasProperty(self.cacheMoves, move.id)) {
					playerId = self.cacheMoves[move.id].playerId || -1;
				}
				var startDate = move.startDate;
				var endDate = new Date();
				endDate.setTime(move.endDate * 1000);
				var from = { x : parseInt(move.masterHeroMove.x1), y : parseInt(move.masterHeroMove.y1) };
				var to = { x : parseInt(move.masterHeroMove.x2), y : parseInt(move.masterHeroMove.y2) };
				var speedText = "";
				var hasHalt = (move.x2p != to.x || move.y2p != to.y);
				var halt = { };
				if(hasHalt)
				{
					halt.x = parseInt(move.x2p);
					halt.y = parseInt(move.y2p);
				}
				
				if(endDate.getTime() > $.now())
				{
					if(playerId != -1) {
						var data = self._getPlayerInfo(playerId);
					}

					var $line = $("<tr>").appendTo($table);

					$("<td>").addClass("MMHKPLUS_Cell clickable")
						.css({textAlign : "left", paddingLeft : "15px"})
						.addClass(data ? "MMHKPLUS_LookoutAlliance" + data.allianceId : "")
						.append(data ? self._createBlockColor(self, playerId) + data.allianceName : "?")
						.appendTo($line);
					 
					$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter clickable")
						.addClass(data ? "MMHKPLUS_LookoutPlayer" + playerId : "")
						.click(function() {if(playerId != undefined) MMHKPLUS.openPlayerFrame(playerId);})
						.html(data ? data.playerName : "?")
						.appendTo($line);
					$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter clickable")
						.addClass("MMHKPLUS_Lookout" + from.x + "_" + from.y)
						.html("(" + from.x + "," + from.y + ")")
						.click(function() {MMHKPLUS.centerOn(from.x, from.y);})
						.appendTo($line);
					$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter clickable")
						.addClass("MMHKPLUS_Lookout" + to.x + "_" + to.y)
						.html("(" + to.x + "," + to.y + ")")
						.click(function() {MMHKPLUS.centerOn(to.x, to.y);})
						.appendTo($line);
					$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter " + (hasHalt ? "clickable" : ""))
						.html((hasHalt ? "(" + parseInt(halt.x + 0.49) + "," + parseInt(halt.y + 0.49) + ")" : MMHKPLUS.localize("NONE")))
						.click(function() {if(hasHalt) MMHKPLUS.centerOn( halt.x + 0.49, halt.y + 0.49);})
						.appendTo($line);
					$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
						.html(endDate.toShortFrenchFormat())
						.appendTo($line);
					
					 $("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter clickable")
						// .css({width : "45px"})
						.html(data ? move.masterHeroMove.heroId : "")
						.click(function() {if(data) {MMHKPLUS.openDisplayable("AllianceHeroes");MMHKPLUS.getElement("AllianceHeroes",true)._loadHero(playerId,move.masterHeroMove.heroId); }})
						.appendTo($line);
					var diff = move.dur;
					var s = MMHKPLUS.getElement("Player").get("worldSize");
					var dx = Math.abs(move.x2p - move.x1p); var dy = Math.abs(move.y2p - move.y1p);
					if (dx > s / 2) 
					{
						dx = s - dx;
					}
					if (dy > s / 2) 
					{
						dy = s - dy;
					}
					var dist = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
					var neededTime = dist /4 * 3600;
					
					if(move.x2p == move.x1p && move.y2p == move.y1p)
					{
						$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
							// .css({width : "45px"})
							.html("<img src='" + self.options.images  + "unknow.png' style='width:15px;height:15px;'/>")
							.appendTo($line);
						speedText = MMHKPLUS.localize("LOOKOUT_SPEED_1");
					}
					else if(neededTime * 0.97 > diff)
					{
						$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
							// .css({width : "45px"})
							.html("<img src='" + self.options.images  + "increase.png' style='width:15px;height:15px;'/>")
							.appendTo($line);
						speedText = MMHKPLUS.localize("LOOKOUT_SPEED_2");
					}
					else if(neededTime * 0.97 < diff && neededTime * 1.03 > diff)
					{
						$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
							// .css({width : "45px"})
							.html("<img src='" + self.options.images  + "normal.png' style='width:15px;height:15px;'/>")
							.appendTo($line);
						speedText = MMHKPLUS.localize("LOOKOUT_SPEED_3");
					}
					else if(neededTime * 0.35 < diff)
					{
						$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
							// .css({width : "45px"})
							.html("<img src='" + self.options.images  + "decrease.png' style='width:15px;height:15px;'/>")
							.appendTo($line);
						speedText = MMHKPLUS.localize("LOOKOUT_SPEED_4");
					}

                    $("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
                        .click(function() {  })
                        .append(
                            $("<div>")
                                .button()
                                .html("● ● ●")
                                .css("lineHeight", "15px")
                                .css("padding", "2px")
                                .click(function()
                                    {
                                        $("div.MMHKPLUS_LookoutSpot").removeClass("MMHKPLUS_LookoutSpot");
                                        if(self.currentPlot != "HeroMove" + move.id + "Plot")
                                        {
                                            $("div[id^='HeroMove" + move.id + "Plot']").addClass("MMHKPLUS_LookoutSpot");
                                            self.currentPlot = "HeroMove" + move.id + "Plot";
                                        }
                                        else
                                        {
                                            self.currentPlot = "";
                                        }
                                        
                                    }))
                        .appendTo($line);
					
					 var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($line, function($container, $tip)
						{
							$tip.css({minWidth : "210px"});
							if(playerId != -1) {
								var data = self._getPlayerInfo(playerId);
								if(hasProperty(data, "playerBGNb"))
								{
									var $avatar = MMHKPLUS.getPlayerAvatar(data.playerBGNb, data.playerPatternNb, data.playerIconNb)
										.css( { position : "relative"} )
										.appendTo($tip);
									var pName = data.playerName + " (" + data.allianceName + ")";
									$("<p>")
										.html(pName)
										.css(
											{
												"position" : "relative",
												"width" : "150px",
												"padding-left" : "50px",
												"top" : "-115px",
												"font-weight" : "bold"
											})
										.appendTo($avatar);
									
									$("<p style='margin-top:10px;'/>")
										.html(MMHKPLUS.localize("DOMINATION") + " : " + data.dominationPosition + " (" + formatNumber(data.dominationScore) + ")")
										.appendTo($tip);
									$("<p/>")
										.html(MMHKPLUS.localize("WEALTH") + " : " + data.wealthPosition+ " (" + formatNumber(data.wealthScore) + ")")
										.appendTo($tip);
									$("<p/>")
										.html(MMHKPLUS.localize("HONOR") + " : " + data.honorPosition+ " (" + formatNumber(data.honorScore) + ")")
										.appendTo($tip);
									$("<br/>").appendTo($tip);
									$("<p/>")
										.html(MMHKPLUS.localize("CITY_COUNT") + " : " + data.cityList.length)
										.appendTo($tip);
								}
							}
							var d = new Date(); var tmp = new Date(); tmp.setTime(move.endDate * 1000 - d.getTime());
                            var tmp2 = new Date(); tmp2.setTime(d.getTime() - move.startDate * 1000);
							var endCD = (d > endDate ? "Terminé" : tmp.countDown());
                            var startCD = tmp2.countDown();
							$("<br/>").appendTo($tip);
							$("<p/>")
								.html(MMHKPLUS.localize("SPEED") + " : " + speedText)
								.appendTo($tip);

                            if(move.endDate != move.endDate)
                            {
                                // var startHalt = new Date() ; startHalt.setTime(move.startDate * 1000);
                                var endHalt = new Date() ; endHalt.setTime(move.endDate * 1000);
                                $("<br/>").appendTo($tip);
                                // $("<p/>")
                                //     .html(MMHKPLUS.localize("START_HALT") + " : "  + startHalt.toShortFrenchFormat())
                                //     .appendTo($tip);
                                $("<p/>")
                                    .html((move.x2p == move.x1p && move.y2p == move.y1p ? MMHKPLUS.localize("END_HALT") : MMHKPLUS.localize("START_HALT")) + " : "  + endHalt.toShortFrenchFormat())
                                    .appendTo($tip);
                            }

							$("<br/>").appendTo($tip);
                            $("<p/>")
                                .html(MMHKPLUS.localize("STARTED_SINCE") + " : "  + startCD)
                                .appendTo($tip);
							$("<p/>")
								.html(MMHKPLUS.localize("END_IN") + " : "  + endCD)
								.appendTo($tip);
							
							$tip = null;
							$container = null;
						}
					);
				}
			}
		);
		MMHKPLUS.getElement("Player").getRegions().map(function(r)
			{
				if(r.content && r.content.x && r.content.y)
				{
					if(r.content.cN)
						$(".MMHKPLUS_Lookout" + r.content.x + "_" + r.content.y).html("(" + r.content.x + "," + r.content.y + ")<br/><i>" + r.content.cN + "</i>");
				} 
			}
		);
	},
	
	_createBlockColor : function(self, id)
	{
		var data = self._getPlayerInfo(id);
		var color = "#FFFFFF";
		if(hasProperty(self.cacheAlliances, data.allianceId))
			color = getColor(self.cacheAlliances[data.allianceId].color) || color;
		else
			color = data.color || color;
		return "<div class='MMHKPLUS_Color" 
					+ self._getPlayerInfo(id).allianceId 
					+ "' style='float:left; background-color:" 
					+ color + ";width:14px; height:14px; margin:5px 5px 5px 5px;'>&nbsp&nbsp&nbsp&nbsp&nbsp</div>";
	},
	
	_getPlayerInfo : function(id)
	{
		var self = this;
		if(!hasProperty(this.cachePlayers, id))
		{
			this.cachePlayers[id] = 
				{
					id : id,
					playerName : "?",
					allianceId : "None",
					allianceName : "?",
					color : -1
				}
			;
			MMHKPLUS.getElement("Ajax").getProfileFrame(id, function(json)
				{
					var data = json.d[Object.keys(json.d)[0]];
					self.cachePlayers[id] = data;
					if(hasProperty(data, "allianceName") && !(hasProperty(self.cacheAlliances, data.allianceId)))
					{
						self.cacheAlliances[data.allianceId] = { color : -1 };
						MMHKPLUS.getElement("Ajax").getAllianceFrame(data.allianceId, function(json)
							{
								var aData = json.d[Object.keys(json.d)[0]];
								self.cacheAlliances[data.allianceId] = aData;
								self.cachePlayers[id].color = aData.color;
								self._updateDisplayedInformations(self, self.cachePlayers[id].id);
							}
						);
					}
					else if(!hasProperty(data, "allianceName"))
					{
						self.cachePlayers[id].allianceName = MMHKPLUS.localize("NONE");
					}
					self._updateDisplayedInformations(self, self.cachePlayers[id].id);
				}
			);
		}
		return this.cachePlayers[id];
	},
	
	_updateDisplayedInformations : function(self, id)
	{
		var data = self.cachePlayers[id];
		self.$elem.find("td.MMHKPLUS_LookoutPlayer" + id)
			.parent()
			.find("td:first")
			.removeClass()
			.addClass("MMHKPLUS_Cell clickable MMHKPLUS_LookoutAlliance" + data.allianceId);
		self.$elem.find("td.MMHKPLUS_LookoutPlayer" + id).html(data.playerName);
		self.$elem.find("td.MMHKPLUS_LookoutAlliance" + data.allianceId).html(self._createBlockColor(self, id) + data.allianceName);
		$("div.MMHKPLUS_Color" + data.allianceId).css({backgroundColor : getColor(data.color)});;
	},
	
	_findPlayerIdsFromMovements : function(movements) 
	{
		var self = this;
		var regionList = MMHKPLUS.HOMMK.worldMap.content.attachedRegionList;
		
		regionList.forEach(function(r) 
			{
				movements.forEach(function(m)
					{
						var movementCoordinates = 
							[
							 	{x: m.masterHeroMove.x1, y: m.masterHeroMove.y1},
							 	{x: m.masterHeroMove.x2, y: m.masterHeroMove.y2}
							]
						;
						
						movementCoordinates.forEach(function(c)
							{
								if(r.isC && r.x == c.x && r.y == c.y) {
									// Region match, check alliance/player color
									if(hasProperty(r, "_iaCol")) {
										var color = r._iaCol
									}
									else {
										var color = r._ipCol;
									}
									if(color == m.color) {
										// Put move and player in cache
										self._putMoveInCache(m.id, undefined, undefined, r.pId);
										self._getPlayerInfo(r.pId);
									}
								}
								else if(!r.isC && r.x == c.x && r.y == c.y) {
									// if region is not a city, do not check it again
									// so we save this information in move cache
									// and if the two coordinates in move cache are defined,
									// it means that we do not need to check this move playerId
									// (typically Black Elves movements)
									self._putMoveInCache(m.id, c.x, c.y, undefined);
								}
							}
						);
					}
				);
			}
		);
	},
	
	_putMoveInCache : function(id, x, y, playerId) 
	{
		var self = this;
		if(!hasProperty(self.cacheMoves, id)) {
			self.cacheMoves[id] =
				{
					coord1 : undefined,
					coord2 : undefined,
					playerId: playerId
				}
			;
		}
		if(x != undefined && y != undefined) {
			var c = {x : x, y : y};
			if(self.cacheMoves[id].coord1 == undefined) {
				self.cacheMoves[id].coord1 = c;
			}
			else {
				self.cacheMoves[id].coord2 = c
			}
		}
		if(playerId != undefined) {
			self.cacheMoves[id].playerId = playerId;
		}
	},
	
	unload : function()
	{

		MMHKPLUS.clearInterval(this.intervalUpdate); this.intervalUpdate = null;
		MMHKPLUS.resetElement(this.$elem);
		destroy(this.moves); this.moves = null;
		destroy(this.cachePlayers); this.cachePlayers = null;
		destroy(this.cacheAlliances); this.cacheAlliances = null;
		destroy(this.cacheMoves); this.cacheMoves = null;
	}
});
