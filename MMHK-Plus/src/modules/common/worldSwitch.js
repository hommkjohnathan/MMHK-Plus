MMHKPLUS.WorldSwitch = MMHKPLUS.ExtendableElement.extend({
    elementType : "WorldSwitch",
    
    options : {

    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.$elem = $("<div>");
        
        this.display();
        
        return this;
    },

    display : function()
    {
        this._addCurrentWorld();
        var self = this;
        this.$elem.empty();
        this.$elem.remove();
        this.$elem.addClass("center").appendTo($("#Container"));
        this.$elem.css(
            {
                "border-radius" : "10px 10px 0 0",
                "border" : "1px solid #FFFFFF",
                "border-bottom" : "none",
                "color" : "#FFFFFF",
                "width" : "400px",
                "height" : "30px",
                "position" : "absolute",
                "top" : "-30px",
                "left" : "305px",
                "background-color" : "background-color: rgba(0, 0, 0, 0.75)",
                "line-height" : "30px",
                "margin-left" : "auto",
                "margin-right" : "auto",
                "z-index": "3000"
            }
        );
        var $cb = $("<select>").appendTo(this.$elem);
        var worlds = MMHKPLUS.getElement("Store").get("MMHKPLUS_WORLDS") || {list : []};
        worlds.list.forEach(function(w)
            {
                $("<option>").attr("value", self._createUrl(w)).html(self._createText(w)).appendTo($cb);
            }
        );
        $("<option>").attr("value", "").html("-----------------").appendTo($cb);
        $("<option>").attr("value", "reset").html(MMHKPLUS.localize("RESET")).appendTo($cb);

        $cb.bind("change", function(e)
            {
                if($cb.val() == "reset")
                {

                    var $panel = $("<div>").dialog(
                        {
                            title : MMHKPLUS.localize("CONFIRM"),
                            width : 220,
                            height : 100, 
                            resizable : false,
                            position : ["center", 30],

                            close : function()
                            {
                                $(this).empty();
                                $(this).remove();
                                $cb[0].selectedIndex = -1;
                            }
                        }
                    );

                    $panel.css(
                        {
                            textAlign : "center",

                        }
                    );

                    $panel.append($("<p/>").html(MMHKPLUS.localize("CONFIRM_TEXT")));
                    $panel.append(
                        $("<p/>")
                            .append(
                                $("<div/>").button().css("padding", "3px")
                                    .html(MMHKPLUS.localize("OK"))
                                    .click(function()
                                        {
                                            var allWorlds = MMHKPLUS.getElement("Store").get("MMHKPLUS_WORLDS");
                                            allWorlds.list = [];
                                            MMHKPLUS.getElement("Store").set("MMHKPLUS_WORLDS", allWorlds);

                                            self.display();
                                            $panel.dialog("close");
                                        }))
                            .append(
                                $("<span>&nbsp;&nbsp;&nbsp;</span>"))
                            .append(
                                $("<div/>").button().css("padding", "3px")
                                    .html(MMHKPLUS.localize("CANCEL"))
                                    .click(function()
                                        {
                                            $panel.dialog("close");
                                            $cb.attr('selectedIndex', -1);
                                        })));
                    $panel.dialog("open");
                }
                else if($cb.val() == "")
                {
                    //separator
                    $cb[0].selectedIndex = -1;
                }
                else
                {
                    if($cb.val() != document.referrer) {
                    	var message = "<p>" + MMHKPLUS.localize("WS_MESSAGE") + "</p>" + "<p>" + $cb.find("option")[$cb[0].selectedIndex].text + "</p>";
                    	MMHKPLUS.dialog(MMHKPLUS.localize("WARNING"), message, function() {document.location.href = $cb.val();}, function() { $cb[0].selectedIndex = -1; $("div.MMHKPLUS_dialog").remove(); });
                    }
                    else {
                        $cb[0].selectedIndex = -1;
                    }
                }
                
            }
        );
        $cb[0].selectedIndex = -1;
    },

    _isAlreadyPresent : function(array, object)
    {
        var isPresent = false;
        array.forEach(function(o)
            {
                if(o.id == object.id && o.name == object.name && o.coge == object.coge &&
                        o.cogeId == object.cogeId && o.cogeName == object.cogeName)
                {
                    isPresent = true;
                }
            }
        );
        return isPresent;
    },

    _addCurrentWorld : function()
    {
        if(MMHKPLUS.getElement("Player").get("worldName").toUpperCase() != "TRAINING WORLD")
        {
            var referer = document.referrer;
            var playerId = document.referrer.split();
            var worlds = MMHKPLUS.getElement("Store").get("MMHKPLUS_WORLDS") || {};
            if(!hasProperty(worlds, "list"))
                worlds.list = [];
            
            var cogePlayerId = referer.split("playForPlayerId=")[1];
            var thisWorld = 
                {
                    id : MMHKPLUS.getElement("Player").get("worldId"), 
                    name : MMHKPLUS.getElement("Player").get("worldName"), 
                    coge : (cogePlayerId != undefined), 
                    cogeId : (cogePlayerId != undefined ? cogePlayerId : -1), 
                    cogeName : (cogePlayerId != undefined ? MMHKPLUS.getElement("Player").get("playerName") : "")
                };
            
            if(!this._isAlreadyPresent(worlds.list, thisWorld))
            {
                worlds.list.push(thisWorld);
            }
            MMHKPLUS.getElement("Store").set("MMHKPLUS_WORLDS", worlds);
        }
    },
    
    _createUrl : function(object)
    {
        var url = "http://" + window.location.hostname + "/selectWorld?worldId=" + object.id; 
        if(object.coge)
        {
            url += "&playForPlayerId=" + object.cogeId;
        }
        return url;
    },
    
    _createText : function(object)
    {
        var text = object.name;
        if(object.coge)
        {
            text += " (" + object.cogeName + ")";
        }
        return text;
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
    }
});
