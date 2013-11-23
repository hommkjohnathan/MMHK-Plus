MMHKPLUS.SpyReport = MMHKPLUS.ArmiesPanelElement.extend({
    elementType : "SpyReport",
    currentReport : null,

    options : {
        title : "",
        resizable : true,
        opened : false,
        x : "center",
        y : "center",
        w : 700,
        h : 500,
        savePos : true,
        saveWidth : true,
        saveHeight : true,
        saveOpened : false,
        images : MMHKPLUS.URL_IMAGES + "kingdom/",

        troop : "TROOP_SCOUTING",
        city : "CITY_SCOUTING",
        region : "REGION_SCOUTING"
    },

    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("SPY_REPORT");
        this.$elem = $("<div>");
        this._setupPanel();

        return this;
    },

    onSetup : function()
    {
        this.$elem.dialog(
            {
                minWidth : 700,
                maxWidth : 700,
                minHeight : 350,
            }
        );
    },
    
    onOpen : function()
    {
        this._createView();
    },

    onClose : function()
    {
        this.currentReport = null;
    },

    _createView : function()
    {
        this.$elem.empty();

        if(!this.currentReport)
            return;

        if(this.currentReport.type == this.options.troop)
        {
            this._createTroopScoutingReport();
        }
        else if(this.currentReport.type == this.options.city)
        {
            this._createCityScoutingReport();
        }
        else if(this.currentReport.type == this.options.region)
        {
            this._createRegionScoutingReport();
        }
    },

    loadReport : function(report)
    {
        this.currentReport = report;
        this._createView();
    },

    _createTroopScoutingReport : function()
    {
        this._createReportHeader(true);
        this._createTroopScoutingCityPart();
        this._createTroopScoutingHeroPart();
    },

    _createCityScoutingReport : function()
    {
        this._createReportHeader(false);
        var content = this.currentReport.contentJSON;

        var $table = $("<table>").addClass("MMHKPLUS_100Width").appendTo(this.$elem);
        var $header = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
        var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
        
        var $tdRessources = $("<td style='width:25%;'>").addClass("center").appendTo($line);
        var $tdTroops = $("<td style='width:25%;'>").addClass("center").appendTo($line);
        var $tdMagic = $("<td style='width:25%;'>").addClass("center").appendTo($line);
        var $tdOther = $("<td style='width:25%;'>").addClass("center").appendTo($line);
        
        var ressources = (hasProperty(content, "cityBuildingResourcesEntityList") ? content.cityBuildingResourcesEntityList : []);
        var troops = (hasProperty(content, "cityBuildingTroopsEntityList") ? content.cityBuildingTroopsEntityList : []);
        var magic = (hasProperty(content, "cityBuildingMagicEntityList") ? content.cityBuildingMagicEntityList : []);
        var other = (hasProperty(content, "cityBuildingMixedEntityList") ? content.cityBuildingMixedEntityList : []);   

        /**
         * Ressources
         */
        $("<td style='width:25%;padding:15px;'>")
            .addClass("center")
            .append(
                $("<img>").attr("src", MMHKPLUS.URL_IMAGES + "spy/ressourcesBuildingIcon.png"))
            .appendTo($header);
        ressources.forEach(function(r)
            {
                $("<p>").html(MMHKPLUS.localizeText(r.name)).appendTo($tdRessources);
            }
        );
        
        /**
         * Troupes
         */
        $("<td style='width:25%;padding:15px;'>")
            .addClass("center")
            .append(
                $("<img>").attr("src", MMHKPLUS.URL_IMAGES + "spy/troopBuildingIcon.png"))
            .appendTo($header);
        troops.forEach(function(t)
            {
                $("<p>").html(MMHKPLUS.localizeText(t.name)).appendTo($tdTroops);
            }
        );
        
        /**
         * Magie
         */
        $("<td style='width:25%;padding:15px;'>")
            .addClass("center")
            .append(
                $("<img>").attr("src", MMHKPLUS.URL_IMAGES + "spy/magicBuildingIcon.png"))
            .appendTo($header);
        magic.forEach(function(m)
            {
                $("<p>").html(MMHKPLUS.localizeText(m.name)).appendTo($tdMagic);
            }
        );
        
        /**
         * Autre
         */
        $("<td style='width:25%;padding:15px;'>")
            .addClass("center")
            .append(
                $("<img>").attr("src", MMHKPLUS.URL_IMAGES + "spy/otherBuildingIcon.png"))
            .appendTo($header);
        other.forEach(function(o)
            {
                $("<p>").html(MMHKPLUS.localizeText(o.name)).appendTo($tdOther);
            }
        );
    },

    _createRegionScoutingReport : function()
    {
        this._createReportHeader(false);
        var content = this.currentReport.contentJSON;

        this.$elem.css('height', '550px');
        
        var $region = $("<div>")
        	.css({'background-repeat' : 'no-repeat', 'background-image' : 'url(' + MMHKPLUS.URL_IMAGES + "spy/background_region.jpg)", height : '405px', width: '660px'})
        	.addClass("MMHKPLUS_AutoCenter")
        	.appendTo(this.$elem);
        
        content.zoneBuildingZoneList.forEach(function(zone)
        	{
        		var relx = zone.x- 3;
    			var rely = zone.y - 3;
    			
    			if(hasProperty(zone, "attachedZoneBuilding")) {
    				var type = -1;
    				switch(zone.attachedZoneBuilding.zoneBuildingEntity.buildingTypeEntityTagName) {
    				case "RECRUITMENT":
    					type = 1;
    					break;
    				default: 
    					type = 0;
    					break;
    				}
    				
    				var $building = MMHKPLUS.getCssSprite("ZoneBuilding", zone.attachedZoneBuilding.zoneBuildingEntityTagName + (type == 1? "_" + zone.attachedZoneBuilding.factionEntityTagName : ""));
    				var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($building, function($container, $tip)
        				{
    						var b = zone.attachedZoneBuilding.zoneBuildingEntity;
        					$("<p>").addClass("MMHKPLUS_CellHeader").html(b.name).appendTo($tip);
        					$("<br>").appendTo($tip);
        					for(var i = 1; i <= 5; i++) {
        						if(hasProperty(b, 'effect' + i)) {
        							$("<p>").addClass("MMHKPLUS_TextCenter").html(b['effect' + i].desc).css('width', '250px').appendTo($tip);
        						}
        					}
        				}
        			);
    			}
    			
    			if(hasProperty(zone, "attachedMine")) {
        			var $building = MMHKPLUS.getCssSprite("Zone_NEUTRAL", zone.attachedMine.mineEntityTagName);
        			var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($building, function($container, $tip)
        				{
        					$("<p>").addClass("MMHKPLUS_CellHeader").html(zone.attachedMine.name).appendTo($tip);
        					$("<br>").appendTo($tip);
        					$("<p>").addClass("MMHKPLUS_TextCenter").html(MMHKPLUS.localize("LEVEL") + " " + zone.attachedMine.upgradeLevel).appendTo($tip);
        					if(hasProperty(zone.attachedMine, 'improveLevel')) {
        						$("<p>").addClass("MMHKPLUS_TextCenter").html(zone.attachedMine.improveLevel + " " + MMHKPLUS.localize("IMPROVEMENTS")).appendTo($tip);
        					}
        					if(hasProperty(zone.attachedMine, "amountProtected")) {
        						$("<p>").addClass("MMHKPLUS_TextCenter").html(MMHKPLUS.localize("PROTECTED") + " : " + zone.attachedMine.amountProtected + "%").appendTo($tip);
        					}
        				}
        			);
    			}
    			
    			if($building) {
    				$building.css(
        				{
        					position: 'absolute',
        					top:  220 - 32*relx + rely*32 + "px",
        					left: 285 + relx*64 + rely*64 + "px"
        				}
        			).appendTo($region);
    			}
    			
        	}
        );
    },

    _createReportHeader : function(isTroopScouting)
    {
        isTroopScouting = isTroopScouting || false;
        var self = this;
        var content = this.currentReport.contentJSON;
            
        var $header = $("<div>").css(
            {
                "border-bottom" : "1px solid #FFFFFF",
                "text-align" : "center",
                "color" : "#FFFFFF",
                "padding-bottom" : "10px"
            }
        ).appendTo(this.$elem);
        var $table = $("<table>").addClass("MMHKPLUS_100Width").appendTo($header);
        var $line = $("<tr>").appendTo($table);
        $("<td>")
            .html(MMHKPLUS.localize("PLAYER") +  " : " + content.targetedPlayerName)
            .css(
                {
                    "font-weight" : "bold",
                    "cursor" : "pointer"
                })
            .click(function()
                {
                    MMHKPLUS.openPlayerFrame(content.targetedPlayerId);
                })
            .appendTo($line);
        if(hasProperty(content, "targetedPlayerAlliance"))
        {
            $("<td>")
                .html(MMHKPLUS.localize("ALLIANCE") + " : " + content.targetedPlayerAlliance)
                .appendTo($line);
        }
        var location = "";
        if(hasProperty(content, "targetedHaltX"))
            location = MMHKPLUS.localize("HALT")
        else if(hasProperty(content, "siegedRegionName"))
            location = content.siegedRegionName;
        else if(content.ScoutingLevelStr.indexOf("<location") != -1)
            location = MMHKPLUS.localize("RUIN");
        else
            location = content.cityName;

        var rX = 1;
        var rY = 1;
        if(hasProperty(content, "targetedHaltX"))
        {
            rX = content.targetedHaltX;
            rY = content.targetedHaltY;
        }
        else if(hasProperty(content, "siegedRegionX"))
        {
            rX = content.siegedRegionX;
            rY = content.siegedRegionY;
        }
        else if(content.ScoutingLevelStr.indexOf("<location") != -1)
        {
            var matches = content.ScoutingLevelStr.match(/<location:(\d+),(\d+)>/);
            rX = matches[1];
            rY = matches[2];
        }
        else
        {
            rX = content.targetedRegionNumber % MMHKPLUS.getElement("Player").get("worldSize");
            rY = (((content.targetedRegionNumber - rX) / MMHKPLUS.getElement("Player").get("worldSize")) + 1);
        }

        $("<td/>")
            .append(
                $("<p>")
                    .html(MMHKPLUS.localize("LOCATION") + " : " + location)
                    .click(function()
                        {
                            var x = Math.round(rX);
                            var y = Math.round(rY);
                            
                            MMHKPLUS.centerOn(x, y);
                        })
                    .css(
                        {
                            "font-weight" : "bold",
                            "cursor" : "pointer"
                        }))
            .appendTo($line);
        if(isTroopScouting)
        {
            $("<td>")
                .append(
                    $("<div/>")
                        .html("Jactari").button()
                        .click(self._openJactariFight))
                .appendTo($line);
        }
        $("<br>").appendTo($header);
        if(hasProperty(content, "scoutingLevel"))
        {
            $("<p>").addClass("center")
                .html(MMHKPLUS.localize("SCOUT_LVL") + " : " + MMHKPLUS.localize("SCOUT_LVL" + content.scoutingLevel))
                .appendTo($header);
        }
        if(hasProperty(this.currentReport, "creationDate"))
        {
            var d = new Date(); d.setTime(this.currentReport.creationDate * 1000);
            $("<p>").addClass("center")
                .html(d.toShortFrenchFormat())
                .appendTo($header);
        }
        $("<p>")
            .append()
            .append(MMHKPLUS.localize("IG_PERMALINK") + " : ")
            .append(
                $("<input readonly>")
                    .css("width", "250px")
                    .val("MMHKPLUS_ScoutPL(" + self.currentReport.hash + "," + removeDiacritics(self.currentReport.contentJSON.targetedPlayerName) + ")")
                    .click(function() { this.select();}))
            .appendTo($header);
    },

    _createTroopScoutingCityPart : function()
    {
        var content = this.currentReport.contentJSON;
        if(hasProperty(content, "cityName"))
        {
            var $city = $("<div/>").css(
                {
                    "border-bottom" : "1px solid #FFFFFF",
                    "min-height" : "105px"
                }
            ).appendTo(this.$elem);
            
            MMHKPLUS.getCssSprite("City_" + content.cityFactionEntityTagName, "Level" + content.cityDisplayLevel).css(
                {
                    "float" : "left",
                    "margin-left" : "150px",
                    "margin-right" : "15px"
                }
            ).appendTo($city);
            var $infos = $("<div>").css(
                {
                    "padding-top" : "15px",
                    "padding-bottom" : "15px",
                    "color" : "#FFFFFF"
                }
            ).appendTo($city);
            var cityStacks = (hasProperty(content, "regionUnitStackList") ? content.regionUnitStackList : []);
            var cityStacksPower = (cityStacks ? formatNumber(this.getPower(cityStacks)) : "?");
            $("<p>")
                .html(content.cityName + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(" + MMHKPLUS.localize("POWER") + " : " + cityStacksPower + ")")
                .css({"font-weight" : "bold"})
                .appendTo($infos);
            $("<p>")
                .html(MMHKPLUS.localize("FORTIFICATION") + " : " + (hasProperty(content, "cityFortificationName") ? MMHKPLUS.localizeText(content.cityFortificationName) : "?"))
                .appendTo($infos);
            if(cityStacks)
            {
                $infos.append(this._createUnitStackContent(cityStacks));
            }
        }
    },

    _createTroopScoutingHeroPart : function()
    {
        var self = this;
        var content = this.currentReport.contentJSON;
        if(hasProperty(content, "heroList"))
        {
            var heroList = content.heroList;
            var div = $("<div/>").css(
                {
                    "margin-top" : "10px"
                }
            ).appendTo(this.$elem);
            var table = $("<table style='border:collapse;'/>").appendTo(div);
            
            heroList.forEach(function(hero)
                {
                    var line = $("<tr/>").appendTo(table);
                    var heroLeft = $("<td style='border-bottom:1px solid #FFFFFF;'/>").css(
                        {
                            "width" : "300px"
                        }
                    ).appendTo(line);
                    var heroRight = $("<td style='border-bottom:1px solid #FFFFFF;'/>").css(
                        {
                            "width" : "380px"
                        }
                    ).appendTo(line);
                    
                    var avatar = MMHKPLUS.getCssSprite("Hero_" + hero.factionEntityTagName, "Hero" + hero.picture).appendTo(heroLeft);
                    avatar.css(
                        {
                            "margin" : "0",
                            "position" : "relative",
                            "top" : "10px",
                            "left" : "10px"
                        }
                    );
                    var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent(avatar, function($container, tip)
                        {
                            $("<p class='center' style='font-weight:bold;'/>").html((hasProperty(hero, "name") ? hero.name : "")+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + MMHKPLUS.localize("LEVEL") + " " + (hasProperty(hero, "_level") ? hero._level : "?")).appendTo(tip);
                            $("<br/>").appendTo(tip);
                            $("<p/>").html(MMHKPLUS.localize("ARMY_POWER") + " : " + (hasProperty(hero, "attachedUnitStackList") ? formatNumber(self.getPower(hero.attachedUnitStackList)) : "0")).appendTo(tip);
                            $("<div/>").css(
                                {
                                    "background-image" : "url(" + self.options.images + "heroAttack_20.png)",
                                    "padding-left" : "30px",
                                    "width" : "20px",
                                    "height" : "20px",
                                    "color" : "#FFFFFF",
                                    "line-height" : "20px",
                                    "margin": "5px",
                                    "background-repeat" : "no-repeat no-repeat"
                                }
                            ).html((hasProperty(hero, "attack") ? hero.attack : "?")).appendTo(tip);
                            $("<div/>").css(
                                {
                                    "background-image" : "url(" + self.options.images + "heroDefense_20.png)",
                                    "padding-left" : "30px",
                                    "width" : "20px",
                                    "height" : "20px",
                                    "color" : "#FFFFFF",
                                    "line-height" : "20px",
                                    "margin": "5px",
                                    "background-repeat" : "no-repeat no-repeat"
                                }
                            ).html((hasProperty(hero, "defense") ? hero.defense : "?")).appendTo(tip);
                            $("<div/>").css(
                                {
                                    "background-image" : "url(" + self.options.images + "heroMagic_20.png)",
                                    "padding-left" : "30px",
                                    "width" : "20px",
                                    "height" : "20px",
                                    "color" : "#FFFFFF",
                                    "line-height" : "20px",
                                    "margin": "5px",
                                    "background-repeat" : "no-repeat no-repeat"
                                }
                            ).html((hasProperty(hero, "magic") ? hero.magic : "?")).appendTo(tip);
                            $container = null;
                            tip = null;
                        }
                    );     
                    
                    $("<p/>").html((hasProperty(hero, "name") ? hero.name : "")+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + MMHKPLUS.localize("LEVEL") + " " + (hasProperty(hero, "_level") ? hero._level : "?")).css(
                        {
                            "position" : "relative",
                            "top" : "-40px",
                            "left" : "72px",
                            "font-weight" : "bold"
                        }
                    ).click(function() { MMHKPLUS.openDisplayable("AllianceHeroes");MMHKPLUS.getElement("AllianceHeroes")._loadHero(self.currentReport.contentJSON.targetedPlayerId,hero.id);}).css("cursor", "pointer").appendTo(heroLeft);
                    
                    $("<p/>").html((hasProperty(hero, "heroTrainingEntityTagName") ? MMHKPLUS.localize(hero.heroTrainingEntityTagName) : "")).css(
                        {
                            "position" : "relative",
                            "top" : "-40px",
                            "left" : "72px",
                        }
                    ).appendTo(heroLeft);
                    
                    var heroUnitStackList = (hasProperty(hero, "attachedUnitStackList") ? hero.attachedUnitStackList : []);

                    var heroClassList = (hasProperty(hero, "heroClassList") ? hero.heroClassList : []);
                    var heroSpellList = (hasProperty(hero, "spellStackList") ? hero.spellStackList : []);
                    var heroArtefactList = (hasProperty(hero, "artefactList") ? hero.artefactList : []);
                    
                    var tableRight = $("<table style='width:360px'/>").appendTo(heroRight);
                    var classSpellLine = $("<tr/>").appendTo(tableRight);
                    var tableClassSpellLine = $("<table style='width:360px'/>").appendTo($("<td/>").appendTo(classSpellLine));
                    var lineTableClassSpellLine = $("<tr/>").appendTo(tableClassSpellLine);
                    var arteLine = $("<tr/>").appendTo(tableRight);
                    
                    var tdClasses = $("<td style='width:175px'/>").appendTo(lineTableClassSpellLine);
                    var tdSpells = $("<td style='width:120px'/>").appendTo(lineTableClassSpellLine);
                    var tdArte = $("<td style='width:295px'/>").appendTo(arteLine);
                    
                    self._createUnitStackContent(heroUnitStackList).appendTo(heroLeft);
                    self._createClassesContent(heroClassList).appendTo(tdClasses);
                    self._createSpellsContent(heroSpellList).appendTo(tdSpells);
                    self._createArtefactsContent(heroArtefactList).appendTo(tdArte);
                }
            );
        }
    },

    _createUnitStackContent : function(army)
    {
        var $div = $("<div/>").css(
            {
                "margin-top" : "10px"
            }
        );
        var $table = $("<table style='width:" + army.length * 40 + "px;'>").appendTo($div);
        var $line = $("<tr/>").appendTo($table);
        army.forEach(function(stack)
            {
                
                var $block = $("<td>").css(
                    {
                        "width" : "40px",
                        "text-align" : "center",
                        "font-size" : "80%"
                    }
                ).append(MMHKPLUS.getCssSprite("UnitStack_" + stack.factionEntityTagName, stack.tier)).appendTo($line);
                $block.append($("<p/>").html(stack.quantity));
                var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($block, function($container, $tip)
                    {
                        MMHKPLUS.getCssSprite("UnitStack_types", stack.unitEntityType).css("float", "left").css("margin-right", "10px").appendTo($tip);
                        $("<p/>").html(MMHKPLUS.localizeUnit(stack.factionEntityTagName, stack.tier)).appendTo($tip);
                        $("<br/>").appendTo($tip);
                        $("<p/>").html(MMHKPLUS.localize("UNIT_POWER") + " : " + formatNumber(stack.unitEntityPower)).appendTo($tip);
                        $("<p/>").html(MMHKPLUS.localize("UNIT_AMOUNT") + " : "  + formatNumber(stack.quantity)).appendTo($tip);
                        $("<br/>").appendTo($tip);
                        $("<p/>").html(MMHKPLUS.localize("STACK_POWER") + " : " + formatNumber(stack.quantity * stack.unitEntityPower)).appendTo($tip);
                        
                        $tip = null;
                        $container = null;
                    }
                );
            }
        );
        return $div;
    },

    _createClassesContent : function(classes)
    {
        var div = $("<div/>").css(
            {
                "margin-top" : "10px",
                "background-image" : "url(" + MMHKPLUS.URL_IMAGES + "spy/background_class.png)",
                "width" : "165px",
                "height" : "52px",
                "background-repeat" : "no-repeat no-repeat"
            }
        );
        
        var i = 0;
        classes.forEach(function(classe)
            {
                var img = MMHKPLUS.getCssSprite("HeroClass", classe.heroClassEntityTagName).css(
                    {
                        "position" : "relative",
                        "top" : (4 - 44*i) + "px",
                        "left" : (5 + 54*i) + "px"
                    }
                );
                img.appendTo(div);
                var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent(img, function($container, tip)
                    {
                        $("<p style='font-weight:bold;'>").addClass("center").html(MMHKPLUS.localize(classe.heroClassEntityTagName)).appendTo(tip);
                        $("<br>").appendTo(tip);
                        $("<p>").html(MMHKPLUS.localize(classe.heroClassEntityTagName + "_DESC")).appendTo(tip);
                    }
                );
                i++;
            }
        );
        return div;
    }, 

    _createSpellsContent : function(spells)
    {
        var div = $("<div/>").css(
            {
                "margin-top" : "10px",
                "background-image" : "url(" + MMHKPLUS.URL_IMAGES + "spy/background_spells.png)",
                "width" : "100px",
                "height" : "48px",
                "background-repeat" : "no-repeat no-repeat"
            }
        );
        
        var i = 0;
        spells.forEach(function(spell)
            {
                var img = MMHKPLUS.getCssSprite('SpellStack_' + spell.attachedSpellEntity.magicSchoolEntityTagName, spell.attachedSpellEntity.tagName).css(
                    {
                        "position" : "relative",
                        "top" : (4 - 40*i) + "px",
                        "left" : (5 + 51*i) + "px"
                    }
                );
                img.appendTo(div);
                var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent(img, function($container, tip)
                    {
                        $("<p style='font-weight:bold;'>").addClass("center").html(MMHKPLUS.localize(spell.spellEntityTagName)).appendTo(tip);
                        $("<p>").addClass("center").html(MMHKPLUS.localize("LEVEL") + " " + spell.attachedSpellEntity.magicSchoolLevel).appendTo(tip);
                        $("<br/>").appendTo(tip);
                        $("<p/>").html(MMHKPLUS.localize(spell.spellEntityTagName + "_DESC")).appendTo(tip);
                    }
                );
                i++;
            }
        );
        return div;
    },
        
    _createArtefactsContent : function(artefacts)
    {
        var div = $("<div/>").css(
            {
                "margin-top" : "10px",
                "background-image" : "url(" + MMHKPLUS.URL_IMAGES + "spy/background_artefacts.png)",
                "width" : "350px",
                "height" : "47px",
                "background-repeat" : "no-repeat no-repeat"
            }
        );
        
        var i = 0;
        var correctY = -1;
        var correctX = 12;
        var positions =
            {
                HEAD : {x : 6, y : 6},
                NECKLACE : {x : 49, y : 6},
                RING : {x : 92, y : 6},
                LEFT_HAND : {x : 135, y : 6},
                CHEST : {x : 178, y : 6},
                RIGHT_HAND : {x : 221, y : 6},
                FEET : {x : 264, y : 6},
                CAPE : {x : 307, y : 6}
            };

        artefacts.forEach(function(artefact)
            {
                var name = "" ;
                if (artefact.artefactEntity.artefactType == MMHKPLUS.HOMMK.ARTEFACT_TYPE_REWARD || artefact.artefactType == MMHKPLUS.HOMMK.ARTEFACT_TYPE_REGION_BUILDING_LOOT) 
                {
                    name = "Artefact_REWARD";
                } else 
                {
                    if (artefact.artefactEntity.artefactType == MMHKPLUS.HOMMK.ARTEFACT_TYPE_HEREDITY) 
                    {
                        name = "Artefact_HEREDITY";
                    } else 
                    {
                        if (artefact.artefactEntity.artefactType == "event" || artefact.artefactSetEntityId != null) 
                        {
                            name = "Artefact_SET";
                        } else 
                        {
                            name = "Artefact_COMMON";
                        }
                    }
                }
                var currentTop = i * 36;
                var img = MMHKPLUS.getCssSprite(name, artefact.artefactEntity.tagName).css(
                    {
                        "position" : "relative",
                        "top" : (positions[artefact.artefactEntity.bodyPart].y + correctY - currentTop) + "px",
                        "left" : (positions[artefact.artefactEntity.bodyPart].x + correctX - 13)+ "px"
                    }
                );
                img.appendTo(div);
                var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent(img, function($container, tip)
                    {
                        $("<p style='font-weight:bold;'>").addClass("center").html(artefact.artefactEntity.name).appendTo(tip);
                        $("<br/>").appendTo(tip);
                        var j = 1;
                        while(hasProperty(artefact.artefactEntity, "effect" + j))
                        {
                            $("<p>").html("- " + artefact.artefactEntity["effect" + j].desc).appendTo(tip);
                            j++;
                        }
                    }
                );
                i++;
            }
        );
        return div;
    },

    _openJactariFight : function()
    {
        var self = MMHKPLUS.getElement("SpyReport");
        var $panel = $("<div>").dialog(
            {
                title : "Jactari",
                modal : true,
                resizable : false,
                width : 350,
                height : 210,
                position : ["center", "center"],
                draggable : false,
                close : function() { $(this).empty(); $(this).remove();}
            }
        );

        var myHeroes = MMHKPLUS.getElement("Player").getHeroes() || [];
        var ennemyHeroes = self.currentReport.contentJSON.heroList || [];
        
        var $content = $("<div>").addClass("center").appendTo($panel);
        
        $("<p style='font-weight:bold;font-size:115%;margin-bottom:10px;'>")
            .addClass("center")
            .html(MMHKPLUS.localize("My_HERO"))
            .appendTo($content);
        var $cbMyHeroes = $("<select>").appendTo($content);
        myHeroes.forEach(function(hero)
            {
                $("<option>")
                    .attr("value", hero.content.id)
                    .html(hero.content.name).appendTo($cbMyHeroes);
            }
        );
        var $cbIsAtt = $("<input>").attr("type", "radio").attr("name", "attdef").attr("checked", true);
        var $cbIsDef = $("<input>").attr("type", "radio").attr("name", "attdef").attr("checked", false);
        $("<span style='padding-left:20px;'/>").append($cbIsAtt).append(MMHKPLUS.localize("ATTACKER")).appendTo($content);
        $("<span style='padding-left:10px;'/>").append($cbIsDef).append(MMHKPLUS.localize("DEFENDER")).appendTo($content);
        
        $("<p style='font-weight:bold;font-size:115%;margin-bottom:10px;margin-top:30px;'>")
            .addClass("center")
            .html(MMHKPLUS.localize("ENNEMY_HERO")).appendTo($content);
        var $cbEnnemyHeroes = $("<select>").appendTo($content);
        ennemyHeroes.forEach(function(hero)
            {
                $("<option>")
                    .attr("value", hero.id)
                    .html(hero.name)
                    .appendTo($cbEnnemyHeroes);
            }
        );
        var $cbCityunits = $("<input>").attr("type", "checkbox").attr("checked", false);
        $("<span style='padding-left:20px;'>")
            .append($cbCityunits)
            .append(MMHKPLUS.localize("ATTACK_CITY"))
            .appendTo($content);
        
        $("<p style='margin-top:15px;'>")
            .append(
                $("<div/>").button()
                .css("padding", "5px")
                .html(MMHKPLUS.localize("FIGHT"))
                .click(function()
                    {
                        var myHeroId = $cbMyHeroes.val();
                        var ennemyHeroId = $cbEnnemyHeroes.val();

                        var myHero = MMHKPLUS.getElement("Player").getHero(myHeroId);
                        
                        if(hasProperty(myHero.content, "heroBonuses"))
                        {
                            var artefacts = myHero.content.heroBonuses.artefacts.local || [];
                            var skills = myHero.content.heroBonuses.skills.local || [];
                            
                            self._openJactariWebsite(self, myHeroId, ennemyHeroId, artefacts, skills, $cbCityunits.is(":checked"), $cbIsAtt.is(":checked"));
                        }
                        else
                        {
                            MMHKPLUS.getElement("Ajax").getHeroFrame(myHeroId, function(json)
                                {
                                    var artefacts = json.d["HeroFrame" + myHeroId].equipedArtefacts || [];
                                    var skills = json.d["HeroFrame" + myHeroId].heroSkillList || [];
                                    
                                    self._openJactariWebsite(self, myHeroId, ennemyHeroId, artefacts, skills, $cbCityunits.is(":checked"), $cbIsAtt.is(":checked"));
                                }
                            );
                        }
                    }))
            .appendTo($content);

        $panel.dialog("open");
    },

    _openJactariWebsite : function(self, heroId, ennemyId, artefacts, skills, vsCity, isAtt)
    {
        var fortif = self.currentReport.contentJSON.cityFortificationTagName || null;
        var heroContent = MMHKPLUS.getElement("Player").getHero(heroId).content;
        if(heroContent.attachedUnitStackList && !isAtt)
        {
            heroContent.attachedUnitStackList.sort(function(a, b)
                {
                    return (b.quantity * b.unitEntityPower) - (a.quantity * a.unitEntityPower);
                }
            );
        }
        heroContent.artefactList = artefacts;
        var myHero =
            {
                hero : heroContent,
                bonus : 
                    {
                        skills : skills,
                        artefacts : artefacts,
                        spells : []
                    }
            };
        myHero.skills = myHero.bonus.skills;
        myHero.hero.attachedUnitStackList = MMHKPLUS.getElement("Player").getHero(heroId).unitStackList.getContent().copy();
        var ennemyHero = self._getHero(self.currentReport.contentJSON.heroList, ennemyId);
        if(!ennemyHero)
        {
            ennemyHero = {};
        }
        
        var regionUSL = (hasProperty(self.currentReport.contentJSON, "defenseUnitStackList") ? self.currentReport.contentJSON.defenseUnitStackList : null);
        var enHeroUSL = (hasProperty(ennemyHero, "attachedUnitStackList") ? ennemyHero.attachedUnitStackList : null);
        var originalStackList = ennemyHero.attachedUnitStackList;
        ennemyHero.attachedUnitStackList0 = (vsCity ? regionUSL : enHeroUSL);
        ennemyHero.attachedUnitStackList = ennemyHero.attachedUnitStackList0;
        var ennBonus = 
            {
                skills : [],
                artefacts : (hasProperty(ennemyHero, "artefactList") ? ennemyHero.artefactList : []),
                spells : []
            };
        ennemyHero.bonus = ennBonus;
        ennemyHero.artefactList = ennemyHero.bonus.artefacts;
        MMHKPLUS.getElement("Ajax").getSpyHeroContent(self.currentReport.contentJSON.targetedPlayerId, ennemyId, function(hero)
        	{
        		if(hero) {
        			ennemyHero.bonus.artefacts = hero.artefactList || [];
                    ennemyHero.bonus.spells = hero.spellStackList || [];
                    ennemyHero.bonus.skills = hero.heroClassList || [];
                    ennemyHero.artefactList = ennemyHero.bonus.artefacts;
                    ennemyHero._level = hero._level || 1;;
                    ennemyHero.heroTrainingEntityTagName = hero.heroTrainingEntityTagName || "";
        		}
        		if(isAtt)
                {
                    MMHKPLUS.getElement("Jactari").permalien(null,myHero,ennemyHero, fortif);
                }
                else
                {
                    MMHKPLUS.getElement("Jactari").permalien(null,ennemyHero, myHero);
                }

                MMHKPLUS.openURL(MMHKPLUS.getElement("Jactari").lastPermalien());
                myHero = null;
                ennemyHero = null;  
        	}
        );
    },

    _getHero : function(list, id)
    {
        var result = null;
        list.forEach(function(h)
            {
                if(parseInt(h.id) == parseInt(id))
                {
                    result = h;
                }
            }
        );
        return result;
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
        //destroy(this.currentReport) ; this.currentReport = null;
    }
});
