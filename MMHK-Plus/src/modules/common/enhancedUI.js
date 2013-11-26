MMHKPLUS.EnhancedUI = MMHKPLUS.ExtendableElement.extend({
	elementType : "EnhancedUI",
	$elemCenterOn : null,
	$elemChat : null,
    originalWorldmapTooltip : null,
    originalTooltipContentFunction : null,
    intervalClockUpdate : null,
    chatType2Injected : false,
    previousChatType : 0,
    intervalUpdateOnline : null,
    isHeroMoveInjected : false,
	
	options : {
		showBuyable : false,
        showPanels : true,
        showInfluence : false,
        showResources : true,
        showMovements : true,
        gameToleft : false,
        showDistances : true,
        showRequestIndicator : true,
        usePlayerChatColor : true,
		chatType : 2 // 0 : normal, 1 : amélioré, 2 : MMHK+ Chat
	},
	
	init : function(options)
	{
		var self = this;
		this.options = $.extend({}, this.options, options);
		
		this.options.showBuyable = this.load("sB") || this.options.showBuyable;
        this.options.showPanels = (this.load("sP") != null ? this.load("sP") : this.options.showPanels);
        this.options.showInfluence = this.load("sI") || this.options.showInfluence;
        this.options.showResources = this.load("sR") || this.options.showResources;
        this.options.showMovements = (this.load("sM") != null ? this.load("sM") : this.options.showMovements);
        this.options.gameToleft = (this.load("gP") != null ? this.load("gP") : this.options.gameToleft);
        this.options.showDistances = (this.load("sD") != null ? this.load("sD") : this.options.showDistances);
        this.options.showRequestIndicator = (this.load("sRI") != null ? this.load("sRI") : this.options.showRequestIndicator);
        this.options.usePlayerChatColor = (this.load("uPC") != null ? this.load("uPC") : this.options.usePlayerChatColor);

		this.options.chatType = (this.load("cT") != null ? this.load("cT") : this.options.chatType);
		return this;
	},
	
	toggleBuyable : function()
	{
		this.options.showBuyable = !this.options.showBuyable;
		this.save("sB", this.options.showBuyable);
		this._setupBuyable();
	},
	
	toggleChat : function(type)
	{
        this.previousChatType = this.options.chatType;
		this.options.chatType = type || 0;
		this.save("cT", this.options.chatType);
        if(MMHKPLUS.getElement("Chat", true).options.opended)
            MMHKPLUS.getElement("Chat").$elem.dialog("close");
		this._setupChat();
	},

    togglePanels : function()
    {
        this.options.showPanels = !this.options.showPanels;
        this.save("sP", this.options.showPanels);
        this._setupPanels();
    },

    toggleInfluence : function()
    {
        this.options.showInfluence = !this.options.showInfluence;
        this.save("sI", this.options.showInfluence);
        this._setupInfluence();
    },

    toggleResources : function()
    {
        this.options.showResources = !this.options.showResources;
        this.save("sR", this.options.showResources);
        MMHKPLUS.getElement("MineFinder", true).setupToolipContent();
    },

    toggleGamePosition : function()
    {
        this.options.gameToleft = !this.options.gameToleft;
        this.save("gP", this.options.gameToleft);
        this._setupGamePosition();
    },

    toggleMovements : function()
    {
        this.options.showMovements = !this.options.showMovements;
        this.save("sM", this.options.showMovements);
        this._setupMovements();
    },
    
    toggleDistances : function()
    {
        this.options.showDistances = !this.options.showDistances;
        this.save("sD", this.options.showDistances);
        this._setupRegionCity();
    },
    
    toggleRequestIndicator : function()
    {
        this.options.showRequestIndicator = !this.options.showRequestIndicator;
        this.save("sRI", this.options.showRequestIndicator);
        MMHKPLUS.getElement("Ajax", true).setupRequestIndicator();
    },
    
    togglePlayerChatColor : function()
    {
        this.options.usePlayerChatColor = !this.options.usePlayerChatColor;
        this.save("uPC", this.options.usePlayerChatColor);
    },
	
	enhanceUi : function()
	{
		this._setupQuestBox();
		this._setupCenterOn();
		this._setupBuyable();
		this._setupChat();
        this._setupPanels();
        this._setupClearMessages();
        this._setupInfluence();
        this._setupBuildEndTime();
        this._setupAllianceReports();
        this._setupClock();
        this._setupMovements();
        this._setupMarketPlaceFrame();
        this._setupGamePosition();
        this._setupSiegeFrame();
        this._setupTimelineCaravansTooltip();
        this._setupBattleRoundBonus();
        this._setupRegionCity();
        this._setupColoredAlerts();
        //this._setupExportToImageButtons();
	},
	
	_setupColoredAlerts : function()
	{
		var customizeAlertDisplay = function()
		{
			var self = this;
			var classes = 
				[
				 	"MMHKPLUS_ColoredAlerts_Attaque", 
				 	"MMHKPLUS_ColoredAlerts_Siege", 
				 	"MMHKPLUS_ColoredAlerts_Reco", 
				 	"MMHKPLUS_ColoredAlerts_Leurre", 
				 	"MMHKPLUS_ColoredAlerts_Frigo",
				 	"MMHKPLUS_ColoredAlerts_Pillage",
				 	"MMHKPLUS_ColoredAlerts_Coloniser"
				 ]
			;
			
			if(hasProperty(this, "content") && hasProperty(this.content, "message")) {
				var clazz = "";
				
				classes.forEach(function(c) { $(self.imageElement).removeClass(c);});
				
				if(/attaque/gi.test(this.content.message)) clazz = classes[0];
				if(/siege/gi.test(this.content.message)) clazz = classes[1];
				if(/reco/gi.test(this.content.message)) clazz = classes[2];
				if(/leurre/gi.test(this.content.message)) clazz = classes[3];
				if(/frigo/gi.test(this.content.message)) clazz = classes[4];
				if(/pillage/gi.test(this.content.message)) clazz = classes[5];
				if(/coloniser/gi.test(this.content.message)) clazz = classes[6];
				
				$(self.imageElement).addClass(clazz);
			}
		};
		
		MMHKPLUS.HOMMK.WorldMapAlert.prototype.initializeDisplay = injectAfter(MMHKPLUS.HOMMK.WorldMapAlert.prototype.initializeDisplay, customizeAlertDisplay);
		MMHKPLUS.HOMMK.WorldMapAlert.prototype.display = injectAfter(MMHKPLUS.HOMMK.WorldMapAlert.prototype.display, customizeAlertDisplay);
		var allWMAlerts = MMHKPLUS.HOMMK.elementPool.get("WorldMapAlert");
		if(allWMAlerts) {
			MMHKPLUS.HOMMK.elementPool.get("WorldMapAlert").each(function(a) {a.initializeDisplay();});
		}
		
		var customizeAlertFrameDisplay = function()
		{
			var self = this;
			$("#MMHKPLUS_ColoredAlert_Type").remove();
			var $select = $("<select>")
				.attr("id", "MMHKPLUS_ColoredAlert_Type")
				.css({float: 'right', 'margin-right' : '35px'})
				.append($("<option>").attr("value", "").html("Basic"))
				.append($("<option>").attr("value", "attaque").html(MMHKPLUS.localize("ATTACK")))
				.append($("<option>").attr("value", "pillage").html(MMHKPLUS.localize("PILLAGE")))
				.append($("<option>").attr("value", "siege").html(MMHKPLUS.localize("SIEGE")))
				.append($("<option>").attr("value", "reco").html(MMHKPLUS.localize("SCOUT")))
				.append($("<option>").attr("value", "leurre").html(MMHKPLUS.localize("DECOY")))
				.append($("<option>").attr("value", "frigo").html(MMHKPLUS.localize("FRIDGE")))
				.append($("<option>").attr("value", "coloniser").html(MMHKPLUS.localize("SETTLE")))
				.change(function()
					{
						$("#" + self.messageField.id).val($("#MMHKPLUS_ColoredAlert_Type").val());
					}
				)
			;
			
			var $el = $(this.mainElement).find("div.createMapAlertBg").find("div.boldFont");
			if($el.length == 0) {
				$el = $(this.mainElement).find("div.createMapAlertBg");
				$el.prepend($select);
			}
			else {
				$el.append($select);
			}
			$("#MMHKPLUS_ColoredAlert_Type")[0].selectedIndex = -1;
		};
		
		MMHKPLUS.HOMMK.EditWorldMapAlertFrame.prototype.display = injectAfter(MMHKPLUS.HOMMK.EditWorldMapAlertFrame.prototype.display, customizeAlertFrameDisplay);
		MMHKPLUS.HOMMK.CreateWorldMapAlertFrame.prototype.display = injectAfter(MMHKPLUS.HOMMK.CreateWorldMapAlertFrame.prototype.display, customizeAlertFrameDisplay);
	},
	
	_setupRegionCity : function()
	{
		var self = this;
		/*
		 * 0 : North
		 * 1 : North-East
		 * 2 : East
		 * 3 : South-East
		 * 4 : South
		 * 5 : South-West
		 * 6 : West
		 * 7 : North-West
		 * -1 : None
		 */ 
		
		var currentX, currentY;
		
		var direction = function(x1, y1, x2, y2) 
		{
			if(x1 == x2 && y1 == y2) {
				return -1;
			}
			
			if(x2 == x1 && y2 < y1) return 0;
			if(x2 > x1 && y2 < y1) return 1;
			if(x2 > x1 && y2 == y1) return 2;
			if(x2 > x1 && y2 > y1) return 3;
			if(x2 == x1 && y2 > y1) return 4;
			if(x2 < x1 && y2 > y1) return 5;
			if(x2 < x1 && y2 == y1) return 6;
			if(x2 < x1 && y2 < y1) return 7;
		};
		
		var distanceToCity = function(city) 
		{
			var result =
				{
					"cityName" : city.content.cityName,
					"x" : city.content.x,
					"y" : city.content.y,
					"distance" : MMHKPLUS.distance(currentX, currentY, city.content.x, city.content.y),
					"direction" : direction(currentX, currentY, city.content.x, city.content.y) - 1
				};
			return result; 
		};
		
		var updateDistanceToCities = function(city)
		{
			currentX = MMHKPLUS.getElement("Player").getCurrentViewX();
			currentY = MMHKPLUS.getElement("Player").getCurrentViewY();
			
			var distance = distanceToCity(city);
			if(distance.direction == -2) {
				$("#" + city.completeViewNameElement.id).html(distance.cityName);
				$("#" + city.summaryViewNameElement.id).html(distance.cityName);
			}
			else {
				var $elem = $("<div>");
				$elem
					.append(
						$("<span>").html(distance.cityName + "&nbsp;&nbsp"))
					.append(
						$("<img>")
							.addClass("MMHKPLUS_EnhancedUI_RegionCity")
							.attr("src", MMHKPLUS.URL_IMAGES + 'arrow_region_city.png')
							.css(
								{
									width: 12,
									height: 12,
									'-webkit-transform' : 'rotate(' + distance.direction * 45 + 'deg)',
									'-moz-transform' : 'rotate(' + distance.direction * 45 + 'deg)',
									'-o-transform' : 'rotate(' + distance.direction * 45 + 'deg)',
									'transform' : 'rotate(' + distance.direction * 45 + 'deg)'
								}))
					.append(
						$("<span>").addClass("MMHKPLUS_EnhancedUI_RegionCity").css('font-size', '75%').html(distance.distance.toFixed(1)));
				$("#" + city.completeViewNameElement.id).html("").append($elem);
				$("#" + city.summaryViewNameElement.id).html("").append($elem.clone());
			}
		};
		
		var needToRemoveDistances = true;
		
		var updateRegionView = function() 
		{
			if(self.options.showDistances) {
				MMHKPLUS.HOMMK.elementPool.get("RegionCity").each(updateDistanceToCities);
				needToRemoveDistances = true;
			}
			else {
				if(needToRemoveDistances) {
					$(".MMHKPLUS_EnhancedUI_RegionCity").remove();
					needToRemoveDistances = false;
				}
			}
		};
		
		MMHKPLUS.HOMMK.setCurrentView = injectAfter(MMHKPLUS.HOMMK.setCurrentView, updateRegionView);
		MMHKPLUS.HOMMK.worldMap.move = injectAfter(MMHKPLUS.HOMMK.worldMap.move, updateRegionView);
		MMHKPLUS.HOMMK.worldMap.center = injectAfter(MMHKPLUS.HOMMK.worldMap.center, updateRegionView);
		updateRegionView();
	},
	
	_setupQuestBox : function()
	{
		MMHKPLUS.HOMMK.getElement("QuestBox").toggleQuestBox();
	},
	
	_setupBuyable : function()
	{
		(this.options.showBuyable ? $("body").removeClass("MMHKPLUS_UiBuyable") :  $("body").addClass("MMHKPLUS_UiBuyable"));
	},

    _setupPanels : function()
    {
        if(!this.options.showPanels)
            $("body").addClass("MMHKPLUS_UiPanels");
        else
            $("body").removeClass("MMHKPLUS_UiPanels");
    },

    _setupInfluence : function()
    {   
        var self = this; 

        var newTooltip = function(a, e)
        {
            var result = self.originalWorldmapTooltip.apply(this,arguments);
            
            if(MMHKPLUS.HOMMK.currentView.viewType == 2)
            {
                var influenced = this.content.aRL;
                var s = MMHKPLUS.HOMMK.worldMap.content._size;

                var e = MMHKPLUS.HOMMK.getRegionLeftFromXY(this.getRelativeX(), this.getRelativeY());
                var d = MMHKPLUS.HOMMK.getRegionTopFromXY(this.getRelativeX(), this.getRelativeY());
                var $container = $("#WorldMapContainer");
                var view = MMHKPLUS.currentView();
                var color = this.content._iaCol || this.content._ipCol || 0;
                influenced.forEach(function(r)
                    {
                        if($.inArray(r[0] + "_" + r[1], view) != -1)
                        {
                            var q = MMHKPLUS.HOMMK.getMapRelativeX(r[0]);
                            var n = MMHKPLUS.HOMMK.getMapRelativeY(r[1]);
                            var j = MMHKPLUS.HOMMK.getRegionLeftFromXY(q, n) - e;
                            var m = MMHKPLUS.HOMMK.getRegionTopFromXY(q, n) - d;
                            m++;
                            
                            var divColor = $("<div/>").css(
                                {
                                    "position" : "absolute",
                                    "top" : 341- ((q - 6) * 32/2) + ((n - 6) * 32/2) + 1 +"px",
                                    "left" : 302 + ((q - 6) * 65/2) + ((n - 6) * 65/2) + "px",
                                    "background-image" : "url(" + MMHKPLUS.URL_IMAGES + "map/color_" + color + ".png)",
                                    "opacity" : "0.75",
                                    "width" : "65px",
                                    "height" : "32px"
                                }
                            ).addClass("MMHKPLUS_UiMapInfluence").appendTo($container);
                        }
                        
                    }
                );
                view.forEach(function(a) { delete a;});
                view = null;
                color = null;
            }

            return result;
        };

        var removeInfluence = function()
        {
            $(".MMHKPLUS_UiMapInfluence").empty();
            $(".MMHKPLUS_UiMapInfluence").remove();
        };

        if(this.options.showInfluence)
        {
            this.originalWorldmapTooltip = MMHKPLUS.HOMMK.Region.prototype.getTooltipContent;
            MMHKPLUS.HOMMK.Region.prototype.getTooltipContent = newTooltip;

            MMHKPLUS.HOMMK.worldMap.setZoomLevel = injectAfter(MMHKPLUS.HOMMK.worldMap.setZoomLevel, removeInfluence);
            MMHKPLUS.HOMMK.setCurrentView = injectAfter(MMHKPLUS.HOMMK.setCurrentView, removeInfluence);
            MMHKPLUS.HOMMK.worldMap.tooltip.onMouseLeave = injectAfter(MMHKPLUS.HOMMK.worldMap.tooltip.onMouseLeave,removeInfluence);
            MMHKPLUS.HOMMK.worldMap.tooltip.hide = injectAfter(MMHKPLUS.HOMMK.worldMap.tooltip.hide,removeInfluence);
        }
        else
        {
            if(this.originalWorldmapTooltip)
                MMHKPLUS.HOMMK.Region.prototype.getTooltipContent = this.originalWorldmapTooltip;
            this.originalWorldmapTooltip = null;
        }
    },

    _setupMovements : function()
    {
        var onUpdatePlots = function(result, X, Y)
        {
            var i, p, x, y;
            var zoom = this.getParentElement().zoomLevel, 
                size = MMHKPLUS.getElement("Player").get("worldSize"),
                size2 = size / 2, 
                plots = this.plotList[zoom], 
                length = plots.length;
            
            for ( i = 0; i < length; i++)
            {
                p = plots[i];
                p.element.className = p.element.className.replace("MMHKPLUS_UiBigPlot", "");

                x = X; y = Y;
                if ( (p.x - X) > size2 ) { x += size; } else if ( (X - p.x) > size2 ) { x -= size; }
                if ( (p.y - Y) > size2 ) { y += size; } else if ( (Y - p.y) > size2 ) { y -= size; }
                if (((this.xDir >= 0 && x >= p.x) || (this.xDir <= 0 && x <= p.x)) 
                    && ((this.yDir >= 0 && y >= p.y) || (this.yDir <= 0 && y <= p.y)))
                {
                    p.element.className += " MMHKPLUS_UiBigPlot";
                }
            }
            return result;
        };

        if(!this.isHeroMoveInjected)
        {
            MMHKPLUS.HOMMK.HeroMove.prototype.updatePlotSize = injectAfter(MMHKPLUS.HOMMK.HeroMove.prototype.updatePlotSize, onUpdatePlots);

            this.isHeroMoveInjected = true;   
        }
        if(this.options.showMovements)
        {
            $("body").removeClass("MMHKPLUS_UiMovements");
        }
        else
        {
            $("body").addClass("MMHKPLUS_UiMovements");
        }
    },

    _setupGamePosition : function()
    {
        var y = "10px";
        if(MMHKPLUS.getElement("Menu").options.type != 0)
            y = "0px";
        if(this.options.gameToleft)
            $("body").attr("style", "float:left; background-position:-295px " + y + " !important;");
        else
            $("body").attr("style","");
    },
	
	_setupCenterOn : function()
	{
		var $container = $("<div>").addClass("MMHKPLUS_UiCenterOn").appendTo($("div.toolbarBg"));
		
		$("<label>").html("X : ").appendTo($container);
		$("<input maxlength='3' style='width:35px;'>").appendTo($container);
		$("<label>").html(" Y : ").appendTo($container);
		$("<input maxlength='3' style='width:35px;'>").appendTo($container);
		$("<div>").button()
			.css({height : "20px", width : "80px", marginLeft : "10px", marginTop : "3px", lineHeight : "20px"})
			.html(MMHKPLUS.localize("CENTER"))
			.click(function()
				{
					var $x = $container.find("input:first");
					var $y = $container.find("input:last");
					var x = parseInt($x.val());
					var y = parseInt($y.val());
					
					$x.val(""); $y.val("");
					
					MMHKPLUS.centerOn(x, y);
				})
			.appendTo($container);
		this.$elemCenterOn = $container;
	},

	_setupChat : function()
	{
        var self = this;
        MMHKPLUS.HOMMK.Chat.prototype.renderMessage = injectAfter(MMHKPLUS.HOMMK.Chat.prototype.renderMessage, function(result, f, h)
            {
                if(!f.toBePaid && typeof result == "string")
                {
                    result = result.replace("background-image: url('%avatar%');", "");
                    var contentText = result.match("<span class=\"chatsystemspeakcontent\">(.*)</span>");
                    if(contentText && contentText[1])
                    {
                        var content = contentText[1];
                        content = content.replace(new RegExp("(((f|ht){1}tp(s)?://)[-a-zA-Z0-9@:%_\+.~#?&//=]+)", "gi"),"<a href='$1' target='_blank' style='color:blue;'>$1</a> ");
                        content = content.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*,\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
                        content = content.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*\-\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
                        content = content.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*\.\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
                        content = content.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*:\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");     
                        content = content.replace(/MMHKPLUS_ScoutPL\(([0-9a-zA-Z]+)\)/,"<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.getElement(\"Ajax\").getSpyReportContent(\"$1\", MMHKPLUS.getElement(\"AllianceSpys\", true)._openSpyReport);'>$2</span>");
                        content = content.replace(/MMHKPLUS_HeroPL\(([0-9]+),([0-9]+),([A-Za-z0-9_\-\s'"\?\!\w]+)\)/,"<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.openDisplayable(\"AllianceHeroes\");MMHKPLUS.getElement(\"AllianceHeroes\")._loadHero($1,$2);'>$3</span>");
                        result = result.replace(/<span class=\"chatsystemspeakcontent\">(.*)<\/span>/, "<span class=\"chatsystemspeakcontent\">" + content + "</span>");
                    }
                }
                return result;
            }
        );
        if(this.previousChatType == 1)
        {
            $("div.chatsystem").resizable().resizable("destroy");
        }

		if(this.options.chatType == 2)
		{
			this.$elemChat = $("<div>").button()
				.html(MMHKPLUS.localize("CHAT_BUTTON"))
				.addClass("MMHKPLUS_UiChatButton")
				.click(function()
					{
						MMHKPLUS.openDisplayable("Chat");
					})
				.appendTo($("div.toolbarBg").children());
			
			if(MMHKPLUS.getElement("Chat", true).options.opened) {
				this.$elemChat.addClass("hidden");
			}
			else {
				this.$elemChat.removeClass("hidden");
			}
			
			$(".chatsystemmincontainer").addClass("hidden");
            $(".chatsystem").addClass("hidden");
		}
        else if(this.options.chatType == 1)
        {
        	if(this.$elemChat) MMHKPLUS.resetElement(this.$elemChat);
			this.$elemChat = null;
			var chat = MMHKPLUS.getElement("Chat");
			if(chat && chat.options.opened)
			{
				chat.$elem.dialog("close");
			}
			
            var previsousIsP2P = false; 

            var $chatsystemp2ptab = $("ul.chatsystemp2ptab");
            var $chatsystemcontent = $("div.chatsystemcontent");
            var $chatsysteminput = $("div.chatsysteminput");
            var $chatsystemtab = $("ul.chatsystemtab");
            var $chatmessageslistcontainer = $("div.chatmessageslistcontainer");
            var $chatsysteminputbar = $("input.chatsysteminputbar");
            var $chatsystemcontainer = $("div.chatsystemcontainer");

            var onTabChanged = function()
            {
                if(MMHKPLUS.getElement("EnhancedUI").options.chatType == 1 && this.tab == "p2p")
                {
                    $chatmessageslistcontainer.css("height", parseInt($chatsystemcontent.css("height").replace("px", "")) - 28 + "px");
                    $chatsystemcontent.css("height", parseInt($chatsystemcontent.css("height").replace("px", "")) - 28 + "px");
                    previsousIsP2P = true;
                }
                else if(MMHKPLUS.getElement("EnhancedUI").options.chatType == 1 && previsousIsP2P)
                {
                    previsousIsP2P = false;
                    $chatmessageslistcontainer.css("height", parseInt($chatsystemcontent.css("height").replace("px", "")) + 28 + "px");
                    $chatsystemcontent.css("height", parseInt($chatsystemcontent.css("height").replace("px", "")) + 28 + "px");
                }
            };
            var onDragComplete = function()
            {
                if(MMHKPLUS.getElement("EnhancedUI").options.chatType == 1)
                {
                    MMHKPLUS.getElement("EnhancedUI").save("cT1x", parseInt($chatsystemcontainer.css("left").replace("px", "")));
                    MMHKPLUS.getElement("EnhancedUI").save("cT1y", parseInt($chatsystemcontainer.css("top").replace("px", "")));
                }
            };
            var onOpen = function()
            {
                $chatsystemcontainer.css("top", MMHKPLUS.getElement("EnhancedUI").load("cT1y") || -260);
                $chatsystemcontainer.css("left", MMHKPLUS.getElement("EnhancedUI").load("cT1x") || -328);
                $rez.css("width", MMHKPLUS.getElement("EnhancedUI").load("cT1w") || 320);
                $rez.css("height", MMHKPLUS.getElement("EnhancedUI").load("cT1h") || 260);
                $chatsystemcontent.css("width", MMHKPLUS.getElement("EnhancedUI").load("cT1w") || 320);
                $chatsystemcontent.css("height", (MMHKPLUS.getElement("EnhancedUI").load("cT1h") || 260) - 106);
                onResize();
                MMHKPLUS.getElement("EnhancedUI").save("cT1o", true);
                self.intervalUpdateOnline = setInterval(updateOnlineMembers, 30000);
                updateOnlineMembers();
            };
            var onClose = function()
            {
                MMHKPLUS.getElement("EnhancedUI").save("cT1o", false);
                MMHKPLUS.clearInterval(self.intervalUpdateOnline); self.intervalUpdateOnline = null;
            };
            var onResize = function(e, ui)
            {
                $chatsysteminput.css("width",$chatsystemcontent.css("width"));
                $chatsystemtab.css("width", $chatsystemcontent.css("width"));
                $chatmessageslistcontainer.css("width", parseInt($chatsystemcontent.css("width").replace("px", "")) - 19 + "px");
                $chatmessageslistcontainer.css("height", parseInt($chatsystemcontent.css("height").replace("px", "")) + "px");
                $chatsystemp2ptab.css("width", $chatsystemcontent.css("width"));
                $chatsysteminputbar.css("width",  parseInt($chatsystemcontent.css("width").replace("px", "")) - 55 - 75 - 25 + "px");
                
                MMHKPLUS.HOMMK.elementPool.obj.Chat.values()[0].updateSlider();

                MMHKPLUS.getElement("EnhancedUI").save("cT1w", parseInt($rez.css("width").replace("px", "")));
                MMHKPLUS.getElement("EnhancedUI").save("cT1h", parseInt($rez.css("height").replace("px", "")));
            };
            var updateOnlineMembers = function()
            {
                if($online.is(":visible"))
                {
                    MMHKPLUS.getElement("Ajax").getAllianceFrame(MMHKPLUS.getElement("Player").get("allianceId"),
                        function(json)
                        {
                            $online.find("p.MMHKPLUS_Chat1Online").remove();

                            var members = json.d[Object.keys(json.d)[0]].attachedPlayerList;
                                members.forEach(function(member)
                                {
                                    if(member.status == "ONLINE" && member.id != MMHKPLUS.getElement("Player").get("playerId"))
                                    {
                                        $online.append(
                                            $("<p>")
                                                .addClass("MMHKPLUS_Chat1Online")
                                                .css("marginLeft", "8px")
                                                .css("cursor", "pointer")
                                                .html("● " + member.name)
                                                .click(function()
                                                    {
                                                        MMHKPLUS.HOMMK.elementPool.obj.Chat.values()[0].chatWithPlayer(member.name);
                                                    }));
                                    }
                                }
                            );
                        }
                    );
                }
            };

            if(!this.chatType2Injected)
            {
                MMHKPLUS.HOMMK.Chat.prototype.setType = injectAfter(MMHKPLUS.HOMMK.Chat.prototype.setType, onTabChanged);
                MMHKPLUS.HOMMK.Chat.prototype.moveBackToScreen = injectAfter(MMHKPLUS.HOMMK.Chat.prototype.moveBackToScreen, onDragComplete);
                MMHKPLUS.HOMMK.Chat.prototype.open = injectAfter(MMHKPLUS.HOMMK.Chat.prototype.open, onOpen);
                MMHKPLUS.HOMMK.Chat.prototype.close = injectAfter(MMHKPLUS.HOMMK.Chat.prototype.close, onClose);

                this.chatType2Injected = true;
            }
            
            var $rez = $("div.chatsystem").resizable();
            $chatsysteminput.css({background : "url(http://static5.cdn.ubi.com/u/HOMMK/mightandmagicheroeskingdoms.ubi.com/4.0.17-MTR/img/chat/chatsystem.gif) left -102px repeat-x"});
            $("div.chatsystemmorebutton").css({background : "url(http://static5.cdn.ubi.com/u/HOMMK/mightandmagicheroeskingdoms.ubi.com/4.0.17-MTR/img/chat/chatsystem.gif) left -78px repeat-x"});
            $rez.resizable( 
                {
                    alsoResize :  "div.chatsystemcontent,div.chatsystem", 
                    minWidth: 320,
                    minHeight : 250,

                    stop : onResize
                } 
            );
            $chatsysteminputbar.removeAttr("maxlength");

            var $online = $("<div>")
                .css({position:"absolute", top:"0px",right:"-133px", width:"130px", height:"100%"})
                .css({background:"rgba(169,141,120,1)", borderRadius:"0 10px 10px 0", border:"1px solid rgba(81,50,39,1)", borderLeft:"none"})
                .css({color:"#FFFFFF", overflowX:"hidden", overflowY:"auto"});
            $online
                .append(
                    $("<p>")
                        .addClass("MMHKPLUS_TextCenter")
                        .html(MMHKPLUS.localize("ONLINE"))
                        .css("fontSize", "120%"))
                .append($("<br>"));

            $rez.append($online);
            $rez.append(
                $("<div>")
                    .css({position:"absolute",top:"6px",left:"10px", color:"#FFFFFF", cursor:"pointer"})
                    .html(MMHKPLUS.localize("ONLINE"))
                    .click(function()
                        {
                            if($online.is(":visible"))
                                $online.hide();
                            else
                            {
                                $online.show();
                                updateOnlineMembers();
                            }
                        }));
            $online.hide();

            if(this.load("cT1o"))
                setTimeout(function() { MMHKPLUS.HOMMK.elementPool.obj.Chat.values()[0].open(); }, 250);
        }
		else if(this.options.chatType == 0)
		{
			if(this.$elemChat) MMHKPLUS.resetElement(this.$elemChat);
			this.$elemChat = null;
			$(".chatsystemmincontainer").removeClass("hidden");
            $(".chatsystem").removeClass("hidden");
			var chat = MMHKPLUS.getElement("Chat");
			if(chat && chat.options.opened)
			{
				chat.$elem.dialog("close");
			}
		}
	},

    _setupClearMessages : function()
    {
        var simplifiedMessages = function()
        {
            var content = this.getChildElement("Content");
            if(content)
            {
                var newContent = content.innerHTML.replace(/------------------------------<br>/g, '<br><hr style="clear:none;border-top:1px solid #666">');
                // newContent = newContent.replace(/>([0-9]{1,2}\/[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}) De :([\u0000-\uFFFF]+?)<br>(À : [\u0000-\uFFFF]+?)<br>Sujet :([\u0000-\uFFFF]+?)<br>/g, '><span style="font-size:11px;font-weight:bold;color:#990033;">$1<\/span><span style="font-size:11px;font-weight:bold;color:#990033;"> ' + MMHKPLUS.localize("FROM_MSG") + ' $2<\/span><br/><span style="font-size:11px;font-style:italic;color:#990033;">$3<\/span><br/>');
                newContent = newContent.replace(/>([0-9]{1,2}\/[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}) De :([\u0000-\uFFFF]+?)<br>(À : [\u0000-\uFFFF]+?)<br>Sujet :([\u0000-\uFFFF]+?)<br>/g, '><span style="font-size:11px;font-weight:bold;color:#990033;">$1<\/span><span style="font-size:11px;font-weight:bold;color:#990033;"> ' + MMHKPLUS.localize("FROM_MSG") + ' $2<\/span><br/><span style="font-size:11px;color:#990033;">$3<\/span><br/>');
                newContent = newContent.replace(/>([0-9]{1,2}\/[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}) From :([\u0000-\uFFFF]+?)<br>(To : [\u0000-\uFFFF]+?)<br>Subject :([\u0000-\uFFFF]+?)<br>/g, '><span style="font-size:11px;font-weight:bold;color:#990033;">$1<\/span><span style="font-size:11px;font-weight:bold;color:#990033;"> ' + MMHKPLUS.localize("FROM_MSG") + ' $2<\/span><br/><span style="font-size:11px;color:#990033;">$3<\/span><br/>');
                newContent = newContent.replace(new RegExp("(((f|ht){1}tp(s)?://)[-a-zA-Z0-9@:%_\+.~#?&//=]+)", "gi"),"<a href='$1' target='_blank' style='color:blue;'>$1</a> ");
                newContent = newContent.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*,\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
                newContent = newContent.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*\-\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
                newContent = newContent.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*\.\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
                newContent = newContent.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*:\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
                newContent = newContent.replace(/MMHKPLUS_ScoutPL\(([0-9a-zA-Z]+),([A-Za-z0-9_\-\s'"\?\!\w]+)\)/,"<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.getElement(\"Ajax\").getSpyReportContent(\"$1\", MMHKPLUS.getElement(\"AllianceSpys\", true)._openSpyReport);'>$2</span>");
                newContent = newContent.replace(/MMHKPLUS_HeroPL\(([0-9]+),([0-9]+),([A-Za-z0-9_\-\s'"\?\!\w]+)\)/,"<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.openDisplayable(\"AllianceHeroes\");MMHKPLUS.getElement(\"AllianceHeroes\")._loadHero($1,$2);'>$3</span>");

                content.innerHTML = newContent;
                newContent = null;
            }
        };
        var types = 
            [
                'DetailedMessage', 'BattleResultDetailedMessage', 'CityScoutingResultDetailedMessage', 
                'RegionScoutingResultDetailedMessage', 'TroopScoutingResultDetailedMessage', 'AcceptDeclineDetailedMessage', 
                'MultiChoiceDetailedMessage', 'PlayerInvitationKeyDetailedMessage', 'CrmDetailedMessage'
            ];
        types.forEach(function(t)
            {
                MMHKPLUS.HOMMK[t].prototype.display = injectAfter(MMHKPLUS.HOMMK[t].prototype.display, simplifiedMessages);
            }
        );

        var filter = function(self, pattern, check)
        {
            pattern = pattern.trim().toUpperCase();
            check = isDefined(check) || false;
            if(hasProperty(self, "currentMessageList"))
            {
                if(hasProperty(self.currentMessageList, "elementList"))
                {
                    self.currentMessageList.elementList.forEach(function(e)
                        {
                            if(pattern == ""
                                || e.content.subject.toUpperCase().indexOf(pattern) != -1
                                || (hasProperty(e.content, "exp_playerName") ? e.content.exp_playerName.toUpperCase().indexOf(pattern) != -1 : false))
                            {
                                $(e.mainElement).removeClass("hidden");
                                if(check && pattern != "")
                                    //$(e.checkBox).attr("checked", true);
                                    e.check();
                                else
                                    //$(e.checkBox).attr("checked", false);
                                    e.uncheck();
                            }
                            else
                            {
                                $(e.mainElement).addClass("hidden");
                                //$(e.checkBox).attr("checked", false);
                                e.uncheck();
                            }
                            e.checkBoxChange();
                        }
                    );
                }
            }
        };

        var contentFilter = function()
        {
            var self = this;
            var tb = self.getChildElement('ToolBar');
            var $input = $("<input>").css("width", "150px");
            $(tb).append(
                $("<div>")
                    .css({paddingTop:"5px", marginLeft:"140px"})
                    .append(
                        $("<span>")
                            .html(MMHKPLUS.localize("FILTER") + " : "))
                    .append(
                        $input
                            .keyup(function() { filter(self, $input.val());}))
                    .append(
                        $("<div>")
                            .button()
                            .css({padding:"2px",marginLeft:"10px"})
                            .click(function() { filter(self, $input.val(), true);})
                            .html(MMHKPLUS.localize("CHECK")))
                    .append(
                        $("<div>")
                            .button()
                            .css({padding:"2px",marginLeft:"10px"})
                            .click(function() { $input.val(""); filter(self, ""); })
                            .html(MMHKPLUS.localize("CLEAN"))));
        };
        MMHKPLUS.HOMMK.MessageBoxFrame.prototype.setContent = injectAfter(MMHKPLUS.HOMMK.MessageBoxFrame.prototype.setContent, contentFilter);
    },

    _setupBuildEndTime : function()
    {
        var intervalRefresh = null; 

        var getEndDate = function(slider)
        {
            var d = new Date(); d.setTime(d.getTime() + slider.baseDuration * slider.timeRatio * 1000);
            return d.toShortFrenchFormat();
        };
        
        var injectEndTime = function(type)
        {
            return function()
            {
                var slider = this.actionDurationSlider;
                var frame = $(this.mainElement);
                
                if(!slider || !frame)
                    return;
                
                if(!type ||
                    (type == "mine" && this.selectedAction && (this.selectedAction === 'IMPROVE_MINE' || this.selectedAction === 'UPGRADE_MINE') && MMHKPLUS.HOMMK.selectedHeroId))
                {
                    var $container = $("#MMHKPLUS_UiEndTime");
                    if($container.length == 0)
                    {
                        $container = $("<div>").attr("id", "MMHKPLUS_UiEndTime").css(
                            {
                                "position" : "relative",
                                "bottom" : "85px",
                                "right" : "15px",
                                "float" : "right",
                                "width" : "80px",
                                "background" : "rgba(0,0,0,0.75)",
                                "border" : "1px solid #FFFFFF",
                                "border-radius" : "10px",
                                "padding" : "5px",
                                "color" : "#FFFFFF",
                                "text-align" : "center"
                                
                            }
                        ).appendTo(frame);
                    }
                    else
                    {
                        $container.remove();
                        $container.appendTo(frame);
                    }
                    
                    $container.html(getEndDate(slider));
                    if(intervalRefresh)
                    {
                        clearInterval(intervalRefresh);
                        intervalRefresh = null;
                    }
                    intervalRefresh = setInterval(function()
                        {
                            $container.html(getEndDate(slider));
                        }, 
                        1000
                    );
                }
            }
        };

        var clearRefreshInterval = function()
        {
            if(intervalRefresh)
            {
                clearInterval(intervalRefresh);
                intervalRefresh = null;
            }
            if($("#MMHKPLUS_UiEndTime").length > 0)
            {
                $("#MMHKPLUS_UiEndTime").empty();
                $("#MMHKPLUS_UiEndTime").remove();
            }
        };

        MMHKPLUS.HOMMK.MineUpgradeFrame.prototype.showActionChoiceZone = injectAfter(MMHKPLUS.HOMMK.MineUpgradeFrame.prototype.showActionChoiceZone, injectEndTime("mine"));
        MMHKPLUS.HOMMK.ZoneBuildingUpgradeFrame.prototype.showActionChoiceZone = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingUpgradeFrame.prototype.showActionChoiceZone, injectEndTime());
        MMHKPLUS.HOMMK.ZoneBuildingFrame.prototype.showActionChoiceZone = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingFrame.prototype.showActionChoiceZone, injectEndTime());
        MMHKPLUS.HOMMK.CityBuildingFrame.prototype.displayRefreshable = injectAfter(MMHKPLUS.HOMMK.CityBuildingFrame.prototype.displayRefreshable, injectEndTime());
        
        MMHKPLUS.HOMMK.MineUpgradeFrame.prototype.hide = injectAfter(MMHKPLUS.HOMMK.MineUpgradeFrame.prototype.hide, clearRefreshInterval);
        MMHKPLUS.HOMMK.ZoneBuildingUpgradeFrame.prototype.hide = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingUpgradeFrame.prototype.hide, clearRefreshInterval);
        MMHKPLUS.HOMMK.ZoneBuildingStorehouseUpgradeFrame.prototype.hide = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingStorehouseUpgradeFrame.prototype.hide, clearRefreshInterval);
        MMHKPLUS.HOMMK.ZoneBuildingFrame.prototype.hide = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingFrame.prototype.hide, clearRefreshInterval);
        MMHKPLUS.HOMMK.CityBuildingFrame.prototype.hide = injectAfter(MMHKPLUS.HOMMK.CityBuildingFrame.prototype.hide, clearRefreshInterval);
        
        MMHKPLUS.HOMMK.MineUpgradeFrame.prototype.unsetAction = injectAfter(MMHKPLUS.HOMMK.MineUpgradeFrame.prototype.unsetAction, clearRefreshInterval);
        MMHKPLUS.HOMMK.ZoneBuildingUpgradeFrame.prototype.resetActionSelector = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingUpgradeFrame.prototype.resetActionSelector, clearRefreshInterval);
        MMHKPLUS.HOMMK.ZoneBuildingFrame.prototype.resetActionSelector = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingFrame.prototype.resetActionSelector, clearRefreshInterval);
        MMHKPLUS.HOMMK.ZoneBuildingStorehouseUpgradeFrame.prototype.selectUnspecializationAction = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingStorehouseUpgradeFrame.prototype.selectUnspecializationAction, clearRefreshInterval);
        MMHKPLUS.HOMMK.ZoneBuildingStorehouseUpgradeFrame.prototype.resetResourceSelector = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingStorehouseUpgradeFrame.prototype.resetResourceSelector, clearRefreshInterval);
        MMHKPLUS.HOMMK.ZoneBuildingStorehouseUpgradeFrame.prototype.resetActionSelector = injectAfter(MMHKPLUS.HOMMK.ZoneBuildingStorehouseUpgradeFrame.prototype.resetActionSelector, clearRefreshInterval);
    },

    _setupAllianceReports : function()
    {
        if(!MMHKPLUS.getElement("Player").isPVEWorld() && MMHKPLUS.getElement("Player").isInAlliance())
        {
            var lastMessage = -1; 

            var checkScoutingMessage = function()
            {
                if(this.openedMessageType == "TroopScoutingResultDetailedMessage" 
                    || this.openedMessageType == "RegionScoutingResultDetailedMessage" 
                    || this.openedMessageType == "CityScoutingResultDetailedMessage")
                {
                    var message = this.getOpenedDetailedMessage();
                    if(message.content.id != lastMessage)
                    {
                        var content = $.extend(true, {}, message.content);
                        // Remove some unecessary values
                        if(hasProperty(content, "id")) delete content.id;
                        if(hasProperty(content, "summaryContent")) delete content.summaryContent;
                        if(hasProperty(content, "exp_playerId")) delete content.exp_playerId;
                        if(hasProperty(content, "exp_playerName")) delete content.exp_playerName;
                        if(hasProperty(content, "exp_backgroundNb")) delete content.exp_backgroundNb;
                        if(hasProperty(content, "exp_iconNb")) delete content.exp_iconNb;
                        if(hasProperty(content, "exp_patternNb")) delete content.exp_patternNb;
                        if(hasProperty(content, "exp_avatar")) delete content.exp_avatar;
                        if(hasProperty(content, "exp_allianceId")) delete content.exp_allianceId;
                        if(hasProperty(content, "exp_allianceName")) delete content.exp_allianceName;
                        if(hasProperty(content, "recptPlayerNameList")) delete content.recptPlayerNameList;
                        if(hasProperty(content, "isRead")) delete content.isRead;
                        if(hasProperty(content, "isTrashed")) delete content.isTrashed;
                        if(hasProperty(content, "isArchived")) delete content.isArchived;
                        if(hasProperty(content, "isAllianceChiefMessage")) delete content.isAllianceChiefMessage;
                        if(hasProperty(content, "subject")) delete content.subject;
                        if(hasProperty(content, "isArchived")) delete content.isArchived;
                        if(hasProperty(content, "patrol_heroId")) delete content.patrol_heroId;
                        if(hasProperty(content, "XPGainedStr")) delete content.XPGainedStr;
                        if(hasProperty(content, "linked_messageId")) delete content.linked_messageId;

                        if(hasProperty(content, "contentJSON"))
                        {
                        	if(hasProperty(content.contentJSON, "hero")) delete content.contentJSON.hero;
                            if(hasProperty(content.contentJSON, "message")) delete content.contentJSON.message;
                            if(hasProperty(content.contentJSON, "ScoutingLevelStr")) {
                            	var pos = content.contentJSON.ScoutingLevelStr.indexOf(".");
                            	content.contentJSON.ScoutingLevelStr = content.contentJSON.ScoutingLevelStr.slice(pos+2, content.contentJSON.ScoutingLevelStr.length);
                            }
                            if(hasProperty(content.contentJSON, "XPGainedStr")) delete content.contentJSON.XPGainedStr;
                            if(hasProperty(content.contentJSON, "cityFortificationName")) delete content.contentJSON.cityFortificationName;

                            if(hasProperty(content.contentJSON, "defenseUnitStackList"))
                            {
                                content.contentJSON.defenseUnitStackList.forEach(function(d, di)
                                    {
                                        delete content.contentJSON.defenseUnitStackList[di].id;
                                        delete content.contentJSON.defenseUnitStackList[di].unitEntityName;
                                        delete content.contentJSON.defenseUnitStackList[di].unitEntityTagName;
                                        delete content.contentJSON.defenseUnitStackList[di].unitEntityTypeName;
                                    }
                                );
                            }

                            if(hasProperty(content.contentJSON, "regionUnitStackList"))
                            {
                                content.contentJSON.regionUnitStackList.forEach(function(d, di)
                                    {
	                                	delete content.contentJSON.regionUnitStackList[di].id;
	                                    delete content.contentJSON.regionUnitStackList[di].unitEntityName;
	                                    delete content.contentJSON.regionUnitStackList[di].unitEntityTagName;
	                                    delete content.contentJSON.regionUnitStackList[di].unitEntityTypeName;
                                        delete content.contentJSON.regionUnitStackList[di].powerPosition;
                                    }
                                );
                            }

                            if(hasProperty(content.contentJSON, "heroList"))
                            {
                                content.contentJSON.heroList.forEach(function(h, hi)
                                    {
                                		if(hasProperty(h, "heroTrainingEntityName")) delete content.contentJSON.heroList[hi].heroTrainingEntityName;
                                		
                                        if(hasProperty(h, "attachedUnitStackList"))
                                        {
                                            h.attachedUnitStackList.forEach(function(u, ui)
                                                {
	                                            	delete content.contentJSON.heroList[hi].attachedUnitStackList[ui].id;
	        	                                    delete content.contentJSON.heroList[hi].attachedUnitStackList[ui].unitEntityName;
	        	                                    delete content.contentJSON.heroList[hi].attachedUnitStackList[ui].unitEntityTagName;
	        	                                    delete content.contentJSON.heroList[hi].attachedUnitStackList[ui].unitEntityTypeName;
                                                    delete content.contentJSON.heroList[hi].attachedUnitStackList[ui].powerPosition;
                                                }
                                            );
                                        }

                                        if(hasProperty(h, "artefactList"))
                                        {
                                            h.artefactList.forEach(function(a, ai)
                                                {
                                                    delete content.contentJSON.heroList[hi].artefactList[ai].id;
                                                    delete content.contentJSON.heroList[hi].artefactList[ai].heroId;
                                                    delete content.contentJSON.heroList[hi].artefactList[ai].binded;
                                                    delete content.contentJSON.heroList[hi].artefactList[ai].associated;
                                                    delete content.contentJSON.heroList[hi].artefactList[ai].bodyPartLoc;
                                                    delete a.position

                                                    delete content.contentJSON.heroList[hi].artefactList[ai].artefactEntity.isSellable;
                                                    delete content.contentJSON.heroList[hi].artefactList[ai].artefactEntity.discounted;
                                                    delete content.contentJSON.heroList[hi].artefactList[ai].artefactEntity.isApiEnabled;
                                                    
                                                    var i = 1;
                                                    while(hasProperty(a.artefactEntity, "effect" + i + "_effectEntityId"))
                                                    {
                                                        delete content.contentJSON.heroList[hi].artefactList[ai].artefactEntity["effect" + i + "_effectEntityId"];
                                                        delete content.contentJSON.heroList[hi].artefactList[ai].artefactEntity["effect" + i + "_effectEntityTagName"];
                                                        delete content.contentJSON.heroList[hi].artefactList[ai].artefactEntity["effect" + i + "_level"];
                                                        i++;
                                                    }
                                                }
                                            );
                                        }

                                        if(hasProperty(h, "heroClassList"))
                                        {
                                            h.heroClassList.forEach(function(c, ci)
                                                {
                                                    delete content.contentJSON.heroList[hi].heroClassList[ci].id; 
                                                    delete content.contentJSON.heroList[hi].heroClassList[ci].heroId; 
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                        
                        // add somes properties
                        	// playerId/name & allianceId/name
                        content.playerId = MMHKPLUS.getElement("Player").get("playerId");
                        content.playerName = MMHKPLUS.getElement("Player").get("playerName");
                        content.allianceId = MMHKPLUS.getElement("Player").get("allianceId"); //exists
                        content.allianceName = MMHKPLUS.getElement("Player").get("allianceName"); //exists
                        	// x and y, and location type
                        if(hasProperty(content, "contentJSON")) {
                        	if(hasProperty(content.contentJSON, "targetedHaltX")) {
                        		content['x'] = content.contentJSON.targetedHaltX;
                        		content['y'] = content.contentJSON.targetedHaltY;
                        		content['locationTagName'] = "HALT";
                        	}
                        	else if(hasProperty(content.contentJSON, "siegedRegionX")) {
                        		content['x'] = content.contentJSON.siegedRegionX;
                        		content['y'] = content.contentJSON.siegedRegionY;
                        		content['locationTagName'] = "SIEGE";
                        	}
                        	else if(hasProperty(content.contentJSON, "targetedRegionId")) {
                        		var wS = MMHKPLUS.getElement("Player").get("worldSize");
                        		var rN = content.contentJSON.targetedRegionNumber;
                        		content['x'] = rN % wS;
                        		content['y'] = ((rN - content.x) / wS) +1;
                        		content['locationTagName'] = "CITY";
                        	}
                        	else {
                        		var match = content.contentJSON.ScoutingLevelStr.match('<location:([0-9]+),([0-9]+)>');
                        		if(match != null) {
                        			content['x'] = parseInt(match[1]);
                            		content['y'] = parseInt(match[2]);
                            		content['locationTagName'] = "RUIN";
                        		}
                        	}
                        }

                        if(content.contentJSON.scoutingLevel >= 2 || content.locationTagName == 'SIEGE') {
                        	MMHKPLUS.getElement("Ajax").sendScoutingReport(content);
                        }
                        lastMessage = message.content.id;
                    }
                }
            };
            
            var getSpyReportsForSelectedRegion = function() 
            {
            	MMHKPLUS.getElement("Ajax").getSpyReportsForSelectedRegion(function(reports)
            		{
            			MMHKPLUS.getElement('AllianceRegionReports', true).displayReports(reports);
            		}
            	);
            };

            MMHKPLUS.HOMMK.WorldMap.prototype.selectRegion = injectAfter(MMHKPLUS.HOMMK.WorldMap.prototype.selectRegion,getSpyReportsForSelectedRegion);
            MMHKPLUS.HOMMK.MessageBoxFrame.prototype.displayMessage = injectAfter(MMHKPLUS.HOMMK.MessageBoxFrame.prototype.displayMessage, checkScoutingMessage);   
        }
    },

    _setupClock : function()
    {
        var time = new Date(); time.setTime($.now());
        var serverTime = new Date(); time.setTime($.now());
        
        var $clock = $("<div>").addClass("MMHKPLUS_Clock_local").css({position:"absolute", top:"35px", left:"146px", zIndex:1000}).appendTo($("#Container"));
        var $serverClock = null;
        this.intervalClockUpdate = setInterval(function()
            {
                time.setTime($.now());
                $("div.MMHKPLUS_Clock_local").html("Local: " + time.toHoursMinSecFormat());
                serverTime.setTime(serverTime.getTime() + 1000);
                $("div.MMHKPLUS_Clock_server").html("Server: " + serverTime.toHoursMinSecFormat());
            },
            1000
        );
        
        var requestServerTime = function() {
        	if($serverClock == null) {
    			$serverClock = $("<div>").addClass("MMHKPLUS_Clock_server").css({position:"absolute", top:"50px", left:"140px", zIndex:1000}).appendTo($("#Container"));
    		}
    		
        	var $startRequest = $.now();
    		MMHKPLUS.getElement("Ajax").getMMHKPLUSServerTime(function(data)
            	{
    				var $endRequest = $.now();
            		serverTime = new Date(data.t * 1000 + ($endRequest - $startRequest)/2 - 1000);
            	}
           );
        }
        
        var serverClockInterval = setInterval(requestServerTime, 10 * 60 * 1000);
        setTimeout(requestServerTime, 10000);// wait 10 second while game is loading
    },
    
    _setupMarketPlaceFrame : function()
    {
        var onArtefactAuctionDisplay = function()
        {
            var self = this;
            MMHKPLUS.HOMMK.ARTEFACT_BODYPART_LIST.forEach(function(a) 
                { 
                    if(self.artefactAuctionOfferList.bodyPartFilterList.indexOf(a) == -1)
                        self.artefactAuctionOfferList.bodyPartFilterList.push(a); 
                } 
            );
            self.artefactAuctionOfferList.setBodyPartFilter(self.artefactAuctionBodyPartFilterList);
            self.artefactAuctionOfferListSlider.updateDimensions();
        };

        MMHKPLUS.HOMMK.MarketPlaceFrame.prototype.displayArtefactAuctionTab = injectAfter(MMHKPLUS.HOMMK.MarketPlaceFrame.prototype.displayArtefactAuctionTab, onArtefactAuctionDisplay);
    },

    _setupSiegeFrame : function()
    {
        var onSiegeFrameDisplay = function()
        {
            var x = this.content.targetedRegion.x;
            var y = this.content.targetedRegion.y;
            var $header = $(this.mainElement).find("div.siegeFrameRegionCityZone");
            $header.append(
                $("<div>")
                    .button()
                    .html(MMHKPLUS.localize("CENTER"))
                    .css("padding", 3)
                    .css("float", "right")
                    .click(function() 
                        {
                            MMHKPLUS.centerOn(x, y);
                        }));
        };

        MMHKPLUS.HOMMK.SiegeFrame.prototype.display = injectAfter(MMHKPLUS.HOMMK.SiegeFrame.prototype.display, onSiegeFrameDisplay);
    },
    
    _setupTimelineCaravansTooltip : function() 
    {
    	var caravansContent = function(result) 
    	{
    		var newResult = result;
    		if(this.content.type == "CARAVAN_DELIVERY") 
			{
    			var $content = $("<div>");
    			for(var i = 1; i <=7; i++)
    			{
    				$content
    					.append(
    							MMHKPLUS.getCssSprite("Ressources", MMHKPLUS.resources[i-1]).addClass("MMHKPLUS_KingdomResourcesImage").css("display", "inline-block").css("margin-bottom", "10px").css("margin-left", "10px"))
    					.append(
    						$("<span/>")
    							.html(formatNumber(parseInt(this.content.paramList[i])))
    							.css("padding-left", "4px").css("top", "-4px").css("position", "relative"));
    			}
    			newResult = result + $content.append("<br/>").html();
			}
    		return newResult;
    	};
    	
    	MMHKPLUS.HOMMK.MasterAction.prototype.getTooltipContent = injectAfter(MMHKPLUS.HOMMK.MasterAction.prototype.getTooltipContent, caravansContent);
    	MMHKPLUS.getElement("Player").getActions().forEach(function(a)
    		{
    			a.display();
    		}
    	);
    },
    
    _setupBattleRoundBonus : function() 
    {
    	/*
    	 * From Heroes Kinfdom Evolution
    	 * http://amroth.free.fr/MMHK/extension/
    	 */
    	var computeBonus = function(round, type) 
    	{
    		var totalBonus = round[ type + "TotalBonus" ] ? round[ type + "TotalBonus" ] : 0;
    		var typeBonus = round[ type + "UnitStackUnitTypeBonus" ] ? round[ type + "UnitStackUnitTypeBonus" ] : 0;
    		if( totalBonus > typeBonus ) {
    			var bonus = totalBonus - typeBonus;
    			return "+" + Math.round( 1000*bonus/round[ type + 'UnitStackPower' ] )/10 + "%";
    		}
    		return false;
    	};
    	
    	var addPowerBonus = function() 
    	{
    		var obj = this;
    		// get the full battle report object
    		var id = obj.elementId.substring( 0, obj.elementId.indexOf('_') );
    		var battle = MMHKPLUS.HOMMK.elementPool.get( "BattleResultDetailedMessage" ).get( id );

    		var attackBonus = false, defenseBonus = false;

    		// determine the attack and defense bonus
    		var attackBonus = computeBonus( obj.content, 'attacker' );
    		var defenseBonus = computeBonus( obj.content, 'defender' );

    		// display it all
    		function displayBonus( type, bonus ) {
    			var before = $( "#"+obj.elementType + obj.elementId + type + "QuantityBefore" );	
    			var div = $("<div></div>", {
    				id: obj.elementType + obj.elementId + type + "Bonus",
    				style: "font-size:12px;"
    			})
    			.html( bonus );
    			div.prependTo( before.parent() );
    			before.css( "display", "inline" )
    				.remove()
    				.prependTo( div );			
    		}
    		if ( battle.content.type == MMHKPLUS.HOMMK.MESSAGE_TYPE_BATTLE_RESULT_DEFENDER ) {
    			if( attackBonus ) displayBonus( "Enemy", attackBonus );
    			if( defenseBonus ) displayBonus( "Ally", defenseBonus );
    		}
    		else {
    			if( attackBonus ) displayBonus( "Ally", attackBonus );
    			if( defenseBonus ) displayBonus( "Enemy", defenseBonus );
    		}
    	};
    	
    	MMHKPLUS.HOMMK.BattleRound.prototype.addToDOM = injectAfter(MMHKPLUS.HOMMK.BattleRound.prototype.addToDOM, addPowerBonus);

    },
    
    _setupExportToImageButtons : function() 
    {
    	var addExportButtonsBattle = function() 
    	{
    		var self = this;
    		// Remove all existing buttons (only one at a time)
    		$("div.MMHKPLUS_PNGButton").remove();
    		$(this.allyResultTextElement).append(
    			$("<div/>")
    				.html("PNG")
    				.addClass("MMHKPLUS_PNGButton")
    				.button()
    				.css({float:"left", fontSize:"50%"})
    				.click(function()
    					{
    						$("div.MMHKPLUS_PNGButton").css("display", "none");
    						var $toExport = $("#BattleResultDetailedMessage" + self.elementId + "Body").clone()
    						$toExport.find("#BattleResultDetailedMessage" + self.elementId + "Content").remove();;
    						$toExport.find("div.MMHKPLUS_PNGButton").remove();
    						MMHKPLUS.exportToImage($toExport);
    						
    					}));
    	};
    	
    	var addExportButtonsSpys = function() 
    	{
    		var self = this;
    		// Remove all existing buttons (only one at a time)
    		$("div.MMHKPLUS_PNGButton").remove();
    		$("#" + self.elementType + self.elementId + "Description").append(
    			$("<div/>")
    				.html("PNG")
    				.addClass("MMHKPLUS_PNGButton")
    				.button()
    				.css({float:"right"})
    				.click(function()
    					{
    						$("div.MMHKPLUS_PNGButton").css("display", "none");
    						var $toExport = $("#" + self.elementType + self.elementId + "Body").clone()
    						$toExport.find("#" + self.elementType + self.elementId + "Content").remove();;
    						$toExport.find("div.MMHKPLUS_PNGButton").remove();
    						MMHKPLUS.exportToImage($toExport);
    						
    					}));
    	};
    	
    	MMHKPLUS.HOMMK.BattleResultDetailedMessage.prototype.display = injectAfter(MMHKPLUS.HOMMK.BattleResultDetailedMessage.prototype.display, addExportButtonsBattle);
    	MMHKPLUS.HOMMK.TroopScoutingResultDetailedMessage.prototype.display = injectAfter(MMHKPLUS.HOMMK.TroopScoutingResultDetailedMessage.prototype.display, addExportButtonsSpys);
    	MMHKPLUS.HOMMK.RegionScoutingResultDetailedMessage.prototype.display = injectAfter(MMHKPLUS.HOMMK.RegionScoutingResultDetailedMessage.prototype.display, addExportButtonsSpys);
    	MMHKPLUS.HOMMK.CityScoutingResultDetailedMessage.prototype.display = injectAfter(MMHKPLUS.HOMMK.CityScoutingResultDetailedMessage.prototype.display, addExportButtonsSpys);
    },
	
	unload : function()
	{
		if(this.$elemCenterOn) MMHKPLUS.resetElement(this.$elemCenterOn);
		if(this.$elemChat) MMHKPLUS.resetElement(this.$elemChat);
        MMHKPLUS.clearInterval(this.intervalClockUpdate); this.intervalClockUpdate = null;
        MMHKPLUS.clearInterval(this.intervalUpdateOnline); this.intervalUpdateOnline = null;
	}
});
