MMHKPLUS.Notepad = MMHKPLUS.PanelElement.extend({
	elementType : "Notepad",
	
	options : {
		title : "",
		resizable : false,
		opened : false,
		x : "center",
		y : "center",
		w : 650,
		h : 300,
		savePos : true,
		saveWidth : false,
		saveHeight : false,
		saveOpened : true,
		limit : 500,
		images : MMHKPLUS.URL_RESOURCES + "/images/marks/"
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("NOTEPAD");
		this.$elem = $("<div>");
		this._setupPanel();
		
		return this;
	},
	
	onSetup : function()
	{
		var self = this;
		this.$elem.dialog(
			{
				minWidth : self.options.w,
				maxWidth: self.options.w,
				minHeight : self.options.h,
				maxHeight: self.options.h
			}
		).css(
			{
				overflow : "hidden"
			}
		);
	},
	
	onOpen : function()
	{
		this._createView();
		this._loadMemos();
	},
	
	_createView : function()
	{
		var self = this;
		this.$elem.empty();
		
		var $table = $("<table>")
			.addClass("MMHKPLUS_Table MMHKPLUS_100Width")
			.css({height : "100%"})
			.appendTo(this.$elem);
		$("<tr>")
			.addClass("MMHKPLUS_100Width")
			.append(
				$("<td>")
					.css({width : "40%", height : "100%", borderRight : "1px solid #FFFFFF"}))
			.append(
				$("<td>")
					.css({width : "60%", height : "100%"}))
			.appendTo($table);
		
		var $list = this.$elem.find("td:first");
		var $content = this.$elem.find("td:last");
		
		$("<div>").button()
			.html(MMHKPLUS.localize("NEW"))
			.css({position : "absolute", top : "10px", width : "90px", left : "150px", height : "20px", lineHeight : "20px", marginBottom : "10px"})
			.click(function()
				{
					self._createNewMemo();
				})
			.appendTo($list);
		
		$("<div>")
			.css({position : "absolute", top : "40px", width : "235px",  height : "210px", overflowY : "auto", overflowX : "hidden"})
			.append($("<table cellpadding='3'>")
				.addClass("MMHKPLUS_Table MMHKPLUS_WhiteBorder")
				.css({width : "100%"}))
			.appendTo($list);
	},
	
	_createNewMemo : function()
	{
		var self = this;
		var $content = this.$elem.find("td:last");
		$content.empty();
		
		$("<label>")
			.css({ marginLeft : "10px" })
			.html(MMHKPLUS.localize("TITLE"))
			.appendTo($content);
		var $title = $("<input>")
			.css({ marginLeft : "10px", marginRight : "10px", width : "310px", marginBottom : "10px"})
			.attr("maxlength", 25).appendTo($content);
			
		$("<br>").appendTo($content);
		$("<label>")
			.css({ marginLeft : "10px"})
			.html(MMHKPLUS.localize("CONTENT"))
			.appendTo($content);
		$("<br>").appendTo($content);
		
		var $textarea = $("<textarea>")
			.css({marginLeft : "10px",resize : "none", width : "355px", height : "145px", marginBottom : "10px", marginTop : "10px"})
			.attr("maxlength", 500).appendTo($content);
			
		$("<div>").button()
			.html(MMHKPLUS.localize("CANCEL"))
			.css({width : "90px", left : "285px", height : "20px", lineHeight : "20px", marginBottom : "10px"})
			.click(function()
				{
					$content.empty();
				})
			.appendTo($content);
		$("<div>").button()
			.html(MMHKPLUS.localize("ADD"))
			.css({width : "90px", left : "80px", height : "20px", lineHeight : "20px", marginBottom : "10px"})
			.click(function()
				{
					var title = $title.val();
					var content = $textarea.val();
					
					if(title.trim().length > 0 && content.trim().length > 0)
					{
						$title.val("");
						$textarea.val("");
						self._addMemo(title, content);
						self._loadMemos();
						$content.empty();
					}
				})
			.appendTo($content);
		
		var $count = $("<div>")
			.css({position : "absolute", right : "15px", top : "35px", fontStyle : "italic"})
			.html("0/" + self.options.limit)
			.appendTo($content);
		
		$textarea.keyup(function()
			{
				$count.html($textarea.val().length + "/" + self.options.limit);
			}
		);
	},
	
	_addMemo : function(title, content)
	{
		var store = MMHKPLUS.getElement("Store");
		var notepadSName = store.options.prefix + store.options.notepadName;
		
		var player = MMHKPLUS.getElement("Player");
		var worldId = player.get("worldId");
		var worldName = player.get("worldName");
		
		var memos = store.get(notepadSName);
		if(!hasProperty(memos, worldId))
		{
			memos[worldId] = 
				{
					id : worldId,
					name : player.get("worldName"),
					memos : []
				};
		}
		memos[worldId].memos.push(
			{
				date : $.now(),
				title : title,
				content : content
			}
		);
		store.set(notepadSName, memos);
	},
	
	_loadMemos : function()
	{
		var self = this;
		var store = MMHKPLUS.getElement("Store");
		var notepadSName = store.options.prefix + store.options.notepadName;
		
		var player = MMHKPLUS.getElement("Player");
		var worldId = player.get("worldId");
		
		var memos = store.get(notepadSName);
		
		if(hasProperty(memos, worldId))
		{
			var $table = this.$elem.find("td:first").find("table");
			$table.empty();
			memos[worldId].memos.forEach(function(memo)
				{
					var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
					$("<td style='width:15px;'/>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
						.html("<img src='" + self.options.images + "delete.png' style='width:12px;height:12px;cursor:pointer;'/>")
						.click(function()
							{
								self._removeMemo(memo.title, memo.date);
								self._loadMemos();
							})
						.appendTo($line);
					$("<td style='width:65px;font-weight:bold;cursor:pointer;'/>")
						.addClass("MMHKPLUS_Cell")
						.html(memo.title)
						.click(function()
							{
								self._showMemo(memo);
							})
						.appendTo($line);
				}
			);
		}
	},
	
	_removeMemo : function(title, date)
	{
		var $content = this.$elem.find("td:last");
		$content.empty();
		var store = MMHKPLUS.getElement("Store");
		var notepadSName = store.options.prefix + store.options.notepadName;
		
		var player = MMHKPLUS.getElement("Player");
		var worldId = player.get("worldId");
		
		var memos = store.get(notepadSName);
		
		if(hasProperty(memos, worldId))
		{
			var worldMemo = memos[worldId].memos;
			$.each(worldMemo, function(i)
                {
                    if(worldMemo[i].title == title && worldMemo[i].date == date)
                    {
                        worldMemo.splice(i,1);
                        return false;
                    }
                }
            );
			store.set(notepadSName, memos);
		}
	},
	
	_showMemo : function(memo)
	{
		var self = this;
		var $content = this.$elem.find("td:last");
		$content.empty();
		var d = new Date(); d.setTime(memo.date);
		
		var $container = $("<div>")
			.css({width : "355px", height : "225px"})
			.appendTo($content);
		
		$("<p>").addClass("MMHKPLUS_WhiteText")
			.css({marginLeft : "10px", marginTop : "10px", fontWeight : "bold"})
			.html(memo.title)
			.appendTo($container);
		$("<p>").addClass("MMHKPLUS_WhiteText")
			.css({marginLeft : "10px", marginTop : "5px", fontStyle : "italic", fontSize : "90%"})
			.html(d.toShortFrenchFormat())
			.appendTo($container);
		$("<p>").addClass("MMHKPLUS_WhiteText")
			.css({marginLeft : "10px", marginTop : "15px"})
			.html(memo.content)
			.appendTo($container);
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
	}
});
