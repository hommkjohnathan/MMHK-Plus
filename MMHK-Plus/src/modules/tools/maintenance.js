MMHKPLUS.Maintenance = MMHKPLUS.PanelElement.extend({
    elementType : "Maintenance",
    costMatrice : [],
    
    options : {
        title : "",
        resizable : false,
        opened : false,
        x : "center",
        y : "center",
        w : 350,
        h : 310,
        savePos : true,
        saveWidth : false,
        saveHeight : false,
        saveOpened : true
    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("MAINTENANCE");
        this.$elem = $("<div>");

        var prev = 0;
        for(var i = 0 ; i < 16 ; i++)
            this.costMatrice.push((prev = prev + 0.015));
        for(var i = 0 ; i < 16 ; i++)
            this.costMatrice.push((prev = prev + 0.025));
        for(var i = 0 ; i < 250 ; i++)
            this.costMatrice.push((prev = prev + 0.04));

        this._setupPanel();
        
        return this;
    },

    onOpen : function()
    {
        this._createView();
    },

    onSetup : function()
    {
        this.$elem.css("text-align", "center");
    },

    _createView : function()
    {
        var self = this;
        $("<p>").html(MMHKPLUS.localize("MAINTENANCE_W")).css("color", "#33CCFF").appendTo(this.$elem);
        $("<br>").appendTo(this.$elem);

        $("<label>")
            .html(MMHKPLUS.localize("ARMY_POWER") + " : ")
            .appendTo(this.$elem);
        var $inputPower = $("<input>")
            .attr("maxLength", 8)
            .keyup(function() {self._updateMaintenance.call(self, self)})
            .css("width", "120px")
            .appendTo(this.$elem);
        $("<br>").appendTo(this.$elem);

        $("<label>")
            .html(MMHKPLUS.localize("CITY_BUILDING") + " : ")
            .appendTo(this.$elem);
        var $selectBuilding = $("<select>")
            .change(function() {self._updateMaintenance.call(self, self)})
            .append(
                $("<option>").attr("value", 0).html(MMHKPLUS.localize("CITY_0")))
            .append(
                $("<option>").attr("value", 1).html(MMHKPLUS.localize("CITY_1")))
            .append(
                $("<option>").attr("value", 2).html(MMHKPLUS.localize("CITY_2")))
            .append(
                $("<option>").attr("value", 3).html(MMHKPLUS.localize("CITY_3")))
            .appendTo(this.$elem);
        $("<br>").appendTo(this.$elem);

        $("<label>")
            .html(MMHKPLUS.localize("LANDLORD") + " : ")
            .appendTo(this.$elem);
        var $selectLandlord = $("<select>")
            .change(function() {self._updateMaintenance.call(self, self)})
            .append(
                $("<option>").attr("value", 0).html(MMHKPLUS.localize("LEVEL") + " 0"))
            .append(
                $("<option>").attr("value", 1).html(MMHKPLUS.localize("LEVEL") + " 1"))
            .append(
                $("<option>").attr("value", 2).html(MMHKPLUS.localize("LEVEL") + " 2"))
            .append(
                $("<option>").attr("value", 3).html(MMHKPLUS.localize("LEVEL") + " 3"))
            .appendTo(this.$elem);
        $("<br>").appendTo(this.$elem);

        $("<label>")
            .html(MMHKPLUS.localize("MUSE") + " : ")
            .appendTo(this.$elem);
        var $selectLandlord = $("<select>")
            .change(function() {self._updateMaintenance.call(self, self)})
            .append(
                $("<option>").attr("value", 0).html(MMHKPLUS.localize("LEVEL") + " 0"))
            .append(
                $("<option>").attr("value", 1).html(MMHKPLUS.localize("LEVEL") + " 1"))
            .append(
                $("<option>").attr("value", 2).html(MMHKPLUS.localize("LEVEL") + " 2"))
            .append(
                $("<option>").attr("value", 3).html(MMHKPLUS.localize("LEVEL") + " 3"))
            .appendTo(this.$elem);
        $("<br>").appendTo(this.$elem);

        $("<label>")
            .html(MMHKPLUS.localize("FIELDS") + " : ")
            .appendTo(this.$elem);
        var $selectFields = $("<select>")
            .change(function() {self._updateMaintenance.call(self, self)})
            .css("width", "120px")
            .appendTo(this.$elem);
        $("<br>").appendTo(this.$elem);

        $("<label>")
            .html(MMHKPLUS.localize("SPHINX") + " : ")
            .appendTo(this.$elem);
        var $selectSphinx = $("<select>")
            .change(function() {self._updateMaintenance.call(self, self)})
            .css("width", "120px")
            .appendTo(this.$elem);
        $("<br>").appendTo(this.$elem);

        $("<label>")
            .html(MMHKPLUS.localize("GRAIL") + " : ")
            .appendTo(this.$elem);
        var $selectGrail = $("<select>")
            .change(function() {self._updateMaintenance.call(self, self)})
            .css("width", "120px")
            .append(
                $("<option>").attr("value", 0).html(MMHKPLUS.localize("NO")))
            .append(
                $("<option>").attr("value", 1).html(MMHKPLUS.localize("YES")))
            .appendTo(this.$elem);
        $("<br>").appendTo(this.$elem);
        $("<br>").appendTo(this.$elem);

        var $result = $("<p>")
            .html(MMHKPLUS.localize("MAINTENANCE") + " : 0")
            .css("font-size", "120%")
            .appendTo(this.$elem);

        for(var i = 0; i< 11; i++)
        {
            $selectFields.append($("<option>").attr("value", i).html(i));
            $selectSphinx.append($("<option>").attr("value", i).html(i));
        }

        this.$elem.children().css("margin-top", "5px");
    },

    _updateMaintenance : function(self)
    {
        var $selector = self.$elem;

        var power = parseInt($selector.find("input:first").val() || "0") || 0;
        var building = parseInt($selector.find("select").eq(0).val() || "0") || 0;
        var landlord = parseInt($selector.find("select").eq(1).val() || "0") || 0;
        var muse = parseInt($selector.find("select").eq(2).val() || "0") || 0;
        var fields = parseInt($selector.find("select").eq(3).val() || "0") || 0;
        var sphinx = parseInt($selector.find("select").eq(4).val() || "0") || 0;
        var grail = (parseInt($selector.find("select").eq(5).val() || "0") == 0 ? 0 : 125000) || 0;

        //var base = [62500, 125000, 281250, 500000];
        var limit = [31250, 75000, 187500, 250000];
        var base = [250000, 500000, 750000, 1000000];

        // var ratio = power / (base[building] * (1 + 0.1 * fields) + grail);
        // var tax = 0;
        // for (i=0; i<ratio; i++)
        // { 
        //     if (i < 16) 
        //         tax += 0.015; 
        //     else if(i < 32) 
        //         tax += 0.025; 
        //     else 
        //         tax += 0.04; 
        // }
        // console.log(ratio);

        var ratio =(1+(power-(base[building]*(1+fields*0.1)))/((base[building]+grail)*(1+fields*0.1)))*base[building];
        //var ratio = (1 + ((power - (base[building] * (1 + 0.1 * fields)))))/(base[building] * (1 + 0.1 * fields)) * base[building];
        var tax = self.costMatrice[Math.floor(ratio/limit[building])-1] || 0.015;

        var bonus = Math.min(sphinx * 0.05 + landlord * 0.03 + muse * 0.05, 0.5);
        var maintenance = tax * power * (1 - bonus);

        if(power <= limit[building] * (1 + 0.1 * fields))
            maintenance = 0;

        var $result = $selector.find("p:last");
        $result
            .html(MMHKPLUS.localize("MAINTENANCE") + " : " + formatNumber(Math.floor(maintenance)));
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
        destroy(this.costMatrice); this.costMatrice = null;
    }
});
