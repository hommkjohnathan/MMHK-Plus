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
		chatType : 2 // 0 : normal, 1 : amélioré, 2 : MMHK+ Chat
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		
		this.options.showBuyable = this.load("sB") || this.options.showBuyable;
        this.options.showPanels = (this.load("sP") != null ? this.load("sP") : this.options.showPanels);
        this.options.showInfluence = this.load("sI") || this.options.showInfluence;
        this.options.showResources = this.load("sR") || this.options.showResources;
        this.options.showMovements = (this.load("sM") != null ? this.load("sM") : this.options.showMovements);
        this.options.gameToleft = (this.load("gP") != null ? this.load("gP") : this.options.gameToleft);

		this.options.chatType = (this.load("cT") != null ? this.load("cT") : this.options.chatType);
		
		this._enhanceUi();
		
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
        this._setupResources();
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
	
	_enhanceUi : function()
	{
		this._setupCenterOn();
		this._setupBuyable();
		this._setupChat();
        this._setupPanels();
        this._setupClearMessages();
        this._setupInfluence();
        this._setupResources();
        this._setupBuildEndTime();
        this._setupAllianceReports();
        this._setupClock();
        this._setupMovements();
        this._setupMarketPlaceFrame();
        this._setupGamePosition();
        this._setupSiegeFrame();
        this._setupTimelineCaravansTooltip();
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
                                    "background-image" : "url(" + MMHKPLUS.URL_RESOURCES + "/images/" + "map/color_" + color + ".png)",
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

    _setupResources : function()
    {
        var self = this;
        var isRunning = false;

        var ressourcesImages = [
                MMHKPLUS.URL_RESOURCES + "/images/" + "ressources/gold.png",
                MMHKPLUS.URL_RESOURCES + "/images/" + "ressources/wood.png",
                MMHKPLUS.URL_RESOURCES + "/images/" + "ressources/ore.png",
                MMHKPLUS.URL_RESOURCES + "/images/" + "ressources/mercury.png",
                MMHKPLUS.URL_RESOURCES + "/images/" + "ressources/crystal.png",
                MMHKPLUS.URL_RESOURCES + "/images/" + "ressources/sulfure.png",
                MMHKPLUS.URL_RESOURCES + "/images/" + "ressources/gem.png",
            ];
        
        var getRessourcesAt = function(x, y)
        {
            var id = "MMHKPLUS_UiResourcePool_" + MMHKPLUS.getElement("Player").get("worldId");
            if(!sessionStorage[id])
                return null;
            return JSON.parse(sessionStorage.getItem(id))[MMHKPLUS.getRegionId(x, y) + ''];
        };

        var putRessourcesInCache = function(regionId)
        {
            if(isRunning)
                return;

            isRunning = true;
            console.log("Getting ressources for " + regionId);
            var size = MMHKPLUS.getElement("Player").get("worldSize");
            $.getScript(MMHKPLUS.URL_RESOURCES + "/php/v2/"  + "map_ressources.php?worldId=" 
                    + MMHKPLUS.getElement("Player").get("worldId")
                    + "&regionId=" + regionId 
                    + "&worldSize=" + size, 
                function(e)
                {
                    isRunning = false;
                    var currentX = MMHKPLUS.HOMMK.worldMap.getGoodPosition(MMHKPLUS.HOMMK.worldMap.x + MMHKPLUS.HOMMK.worldMap.lastTooltipX);
                    var currentY = MMHKPLUS.HOMMK.worldMap.getGoodPosition(MMHKPLUS.HOMMK.worldMap.y + MMHKPLUS.HOMMK.worldMap.lastTooltipY);
                    var rAt = getRessourcesAt(currentX, currentY);
                    if(rAt == null)
                    {
                        askForSingleRegion(currentX, currentY);
                    }
                    var tip = $("#MMHKPLUS_UiResources");
                    if(tip.length > 0)
                    {
                        tip.html(createRessourcesToolTip(currentX, currentY));
                    }
                }
            );
        };

        var askForSingleRegion = function(x, y)
        {
            MMHKPLUS.getElement("Ajax").getRegionMapXY(x, y, function(json)
                {
                    var cases = json.d.RegionMap0.attachedZoneList;
                    var result = []; 
                    cases.forEach(function(c)
                        {
                            if(hasProperty(c, "attachedMine"))
                            {
                                (c.attachedMine.ressourceEntityTagName=="GOLD")?result.push(1):0;
                                (c.attachedMine.ressourceEntityTagName=="WOOD")?result.push(2):0;
                                (c.attachedMine.ressourceEntityTagName=="ORE")?result.push(3):0;
                                (c.attachedMine.ressourceEntityTagName=="MERCURY")?result.push(4):0;
                                (c.attachedMine.ressourceEntityTagName=="CRYSTAL")?result.push(5):0;
                                (c.attachedMine.ressourceEntityTagName=="SULFUR")?result.push(6):0;
                                (c.attachedMine.ressourceEntityTagName=="GEM")?result.push(7):0;
                            }
                        }
                    );
                    result = result.sort();
                    var resources = JSON.parse(sessionStorage.getItem("MMHKPLUS_UiResourcePool_" + MMHKPLUS.getElement("Player").get("worldId")));
                    resources[MMHKPLUS.getRegionId(x, y)] = result;
                    sessionStorage.setItem("MMHKPLUS_UiResourcePool_" + MMHKPLUS.getElement("Player").get("worldId"), JSON.stringify(resources));
                    var tip = $("#MMHKPLUS_UiResources");
                    if(tip.length > 0)
                    {
                        var currentX = MMHKPLUS.HOMMK.worldMap.getGoodPosition(MMHKPLUS.HOMMK.worldMap.x + MMHKPLUS.HOMMK.worldMap.lastTooltipX);
                        var currentY = MMHKPLUS.HOMMK.worldMap.getGoodPosition(MMHKPLUS.HOMMK.worldMap.y + MMHKPLUS.HOMMK.worldMap.lastTooltipY);
                        if(currentX == x && currentY == y)
                            tip.html(createRessourcesToolTip(x, y));
                    }
                }
            );
        };
        
        var createRessourcesToolTip = function(x, y)
        {
            var rAt = getRessourcesAt(x, y);
            if(!rAt)
            {
                putRessourcesInCache(MMHKPLUS.getRegionId(x, y));
                return "<i>" + MMHKPLUS.localize("IN_PROGRESS") + "</i>";
            }
            if(rAt.length == 0)
            {
                return MMHKPLUS.localize("NONE");
            }
            else
            {
                return "<img src='" + ressourcesImages[rAt[0]-1] + "' style='width:20px;height:20px'/>&nbsp;&nbsp;"
                     + "<img src='" + ressourcesImages[rAt[1]-1] + "' style='width:20px;height:20px'/>&nbsp;&nbsp;"
                     + "<img src='" + ressourcesImages[rAt[2]-1] + "' style='width:20px;height:20px'/>&nbsp;&nbsp;"
                     + "<img src='" + ressourcesImages[rAt[3]-1] + "' style='width:20px;height:20px'/>";
            }
        };

        var newToolTipContent = function()
        {
            var originalTip = self.originalTooltipContentFunction.apply(this,arguments);
            if(originalTip && !originalTip.match(/id='MMHKPLUS_UiResources/))
            {
                var currentX = MMHKPLUS.HOMMK.worldMap.getGoodPosition(MMHKPLUS.HOMMK.worldMap.x + MMHKPLUS.HOMMK.worldMap.lastTooltipX);
                var currentY = MMHKPLUS.HOMMK.worldMap.getGoodPosition(MMHKPLUS.HOMMK.worldMap.y + MMHKPLUS.HOMMK.worldMap.lastTooltipY);
                
                originalTip += "<div id='MMHKPLUS_UiResources'>" + createRessourcesToolTip(currentX, currentY) + "</div>"
            }
            return originalTip;
        };

        if(this.options.showResources)
        {
            this.originalTooltipContentFunction = MMHKPLUS.HOMMK.worldMap.tooltip.htmlContentFunction; 

            MMHKPLUS.HOMMK.worldMap.tooltip.htmlContentFunction = newToolTipContent;
        }
        else
        {
            if(this.originalTooltipContentFunction)
                MMHKPLUS.HOMMK.worldMap.tooltip.htmlContentFunction = this.originalTooltipContentFunction;
            this.originalTooltipContentFunction = null;
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
			.css({height : "20px", width : "65px", marginLeft : "10px", marginTop : "3px", lineHeight : "20px"})
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
                        content = content.replace(/MMHKPLUS_ScoutPL\(([0-9]+),([A-Za-z0-9_\-\s'"\?\!\w]+)\)/,"<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.getElement(\"Ajax\").getSpyReportContent($1);'>$2</span>");
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
			
			$(".chatsystemmincontainer").addClass("hidden");
            $(".chatsystem").addClass("hidden");
		}
        else if(this.options.chatType == 1)
        {
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
                newContent = newContent.replace(/MMHKPLUS_ScoutPL\(([0-9]+),([A-Za-z0-9_\-\s'"\?\!\w]+)\)/,"<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.getElement(\"Ajax\").getSpyReportContent($1);'>$2</span>");
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
        if(MMHKPLUS.getElement("Player").isInAlliance())
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
                        if(hasProperty(content, "isArchived")) delete content.isArchived;
                        if(hasProperty(content, "isAllianceChiefMessage")) delete content.isAllianceChiefMessage;
                        if(hasProperty(content, "subject")) delete content.subject;
                        if(hasProperty(content, "isArchived")) delete content.isArchived;
                        if(hasProperty(content, "patrol_heroId")) delete content.patrol_heroId;
                        if(hasProperty(content, "XPGainedStr")) delete content.XPGainedStr;

                        if(hasProperty(content, "contentJSON"))
                        {
                            if(hasProperty(content.contentJSON, "message")) delete content.contentJSON.message;

                            if(hasProperty(content.contentJSON, "defenseUnitStackList"))
                            {
                                content.contentJSON.defenseUnitStackList.forEach(function(d, di)
                                    {
                                        delete content.contentJSON.defenseUnitStackList[di].id;
                                        delete content.contentJSON.defenseUnitStackList[di].unitEntityName;
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
                                        delete content.contentJSON.regionUnitStackList[di].unitEntityTypeName;
                                        delete content.contentJSON.regionUnitStackList[di].powerPosition;
                                    }
                                );
                            }

                            if(hasProperty(content.contentJSON, "heroList"))
                            {
                                content.contentJSON.heroList.forEach(function(h, hi)
                                    {
                                        if(hasProperty(h, "attachedUnitStackList"))
                                        {
                                            h.attachedUnitStackList.forEach(function(u, ui)
                                                {
                                                    delete content.contentJSON.heroList[hi].attachedUnitStackList[ui].id;
                                                    delete content.contentJSON.heroList[hi].attachedUnitStackList[ui].unitEntityName;
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

                        MMHKPLUS.getElement("Ajax").sendSpyReport(content);
                        lastMessage = message.content.id;
                    }
                }
            };

            MMHKPLUS.HOMMK.WorldMap.prototype.selectRegion = injectAfter(MMHKPLUS.HOMMK.WorldMap.prototype.selectRegion, MMHKPLUS.getElement("Ajax").getSpyReportsForSelectedRegion);
            MMHKPLUS.HOMMK.MessageBoxFrame.prototype.displayMessage = injectAfter(MMHKPLUS.HOMMK.MessageBoxFrame.prototype.displayMessage, checkScoutingMessage);   
        }
    },

    _setupClock : function()
    {
        var time = new Date(); time.setTime($.now());

        var $clock = $("<div>").addClass("MMHKPLUS_Clock").css({position:"absolute", top:"35px", left:"140px", zIndex:1000}).appendTo($("#Container"));
        this.intervalClockUpdate = setInterval(function()
            {
                time.setTime($.now());
                $("div.MMHKPLUS_Clock").html(time.toHoursMinSecFormat());
            },
            1000
        );
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
    			var $content = $(newResult);
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
    			newResult = $content.append("<br/>").html();
    			var $content = $(newResult);
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
	
	unload : function()
	{
		if(this.$elemCenterOn) MMHKPLUS.resetElement(this.$elemCenterOn);
		if(this.$elemChat) MMHKPLUS.resetElement(this.$elemChat);
        MMHKPLUS.clearInterval(this.intervalClockUpdate); this.intervalClockUpdate = null;
        MMHKPLUS.clearInterval(this.intervalUpdateOnline); this.intervalUpdateOnline = null;
	}
});
