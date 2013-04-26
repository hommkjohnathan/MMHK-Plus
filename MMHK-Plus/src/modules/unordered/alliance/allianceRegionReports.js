MMHKPLUS.AllianceRegionReports = MMHKPLUS.ExtendableElement.extend({
    elementType : "AllianceRegionReports",
    
    options : {
        oneDay : 24 * 3600 * 1000,
        twoDays : 2 * 24 * 3600 * 1000,
        fiveDays : 5 * 24 * 3600 * 1000
    },

    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.$elem = $("<div>").addClass("MMHKPLUS_AllianceRegionReports");
        
        return this;
    },

    displayReports : function(data)
    {
        var self = this;
        this.$elem.empty();
        this.$elem.remove();

        if(data && data.length > 0)
        {
            var regionView = MMHKPLUS.HOMMK.worldMap.selectedRegion;
            if(regionView && regionView.content.id == MMHKPLUS.HOMMK.worldMap.selectedRegion.content.id)
            {
                var $box = $("#WorldMap" + MMHKPLUS.getElement("Player").get("worldId") + "PlayerName").parent();
                $box.append(this.$elem);
                $("<br>").appendTo(self.$elem);
                var $list = $("<ul>").appendTo(this.$elem);
                data.forEach(function(r)
                    {
                        var d = new Date(); d.setTime(r.date * 1000);
                        var type = "";
                        if(r.referenceType <= 1)
                            type = "T"
                        if(r.referenceType == 2)
                            type = "C"
                        if(r.referenceType == 3)
                            type = "R"
                        if(r.referenceType == 4)
                            type = "S"
                        var $li = $("<li style='font-size:90%; cursor:pointer;'>")
                            .html("<a>" + d.toShortFrenchFormat() + " (" + type + ")</a>")
                            .click(function()
                                {
                                    MMHKPLUS.getElement("Ajax").getSpyReportContent(r.reportId);
                                })
                            .appendTo(self.$elem);

                        if($.now() - d.getTime() >= self.options.fiveDays)
                            $li.css("color", "red");
                        else if($.now() - d.getTime() >= self.options.oneDay && $.now() - d.getTime() <= self.options.fiveDays)
                            $li.css("color", "orange");
                        else 
                            $li.css("color", "green");
                    }
                );
            }
            destroy(data); 
            data = null;
        }
    },

    openSpyReport : function(data)
    {
        MMHKPLUS.openHiddenDisplayable("SpyReport");
        MMHKPLUS.getElement("SpyReport").loadReport(data);
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
    }
});
