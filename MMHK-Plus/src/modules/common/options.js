MMHKPLUS.Options = MMHKPLUS.PanelElement.extend({
    elementType : "Options",
    
    options : {
        title : "",
        resizable : false,
        opened : false,
        x : "center",
        y : "center",
        w : 600,
        h : 300,
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
		
		var $table = $('<table>')
			.addClass("MMHKPLUS_100Width")
			.appendTo(this.$elem);
        
		var $rb2 = $("<input>").attr("type", "radio")
			.css("margin-right", "10px")
			.css("margin-left", "25px")
			.attr("name", "chatType")
			.attr("value", 1)
			.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.chatType == 1)
			.change(function() { MMHKPLUS.getElement("EnhancedUI").toggleChat(1);});
		
		$("<tr>")
			.addClass("MMHKPLUS_100Width")
			.appendTo($table)
			.append(
				$("<td>")
					.css("width", "50%")
					.append($("<p>").html(MMHKPLUS.localize("MENU_TYPE")))
					.append(
						$("<input>").attr("type", "radio")
				            .css("margin-right", "10px")
				            .css("margin-left", "25px")
				            .attr("name", "menuFormat")
				            .attr("value", 0)
				            .attr("checked", MMHKPLUS.getElement("Menu").options.type == 0)
				            .change(function() { MMHKPLUS.getElement("Menu").toggleType();}))
					.append($("<label>").html(MMHKPLUS.localize("MENU_TOPBAR")))
					.append($("<br>"))
					.append(
						$("<input>").attr("type", "radio")
				            .css("margin-right", "10px")
				            .css("margin-left", "25px")
				            .css("margin-bottom", "2em")
				            .attr("name", "menuFormat")
				            .attr("value", 1)
				            .attr("checked", MMHKPLUS.getElement("Menu").options.type == 1)
				            .change(function() { MMHKPLUS.getElement("Menu").toggleType();}))
					.append($("<label>").html(MMHKPLUS.localize("MENU_FLOAT")))
			)
			.append(
				$("<td>")
					.css("width", "50%")
					.append($("<p>").html(MMHKPLUS.localize("U_CHAT")))
					.append(
						$("<input>").attr("type", "radio")
				            .css("margin-right", "10px")
				            .css("margin-left", "25px")
				            .attr("name", "chatType")
				            .attr("value", 2)
				            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.chatType == 2)
				            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleChat(2);}))
					.append($("<label>").html(MMHKPLUS.localize("U_CHAT1")))
					.append($("<br>"))
					.append($rb2)
					.append($("<label>").html(MMHKPLUS.localize("U_CHAT2")))
					.append($("<br>"))
					.append(
						$("<input>").attr("type", "radio")
				            .css("margin-right", "10px")
				            .css("margin-left", "25px")
				            .attr("name", "chatType")
				            .attr("value", 0)
				            .mouseup(function() { if($rb2.is(":checked")) { MMHKPLUS.alert(MMHKPLUS.localize("WARNING"), MMHKPLUS.localize("RESTART_GAME")); }})
				            .attr("checked", MMHKPLUS.getElement("EnhancedUI").options.chatType == 0)
				            .change(function() { MMHKPLUS.getElement("EnhancedUI").toggleChat(0);}))
				    .append($("<label>").html(MMHKPLUS.localize("U_CHAT3")))
			);
		
		$("<tr>")
			.addClass("MMHKPLUS_100Width")
			.appendTo($table)
			.append(
				$("<td>")
					.css("width", "50%")
					.append(
						$("<input>").attr("type", "checkbox")
							.css("margin-right", "5px")
							.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showBuyable)
							.change(function() { MMHKPLUS.getElement("EnhancedUI").toggleBuyable();}))
					.append($("<label>").html(MMHKPLUS.localize("D_BUYABLE")))
			)
			.append(
				$("<td>")
					.css("width", "50%")
					.append(
						$("<input>").attr("type", "checkbox")
							.css("margin-right", "5px")
							.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showInfluence)
							.change(function() { MMHKPLUS.getElement("EnhancedUI").toggleInfluence();}))
					.append($("<label>").html(MMHKPLUS.localize("D_INFLUENCE")))
			);
						
		$("<tr>")
			.addClass("MMHKPLUS_100Width")
			.appendTo($table)
			.append(
				$("<td>")
					.css("width", "50%")
					.append(
						$("<input>").attr("type", "checkbox")
							.css("margin-right", "5px")
							.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showPanels)
							.change(function() { MMHKPLUS.getElement("EnhancedUI").togglePanels();}))
					.append($("<label>").html(MMHKPLUS.localize("D_PANELS")))
			)
			.append(
				$("<td>")
					.css("width", "50%")
					.append(
						$("<input>").attr("type", "checkbox")
							.css("margin-right", "5px")
							.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showMovements)
							.change(function() { MMHKPLUS.getElement("EnhancedUI").toggleMovements();}))
					.append($("<label>").html(MMHKPLUS.localize("D_MOVEMENTS")))
			);		
		
		$("<tr>")
			.addClass("MMHKPLUS_100Width")
			.appendTo($table)
			.append(
				$("<td>")
					.css("width", "50%")
					.append(
						$("<input>").attr("type", "checkbox")
							.css("margin-right", "5px")
							.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.gameToleft)
							.change(function() { MMHKPLUS.getElement("EnhancedUI").toggleGamePosition();}))
					.append($("<label>").html(MMHKPLUS.localize("D_GAMETOLEFT")))
			)
			.append(
				$("<td>")
					.css("width", "50%")
					.append(
						$("<input>").attr("type", "checkbox")
							.css("margin-right", "5px")
							.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showDistances)
							.change(function() { MMHKPLUS.getElement("EnhancedUI").toggleDistances();}))
					.append($("<label>").html(MMHKPLUS.localize("D_DISTANCES")))
			);
		
		$("<tr>")
			.addClass("MMHKPLUS_100Width")
			.appendTo($table)
			.append(
				$("<td>")
					.css("width", "50%")
					.append(
						$("<input>").attr("type", "checkbox")
							.css("margin-right", "5px")
							.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showRequestIndicator)
							.change(function() { MMHKPLUS.getElement("EnhancedUI").toggleRequestIndicator();}))
					.append($("<label>").html(MMHKPLUS.localize("D_REQUEST")))
			)
			.append(
				$("<td>")
					.css("width", "50%")
					.append(
						$("<input>").attr("type", "checkbox")
							.css("margin-right", "5px")
							.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.usePlayerChatColor)
							.change(function() { MMHKPLUS.getElement("EnhancedUI").togglePlayerChatColor();}))
					.append($("<label>").html(MMHKPLUS.localize("D_PLAYERCHAT")))
			);		
		
		var store = MMHKPLUS.getElement("Store");
		
		$("<tr>")
			.addClass("MMHKPLUS_100Width")
			.appendTo($table)
			.append(
				$("<td>")
					.css("width", "50%")
					.append(
						$("<input>").attr("type", "checkbox")
							.css("margin-right", "5px")
							.attr("checked", MMHKPLUS.getElement("EnhancedUI").options.showResources)
							.change(function() { MMHKPLUS.getElement("EnhancedUI").toggleResources();}))
					.append($("<label>").html(MMHKPLUS.localize("D_RESOURCES")))
			);
		
		$("<br>").appendTo(this.$elem);
		$("<div>")
			.addClass("MMHKPLUS_100Width MMHKPLUS_TextCenter")
			.appendTo(this.$elem)
			.append(
				$("<p>")
					.addClass("MMHKPLUS_AutoCenter")
					.html(MMHKPLUS.localize("U_SPACE") + ": " +Math.floor(store.spaceUsed()/1000) + "/" + Math.floor(store.options.quota/1000) + " (" + Math.floor(store.spaceUsed() / store.options.quota) + "%)"))
			.append(
				$("<div>").button()
					.addClass("MMHKPLUS_AutoCenter")
		            .css("padding", "5px")
		            .html(MMHKPLUS.localize("CLEAN"))
		            .click(function()
		                {
		                    self._cleanSpace();
		                }));
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
