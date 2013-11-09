MMHKPLUS.AllianceSpys = MMHKPLUS.PanelElement.extend({
    elementType : "AllianceSpys",
    currentPage : 1,
    $btnNext : null,
    $btnPrevious : null,
    $btnBegin : null,
    
    options : {
        title : "",
        resizable : false,
        opened : false,
        x : "center",
        y : "center",
        w : 820,
        h : 540,
        savePos : true,
        saveWidth : false,
        saveHeight : false,
        saveOpened : true
    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("ALLIANCE_SPYS");
        this.$elem = $("<div>");
        this._setupPanel();
        
        return this;
    },
    
    onOpen : function()
    {
        this._createView();
        this._getAlliances();
    },

    onClose : function()
    {
        this.$btnNext = null;
        this.$btnPrevious = null;
        this.$btnBegin = null;
    },

    _createView : function()
    {
        var self = this;
        $("<div>").addClass("MMHKPLUS_TextCenter")
            .append(
                $("<label>")
                    .html(MMHKPLUS.localize("ALLIANCE") + " : "))
            .append(
                $("<select>")
                    .css("width", "230px")
                    .change(function()
                        {
                            self._getPlayers();
                        }))
            .append("&nbsp;&nbsp;&nbsp;&nbsp;")
            .append(
                $("<label>")
                    .html(MMHKPLUS.localize("PLAYER") + " : "))
            .append(
                $("<select>")
                    .css("width", "150px"))
            .append("<br>")
            .append(
                $("<label>")
                    .html(MMHKPLUS.localize("LOCATION") + " : "))
            .append(
                $("<input>")
                    .css("marginTop", "10px")
                    .css("width", "90px")
                    .attr("maxlength", 25))
            .append("&nbsp;&nbsp;&nbsp;&nbsp;")
            .append(
                $("<label>")
                    .html("X : "))
            .append(
                $("<input>")
                    .css("width", "40px")
                    .attr("maxlength", 3))
            .append("&nbsp;&nbsp;&nbsp;&nbsp;")
            .append(
                $("<label>")
                    .html("Y : "))
            .append(
                $("<input>")
                    .css("width", "40px")
                    .attr("maxlength", 3))
            .append("&nbsp;&nbsp;&nbsp;&nbsp;")
            .append(
                $("<div>")
                    .button()
                    .html(MMHKPLUS.localize("REFRESH"))
                    .css("padding", "5px")
                    .click(function()
                        {
                            self.currentPage = 1;
                            self._reloadContent();
                        }))
            .append("&nbsp;&nbsp;&nbsp;&nbsp;")
            .append(
                $("<div>")
                    .button()
                    .html(MMHKPLUS.localize("CLEAN"))
                    .css("padding", "5px")
                    .click(function()
                        {
                            self.$elem.find("select").empty();
                            self.$elem.find("input").val("");
                            self._getAlliances();
                            self._reloadContent();
                        }))
            .appendTo(this.$elem);

            $("<br>").appendTo(this.$elem);

            $("<div>").addClass("MMHKPLUS_TextCenter")
                .append(
                    self.$btnBegin = $("<div>").addClass("MMHKPLUS_Previous")
                        .button().button("disable")
                        .css("padding", "5px")
                        .html(MMHKPLUS.localize("BEGIN"))
                        .click(function()
                            {
                                self.currentPage = 1; 
                                self._reloadContent();
                            }))
                .append("&nbsp;&nbsp;&nbsp;&nbsp;")
                .append(
                    self.$btnPrevious = $("<div>").addClass("MMHKPLUS_Previous")
                        .button().button("disable")
                        .css("padding", "5px")
                        .html(MMHKPLUS.localize("PREVIOUS"))
                        .click(function()
                            {
                                self.currentPage--; 
                                self._reloadContent();
                            }))
                .append("&nbsp;&nbsp;&nbsp;&nbsp;")
                .append(
                    self.$btnNext = $("<div>").addClass("MMHKPLUS_Next")
                        .button().button("disable")
                        .css("padding", "5px")
                        .html(MMHKPLUS.localize("NEXT"))
                        .click(function()
                            {
                                self.currentPage++; 
                                self._reloadContent();
                            }))
                .appendTo(this.$elem);

            $("<br>").appendTo(this.$elem);
            
            $("<table>")
                .addClass("MMHKPLUS_100Width MMHKPLUS_Table")
                .appendTo(this.$elem);

            this._reloadContent();
    },

    _reloadContent : function()
    {
        var $table = this.$elem.find("table");
        $table.empty();
        this.$btnPrevious.button("disable")
        this.$btnNext.button("disable")
        this.$btnBegin.button("disable");

        var filterAlliance = this.$elem.find("select").eq(0).val() || -2;
        var filterPlayer = this.$elem.find("select").eq(1).val() || -2;
        var filterLocation = this.$elem.find("input").eq(0).val() || ".*";
        var filterX = parseInt(this.$elem.find("input").eq(1).val()) || -2;
        var filterY = parseInt(this.$elem.find("input").eq(2).val()) || -2;

        if(filterLocation != ".*") {
        	if(filterLocation.toLowerCase() == MMHKPLUS.localize("HALT").toLowerCase()) {
        		filterLocation = "HALT";
        	}
        	else if(filterLocation.toLowerCase() == MMHKPLUS.localize("RUIN").toLowerCase()) {
        		filterLocation = "RUIN";
        	}
        	else if(filterLocation.toLowerCase() == MMHKPLUS.localize("SIEGE").toLowerCase()) {
        		filterLocation = "SIEGE";
        	}
        	else {
        		// city
        		filterLocation = ".*" + filterLocation + ".*";
        	}
        }

        MMHKPLUS.getElement("Ajax").getAllianceSpyReports(filterAlliance, filterPlayer, filterLocation, filterX, filterY, this.currentPage, this._setContent);
    },

    _setContent : function(data)
    {
    	var self = MMHKPLUS.getElement("AllianceSpys");
        var $table = self.$elem.find("table");
        var reports = data.reports;
        var count = data.count;
        
        $("<tr>").addClass("MMHKPLUS_100Width")
        	.append(
        		$("<th>").addClass("MMHKPLUS_CellHeader MMHKPLUS_TextCenter").html(MMHKPLUS.localize("PLAYER")))
        	.append(
        		$("<th>").addClass("MMHKPLUS_CellHeader MMHKPLUS_TextCenter").html(MMHKPLUS.localize("ALLIANCE")))
        	.append(
        		$("<th>").addClass("MMHKPLUS_CellHeader MMHKPLUS_TextCenter").html(MMHKPLUS.localize("LOCATION")))
        	.append(
        		$("<th>").addClass("MMHKPLUS_CellHeader MMHKPLUS_TextCenter").html(MMHKPLUS.localize("COORDINATES")))
        	.append(
        		$("<th>").addClass("MMHKPLUS_CellHeader MMHKPLUS_TextCenter").html(MMHKPLUS.localize("DATE")))
        	.appendTo($table);
        
        reports.forEach(function(r)
            {
                var d = new Date(); d.setTime(r.creationDate * 1000);
                var location = "";
                if(r.locationTagName == "HALT") {
                	location = MMHKPLUS.localize("HALT");
                }
                else if(r.locationTagName == "SIEGE") {
                	location = MMHKPLUS.localize("SIEGE");
                }
                else if(r.locationTagName == "RUIN") {
                	location = MMHKPLUS.localize("RUIN");
                }
                else {
                	location = r.contentJSON.cityName;
                }
                $("<tr>").addClass("MMHKPLUS_100Width MMHKPLUS_AllianceSpysHover")
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "230px")
                            .html(r.contentJSON.targetedPlayerName))
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "150px")
                            .html((hasProperty(r, 'contentJSON') && hasProperty(r.contentJSON, 'targetedPlayerAlliance')) ? r.contentJSON.targetedPlayerAlliance : ""))
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "120px")
                            .html(location))
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "80px")
                            .html("(" + r.x + "," + r.y + ")"))
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "150px")
                            .html(d.toShortFrenchFormat()))
                    .css("cursor", "pointer")
                    .click(function()
                        {
                            MMHKPLUS.getElement("Ajax").getSpyReportContent(r.hash, self._openSpyReport);
                        })
                    .appendTo($table);
            }
        );

        if(self.currentPage > 1)
        {
        	self.$btnPrevious.button("enable");
        	self.$btnBegin.button("enable");
        }

        if(self.currentPage * 20 < count)
        {
        	self.$btnNext.button("enable");
        }

        $table.find("tr:odd").css({backgroundColor:"rgba(0,191,255,0.2)"});
    },
    
    _openSpyReport : function(report) 
    {
    	MMHKPLUS.getElement("AllianceRegionReports", true).openSpyReport(report);
    },

    _getAlliances : function()
    {
        MMHKPLUS.getElement("Ajax").getAlliances(function(alliances)
        	{
        		var self = MMHKPLUS.getElement("AllianceSpys");
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

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
        this.$btnNext = null;
        this.$btnPrevious = null;
        this.$btnBegin = null;
    }
});
