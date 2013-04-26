MMHKPLUS.AttacksSieges = MMHKPLUS.PanelElement.extend({
    elementType : "AttacksSieges",
    attacks : {},
    sieges : {},
    
    options : {
        title : "",
        resizable : true,
        opened : false,
        x : "center",
        y : "center",
        w : 830,
        h : 350,
        savePos : true,
        saveWidth : false,
        saveHeight : true,
        saveOpened : true,
    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("ATTACKS_SIEGES");
        this.$elem = $("<div>");
        this._setupPanel();

        MMHKPLUS.HOMMK.SiegeBreakFrame.prototype.display = injectAfter(MMHKPLUS.HOMMK.SiegeBreakFrame.prototype.display, this._onSiegeFrameOpen);
        MMHKPLUS.HOMMK.Region.prototype.drawInfluence = injectAfter(MMHKPLUS.HOMMK.Region.prototype.drawInfluence, this._onDrawInfluence);

        this._initInformations();
        
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
        this._createView();
        this._updateView();
    },

    _createView : function()
    {
        // $("<p>")
        //     .html(MMHKPLUS.localize("ATTACKS"))
        //     .addClass("MMHKPLUS_TextCenter MMHKPLUS_Title")
        //     .appendTo(this.$elem);

        // $("<table>")
        //     .addClass("MMHKPLUS_Table MMHKPLUS_100Width")
        //     .appendTo(this.$elem);

        // $("<br>").appendTo(this.$elem);

        // $("<p>")
        //     .html(MMHKPLUS.localize("SIEGES"))
        //     .addClass("MMHKPLUS_TextCenter MMHKPLUS_Title")
        //     .appendTo(this.$elem);

        $("<table>")
            .addClass("MMHKPLUS_Table MMHKPLUS_100Width")
            .appendTo(this.$elem);
    },

    _initInformations : function()
    {
        var self = this;
        MMHKPLUS.HOMMK.elementPool.obj.Region.values().forEach(function(r)
            {
                if(r.isSieged())
                    self._addSiege(r);
                if(r.isUnderAttack())
                    self._addAttack(r);
            }
        );
    },

    _onDrawInfluence : function(result)
    {
        if(this.isSieged())
            MMHKPLUS.getElement("AttacksSieges")._addSiege(this);
        if(this.isUnderAttack())
            MMHKPLUS.getElement("AttacksSieges")._addAttack(this);
        MMHKPLUS.getElement("AttacksSieges")._updateView();

        return result;
    },

    _getXYFromCityName : function(name) 
    {
        for ( var k in this.sieges ) 
        {
            if ( this.sieges[k].cityName == name ) 
            {
                return { x: this.sieges[k].x, y: this.sieges[k].y}; 
            } 
        } 
        return null; 
    },

    _onSiegeFrameOpen : function(result)
    {
        var coord = MMHKPLUS.getElement("AttacksSieges")._getXYFromCityName(this.content.siegedCityName);
        if(!coord)
            return;

        MMHKPLUS.getElement("AttacksSieges").sieges[coord.x + "_" + coord.y].endDate = this.content.siegeEndDate;
        MMHKPLUS.getElement("AttacksSieges").sieges[coord.x + "_" + coord.y].attacker = this.content.siegingPlayerName;
        MMHKPLUS.getElement("AttacksSieges").sieges[coord.x + "_" + coord.y].attackerAllianceName = (hasProperty(this.content, "siegingAllianceName") ? this.content.siegingAllianceName : MMHKPLUS.localize("NONE"));
        MMHKPLUS.getElement("AttacksSieges")._updateView();
    
        return result;
    },

    _addSiege : function(region)
    {
        if(!hasProperty(this.sieges, region.content.x + "_" + region.content.y))
            this.sieges[region.content.x + "_" + region.content.y] = 
                {
                    x : region.content.x,
                    y : region.content.y,
                    cityName : region.content.cN,
                    playerName : region.content.pN,
                    allianceName : hasProperty(region.content, "iAN") ? region.content.iAN : MMHKPLUS.localize("NONE"),
                    attacker : "?",
                    attackerAllianceName : "?",
                    endDate : 0
                };
    },

    _addAttack : function(region)
    {
        if(!hasProperty(this.attacks, region.content.x + "_" + region.content.y))
            this.attacks[region.content.x + "_" + region.content.y] = 
                {
                    x : region.content.x,
                    y : region.content.y,
                    cityName : region.content.cN,
                    playerName : region.content.pN,
                    allianceName : hasProperty(region.content, "iAN") ? region.content.iAN : MMHKPLUS.localize("NONE"),
                };
    },

    _updateView : function()
    {
        if(this.options.opened)
        {
            var self = this;
            //var $a = this.$elem.find("table").eq(0);
            var $s = this.$elem.find("table").eq(0);

            // $a.empty(); 
            $s.empty();

            // $("<tr>\
            //     <th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("PLAYER") + "</td>\
            //     <th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("CITY") + "</td>\
            //     <th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("COORDINATES") + "</td>\
            // </tr>").appendTo($s);

            // for(var a in this.attacks)
            // {
            //     $("<tr>")
            //         .addClass("MMHKPLUS_100Width").css("cursor", "pointer")
            //         .append(
            //             $("<td>").addClass("MMHKPLUS_TextCenter")
            //                 .html(this.attacks[a].playerName + " (" + this.attacks[a].allianceName + ")"))
            //         .append(
            //             $("<td>").addClass("MMHKPLUS_TextCenter")
            //                 .html(this.attacks[a].cityName))
            //         .append(
            //             $("<td>").addClass("MMHKPLUS_TextCenter")
            //                 .html("(" + this.attacks[a].x + "," + this.attacks[a].y + ")"))
            //         .click(function() { MMHKPLUS.centerOn(self.attacks[a].x, self.attacks[a].y); })
            //         .appendTo($a);
            // }
            // $a.find("tr:odd").css({backgroundColor:"rgba(0,191,255,0.2)"});

            $("<tr>\
                <th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("PLAYER") + "</td>\
                <th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("CITY") + "</td>\
                <th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("COORDINATES") + "</td>\
                <th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("ATTACKER") + "</td>\
                <th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("END_DATE") + "</td>\
            </tr>").appendTo($s);

            $.each(this.sieges, function(i, e)
                {
                    var d = new Date() ; d.setTime(e.endDate * 1000);
                    $("<tr>").css("cursor", "pointer")
                        .addClass("MMHKPLUS_100Width")
                        .append(
                            $("<td>").addClass("MMHKPLUS_TextCenter")
                                .html(e.playerName + " (" + e.allianceName + ")"))
                        .append(
                            $("<td>").addClass("MMHKPLUS_TextCenter")
                                .html(e.cityName))
                        .append(
                            $("<td>").addClass("MMHKPLUS_TextCenter")
                                .html("(" + e.x + "," + e.y + ")"))
                        .append(
                            $("<td>").addClass("MMHKPLUS_TextCenter")
                                .html(e.attacker + " (" + e.attackerAllianceName + ")"))
                        .append(
                            $("<td>").addClass("MMHKPLUS_TextCenter")
                                .html((e.endDate != 0 ? d.toShortFrenchFormat() : "?")))
                        .click(function() { MMHKPLUS.centerOn(e.x, e.y);})
                        .appendTo($s);
                }
            );
            $s.find("tr:odd").css({backgroundColor:"rgba(0,191,255,0.2)"});
        }
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
        delete this.attacks ; 
        delete this.sieges;
    }
});
