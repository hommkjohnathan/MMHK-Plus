MMHKPLUS.Options = MMHKPLUS.PanelElement.extend({
    elementType : "Options",
    
    options : {
        title : "",
        resizable : false,
        opened : false,
        x : "center",
        y : "center",
        w : 250,
        h : 580,
        savePos : true,
        saveWidth : false,
        saveHeight : false,
        saveOpened : true
    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("OPTIONS");
        this.$elem = $("<div>");

        this._setupPanel();
        
        return this;
    },

    onOpen : function()
    {
        this._createView();
    },

    _createView : function()
    {
        var self = this;
        this.$elem.empty();

        $("<br>").appendTo(this.$elem);

        // Menu type
        $("<p>").html(MMHKPLUS.localize("MENU_TYPE") + " : ").appendTo(this.$elem);
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "menuFormat")
            .attr("value", 0)
            .attr("checked", MMHKPLUS.getElement("Menu").options.type == 0)
            .change(function() { MMHKPLUS.getElement("Menu").toggleType();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("MENU_TOPBAR") + "<br/>");
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "menuFormat")
            .attr("value", 1)
            .attr("checked", MMHKPLUS.getElement("Menu").options.type == 1)
            .change(function() { MMHKPLUS.getElement("Menu").toggleType();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("MENU_FLOAT") + "<br/>");

        $("<br>").appendTo(this.$elem);

        // Buyable
        $("<p>").html(MMHKPLUS.localize("D_BUYABLE") + " : ").appendTo(this.$elem);
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "displayBuyable")
            .attr("value", 0)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showBuyable == 1)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleBuyable();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("YES") + "<br/>");
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "displayBuyable")
            .attr("value", 1)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showBuyable == 0)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleBuyable();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("NO") + "<br/>");

        $("<br>").appendTo(this.$elem);

        // Influence
        $("<p>").html(MMHKPLUS.localize("D_INFLUENCE") + " : ").appendTo(this.$elem);
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "displayInfluence")
            .attr("value", 0)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showInfluence == 1)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleInfluence();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("YES") + "<br/>");
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "displayInfluence")
            .attr("value", 1)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showInfluence == 0)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleInfluence();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("NO") + "<br/>");

        $("<br>").appendTo(this.$elem);


        // Alerts
        $("<p>").html(MMHKPLUS.localize("D_PANELS") + " : ").appendTo(this.$elem);
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "displayPanels")
            .attr("value", 0)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showPanels == 1)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").togglePanels();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("YES") + "<br/>");
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "displayPanels")
            .attr("value", 1)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showPanels == 0)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").togglePanels();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("NO") + "<br/>");

        $("<br>").appendTo(this.$elem);

        // Movements
        $("<p>").html(MMHKPLUS.localize("D_MOVEMENTS") + " : ").appendTo(this.$elem);
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "displayMovements")
            .attr("value", 0)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showMovements == 1)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleMovements();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("YES") + "<br/>");
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "displayMovements")
            .attr("value", 1)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showMovements == 0)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleMovements();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("NO") + "<br/>");

        $("<br>").appendTo(this.$elem);

        // Game to left
        $("<p>").html(MMHKPLUS.localize("D_GAMETOLEFT") + " : ").appendTo(this.$elem);
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "gameToleft")
            .attr("value", 0)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.gameToleft == true)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleGamePosition();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("YES") + "<br/>");
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "gameToleft")
            .attr("value", 1)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.gameToleft == false)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleGamePosition();})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("NO") + "<br/>");

        $("<br>").appendTo(this.$elem);

        // Chat
        $("<p>").html(MMHKPLUS.localize("U_CHAT") + " : ").appendTo(this.$elem);
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "chatType")
            .attr("value", 2)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.chatType == 2)
            .mouseup(function() { if($rb2.is(":checked")) { MMHKPLUS.alert(MMHKPLUS.localize("WARNING"), MMHKPLUS.localize("RESTART_GAME")); }})
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleChat(2);})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("U_CHAT1") + "<br/>");
        var $rb2 = $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "chatType")
            .attr("value", 1)
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.chatType == 1)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleChat(1);})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("U_CHAT2") + "<br/>");
        $("<input>").attr("type", "radio")
            .css("margin-right", "10px")
            .css("margin-left", "25px")
            .attr("name", "chatType")
            .attr("value", 0)
            .mouseup(function() { if($rb2.is(":checked")) { MMHKPLUS.alert(MMHKPLUS.localize("WARNING"), MMHKPLUS.localize("RESTART_GAME")); }})
            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.chatType == 0)
            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleChat(0);})
            .appendTo(this.$elem);
        this.$elem.append(
            MMHKPLUS.localize("U_CHAT3") + "<br/>");

        $("<br>").appendTo(this.$elem);

        // Space used
        var store = MMHKPLUS.getElement("Store");
        $("<p>").html(MMHKPLUS.localize("U_SPACE") + " : ").appendTo(this.$elem);
        $("<p>")
            .css("margin-left", "25px")
            .html(Math.floor(store.spaceUsed()/1000) + "/" + Math.floor(store.options.quota/1000) + " (" + Math.floor(store.spaceUsed() / store.options.quota) + "%)").appendTo(this.$elem);
        $("<div>").button()
            .css("padding", "5px")
            .css("margin-left", "25px")
            .css("margin-top", "5px")
            .html(MMHKPLUS.localize("CLEAN"))
            .click(function()
                {
                    self._cleanSpace();
                })
            .appendTo(this.$elem);
    },

    _cleanSpace : function()
    {
        var self = this;
        var $panel = $("<div>").dialog(
            {
                title : MMHKPLUS.localize("CLEAN"),
                modal : true,
                resizable : false,
                width : 500,
                height : 180,

                close : function()
                {
                    $(this).empty();
                    $(this).remove();
                    MMHKPLUS.getElement("Options")._createView();
                }
            }
        ).dialog("open");

        $("<p>")
            .html(MMHKPLUS.localize("CLEAN_NOTEPAD"))
            .appendTo($panel);
        var $selectNotepad = $("<select>")
            .css("margin-left", "25px")
            .css("margin-right", "10px")
            .css("width", "360px")
            .appendTo($panel);
        $("<div>").button()
            .css("padding", "5px")
            .html(MMHKPLUS.localize("CLEAN"))
            .click(function()
                {
                    self._deleteNotepad($selectNotepad.val());
                    self._loadDatas($panel);
                })
            .appendTo($panel);
        $("<br>").appendTo($panel);

        $("<p>")
            .html(MMHKPLUS.localize("CLEAN_MARKS"))
            .appendTo($panel);
        var $selectMarks = $("<select>")
            .css("margin-left", "25px")
            .css("margin-right", "10px")
            .css("width", "360px")
            .appendTo($panel);
        $("<div>").button()
            .css("padding", "5px")
            .html(MMHKPLUS.localize("CLEAN"))
            .click(function()
                {
                    self._deleteMarks($selectMarks.val());
                    self._loadDatas($panel);
                })
            .appendTo($panel);

        this._loadDatas($panel);
    },

    _deleteNotepad : function(id)
    {
        var store = MMHKPLUS.getElement("Store");
        var notepadSName = store.options.prefix + store.options.notepadName;
        
        var notepads = store.get(notepadSName);
        if(hasProperty(notepads, id))
        {
            delete notepads[id];
            store.set(notepadSName, notepads);
        }
    },

    _deleteMarks : function(id)
    {
        var store = MMHKPLUS.getElement("Store");
        var marksSName = store.options.prefix + store.options.marksName;
        
        var marks = store.get(marksSName);
        if(hasProperty(marks, id))
        {
            delete marks[id];
            store.set(marksSName, marks);
        }
    },

    _loadDatas : function($parent)
    {
        var $selectNotepad = $parent.find("select").eq(0);
        var $selectMarks = $parent.find("select").eq(1);

        $selectNotepad.empty();
        $selectMarks.empty();

        var store = MMHKPLUS.getElement("Store");
        var notepads = store.get("MMHKPLUS_NOTEPAD") || {};
        var marks = store.get("MMHKPLUS_MARKS") || {};

        for(var i in notepads)
        {
            if(hasProperty(notepads[i], "memos") && notepads[i].memos.length > 0)
                $selectNotepad.append(
                    $("<option>").attr("value", i).html(notepads[i].id + " - " + notepads[i].name))
        }

        for(var i in marks)
        {
            if(hasProperty(marks[i], "marks") && marks[i].marks.length > 0)
                $selectMarks.append(
                    $("<option>").attr("value", i).html(marks[i].id + " - " + marks[i].name))
        }
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
    }
});
