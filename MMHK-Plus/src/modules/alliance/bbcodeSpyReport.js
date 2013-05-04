MMHKPLUS.BBCodeSpyReport = MMHKPLUS.ArmiesPanelElement.extend({
    elementType : "BBCodeSpyReport",
    currentReport : null,
    currentReportBBCode : null,
    
    /*
     * This module extends ArmiesPanelElement in order to access armies related methods
     * 
     * Do not open this panel (will be empty)
     */

    options : {
        title : "",
        resizable : true,
        opened : false,
        x : "center",
        y : "center",
        w : 100,
        h : 40,
        savePos : false,
        saveWidth : false,
        saveHeight : false,
        saveOpened : false,
        images : MMHKPLUS.URL_RESOURCES + "/images/kingdom/",
        imagesScouting : MMHKPLUS.URL_RESOURCES + "/images/bbcode/scouting/",

        troop : "TROOP_SCOUTING",
        city : "CITY_SCOUTING",
        region : "REGION_SCOUTING"
    },

    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.$elem = $("<div>");
        this._setupPanel();

        return this;
    },

    onSetup : function()
    {
    	//Nothing
    },
    
    onOpen : function()
    {
    	MMHKPLUS.alert("Error", "Element <b>" + this.elementType + "</b> should not be opened!");
    },

    onClose : function()
    {
        //Nothing
    },

    _createView : function()
    {
        //Nothing
    },

    loadReport : function(report)
    {
        this.currentReport = report;
        this.currentReportBBCode = "";
        
        if(!this.currentReport)
            return;
        
        this.currentReportBBCode += "[table width=600 border=0 cellspacing=0 cellpadding=0 bgcolor=#fff2e5]";

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
        
        this.currentReportBBCode += "[/table]";
        
        MMHKPLUS.alertTextArea("BBCode", this.currentReportBBCode);
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
        var ressources = (hasProperty(content, "cityBuildingResourcesEntityList") ? content.cityBuildingResourcesEntityList : []);
        var troops = (hasProperty(content, "cityBuildingTroopsEntityList") ? content.cityBuildingTroopsEntityList : []);
        var magic = (hasProperty(content, "cityBuildingMagicEntityList") ? content.cityBuildingMagicEntityList : []);
        var other = (hasProperty(content, "cityBuildingMixedEntityList") ? content.cityBuildingMixedEntityList : []);   
        
        this.currentReportBBCode += "[tr width=600 bgcolor=#CAB9A4 height=20 ]";
        this.currentReportBBCode += "[td width=600 colspan=9][center][color=black]";
        this.currentReportBBCode += "[size=12][b]" + MMHKPLUS.localize("RESOURCES") + "[/b][/size]";
        this.currentReportBBCode += "[/color][/center][/td]";
		var resources = "";
        ressources.forEach(function(r)
            {
        		resources += MMHKPLUS.localizeText(r.name) + "\n";
            }
        );
        this.currentReportBBCode += "[/tr]";
		this.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
		this.currentReportBBCode += "[td width=200 colspan=9][center][color=black]" + resources + "[/color][/center][/td]";
		this.currentReportBBCode += "[/tr]";
		
		this.currentReportBBCode += "[tr width=600 bgcolor=#CAB9A4 height=20 ]";
        this.currentReportBBCode += "[td width=600 colspan=9][center][color=black]";
        this.currentReportBBCode += "[size=12][b]" + MMHKPLUS.localize("TROOPS") + "[/b][/size]";
        this.currentReportBBCode += "[/color][/center][/td]";
		var troopss = "";
		troops.forEach(function(t)
            {
        		troopss += MMHKPLUS.localizeText(t.name) + "\n";
            }
        );
        this.currentReportBBCode += "[/tr]";
		this.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
		this.currentReportBBCode += "[td width=200 colspan=9][center][color=black]" + troopss + "[/color][/center][/td]";
		this.currentReportBBCode += "[/tr]";
		
		this.currentReportBBCode += "[tr width=600 bgcolor=#CAB9A4 height=20 ]";
        this.currentReportBBCode += "[td width=600 colspan=9][center][color=black]";
        this.currentReportBBCode += "[size=12][b]" + MMHKPLUS.localize("MAGIC_BBCODE") + "[/b][/size]";
        this.currentReportBBCode += "[/color][/center][/td]";
		var magics = "";
		magic.forEach(function(m)
            {
				magics += MMHKPLUS.localizeText(m.name) + "\n";
            }
        );
        this.currentReportBBCode += "[/tr]";
		this.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
		this.currentReportBBCode += "[td width=200 colspan=9][center][color=black]" + magics + "[/color][/center][/td]";
		this.currentReportBBCode += "[/tr]";
        
		this.currentReportBBCode += "[tr width=600 bgcolor=#CAB9A4 height=20 ]";
        this.currentReportBBCode += "[td width=600 colspan=9][center][color=black]";
        this.currentReportBBCode += "[size=12][b]" + MMHKPLUS.localize("OTHER") + "[/b][/size]";
        this.currentReportBBCode += "[/color][/center][/td]";
		var others = "";
		other.forEach(function(o)
            {
				others += MMHKPLUS.localizeText(o.name) + "\n";
            }
        );
        this.currentReportBBCode += "[/tr]";
		this.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
		this.currentReportBBCode += "[td width=200 colspan=9][center][color=black]" + others + "[/color][/center][/td]";
		this.currentReportBBCode += "[/tr]";
    },

    _createRegionScoutingReport : function()
    {
    	var self = this;
        this._createReportHeader(false);
        var content = this.currentReport.contentJSON;
        
        console.log(content);
        var mines = (hasProperty(content, "minesList") ? content.minesList : []);
        
        mines.forEach(function(m)
            {
        		var text = "";
	        	if(hasProperty(m, "name"))
	                text += MMHKPLUS.localizeText(m.name);
	            if(hasProperty(m, "upgradeLevel"))
	            	text += " " + MMHKPLUS.localize("LEVEL").toLowerCase() + " " + m.upgradeLevel;
	            if(hasProperty(m, "improveLevel"))
	            	text += " (" + m.improveLevel + " " + MMHKPLUS.localize("IMPROVEMENTS") + ")";
	            if(hasProperty(m, "amountProtected"))
	            	text += " - " +MMHKPLUS.localize("PROTECTED") + " : " + m.amountProtected + "%";
	            
        		self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
        		self.currentReportBBCode += "[td width=600 colspan=9][center][color=black]" + text + "[/color][/center][/td]";
        		self.currentReportBBCode += "[/tr]";
            }
        );
    },

    _createReportHeader : function(isTroopScouting)
    {
        isTroopScouting = isTroopScouting || false;
        var self = this;
        var content = this.currentReport.contentJSON;
        
        /*
         * Report header (background = orange banner)
         * Scouting level + report date
         */
        this.currentReportBBCode += "[tr width=600 background=" + self.options.imagesScouting + "header.png" + " ]";
        var headerContent = "";
        if(hasProperty(content, "scoutingLevel"))
        {
        	headerContent += MMHKPLUS.localize("SCOUT_LVL") + " : " + MMHKPLUS.localize("SCOUT_LVL" + content.scoutingLevel) + "\n";
        }
        if(hasProperty(this.currentReport, "creationDate"))
        {
            var d = new Date(); d.setTime(this.currentReport.creationDate * 1000);
            headerContent += d.toShortFrenchFormat()
            
        }
        this.currentReportBBCode += "[td width=600 colspan=9 height=72][color=black][center][size=20][b]" +  headerContent+ "[/b][/size][/center][/color][/td]";
        this.currentReportBBCode += "[/tr]";
        
        /*
         * Player name, Alliance name and location
         */
        this.currentReportBBCode += "[tr width=600]";
        this.currentReportBBCode += "[td width=200 colspan=3][color=black][center][b]" + MMHKPLUS.localize("PLAYER") +  " : " + content.targetedPlayerName + "[/b][/center][/color][/td]";
        if(hasProperty(content, "targetedPlayerAlliance"))
        {
        	this.currentReportBBCode += "[td width=200 colspan=3][color=black][center][b][i]" + MMHKPLUS.localize("ALLIANCE") + " : " + content.targetedPlayerAlliance + "[/i][/b][/center][/color][/td]";
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
        this.currentReportBBCode += "[td width=200 colspan=3][color=black][center][b]" + MMHKPLUS.localize("LOCATION") + " : " + location + " (" + rX  + "," + rY + ")[/b][/center][/color][/td]";
        this.currentReportBBCode += "[/tr]";
    },

    _createTroopScoutingCityPart : function()
    {
        var content = this.currentReport.contentJSON;
        if(hasProperty(content, "cityName"))
        {
            var cityStacks = (hasProperty(content, "regionUnitStackList") ? content.regionUnitStackList : []);
            var cityStacksPower = (cityStacks ? formatNumber(this.getPower(cityStacks)) : "?");
            this.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
        	this.currentReportBBCode += "[td width=400 colspan=6][color=black][center][b]" + content.cityName + "      (" + MMHKPLUS.localize("POWER") + " : " + cityStacksPower + ")" + "[/b]  -  [size=12][url=" + this._getJactariPermalink(this, -1, [], [], false, true) + "][color=blue]Jactari[/color][/url][/size][/center][/color][/td]";
        	this.currentReportBBCode += "[td width=200 colspan=6][color=black][center][b]" + MMHKPLUS.localize("FORTIFICATION") + " : " + (hasProperty(content, "cityFortificationName") ? MMHKPLUS.localizeText(content.cityFortificationName) : "?") + "[/b][/center][/color][/td]";
        	this.currentReportBBCode += "[/tr]";
        	if(cityStacks)
            {
        		this.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
        		this.currentReportBBCode += "[td width=" + ((600 - (cityStacks.length * 80))/2) + " colspan=1][/td]";
        		this.currentReportBBCode += "[td width=" + (cityStacks.length * 80) + " colspan=7]";
        		this.currentReportBBCode += this._createUnitStackContent(cityStacks);
				this.currentReportBBCode += "[/td]";
				this.currentReportBBCode += "[td width=" + ((600 - (cityStacks.length * 80))/2) + " colspan=1][/td]";
				this.currentReportBBCode += "[/tr]";
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
            heroList.forEach(function(hero)
                {
	            	var heroUnitStackList = (hasProperty(hero, "attachedUnitStackList") ? hero.attachedUnitStackList : []);
	                var heroClassList = (hasProperty(hero, "heroClassList") ? hero.heroClassList : []);
	                var heroSpellList = (hasProperty(hero, "spellStackList") ? hero.spellStackList : []);
	                var heroArtefactList = (hasProperty(hero, "artefactList") ? hero.artefactList : []);
	                
	            	self.currentReportBBCode += "[tr width=600 bgcolor=#CAB9A4 height=35 ]";
	            	self.currentReportBBCode += "[td width=600 colspan=9][center][color=black]";
	            	self.currentReportBBCode += "[size=16]" + (hasProperty(hero, "name") ? hero.name : "") + "[/size]   -   ";
	            	self.currentReportBBCode += "[size=12]" + (hasProperty(hero, "heroTrainingEntityTagName") ? MMHKPLUS.localize(hero.heroTrainingEntityTagName) : "") + "[/size]   -   ";
            		self.currentReportBBCode += "[size=12]" + MMHKPLUS.localize("LEVEL") + " " + (hasProperty(hero, "_level") ? hero._level : "?") + "[/size]\n";
            		self.currentReportBBCode += "[size=12][url=" + self._getJactariPermalink(self, hero.id, heroArtefactList, heroSpellList, true, false) + "][color=blue]Jactari[/color][/url][/size]";
            		self.currentReportBBCode += "[/color][/center][/td]";
            		self.currentReportBBCode += "[/tr]";
            		
            		self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
            		self.currentReportBBCode += "[td width=200 colspan=3][center][color=black]" + MMHKPLUS.localize("ATTACK_BBCODE") + " " + (hasProperty(hero, "attack") ? hero.attack : "?") + "[/color][/center][/td]";
            		self.currentReportBBCode += "[td width=200 colspan=3][center][color=black]" + MMHKPLUS.localize("DEFENSE_BBCODE") + " " + (hasProperty(hero, "defense") ? hero.defense : "?") + "[/color][/center][/td]";
            		self.currentReportBBCode += "[td width=200 colspan=3][center][color=black]" + MMHKPLUS.localize("MAGIC_BBCODE") + " " + (hasProperty(hero, "magic") ? hero.magic : "?") + "[/color][/center][/td]";
            		self.currentReportBBCode += "[/tr]";
            		
            		self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
            		self.currentReportBBCode += "[td width=600 colspan=9 height=35][center][b][color=black]" + MMHKPLUS.localize("ARMY_POWER") + " : " + (hasProperty(hero, "attachedUnitStackList") ? formatNumber(self.getPower(hero.attachedUnitStackList)) : "0") + "[/color][/b][/center][/td]";
            		self.currentReportBBCode += "[/tr]";
            		
                    self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 height=35]";
                    self.currentReportBBCode += "[td width=" + ((600 - (heroUnitStackList.length * 80))/2) + " colspan=1][/td]";
                    self.currentReportBBCode += "[td width=" + (heroUnitStackList.length * 80) + " colspan=7]";
            		self.currentReportBBCode += self._createUnitStackContent(heroUnitStackList);
            		self.currentReportBBCode += "[/td]";
            		self.currentReportBBCode += "[td width=" + ((600 - (heroUnitStackList.length * 80))/2) + " colspan=1][/td]";
            		self.currentReportBBCode += "[/tr]";
            		
            		self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 height=35][td width=600 colspan=9][center][b][color=black]" + MMHKPLUS.localize("CLASSES")+ "[/color][/b][/center][/td][/tr]";
            		self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
            		self.currentReportBBCode += "[td width=600 colspan=9][center][color=black]" + self._createClassesContent(heroClassList) + "[/color][/center][/td]";
            		self.currentReportBBCode += "[/tr]";
            		
            		self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 height=35][td width=600 colspan=9][center][b][color=black]" + MMHKPLUS.localize("SPELLS")+ "[/color][/b][/center][/td][/tr]";
            		self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
            		self.currentReportBBCode += "[td width=600 colspan=9][center][color=black]" + self._createSpellsContent(heroSpellList) + "[/color][/center][/td]";
            		self.currentReportBBCode += "[/tr]";
            		
            		self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 height=35][td width=600 colspan=9][center][b][color=black]" + MMHKPLUS.localize("ARTIFACTS")+ "[/color][/b][/center][/td][/tr]";
            		self.currentReportBBCode += "[tr width=600 bgcolor=#e0ceb6 ]";
            		self.currentReportBBCode += "[td width=600 colspan=9][center][color=black]" + self._createArtefactsContent(heroArtefactList) + "[/color][/center][/td]";
            		self.currentReportBBCode += "[/tr]";
                }
            );
        }
    },

    _createUnitStackContent : function(army)
    {
    	var result = "";
    	result += "[table width=" + army.length * 80 + "]";
        army.forEach(function(stack)
            {
                result += "[td width=80][size=10][center][color=black]";
                result += MMHKPLUS.localizeUnit(stack.factionEntityTagName, stack.tier) + "\n";
                result += formatNumber(stack.quantity) + "\n";
                result += formatNumber(stack.quantity * stack.unitEntityPower);
                result += "[/color][/center][/size][/td]";
            }
        );
        result += "[/table]";
        return result;
    },

    _createClassesContent : function(classes)
    {
        var result = "";
        classes.forEach(function(classe, index)
            {
        		result += MMHKPLUS.localize(classe.heroClassEntityTagName) + (index != (classes.length - 1) ? "   -   " : "");
            }
        );
        return result;
    }, 

    _createSpellsContent : function(spells)
    {
    	var result = "";
        spells.forEach(function(spell, index)
            {
                result += MMHKPLUS.localize(spell.spellEntityTagName) + (index != (spells.length - 1) ? "   -   " : "");
            }
        );
        return result;
    },
        
    _createArtefactsContent : function(artefacts)
    {
    	var result = "";
        artefacts.forEach(function(artefact, index)
            {
                result += artefact.artefactEntity.name + "\n";
            }
        );
        return result;
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
    
    _getJactariPermalink : function(self, ennemyId, artefacts, skills, isAtt, vsCity)
    {
        var fortif = self.currentReport.contentJSON.cityFortificationTagName || null;
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
        if(!isAtt)
        {
            MMHKPLUS.getElement("Jactari").permalien(null,{},ennemyHero, fortif);
        }
        else
        {
            MMHKPLUS.getElement("Jactari").permalien(null,ennemyHero, {});
        }
        
        var permalink = MMHKPLUS.getElement("Jactari").lastPermalien();
        ennemyHero = null;  
        return permalink;
    },

    unload : function()
    {
    	this.currentReport = null;
    	this.currentReportBBCode = null;
        MMHKPLUS.resetElement(this.$elem);
    }
});
