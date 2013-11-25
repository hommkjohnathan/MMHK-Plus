MMHKPLUS.MineFinder = MMHKPLUS.PanelElement.extend({
	elementType : "MineFinder",
	regionPool : {},
	elementsToSend : [],
	dualRegions : [],
	intervalDiscover : null,
	sendToServerInterval : null,
	resyncWithServer : null,
	originalTooltipHTMLContentFunction : null,
	intervalUpdateCurrentPos : null,
	ressourcesImages : 
		{
           GOLD: MMHKPLUS.URL_IMAGES + "ressources/gold.png",
           WOOD: MMHKPLUS.URL_IMAGES + "ressources/wood.png",
           ORE: MMHKPLUS.URL_IMAGES + "ressources/ore.png",
           MERCURY: MMHKPLUS.URL_IMAGES + "ressources/mercury.png",
           CRYSTAL: MMHKPLUS.URL_IMAGES + "ressources/crystal.png",
           SULFUR: MMHKPLUS.URL_IMAGES + "ressources/sulfure.png",
           GEM: MMHKPLUS.URL_IMAGES + "ressources/gem.png"
		},
	resources : ["GOLD", "WOOD", "ORE", "MERCURY", "CRYSTAL", "SULFUR", "GEM"],
	zoneMapping : 
		[
			 {x:2,y:-2}, 
	         {x:1,y:-2}, {x:2,y:-1}, 
	         {x:0,y:-2}, {x:1,y:-1}, {x:2,y:0}, 
	         {x:-1,y:-2}, {x:0,y:-1}, {x:1,y:0}, {x:2,y:1}, 
	         {x:-2,y:-2}, {x:-1,y:-1}, {x:0,y:0}, {x:1,y:1}, {x:2,y:2}, 
	         {x:-2,y:-1}, {x:-1,y:0}, {x:0,y:1}, {x:1,y:2}, 
	         {x:-2,y:0}, {x:-1,y:1}, {x:0,y:2}, 
	         {x:-2,y:1}, {x:-1,y:2}, 
	         {x:-2,y:2}
	     ],
	
	options : {
		title : "",
		resizable : false,
		opened : false,
		x : "center",
		y : "center",
		w : 500,
		h : 550,
		savePos : true,
		saveWidth : false,
		saveHeight : false,
		saveOpened : true,
	},
	
	init : function(options)
	{
		var self = this;
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("MINEFINDER");
		this.$elem = $("<div>");
		this._setupPanel();
		
		this.sendToServerInterval = setInterval(function() 
			{
				var self = MMHKPLUS.getElement("MineFinder");
				if(self.elementsToSend.length > 0) {
					MMHKPLUS.getElement("Ajax").sendMineFinderData(self.elementsToSend);
					
					self.elementsToSend.splice(0, self.elementsToSend.length);
				}
			},
			4*60000
		);
		
		this.resyncWithServer = setInterval(function()
			{
				MMHKPLUS.getElement("Ajax").getMines(self._putRegionInCacheFromServer);
			},
			5 * 60 * 1000 // 5 min
		);
		
		MMHKPLUS.getElement("Ajax").getMines(this._putRegionInCacheFromServer);
		
		this.originalTooltipHTMLContentFunction = MMHKPLUS.HOMMK.worldMap.tooltip.htmlContentFunction; 
		this.setupToolipContent();
		
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
	
	onClose : function()
	{
		clearInterval(this.intervalUpdateCurrentPos);
		this.intervalUpdateCurrentPos = null;
	},
	
	setupToolipContent : function()
	{
		if(MMHKPLUS.getElement("EnhancedUI", true).options.showResources) {
			MMHKPLUS.HOMMK.worldMap.tooltip.htmlContentFunction = this._tooltipHTMLContentFunction;
		}
		else {
			MMHKPLUS.HOMMK.worldMap.tooltip.htmlContentFunction = this.originalTooltipHTMLContentFunction;
		}
	},
	
	_createView : function()
	{
		var self = this;
		var player = MMHKPLUS.getElement("Player");
		var worldId = player.get("worldId");
		var worldSize = player.get("worldSize");
		
		this.intervalUpdateCurrentPos = setInterval(function()
			{
				$("#MMHKPLUS_MineFinder_curX").html(player.getCurrentViewX());
				$("#MMHKPLUS_MineFinder_curY").html(player.getCurrentViewY());
			},
			1000
		);
		
		var $progressLabel = $("<p>").addClass("MMHKPLUS_TextCenter MMHKPLUS_MineFinder_progress")
			.html("")
			.appendTo(this.$elem);
		var $progress = $("<div>")
			.progressbar({value:0, max:worldSize*worldSize})
			.appendTo(this.$elem);
		MMHKPLUS.getElement("Ajax").getMinesCount(function(json)
			{
				$progress.progressbar({value:json.c, max:worldSize*worldSize});
				$(".MMHKPLUS_MineFinder_progress").html(MMHKPLUS.localize("PROGRESS") + ": " + (json.c * 100 / (worldSize*worldSize)).toFixed(2) + " %");
			}
		);
		
		$("<div>")
			.addClass("MMHKPLUS_AutoCenter MMHKPLUS_TextCenter")
			.append(
				$("<label>").html("X:&nbsp"))
			.append(
				$("<span>").attr("id", "MMHKPLUS_MineFinder_curX"))
			.append(
				$("<label>").html("&nbsp;&nbsp;&nbsp;Y:&nbsp"))
			.append(
				$("<span>").attr("id", "MMHKPLUS_MineFinder_curY"))
			.appendTo(this.$elem);
		
		var $originalSelect = $("<select>")
			.append($("<option>").attr("value", -1).html("?"))
			.append($("<option>").attr("value", 0).html("0"))
			.append($("<option>").attr("value", 1).html("1"))
			.append($("<option>").attr("value", 2).html("2"));
		
		var $table = $("<table>").addClass("MMHKPLUS_AutoCenter").appendTo(this.$elem);
		var $line = $("<tr>").appendTo($table);
		for(var i = 0; i < this.resources.length; i++) {
			$("<td>")
				.addClass("MMHKPLUS_TextCenter")
				.append(
					$("<img>").attr("src", this.ressourcesImages[this.resources[i]]))
				.append($originalSelect.clone().attr("id", "MMHKPLUS_MineFinder_" + this.resources[i]))
				.appendTo($line);
		}
		
		$("<p>")
			.html("Go")
			.addClass("MMHKPLUS_AutoCenter MMHKPLUS_TextCenter")
			.css("width", "100%")
			.button()
			.click(function()
				{
					var request = 
						{
							x : parseInt($("#MMHKPLUS_MineFinder_curX").html()),
							y : parseInt($("#MMHKPLUS_MineFinder_curY").html()),
							mines : []
						}
					;
					for(var i = 0; i < self.resources.length; i++) {
						request.mines.push(
							{
								n : self.resources[i],
								c : $("#MMHKPLUS_MineFinder_" + self.resources[i]).val()
							}
						);
					}
					MMHKPLUS.getElement("Ajax").searchMines(request, function(json)
						{
							var self = MMHKPLUS.getElement("MineFinder");
							var regions = JSON.parse(json);
							
							var curX = parseInt($("#MMHKPLUS_MineFinder_curX").html());
							var curY = parseInt($("#MMHKPLUS_MineFinder_curY").html());
							
							var $table = $("#MMHKPLUS_MineFinder_Results");
							$table.empty();
							
							$table.append(
								$("<tr>").css("height", "25px")
									.append(
										$("<th>").addClass("MMHKPLUS_CellHeader").html(MMHKPLUS.localize("TAKEN")))
									.append(
										$("<th>").addClass("MMHKPLUS_CellHeader").html(MMHKPLUS.localize("LOCATION")))
									.append(
										$("<th>").addClass("MMHKPLUS_CellHeader").html(MMHKPLUS.localize("RANGE")))
									.append(
										$("<th>").addClass("MMHKPLUS_CellHeader").html(MMHKPLUS.localize("MINES"))));
							var Cartographer = MMHKPLUS.getElement("Cartographer", true);
							regions.forEach(function(r)
								{
									var occupied = false;
									if(hasProperty(Cartographer.cache, r.loc[0] + "_" + r.loc[1])) {
										if(hasProperty(Cartographer.cache[r.loc[0] + "_" + r.loc[1]], "city")) {
											occupied = true;
										}
									}
									var $line = $("<tr>").css("height", "25px").appendTo($table);
									$line
										.append(
											$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter").html(occupied ? "X" : ""))
										.append(
												$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter").css("cursor", "pointer").html("(" + r.loc[0] + "," + r.loc[1] + ")").click(function() {MMHKPLUS.centerOn(r.loc[0], r.loc[1]);}))
										.append(
												$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter").html(MMHKPLUS.distance(r.loc[0], r.loc[1], curX, curY).toFixed(1)));
									var $tdMines = $("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter").appendTo($line);
									r.mines.forEach(function(m)
										{
											$tdMines.append($("<img>").attr("src", self.ressourcesImages[m.r]).css({width:15, height:15}));
										}
									);
									
									$line.mouseover(function() 
										{
											var self = MMHKPLUS.getElement("MineFinder");
											var $zoom = $("#MMHKPLUS_MineFinder_View");
											$zoom.removeClass("hidden");
											
											$zoom.html(self._createMineView(r.mines));
										}
									);
									
									$line.mouseleave(function() 
										{
											var $zoom = $("#MMHKPLUS_MineFinder_View");
											$zoom.empty();
											$zoom.addClass("hidden");
										}
									);
								}
							);
						}
					);
				}
			)
			.appendTo(this.$elem);
		
		$("<table>")
			.attr("id", "MMHKPLUS_MineFinder_Results")
			.addClass("MMHKPLUS_Table")
			.css({width:260, position: "absolute", left: 10, top : 150})
			.appendTo(this.$elem);
		
		$("<div>")
			.attr("id", "MMHKPLUS_MineFinder_View")
			.addClass("hidden")
			.css({width:200, height: 170 , position: "absolute", left: 290, top : 300})
			.appendTo(this.$elem);
	},
	
	_tooltipHTMLContentFunction : function()
	{
		var self = MMHKPLUS.getElement("MineFinder");
		var tooltip = self.originalTooltipHTMLContentFunction.apply(this, arguments);
		
		var currentX = MMHKPLUS.HOMMK.worldMap.getGoodPosition(MMHKPLUS.HOMMK.worldMap.x + MMHKPLUS.HOMMK.worldMap.lastTooltipX);
        var currentY = MMHKPLUS.HOMMK.worldMap.getGoodPosition(MMHKPLUS.HOMMK.worldMap.y + MMHKPLUS.HOMMK.worldMap.lastTooltipY);
		
        var mines = self._getMines(currentX, currentY);
        if(mines !== undefined && mines !== null) {
        	tooltip += self._createMineView(mines);
        }
        else if(mines === undefined) {
        	tooltip += '<div id="MMHKPLUS_WaitingResources_' + MMHKPLUS.getRegionId(currentX, currentY) + '"><i>' + MMHKPLUS.localize("IN_PROGRESS") + '</i></div>';
        }
        return tooltip;
	},
	
	_getMines : function(x, y) 
	{
		var self = MMHKPLUS.getElement("MineFinder"); 
		var mines = self._getMinesFromCache(x, y);
		if(mines != undefined) {
			return mines;
		}
		else if(mines === null) {
			return null;
		}
		
		// not in cache... Ask Ubi :D
		self._getMineFromUbiServer(x, y);
		return undefined; // wait result
	},
	
	_getMinesFromCache : function(x, y) 
	{
		var rId = '' + MMHKPLUS.getRegionId(x, y);
		var self = MMHKPLUS.getElement("MineFinder"); 
		if(hasProperty(self.regionPool, rId)) {
			if(hasProperty(self.regionPool[rId], 'mines')) {
				return self.regionPool[rId].mines;
			}
			else if(hasProperty(self.regionPool[rId], 'loc')){
				return null; // empty region
			}
		}
		return undefined;
	},
	
	_getMineFromUbiServer : function(x, y)
	{
		var self = MMHKPLUS.getElement("MineFinder");
		if(!hasProperty(self.regionPool, '' + MMHKPLUS.getRegionId(x, y))) {
			// Avoid to ask multiple time the same region
			self.regionPool['' + MMHKPLUS.getRegionId(x, y)] = {};
			MMHKPLUS.getElement("Ajax").getRegionMapXY(x, y, this._putRegionInCacheFromUbi);
		}
	},
	
	_putRegionInCacheFromServer : function(regions)
	{
		var self = MMHKPLUS.getElement("MineFinder"); 
		regions.forEach(function(r)
			{
				self.regionPool['' + MMHKPLUS.getRegionId(r.loc[0], r.loc[1])] = r;
			}
		);
		
		// compute dual regions (regions not discovered yet)
		self.dualRegions = [];
		var size = MMHKPLUS.getElement("Player").get("worldSize");
		for(var x = 1; x <= size; x++) {
			for(var y = 1; y <= size; y++) {
				if(!hasProperty(self.regionPool, '' + MMHKPLUS.getRegionId(x, y))) {
					self.dualRegions.push({loc : [x, y]});
				}
			}
		}
		if(self.intervalDiscover != null) {
			clearInterval(self.intervalDiscover);
			self.intervalDiscover = null;
		}
		// every 15s, discover a region
		self.intervalDiscover = setInterval(function()
			{
				var toDiscover = self.dualRegions.getRandom();
				if(toDiscover == null) {
					clearInterval(self.intervalDiscover);
					self.intervalDiscover = null;
					clearInterval(self.resyncWithServer);
					self.resyncWithServer = null;
				}
				else {
					self.dualRegions.remove(toDiscover);
					self._getMineFromUbiServer(toDiscover.loc[0], toDiscover.loc[1]);
				}
			},
			15000
		);
	},
	
	_putRegionInCacheFromUbi : function(json)
	{
		var self = MMHKPLUS.getElement("MineFinder");
		var region = json.d.RegionMap0;
		var r = 
			{
				loc : [region.x, region.y]
			}
		;
		if(hasProperty(region, 'attachedZoneList') && hasProperty(region, 'type') && region.type == "plain") {
			// If there is a zone list, there are mines!
			// push them into an array of mine
			r.mines = [];
			region.attachedZoneList.forEach(function(z)
				{
					if(hasProperty(z, 'attachedMine')) {
						r.mines.push(
							{
								x : z.x,
								y : z.y,
								r : z.attachedMine.ressourceEntityTagName
							}
						);
					}
				}
			);
			// Compute mine count (needed for server side queries)
			for(var i = 0; i < r.mines.length; i++) {
				r.mines[i]['c'] = self._numberOfMines(r.mines, r.mines[i].r);
			}
			// Update UI if necessary
			$('#MMHKPLUS_WaitingResources_' + MMHKPLUS.getRegionId(r.loc[0], r.loc[1])).html(self._createMineView(r.mines));
		}
		// Update UI if necessary
		if(!hasProperty(r, "mines")) {
			$('#MMHKPLUS_WaitingResources_' + MMHKPLUS.getRegionId(r.loc[0], r.loc[1])).html("");
		}
		self.regionPool['' + MMHKPLUS.getRegionId(r.loc[0], r.loc[1])] = r;
		self.elementsToSend.push(r);
	},
	
	_numberOfMines : function(mines, type) 
	{
		var result = 0;
		
		mines.forEach(function(m)
			{
				if(m.r == type) {
					result++;
				}
			}
		);
		
		return result;
	},
	
	_createMineView : function(mines) 
	{
		var self = MMHKPLUS.getElement("MineFinder"); 
		var m = 0;
		
		var $div = $("<div>").css('position', 'relative').addClass("MMHKPLUS_AutoCenter").css({backgroundImage:"url(" + MMHKPLUS.URL_IMAGES + "carto/" + "block.png)", backgroundSize: '100%', backgroundRepeat: 'no-repeat', width:"160px", height:"80px"})
		mines.forEach(function(m)
			{
				var relx = m.x - 3;
				var rely = m.y - 3;
				var $result = $("<img>")
					.css('width', '16px').css('height', '16px')
					.css({position:"absolute", left: 72 + relx*16 + rely*16 + "px", top : 32 - 8*relx + rely*8 + "px"})
					.attr('src', self.ressourcesImages[m.r])
					.appendTo($div);
			}
		);
		
		return $div[0].outerHTML;
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
	}
});
