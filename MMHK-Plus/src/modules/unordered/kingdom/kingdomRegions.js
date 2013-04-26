MMHKPLUS.KingdomRegions = MMHKPLUS.PanelElement.extend({
    elementType : "KingdomRegions",
    regions : [],
    
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
        this.options.title = MMHKPLUS.localize("REGIONS");
        this.$elem = $("<div>");
        this._setupPanel();
        
        return this;
    },
    
    onSetup : function()
    {
        this.$elem.dialog(
            {
                minWidth : 500,
                minHeight : 170
            }
        );
    },
    
    onOpen : function()
    {
        this._createView();
    },

    onClose : function()
    {
        this.regions = null;
        this.regions = [];
    },
    
    _createView : function()
    {
        var self = this;
        var params = $.map(MMHKPLUS.getElement("Player").getCities(), function(elem, i) { return [[elem.content.id]] ; });
        this.setProgressContent(this, MMHKPLUS.getElement("Ajax").getRegionMap, params, self._pushRegion, self._createViewContent, self._abort);
    },

    _pushRegion : function(json)
    {
        var key = Object.keys(json.d)[0];
        this.regions.push(
            {
                id : json.d[key].id || -1,
                zones : json.d[key].attachedZoneList || []
            }
        );
    },

    _createViewContent : function()
    {
        var self = this;
        var $table = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(this.$elem);
        $("<tr>\
                <th class='MMHKPLUS_CellHeader' style='width:20%;'>" + MMHKPLUS.localize("CITY") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:20%;'>" + MMHKPLUS.localize("MINES") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:20%;'>" + MMHKPLUS.localize("RESEARCH_BUILDINGS") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:20%;'>" + MMHKPLUS.localize("RECRUITMENT") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:20%;'>" + MMHKPLUS.localize("OTHER") + "</th>\
            </tr>"
        ).appendTo($table);

        this.regions.sort(function(a, b) { return MMHKPLUS.getElement("Player").getCity(a.id).content.captureDate - MMHKPLUS.getElement("Player").getCity(b.id).content.captureDate;});
        this.regions.forEach(function(c)
            {
                var city = MMHKPLUS.getElement("Player").getCity(c.id);
                var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);

                $("<td style='width:20%;'>").addClass("MMHKPLUS_Cell")
                        .append(
                            MMHKPLUS.getCssSprite("City_" + city.content.factionEntityTagName, "Level" + city.content.displayLevel).addClass("MMHKPLUS_AutoCenter"))
                        .append(
                            $("<p style='margin-bottom:10px;'>").addClass("MMHKPLUS_TextCenter").html(city.content.cityName))
                        .appendTo($line);

                var $tdMines = $("<td style='width:20%;'>").addClass("MMHKPLUS_Cell").appendTo($line);
                var $tdResearch = $("<td style='width:20%;'>").addClass("MMHKPLUS_Cell").appendTo($line);
                var $tdRecruit = $("<td style='width:20%;'>").addClass("MMHKPLUS_Cell").appendTo($line);
                var $tdOther = $("<td style='width:20%;'>").addClass("MMHKPLUS_Cell").appendTo($line);

                self._getMines(c.zones).forEach(function(m)
                    {
                        $tdMines.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(m.name + " " + MMHKPLUS.localize("LEVEL_SHORT") + " " + m.upgradeLevel
                                    + " (" + MMHKPLUS.localize("IMPROVE_SHORT") + " " + m.improveLevel + ")"));
                    }
                );

                self._getResearchBuildings(c.zones).forEach(function(m)
                    {
                        $tdResearch.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(m.zoneBuildingEntityName));
                    }
                );

                self._getRecruitmentBuildings(c.zones).forEach(function(m)
                    {
                        $tdRecruit.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(m.zoneBuildingEntityName));
                    }
                );

                $tdOther.append(self._getFields(c.zones));
                $tdOther.append(self._getStorehouses(c.zones));
                self._getOthers(c.zones).forEach(function(m)
                    {
                        $tdOther.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(m.zoneBuildingEntityName));
                    }
                );
            }
        );
    },

    _getMines : function(zones)
    {
        var result = [];
        zones.forEach(function(z)
            {
                if(hasProperty(z, "attachedMine"))
                    result.push(z.attachedMine);
            }
        );
        return result;
    },

    _getResearchBuildings : function(zones)
    {
        var result = [];
        zones.forEach(function(z)
            {
                if(hasProperty(z, "attachedZoneBuilding") && z.attachedZoneBuilding.zoneBuildingEntityTagName.indexOf("RESEARCH_BUILDING") != -1)
                    result.push(z.attachedZoneBuilding);
            }
        );
        return result;
    },

    _getRecruitmentBuildings : function(zones)
    {
        var result = [];
        zones.forEach(function(z)
            {
                if(hasProperty(z, "attachedZoneBuilding") && z.attachedZoneBuilding.zoneBuildingEntityTagName.indexOf("RECRUITMENT") != -1)
                    result.push(z.attachedZoneBuilding);
            }
        );
        return result;
    },

    _getFields : function(zones)
    {
        var count = 0;
        zones.forEach(function(z)
            {
                if(hasProperty(z, "attachedZoneBuilding") && z.attachedZoneBuilding.zoneBuildingEntityTagName == "FIELDS")
                    count++;
            }
        );
        return $("<p>").addClass("MMHKPLUS_TextCenter").html(count + " " + MMHKPLUS.localize("FIELDS"));
    },

    _getStorehouses : function(zones)
    {
        var count = 0;
        zones.forEach(function(z)
            {
                if(hasProperty(z, "attachedZoneBuilding") && z.attachedZoneBuilding.zoneBuildingEntityTagName == "STOREHOUSE")
                    count++;
            }
        );
        return $("<p>").addClass("MMHKPLUS_TextCenter").html(count + " " + MMHKPLUS.localize("STOREHOUSES"));
    },

    _getOthers : function(zones)
    {
        var result = [];
        zones.forEach(function(z)
            {
                if(hasProperty(z, "attachedZoneBuilding") && z.attachedZoneBuilding.zoneBuildingEntityTagName.indexOf("RECRUITMENT") == -1
                    && z.attachedZoneBuilding.zoneBuildingEntityTagName.indexOf("RESEARCH_BUILDING") == -1
                    && z.attachedZoneBuilding.zoneBuildingEntityTagName != "FIELDS"
                    && z.attachedZoneBuilding.zoneBuildingEntityTagName != "STOREHOUSE")
                    result.push(z.attachedZoneBuilding);
            }
        );
        return result;
    },

    _abort : function()
    {
        this.regions = null;
        this.regions = [];
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
        destroy(this.regions); this.regions = null;
    }
});
