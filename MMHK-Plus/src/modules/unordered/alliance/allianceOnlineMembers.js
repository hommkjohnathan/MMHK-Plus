MMHKPLUS.AllianceOnlineMembers = MMHKPLUS.PanelElement.extend({
    elementType : "AllianceOnlineMembers",
    intervalOnlineUpdate : null,
    
    options : {
        title : "",
        resizable : true,
        opened : false,
        x : "center",
        y : "center",
        w : 300,
        h : 250,
        savePos : true,
        saveWidth : false,
        saveHeight : true,
        saveOpened : true,
        refresh : 60000
    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("ONLINE_MEMBERS");
        this.$elem = $("<div>");
        this._setupPanel();
        
        return this;
    },
    
    onSetup : function()
    {
        this.$elem.dialog(
            {
                minWidth : 300,
                maxWidth : 300, 
                minHeight : 150
            }
        ).css(
            {
                overflow : "hidden"
            }
        );
    },
    
    onOpen : function()
    {
        this.intervalOnlineUpdate = setInterval((function(self) { return function() { self._createView(); } })(this), this.options.refresh);
        this._createView();
    },

    onClose : function()
    {
        MMHKPLUS.clearInterval(this.intervalOnlineUpdate); this.intervalOnlineUpdate = null;
    },

    _createView : function()
    {
        var self = this;
        
        MMHKPLUS.getElement("Ajax").getAllianceFrame(MMHKPLUS.getElement("Player").get("allianceId"),
            function(json)
            {
                self.$elem.empty();
                var $content = $("<div>")
                    .css({height:"100%", borderRadius:"10px", overflowX:"hidden", overflowY:"auto"})
                    .addClass("MMHKPLUS_100Width MMHKPLUS_WhiteBorder")
                    .appendTo(self.$elem);
                var $table = $("<table>").addClass("MMHKPLUS_Table MMHKPLUS_100Width").appendTo($content);

                var members = json.d[Object.keys(json.d)[0]].attachedPlayerList;
                    members.forEach(function(member)
                    {
                        if(member.status == "ONLINE" && member.id != MMHKPLUS.getElement("Player").get("playerId"))
                        {
                            var $avatar = MMHKPLUS.getPlayerAvatar(member.backgroundNb, member.patternNb, member.iconNb).css("marginLeft", "10px");
                            $("<tr>")
                                .addClass("MMHKPLUS_100Width")
                                .append(
                                    $("<td>")
                                        .css({width:"70px",height:"44px", maxHeight:"44px"})
                                        .append($avatar.addClass("MMHKPLUS_AutoCenter")))
                                .append(
                                    $("<td>")
                                        .css({lineHeight:"44px", height:"44px", maxHeight:"44px", paddingLeft:"5px", fontWeight:"bold", cursor:"pointer"})
                                        .html(member.name)
                                        .click(function()
                                            {
                                                if(MMHKPLUS.getElement("EnhancedUI").options.chatType == 2)
                                                {
                                                    if(!MMHKPLUS.getElement("Chat").options.opened)
                                                        MMHKPLUS.getElement("Chat").display();
                                                    MMHKPLUS.getElement("Chat")._getChatContent(member.name, member.name, true);
                                                }
                                            }))
                                .appendTo($table);
                        }
                    }
                );
            }
        );

    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
        MMHKPLUS.clearInterval(this.intervalOnlineUpdate); this.intervalOnlineUpdate = null;
    }
});
