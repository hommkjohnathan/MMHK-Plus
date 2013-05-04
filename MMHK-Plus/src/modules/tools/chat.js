MMHKPLUS.Chat = MMHKPLUS.PanelElement.extend({
	elementType : "Chat",
	originalAddToLog : null,
    originalShowLatest : null,
	chatRequest : null,
    cache : {},
	
	options : {
		title : "",
		resizable : true,
		opened : false,
		x : "center",
		y : "center",
		w : 450,
		h : 300,
		savePos : true,
		saveWidth : true,
		saveHeight : true,
		saveOpened : true,
		injected : false,
		allianceTab : "MMHK_Alliance",
		ulHeight : 31,
		inputHeight : 60
	},
	
	init : function(options)
	{
        var self = this;
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("CHAT");
		this.$elem = $("<div>");
		
		this.chatRequest = new MMHKPLUS.HOMMK.JsonRequestHandler(MMHKPLUS.HOMMK.CHAT_URL,{});

		this._setupPanel();

        this.originalShowLatest = MMHKPLUS.HOMMK.Chat.prototype.showLatest;
        MMHKPLUS.HOMMK.Chat.prototype.showLatest = injectAfter(MMHKPLUS.HOMMK.Chat.prototype.showLatest, function()
            {
                if(!self.options.opened && MMHKPLUS.getElement("EnhancedUI").options.chatType == 2)
                {
                    $("div.chatsystemmincontainer").removeClass("hidden").css("width", "1px");
                    $("div.chatsystemmin").addClass("hidden");
                    setTimeout(function() { $("div.chatsystemmincontainer").addClass("hidden").css("width", "");; $("div.chatsystemmin").removeClass("hidden"); }, 10000);
                }
            }
        );
		
		return this;
	},

	onSetup : function()
	{
		var self = this;
		this.$elem.dialog(
			{
				minWidth: 250,
                minHeight: 250
			}
		).css(
			{
				overflow : "hidden"
			}
		);
	},
	
	onOpen : function()
	{
		$("div.toolbarBg").children().find("div.MMHKPLUS_UiChatButton").toggleClass("hidden");
		this._createView();
		this._initChatContent();
		this._inject();
        $("div.chatsystemmincontainer").addClass("hidden");
	},
	
	onResize : function()
	{
		this._adjustHeight(this.$elem.find("ul.MMHKPLUS_ChatContent"));
		this._scrollToBottom();
	},
	
	onClose : function()
	{
		this._inject();
		$("div.toolbarBg").children().find("div.MMHKPLUS_UiChatButton").toggleClass("hidden");
	},
	
	_createView : function()
	{
		var self = this;
		this.$elem.empty();
		this.$elem.append($("<ul>"));
		this.$elem.tabs(
			{
				closable : true,
				
				add : function(e, ui)
				{
					self.options.ulHeight = self.$elem.find("ul")[0].offsetHeight || self.options.ulHeight;
					self._adjustHeight(self.$elem.find("ul.MMHKPLUS_ChatContent"));
					self._scrollToBottom();
				},

				select : function(e, ui)
				{
                    self.$elem.find("ul > li > a[href=#" + ui.panel.id + "]").parent().removeClass("MMHKPLUS_ChatNewMessage");
					self._getTextArea().appendTo($("#" + ui.panel.id));
					self._scrollToBottom();
					self._getTextArea().focus();
				},
				
				show : function(e, ui)
				{
					self._getTextArea().appendTo($("#" + ui.panel.id));
					self._scrollToBottom();
					self._getTextArea().focus();
				},
				
				remove: function(e, ui)
				{
					self.options.ulHeight = self.$elem.find("ul")[0].offsetHeight || self.options.ulHeight;
					self._adjustHeight(self.$elem.find("ul.MMHKPLUS_ChatContent"));
					self._scrollToBottom();	
				}
			}
		);

        $("<div/>").html(MMHKPLUS.localize("NEW_CHAT")).button().css(
            {
                "position" : "absolute",
                "top" : "4px",
                "right" : "30px"
            }
        ).bind("click", function()
            {
                var container = $("<div/>").appendTo(self.$elem.parent().find(".ui-dialog-titlebar"));
                container.css(
                    {
                        "position" : "absolute",
                        "top" : "20px",
                        "right" : "30px",
                        "width" : "175px",
                        "height" : "70px",
                        "background" : "rgba(0,0,0,0.75)",
                        "border" : "1px solid #FFFFFF",
                        "border-radius" : "10px",
                        "cursor" : "default",
                        "text-align" : "center",
                        "z-index" : self.$elem.parent().css("z-index") + 1
                    }
                );
                
                var $input = $('<input value="' + MMHKPLUS.localize("PLAYER_NAME") + '" style="width:130px;top:10px;font-style: italic;margin-top:10px;margin-bottom:10px;"/>').bind("click", function()
                    {
                        if($(this).val() == MMHKPLUS.localize("PLAYER_NAME"))
                            $(this).val("");
                        $(this).focus();
                    }
                ).focus().bind("keypress", function()
                    {
                        if($(this).val() == MMHKPLUS.localize("PLAYER_NAME"))
                            $(this).val("");
                    }
                ).autocomplete({source:[]})
                .bind("keyup", function(e)
                    {
                        var names = [];
                        if($(this).val().length > 1)
                            $.get(
                                "http://mightandmagicheroeskingdoms.ubi.com/ajaxRequest/playerNameAutocompletion?start=" + $(this).val(),
                                function(data)
                                    {
                                        names = JSON.parse(data);
                                        $input.autocomplete({source:names});
                                    }
                            );
                        if (e.which != 13) 
                        {
                            return;
                        } 
                        e.preventDefault();

                        if($input.autocomplete("option", "source").length == 0)
                            return;
                        
                        $.get(
                            "http://mightandmagicheroeskingdoms.ubi.com/ajaxRequest/playerNameAutocompletion?start=" + $(this).val(),
                            function(data)
                                {
                                    var n = JSON.parse(data) || [];
                                    $input.autocomplete({source:n});
                                    if(n.length >= 1 && $input.val().trim().length >= 3 && n[0] == $input.val().trim())
                                    {
                                        self._getChatTab($input.val(), $input.val(), true);
                                        $input.val("");
                                        $input.autocomplete({source:[]});
                                        names = [];
                                        container.empty();
                                        container.remove();
                                        container = null;
                                    }
                                }
                        );

                        return false;
                    }
                ).appendTo(container);

                var buttons = $("<span/>").appendTo(container);
                $("<div/>").html(MMHKPLUS.localize("OPEN")).button().bind("click", function()
                    {
                        if($input.val().length >= 3)
                        {
                            self._getChatTab($input.val(), $input.val(), true);
                            $input.val("");
                            $input.autocomplete({source:[]});

                            container.empty();
                            container.remove();
                            container = null;
                        }
                    }
                ).appendTo(buttons);
                var buttons = $("<span/>").appendTo(container);
                $("<div/>").html(MMHKPLUS.localize("CANCEL")).button().bind("click", function()
                    {
                        container.empty();
                        container.remove();
                        container = null;
                    }
                ).appendTo(buttons);

                $input.focus();
                
            }
        ).appendTo(self.$elem.parent().find(".ui-dialog-titlebar"));

		this._getChatTab(this.options.allianceTab, MMHKPLUS.localize("ALLIANCE"));
	},
	
	_inject : function()
	{
		var self = this;
		if(!this.options.injected)
		{
			this.originalAddToLog = MMHKPLUS.HOMMK.Chat.prototype.addToLog;
            // this.originalShowLatest = MMHKPLUS.HOMMK.Chat.prototype.showLatest;
			MMHKPLUS.HOMMK.Chat.prototype.addToLog = injectAfter(MMHKPLUS.HOMMK.Chat.prototype.addToLog, self._messageAdded);
            // MMHKPLUS.HOMMK.Chat.prototype.showLatest = injectAfter(MMHKPLUS.HOMMK.Chat.prototype.showLatest, function()
            //     {
            //         if(!self.options.opened)
            //         {
            //             $("div.chatsystemmincontainer").removeClass("hidden");
            //             setTimeout(function() { $("div.chatsystemmincontainer").addClass("hidden"); console.log("done"); }, 7000);
            //         }
            //     }
            // );
		}
		else
		{
            // MMHKPLUS.HOMMK.Chat.prototype.showLatest = this.originalShowLatest;
            MMHKPLUS.HOMMK.Chat.prototype.addToLog = this.originalAddToLog;
			this.originalAddToLog = null;
		}
		this.options.injected = !this.options.injected;
	},
	
	_initChatContent : function()
	{
		var self = this;
		var messages = MMHKPLUS.getElement("Player").getChatMessages();
		
		messages.forEach(function(message)
			{
				self._messageAdded("", message, true);
			}
		);
		this.$elem.tabs("select", 0);
		this._getChatTab(this.options.allianceTab, MMHKPLUS.localize("ALLIANCE")).append(self._getTextArea());
		this.$elem.trigger("resize");
	},
	
	_messageAdded : function(a, message, isFirst)
	{
		var self = MMHKPLUS.getElement("Chat");
		var $msgBox = null;
        var name = "";
		var blink = false;
		if(message.type == "alliance")
		{
			$msgBox = self._getChatContent(self.options.allianceTab, MMHKPLUS.localize("ALLIANCE"));
			blink = self._getSelectedChatTab().attr("id").indexOf(self.options.allianceTab) == -1
						&& message.from_playerId != MMHKPLUS.getElement("Player").get("playerId");
            name = self.options.allianceTab;
		}
		else if(message.type == "p2p")
		{
			if(message.from_playerId == MMHKPLUS.getElement("Player").get("playerId"))
			{
				$msgBox = self._getChatContent(message.to_playerName, message.to_playerName);
                name = message.to_playerName;
			}
			else
			{
				$msgBox = self._getChatContent(message.from_playerName, message.from_playerName);
                name = message.from_playerName;
				blink = self.cache[self._getSelectedChatTab().attr("id").replace("MMHKPLUS_ChatTab_", "")].to != message.from_playerName;
			}
		}
		
		if($msgBox)
		{
			blink = blink && (!isDefined(isFirst) || !isFirst);
			$msgBox.append(self._messageRenderer(message));
			if(blink)
			{
                self.cache[self._normalizeName(name)].selector.addClass("MMHKPLUS_ChatNewMessage");
			}
		}
		self._scrollToBottom();
		
	},
	
	_messageRenderer : function(message)
	{
		var self = this;
		var $content = $("<li style='display:block;'>").addClass("MMHKPLUS_ChatMessage");
		var d = new Date(); d.setTime(message.sentDate * 1000);
        var messageContent = message.text.replace(new RegExp("(((f|ht){1}tp(s)?://)[-a-zA-Z0-9@:%_\+.~#?&//=]+)", "gi"),"<a href='$1' target='_blank' style='color:blue;'>$1</a> ");
		messageContent = messageContent.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*\-\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
        messageContent = messageContent.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*\.\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
        messageContent = messageContent.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*:\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");     
        messageContent = messageContent.replace(new RegExp("(\\(\\s*([0-9]{1,3})\\s*\,\\s*([0-9]{1,3}\\s*)\\))", "gi"), "<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.centerOn($2, $3, false);'>$1</span>");
        messageContent = messageContent.replace(/MMHKPLUS_ScoutPL\(([0-9]+),([#A-Za-z0-9_\-\s'"\?\!\w]+)\)/,"<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.getElement(\"Ajax\").getSpyReportContent($1);'>$2</span>");
        messageContent = messageContent.replace(/MMHKPLUS_HeroPL\(([0-9]+),([0-9]+),([#A-Za-z0-9_\-\s'"\?\!\w]+)\)/,"<span style='color:blue;cursor:pointer;' onClick='MMHKPLUS.openDisplayable(\"AllianceHeroes\");MMHKPLUS.getElement(\"AllianceHeroes\")._loadHero($1,$2);'>$3</span>");
        $content
			.append(
				MMHKPLUS.getPlayerAvatar(message.from_backgroundNb, message.from_patternNb, message.from_iconNb)
					.css({"float": "left", marginRight:"10px"}))
			.append(
				$("<span>")
					.css({fontWeight:"bold", cursor:"pointer"})
					.html(message.from_playerName)
					.click(function()
						{
							self._getChatContent(message.from_playerName, message.from_playerName, true);
						}))
			.append(
				$("<span>")
					.css({fontSize:"90%", fontStyle:"italic", "float":"right", marginRight:"10px"})
					.html(d.toHoursMinFormat()))
			.append($("<br>"))
			.append(
				$("<p>")
					.css({wordWrap : "break-word", marginTop:"5px", marginBottom:"5px", paddingLeft: "50px"})
					.html(messageContent));
		return $content;
	},

	_sendMessage : function(text)
	{
		var self = this;
        var infoPlayer = this.cache[this._getSelectedChatTab().attr("id").replace("MMHKPLUS_ChatTab_", "")];
		var data = 
			{
				text : text,
				to: infoPlayer.to || "",
				type: infoPlayer.type || "alliance"
			}
		;
		this.chatRequest.send(data);
	},
	
	_getChatTab : function(id, label, select)
	{
		if(!isDefined(select))
		{
			select = false;
		}
		var self = MMHKPLUS.getElement("Chat");
		var nId = this._normalizeName(id);
		var $tab = $("#MMHKPLUS_ChatTab_" + nId);
		if($tab.length == 0)
		{
			this.$elem.tabs("add", "#MMHKPLUS_ChatTab_" + nId, label);
			this.options.ulHeight = this.$elem.find("ul")[0].offsetHeight || this.options.ulHeight;
			$tab = $("#MMHKPLUS_ChatTab_" + nId);
            self.cache[nId] = 
                {
                    type : (nId == self.options.allianceTab ? "alliance" : "p2p"),
                    to : label,
                    selector : self.$elem.find("ul > li > a[href=#MMHKPLUS_ChatTab_" + nId + "]").parent()
                };
			$tab.css({padding : ".2em .2em 0"})
				.append(
					$("<ul>").addClass("MMHKPLUS_ChatContent"))
			this._adjustHeight($tab.find("ul.MMHKPLUS_ChatContent"));
		}
		if(select)
		{
			this.$elem.tabs("select", $tab.attr("id"));
		}
		return $tab;
	},
	
	_getChatContent : function(id, label, select)
	{
		return this._getChatTab(id, label, select).find("ul:first");
	},
	
	_getSelectedChatTab : function()
	{
        return $(this.$elem.find("ul:first > li.ui-tabs-active.ui-state-active > a").attr("href"));
	},
	
	_getTextArea : function()
	{
		var self = this;
		var $ta = this.$elem.find("textarea.MMHKPLUS_ChatTextArea");
		if($ta.length == 0)
		{
			$ta = $("<textarea>").addClass("MMHKPLUS_ChatTextArea")
				.css({"font-size" : "100%"})
				.keyup(function(e)
					{
						if (e.which != 13) 
						{
							return;
						} 
						e.preventDefault();
						if(!(!$ta.val() || /^\s*$/.test($ta.val())))
						{
							self._sendMessage($ta.val());
							$ta.val("");
						}
					}); 
		}
		$ta.focus();
		return $ta;
	},
	
	_selectedChatTabNumber : function()
	{
		return this.$elem.tabs("option", "selected");
	},
	
	_scrollToBottom : function()
	{
		$.each(this.$elem.find("ul.MMHKPLUS_ChatContent"), function()
			{
				$(this).scrollTop($(this)[0].scrollHeight);
			}
		);
	},
	
	_normalizeName : function(name)
	{
		var forbid = 
			[
				" ", "	", "'"
			];
		var result = name;
		forbid.forEach(function(f)
			{
				result = result.split(f).join("_");
			}
		);
		return result;
	},
	
	_adjustHeight : function($selector)
	{
		var self = this;
		var $parent = $selector.parent();
		$selector.css({height : $parent.parent().height() - self.options.ulHeight - self.options.inputHeight - 5});
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
		destroy(this.openedChats); this.openedChats = null;
	}
	
});
