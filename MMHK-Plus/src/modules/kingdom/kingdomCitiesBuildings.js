MMHKPLUS.KingdomCitiesBuildings = MMHKPLUS.PanelElement.extend({
    elementType : "KingdomCitiesBuildings",
    buildings : [],
    
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
        this.options.title = MMHKPLUS.localize("CITIES_BUILDINGS");
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
        this.buildings = null;
        this.buildings = [];
    },
    
    _createView : function()
    {
        var self = this;
        var params = $.map(MMHKPLUS.getElement("Player").getCities(), function(elem, i) { return [[elem.content.id]] ; });
        this.setProgressContent(this, MMHKPLUS.getElement("Ajax").getCityBuildings, params, self._pushCityBuilding, self._createViewContent, self._abort);
    },

    _pushCityBuilding : function(json)
    {
        var key = Object.keys(json.d)[0];
        this.buildings.push(
            {
                id : json.d[key].id || -1,
                buildings : json.d[key].builtCityBuildingEntityList || []
            }
        );
    },

    _createViewContent : function()
    {
        var self = this;
        var $table = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(this.$elem);
        $("<tr>\
                <th class='MMHKPLUS_CellHeader' style='width:17%;'>" + MMHKPLUS.localize("CITY") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:17%;'>" + MMHKPLUS.localize("SUPPORT") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:17%;'>" + MMHKPLUS.localize("RECRUITMENT") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:17%;'>" + MMHKPLUS.localize("DEFENSE") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:17%;'>" + MMHKPLUS.localize("MAGICAL") + "</th>\
                <th class='MMHKPLUS_CellHeader' style='width:17%;'>" + MMHKPLUS.localize("OTHER") + "</th>\
            </tr>"
        ).appendTo($table);

        this.buildings.sort(function(a, b) { return MMHKPLUS.getElement("Player").getCity(a.id).content.captureDate - MMHKPLUS.getElement("Player").getCity(b.id).content.captureDate;});
        this.buildings.forEach(function(c)
            {
                var city = MMHKPLUS.getElement("Player").getCity(c.id);
                var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);

                $("<td style='width:17%;'>").addClass("MMHKPLUS_Cell")
                        .append(
                            MMHKPLUS.getCssSprite("City_" + city.content.factionEntityTagName, "Level" + city.content.displayLevel).addClass("MMHKPLUS_AutoCenter"))
                        .append(
                            $("<p style='margin-bottom:10px;'>").addClass("MMHKPLUS_TextCenter").html(city.content.cityName))
                        .appendTo($line);

                var $tdSupport = $("<td style='width:17%;'>").addClass("MMHKPLUS_Cell").appendTo($line);
                var $tdRecruit = $("<td style='width:17%;'>").addClass("MMHKPLUS_Cell").appendTo($line);
                var $tdDefense = $("<td style='width:17%;'>").addClass("MMHKPLUS_Cell").appendTo($line);
                var $tdMagical = $("<td style='width:17%;'>").addClass("MMHKPLUS_Cell").appendTo($line);
                var $tdOther = $("<td style='width:17%;'>").addClass("MMHKPLUS_Cell").appendTo($line);

                self._getBuildings(c.buildings, "HALL").forEach(function(b)
                    {
                        $tdSupport.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(b.name));
                    }
                );
                self._getBuildings(c.buildings, "SUPPORT").forEach(function(b)
                    {
                        $tdSupport.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(b.name));
                    }
                );
                self._getBuildings(c.buildings, "RECRUITMENT").forEach(function(b)
                    {
                        $tdRecruit.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(b.name));
                    }
                );
                self._getBuildings(c.buildings, "DEFENSE").forEach(function(b)
                    {
                        $tdDefense.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(b.name));
                    }
                );
                self._getBuildings(c.buildings, "MAGICAL").forEach(function(b)
                    {
                        $tdMagical.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(b.name));
                    }
                );
                self._getOtherBuildings(c.buildings).forEach(function(b)
                    {
                        $tdOther.append(
                            $("<p>")
                                .addClass("MMHKPLUS_TextCenter")
                                .html(b.name));
                    }
                );
            }
        );
    },

    _getBuildings : function(buildings, type)
    {
        var result = [];
        buildings.forEach(function(b)
            {
                if(b.buildingTypeEntityTagName == type)
                    result.push(b);
            }
        );
        return result;
    },

    _getOtherBuildings : function(buildings)
    {
        var result = [];
        buildings.forEach(function(b)
            {
                if(b.buildingTypeEntityTagName != "HALL" && b.buildingTypeEntityTagName != "SUPPORT" && b.buildingTypeEntityTagName != "RECRUITMENT" 
                    && b.buildingTypeEntityTagName != "DEFENSE" && b.buildingTypeEntityTagName != "MAGICAL")
                    result.push(b);
            }
        );
        return result;
    },

    _abort : function()
    {
        this.buildings = null;
        this.buildings = [];
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
        destroy(this.buildings); this.buildings = null;
    }
});
