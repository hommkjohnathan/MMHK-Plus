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

        var filterAlliance = this.$elem.find("select").eq(0).val() || "%";
        var filterPlayer = this.$elem.find("select").eq(1).val() || "%";
        var filterLocation = this.$elem.find("input").eq(0).val() || "%";
        var filterX = parseInt(this.$elem.find("input").eq(1).val()) || "%";
        var filterY = parseInt(this.$elem.find("input").eq(2).val()) || "%";

        if(filterLocation != "%")
            filterLocation = "%" + filterLocation + "%";

        MMHKPLUS.getElement("Ajax").getAllianceSpyReports(filterAlliance, filterPlayer, filterLocation, filterX, filterY, this.currentPage);
    },

    _setContent : function(count, data)
    {
        var $table = this.$elem.find("table");

        data.forEach(function(r)
            {
                var d = new Date(); d.setTime(r[8] * 1000);
                $("<tr>").addClass("MMHKPLUS_100Width MMHKPLUS_AllianceSpysHover")
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "230px")
                            .html(r[4]))
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "150px")
                            .html(r[3]))
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "120px")
                            .html((r[7] == "Halte" ? MMHKPLUS.localize("HALT") : (r[7] == "Ruine" ? MMHKPLUS.localize("RUIN") : r[7]))))
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "80px")
                            .html("(" + r[5] + "," + r[6] + ")"))
                    .append(
                        $("<td>").addClass("MMHKPLUS_TextCenter")
                            .css("width", "150px")
                            .html(d.toShortFrenchFormat()))
                    .css("cursor", "pointer")
                    .click(function()
                        {
                            MMHKPLUS.getElement("Ajax").getSpyReportContent(r[0]);
                        })
                    .appendTo($table);
            }
        );

        if(this.currentPage > 1)
        {
            this.$btnPrevious.button("enable");
            this.$btnBegin.button("enable");
        }

        if(this.currentPage * 20 < count)
        {
            this.$btnNext.button("enable");
        }

        $table.find("tr:odd").css({backgroundColor:"rgba(0,191,255,0.2)"});
    },

    _getAlliances : function()
    {
        var $selectAlliances = this.$elem.find("select").eq(0);
        $selectAlliances.empty();

        sessionStorage.removeItem("MMHKPLUS_Alliances");
        MMHKPLUS.getElement("Ajax").getAlliances();
        MMHKPLUS.wait(function()
            {
                return sessionStorage.getItem("MMHKPLUS_Alliances") != null;   
            },
            function()
            {
                var alliances = JSON.parse(sessionStorage.getItem("MMHKPLUS_Alliances")) || [];
                sessionStorage.removeItem("MMHKPLUS_Alliances");

                $selectAlliances.append(
                            $("<option>")
                                .attr("value", "%")
                                .html(""));
                $selectAlliances.append(
                            $("<option>")
                                .attr("value", -1)
                                .html(MMHKPLUS.localize("NONE")));

                alliances.forEach(function(a)
                    {
                        $selectAlliances.append(
                            $("<option>")
                                .attr("value", a[1])
                                .html(a[0]));
                    }
                );
            },
            8
        );  
    },

    _getPlayers : function()
    {
        var $selectPlayers = this.$elem.find("select").eq(1);
        $selectPlayers.empty();
        var filterAlliance = this.$elem.find("select").eq(0).val() || "%";

        if(filterAlliance == "%")
            return;

        sessionStorage.removeItem("MMHKPLUS_Players");
        MMHKPLUS.getElement("Ajax").getPlayers(filterAlliance);
        MMHKPLUS.wait(function()
            {
                return sessionStorage.getItem("MMHKPLUS_Players") != null;   
            },
            function()
            {
                var players = JSON.parse(sessionStorage.getItem("MMHKPLUS_Players")) || [];
                sessionStorage.removeItem("MMHKPLUS_Players");

                $selectPlayers.append(
                    $("<option>")
                        .attr("value", "%")
                        .html(""));

                players.forEach(function(p)
                    {
                        $selectPlayers.append(
                            $("<option>")
                                .attr("value", p[1])
                                .html(p[0]));
                    }
                );
            },
            8
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
