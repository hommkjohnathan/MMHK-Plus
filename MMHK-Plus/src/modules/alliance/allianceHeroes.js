MMHKPLUS.AllianceHeroes = MMHKPLUS.PanelElement.extend({
    elementType : "AllianceHeroes",
    
    options : {
        title : "",
        resizable : false,
        opened : false,
        x : "center",
        y : "center",
        w : 760,
        h : 540,
        savePos : true,
        saveWidth : false,
        saveHeight : false,
        saveOpened : true
    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("ALLIANCE_HEROES");
        this.$elem = $("<div>");
        this._setupPanel();
        
        return this;
    },
    
    onOpen : function()
    {
        this._createView();
        this._getAlliances();
    },

    onSetup : function()
    {
        this.$elem.css(
            {
                overflow : "hidden"
            }
        );
    },

    _createView : function()
    {
        var self = this;
        $("<div>")
            .addClass("MMHKPLUS_TextCenter")
            .append(
                $("<label>")
                    .html(MMHKPLUS.localize("ALLIANCE") + " : "))
            .append(
                $("<select>")
                    .css("width", "230px")
                    .change(function()
                        {
                            self.$elem.find("div.MMHKPLUS_AllianceHeroesHero").empty();
                            self.$elem.find("div.MMHKPLUS_AllianceHeroesHeroContent").empty().remove();
                            self._getPlayers();
                        }))
            .append("&nbsp;&nbsp;&nbsp;&nbsp;")
            .append(
                $("<label>")
                    .html(MMHKPLUS.localize("PLAYER") + " : "))
            .append(
                $("<select>")
                    .css("width", "150px")
                    .change(function()
                        {
                            self.$elem.find("div.MMHKPLUS_AllianceHeroesHero").empty();
                            self.$elem.find("div.MMHKPLUS_AllianceHeroesHeroContent").empty().remove();
                            self._getHeroes();
                        }))
            .appendTo(this.$elem);

        $("<br>").appendTo(this.$elem);

        $("<table>").addClass("MMHKPLUS_Table MMHKPLUS_100Width").appendTo(
            $("<div>")
                .css({width:"430px", height:"260px", overflowX:"hidden", overflowY:"auto"})
                .appendTo(this.$elem));

        $("<div>")
            .addClass("MMHKPLUS_AllianceHeroesHero")
            .css(
                {
                    border : "1px solid #FFFFFF",
                    borderRadius : "10px",
                    width : "295px",
                    minHeight : "35px",
                    marginTop : "20px",
                    position : "absolute",
                    marginLeft : "440px",
                    top : "20px"
                })
            .appendTo(this.$elem);
    },

    _getAlliances : function()
    {
        MMHKPLUS.getElement("Ajax").getAlliances(function(alliances)
        	{
        		var self = MMHKPLUS.getElement("AllianceHeroes");
        		var $table = self.$elem.find("table");
                $table.empty();
	        	var $selectAlliances = self.$elem.find("select").eq(0);
	            $selectAlliances.empty();
	        	$selectAlliances.append(
                    $("<option>")
                        .attr("value", -2)
                        .html(""));
	        	$selectAlliances.append(
                    $("<option>")
                        .attr("value", -1)
                        .html(MMHKPLUS.localize("NONE")));

	        	alliances.forEach(function(a)
		            {
	        			if(a.allianceId == null) {
	        				return;
	        			}
		                $selectAlliances.append(
		                    $("<option>")
		                        .attr("value", a.allianceId)
		                        .html(a.allianceName));
		            }
		        );
        	}
        );
    },

    _getPlayers : function()
    {
    	var $selectPlayers = this.$elem.find("select").eq(1);
        $selectPlayers.empty();
        var filterAlliance = this.$elem.find("select").eq(0).val() || -2;

        if(filterAlliance == -2)
            return;

        MMHKPLUS.getElement("Ajax").getPlayers(filterAlliance, function(players)
        	{
	            $selectPlayers.append(
	                $("<option>")
	                    .attr("value", -2)
	                    .html(""));
	
	            players.forEach(function(p)
	                {
	                    $selectPlayers.append(
	                        $("<option>")
	                            .attr("value", p.playerId)
	                            .html(p.playerName));
	                }
	            );
        	}
        );
    },

    _getHeroes : function()
    {
        var self = MMHKPLUS.getElement("AllianceHeroes");
        var $table = self.$elem.find("table");
        $table.empty();
        var targetedPlayerId = self.$elem.find("select").eq(1).val() || null;
        if(targetedPlayerId)
        {
            MMHKPLUS.getElement("Ajax").getHeroes(targetedPlayerId, function(heroes)
            	{
            		heroes.forEach(function(h)
                        {
                            $table.append(
                                $("<tr>").addClass("MMHKPLUS_100Width MMHKPLUS_AllianceSpysHover")
                                    .css("cursor", "pointer")
                                    .append(
                                        $("<td>").addClass("MMHKPLUS_TextCenter")
                                            .html(h.name))
                                    .append(
                                        $("<td>").addClass("MMHKPLUS_TextCenter")
                                            .html(MMHKPLUS.localize("LEVEL") + " " + (h._level || "?")))
                                    .append(
                                        $("<td>").addClass("MMHKPLUS_TextCenter")
                                            .html((hasProperty(h, 'heroTrainingEntityTagName') ? MMHKPLUS.localize(h.heroTrainingEntityTagName) : "?")))
                                    .click(function()
                                        {
                                            self._loadHero(targetedPlayerId, h.id);
                                        }));
                        }
                    );
                    $table.find("tr:odd").css({backgroundColor:"rgba(0,191,255,0.2)"});
            	}
            );
        }
    },

    _loadHero : function(playerId, heroId)
    {
        var self = MMHKPLUS.getElement("AllianceHeroes");
        MMHKPLUS.getElement("Ajax").getSpyHeroContent(playerId, heroId, function(hero)
        	{
	        	if(!hero)
	            {
	                MMHKPLUS.alert(MMHKPLUS.localize("NOT_FOUND_AH_TITLE"), MMHKPLUS.localize("NOT_FOUND_AH_TEXT"));
	                self.$elem.dialog("close");
	                return;
	            }
	        	
	        	self._createHeroContent(playerId, hero);
        	}
        );
    },

    _getHeroBackgroundImage : function(faction, picture)
    {
        var factionLower = faction.toLowerCase();
        var factionCapitalize = faction.charAt(0).toUpperCase() + faction.slice(1).toLowerCase();
        picture = (picture < 10 ? "0" + picture : "" + picture);
        
        return $("<div/>").css(
            {
                "margin-left" : "auto",
                "margin-right" : "auto",
                "background-image" : "url(" + MMHKPLUS.HOMMK.IMG_URL + "hero/portraits/" + factionCapitalize + "/" + factionLower + "_" + picture + ".jpg)",
                "width" : "295px",
                "height" : "350px",
                "background-position" : "0px 0px"
            }
        );
    },

    _createHeroContent : function(playerId, hero)
    {
        var self = MMHKPLUS.getElement("AllianceHeroes");
        var $heroContent = self.$elem.find("div.MMHKPLUS_AllianceHeroesHero");
        $heroContent.empty();
            
        var heroImage = self._getHeroBackgroundImage(hero.factionEntityTagName, hero.picture).css(
            {
                "position" : "relative",
                "float" : "left",
                "height" : "450px",
                "top" : "0px",
                "left" : "0px",
                "border-radius" : "10px"
            }
        ).appendTo($heroContent);
        
        var divSummary = $("<div>").css(
            {
                "position" : "absolute",
                "left" : "10px",
                "bottom" : "15px",
                "right" : "10px",
                "top" : "344px",
                "background-color" : "#E7D5B9",
                "border" : "1px solid #50332B",
                "border-radius" : "10px",
                "color" : "#50332B",
                "text-align" : "center",
                "padding" : "7px"
            }
        ).appendTo($heroContent);
        
        var divHeroName = $("<div/>").css(
            {
                "position" : "absolute",
                "left" : "35px",
                "bottom" : "105px",
                "right" : "100px",
                "top" : "320px",
                "background-color" : "#EEEBE9",
                "border" : "1px solid #50332B",
                "border-bottom" : "none",
                "border-radius" : "10px 10px 0 0",
                "border-color" : "#50332B",
                "line-height" : "25px",
                "color" : "#50332B",
                "font-weight" : "bold",
                "padding-left" : "10px"
            }
        ).html(hero.name.toUpperCase()).appendTo($heroContent);
        
        $("<p style='font-weight:bold;'/>").html(MMHKPLUS.localize("LEVEL") + " : " + (hero._level || "?")).appendTo(divSummary);
        $("<p style='font-weight:bold;'/>").html(hasProperty(hero, 'heroTrainingEntityTagName' ? MMHKPLUS.localize(hero.heroTrainingEntityTagName) : "?")).appendTo(divSummary);
        
        var statsSummary = $("<div/>").css({"margin-top" : "10px"}).appendTo(divSummary);
        $("<img/>").attr("src", MMHKPLUS.URL_IMAGES + "kingdom/heroAttack.png").css({"padding-right" : "10px"}).appendTo(statsSummary);
        $("<span/>").css({"font-weight":"bold", "font-size":"135%", "margin-right" : "20px"}).html((parseInt(hero.attack) || "?")).appendTo(statsSummary);
        $("<img/>").attr("src", MMHKPLUS.URL_IMAGES + "kingdom/heroDefense.png").css({"padding-right" : "10px"}).appendTo(statsSummary);
        $("<span/>").css({"font-weight":"bold", "font-size":"135%", "margin-right" : "20px"}).html((parseInt(hero.defense) || "?")).appendTo(statsSummary);
        $("<img/>").attr("src", MMHKPLUS.URL_IMAGES + "kingdom/heroMagic.png").css({"padding-right" : "10px"}).appendTo(statsSummary);
        $("<span/>").css({"font-weight":"bold", "font-size":"135%"}).html((parseInt(hero.magic) || "?")).appendTo(statsSummary);
        
        $("<div/>").addClass("MMHKPLUS_AllianceHeroesHeroContent MMHKPLUS_TextCenter").css(
            {
                "position" : "absolute",
                "left" : "-440px",
                "bottom" : "0px",
                "right" : "310px",
                "top" : "270px",
                "padding-left" : "10px"
            }
        ).append(
            $("<label>").html(MMHKPLUS.localize("IG_PERMALINK")))
        .append($("<input readonly>").css({width: "220px", marginLeft:"15px"}).val("MMHKPLUS_HeroPL(" + playerId + "," + hero.id + "," + removeDiacritics(hero.name)+ ")").click(function() {this.select();}))
        .appendTo($heroContent);

        var divDetailContent = $("<div/>").addClass("MMHKPLUS_AllianceHeroesHeroContent").css(
            {
                "position" : "absolute",
                "left" : "-440px",
                "bottom" : "0px",
                "right" : "310px",
                "top" : "300px",
                "border" : "1px solid #FFFFFF",
                "border-radius" : "10px",
                "color" : "#50332B",
                "padding-left" : "10px"
            }
        ).appendTo($heroContent);
        MMHKPLUS.getElement("SpyReport", true)._createClassesContent(hasProperty(hero, 'heroClassList') ? hero.heroClassList : []).css(
            {
                "margin-left" : "40px"
            }
        ).appendTo(divDetailContent);
        MMHKPLUS.getElement("SpyReport", true)._createSpellsContent(hasProperty(hero, 'spellStackList') ? hero.spellStackList : []).css(
            {
                "position" : "relative",
                "top" : "-60px",
                "right" : "10px",
                "left" : "250px"
            }
        ).appendTo(divDetailContent);
        MMHKPLUS.getElement("SpyReport", true)._createArtefactsContent(hasProperty(hero, 'artefactList') ? hero.artefactList : []).css(
            {
                "position" : "relative",
                "top" : "-50px",
                "left" : "25px"
            }
        ).appendTo(divDetailContent);
        
        
        $("<div/>").html("<p style='height:17px;line-height:17px;'><img src='" + MMHKPLUS.URL_JACTARI + "/images/icone-combat.png' style='margin-right:10px;'/><span style='position:relative;margin-top:-5px;top:-4px;padding-right:7px;'>" + MMHKPLUS.localize("ATTACKER") + "</span></p>").css(
            {
                "position" : "absolute",
                "top" : "10px",
                "left" : "10px",
                "line-height" : "17px",
                "height" : "17px",
                "border" : "1px solid #50332B",
                "color" : "#50332B",
                "font-weight" : "bold",
                "cursor" : "pointer",
                "background-color" : "#E7D5B9"
            }
        ).click(function()
            {
                var heroJac =
                    {
                        defense : hero.defense,
                        attack : hero.attack,
                        magic : hero.magic,
                        factionEntityTagName : hero.factionEntityTagName,
                        id : hero.id,
                        name : hero.name,
                        _level : hero._level,
                        heroTrainingEntityTagName : hero.heroTrainingEntityTagName || "",
                        bonus : 
                            {
                                artefacts : hero.artefactList || [],
                                skills : hero.heroClassList || [],
                                spells : hero.spellStackList || []
                            }
                    };
                MMHKPLUS.getElement("Jactari").permalien(null, heroJac, {});
                MMHKPLUS.openURL(MMHKPLUS.getElement("Jactari").lastPermalien());
            }
        ).appendTo($heroContent);
        
        $("<div/>").html("<p style='height:17px;line-height:17px;'><img src='" + MMHKPLUS.URL_JACTARI + "/images/icone-combat.png' style='margin-right:10px;'/><span style='position:relative;margin-top:-5px;top:-4px;padding-right:5px;'>" + MMHKPLUS.localize("DEFENDER") + "</span></p>").css(
            {
                "position" : "absolute",
                "top" : "35px",
                "left" : "10px",
                "line-height" : "17px",
                "height" : "17px",
                "border" : "1px solid #50332B",
                "color" : "#50332B",
                "font-weight" : "bold",
                "cursor" : "pointer",
                "background-color" : "#E7D5B9"
            }
        ).click(function()
            {
                var heroJac =
                    {
                        defense : hero.defense,
                        attack : hero.attack,
                        magic : hero.magic,
                        factionEntityTagName : hero.factionEntityTagName,
                        id : hero.id,
                        name : hero.name,
                        _level : hero._level,
                        heroTrainingEntityTagName : hero.heroTrainingEntityTagName || "",
                        bonus : 
                            {
	                        	artefacts : hero.artefactList || [],
	                            skills : hero.heroClassList || [],
	                            spells : hero.spellStackList || []
                            }
                    };
                heroJac.artefactList = heroJac.bonus.artefacts;
                MMHKPLUS.getElement("Jactari").permalien(null, {}, heroJac);
                MMHKPLUS.openURL(MMHKPLUS.getElement("Jactari").lastPermalien());
            }
        ).appendTo($heroContent);
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
    }
});
