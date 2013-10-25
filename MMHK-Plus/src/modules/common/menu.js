MMHKPLUS.Menu = MMHKPLUS.ExtendableElement.extend({
	elementType : "Menu",
	
	options : {
		type : 0, // 0 = topbar, 1 = floating div,
		showText : true,
		images : MMHKPLUS.URL_IMAGES + "icons/",
		menuWidth : 140,
		x : 0,
		y : 0
	},
	
	subItems : null,
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.$elem = $("<div>");
		
		this.options.type = this.load("type") || this.options.type;
		this.options.x = this.load("x") || this.options.x;
		this.options.y = this.load("y") || this.options.y;
		
		this.subItems = [
			{i : "alliance.png", t : MMHKPLUS.localize("ALLIANCE"), ra : true, s :
				[
                    {t : MMHKPLUS.localize("ONLINE_MEMBERS"), ref : "AllianceOnlineMembers"},
					{t : MMHKPLUS.localize("ALLIANCE_SPYS"), ref : "AllianceSpys"},
					{t : MMHKPLUS.localize("ALLIANCE_HEROES"), ref : "AllianceHeroes"},
                    {t : MMHKPLUS.SpyReport.elementType, ref : "SpyReport", v : false}
				]
			},
			{i : "kingdom.png", t : MMHKPLUS.localize("KINGDOM"), ra : false, s : 
				[
					{t : MMHKPLUS.localize("ARMIES"), ref : "KingdomArmies"},
					{t : MMHKPLUS.localize("RECRUITMENT"), ref : "KingdomRecruitment"},
					{t : MMHKPLUS.localize("RESOURCES"), ref : "KingdomResources"},
					{t : MMHKPLUS.localize("HEROES"), ref : "KingdomHeroes"},
					{t : MMHKPLUS.localize("ARTIFACTS"), ref : "KingdomArtifacts"},
					{t : MMHKPLUS.localize("ACTIONS"), ref : "KingdomActions"},
					{t : MMHKPLUS.localize("HEROES_SPELLS"), ref : "KingdomHeroesSpells"},
					{t : MMHKPLUS.localize("CITIES_SPELLS"), ref : "KingdomCitiesSpells"},
                    {t : MMHKPLUS.localize("CITIES_BUILDINGS"), ref : "KingdomCitiesBuildings"},
                    {t : MMHKPLUS.localize("REGIONS"), ref : "KingdomRegions"}
				]
			},
			{i : "tools.png", t : MMHKPLUS.localize("TOOLS"), ra : false, s : 
				[
                    {t : MMHKPLUS.localize("ATTACKS_SIEGES"), ref : "AttacksSieges"},
					{t : MMHKPLUS.localize("LOOKOUT"), ref : "Lookout"},
					{t : MMHKPLUS.localize("MAPFINDER"), ref : "MapFinder"},
					{t : MMHKPLUS.localize("CARTO"), ref : "Cartographer"},
					{t : MMHKPLUS.localize("DISTANCES"), ref : "Distances"},
					{t : MMHKPLUS.localize("MARKS"), ref : "Marks"},
					{t : MMHKPLUS.localize("NOTEPAD"), ref : "Notepad"},
                    {t : MMHKPLUS.localize("MAINTENANCE"), ref : "Maintenance"}
				]
			},
			{i : "settings.png", t : MMHKPLUS.localize("OPTIONS"), ra : false, s : 
			[
				{t : MMHKPLUS.localize("OPTIONS"), ref : "Options"},
				{t : MMHKPLUS.localize("ABOUT"), ref : "About"}
			],
		}
		];
		
		this.display();
		
		return this;
	},

	display : function()
	{
		this._clearMenu();
		this.$elem.appendTo($("#MainContainer"));
		this.$elem.addClass(
			(this.options.type == 0 ? 
				"MMHKPLUS_MainMenuTopbar MMHKPLUS_BlackBg MMHKPLUS_MaxZIndex" : "MMHKPLUS_MainMenuFloatting MMHKPLUS_BlackBg MMHKPLUS_MaxZIndex"));
		(this.options.type == 0 ? $("body").addClass("MMHKPLUS_BodyMainMenuTopbar") : $("body").removeClass("MMHKPLUS_BodyMainMenuTopbar"));
        
		this._createMenu();
		var self = this;
        if(this.options.type == 0)
    		$(window.document).scroll(function() 
    			{
    				var scrollLeft = $(this).scrollLeft();
    				var scrollTop = $(this).scrollTop();
    				
    				self.$elem.css("top", scrollTop + "px");
    				self.$elem.css("left", scrollLeft + "px");
    				if(self.options.type == 0)
    				{
    					var $submenus = $("body > ul.MMHKPLUS_SubMenu");
    					$submenus.eq(0).css({left : 1 * self.options.menuWidth + 1 * 4 + scrollLeft + "px", top : 22 + scrollTop + "px"});
    					$submenus.eq(1).css({left : 2 * self.options.menuWidth + 2 * 4 + scrollLeft + "px", top : 22 + scrollTop + "px"});
    					$submenus.eq(2).css({left : 3 * self.options.menuWidth + 3 * 4 + scrollLeft + "px", top : 22 + scrollTop + "px"});
    					$submenus.eq(3).css({left : 4 * self.options.menuWidth + 4 * 4 + scrollLeft + "px", top : 22 + scrollTop + "px"});
    				}
    			}
    		);
	},
	
	toggleType : function()
	{
		this.options.type = (this.options.type == 0 ? 1 : 0);
		this.save("type", this.options.type);
		this.display();
        if(MMHKPLUS.getElement("EnhancedUI"))
            MMHKPLUS.getElement("EnhancedUI")._setupGamePosition();
	},
	
	_createMenu : function()
	{
		if(this.options.type == 0)
		{
			$("<table>").append($("<tr>")).appendTo(this.$elem);
			var $container = this.$elem.find("tr");
			$("<td>").addClass("MMHKPLUS_MenuWidth").append("MMHK-Plus").click(function()
				{
					MMHKPLUS.openURL(MMHKPLUS.URL);
				}
			).button().appendTo($container);
			
			var baseURL = this.options.images;
			var showText = this.options.showText;
			var isInAlliance = MMHKPLUS.getElement("Player").isInAlliance();
			$.each(this.subItems, function(index, item)
				{
					if(!item.ra || (item.ra && isInAlliance))
					{
						var $cell = $("<td>").addClass("MMHKPLUS_MenuWidth")
										.append("<img src='" + baseURL + item.i + "' class='MMHKPLUS_MainMenuIcons'/>")
										.append((showText ? "<a href='#'>" + item.t + "</a>": ""))
										.button()
										.appendTo($container);
						if(hasProperty(item, "ref"))
						{
							$cell.click(function()
								{
									MMHKPLUS.openDisplayable(item.ref);
								}
							);
						}
						if(hasProperty(item, "s"))
						{
							var $submenu = $("<ul>").addClass("MMHKPLUS_SubMenu MMHKPLUS_MaxZIndex MMHKPLUS_MenuWidth hidden").css({left : $cell.offset().left + "px"}).appendTo($("body"));
							$.each(item.s, function(index, item)
								{
									$("<li>").append("<a href='#'>" + item.t + "</a>").on("click", function()
										{
											MMHKPLUS.openDisplayable(item.ref);
										}
									).addClass(hasProperty(item, "v") && !item.v ? "hidden" : "").appendTo($submenu);
								}
							);
							showHideOnMouse($submenu, $cell);
							showHideOnMouse($submenu, $submenu);
							$submenu.menu();
						}
					}
				}
			);
		}
		else
		{
			this.$elem.append("MMHK-Plus").button()
				.css({top : this.options.y, left : this.options.x, cursor : "move"});
			
			var $menu = $("<ul>").addClass("MMHKPLUS_MaxZIndex MMHKPLUS_MenuWidth").hide()
				.css({position : "absolute", left : this.options.x + "px", top : this.options.y + 20 + "px"})
				.appendTo($("body"));
			
			var self = this; 
			var baseURL = this.options.images;
			var showText = this.options.showText;
			var isInAlliance = MMHKPLUS.getElement("Player").isInAlliance();
			$.each(this.subItems, function(index, item)
				{
					if(!item.ra || (item.ra && isInAlliance))
					{
						var $cell = $("<li>")
							.append("<img src='" + baseURL + item.i + "' class='MMHKPLUS_MainMenuIcons' style='margin-left:5px; margin-right:5px;padding-top:3px;'/>")
							.append((showText ? "<a href='#'>" + item.t + "</a>": ""))
							.appendTo($menu);
						if(hasProperty(item, "ref"))
						{
							$cell.click(function()
								{
									MMHKPLUS.openDisplayable(item.ref);
								}
							);
						}
						if(hasProperty(item, "s"))
						{
							var $submenu = $("<ul>").addClass("MMHKPLUS_SubMenu MMHKPLUS_MaxZIndex MMHKPLUS_MenuWidth").appendTo($cell);
							$.each(item.s, function(index, item)
								{
									$("<li>").append("<a href='#'>" + item.t + "</a>").click(function()
										{
											MMHKPLUS.openDisplayable(item.ref);
										}
									).addClass(hasProperty(item, "v") && !item.v ? "hidden" : "").appendTo($submenu);
								}
							);
						}
						
					}
				}
			);
			this.$elem.draggable(
				{
					start : function(event, ui)
					{
						$menu.toggleClass("hidden");
					},
					
					drag : function(event, ui)
					{
						if(ui.offset.top < 0 || ui.offset.left < 0)
						{
							if(ui.offset.top < 0)
								$(this).css({top : "0px", left : ui.offset.left + "px"});
							if(ui.offset.left < 0)
								$(this).css({left : "0px", top : ui.offset.top + "px"});
							
							event.preventDefault();
							return false;
						}
					},
					stop : function(event, ui)
					{
						self.options.x = self.$elem.offset().left;
						self.options.y = self.$elem.offset().top;
						self.save("x", self.options.x);
						self.save("y", self.options.y);
						$menu.css({left : self.options.x + "px", top : self.options.y + 20 + "px"});
						$menu.toggleClass("hidden");
					}
				}
			);
			this.$elem.mouseenter(function()
				{
					$menu.show();
				}
			);
			this.$elem.mouseleave(function()
				{
					$menu.hide();
				}
			);
			$menu.mouseenter(function()
				{
					$menu.show();
				}
			);
			$menu.mouseleave(function()
				{
					$menu.hide();
				}
			);
			$menu.menu();
		}
	},
	
	_clearMenu : function()
	{
		$(window.document).off("scroll");
		this.$elem.draggable().draggable("destroy");
		MMHKPLUS.resetElement(this.$elem);
		MMHKPLUS.resetElement($("body > ul.MMHKPLUS_MaxZIndex"));
	},
	
	unload : function()
	{
		this._clearMenu();
		destroy(this.subItems);
	}
});
