MMHKPLUS.Marks = MMHKPLUS.PanelElement.extend({
	elementType : "Marks",
    isInjected : false,
	
	options : {
		title : "",
		resizable : false,
		opened : false,
		x : "center",
		y : "center",
		w : 300,
		h : 300,
		savePos : true,
		saveWidth : false,
		saveHeight : false,
		saveOpened : true,
		images : MMHKPLUS.URL_RESOURCES + "/images/marks/"
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("MARKS");
		this.$elem = $("<div>");
		this._setupPanel();

        if(!this.isInjected)
        {
            MMHKPLUS.HOMMK.WorldMap.prototype.move = injectAfter(MMHKPLUS.HOMMK.WorldMap.prototype.move, this._updateCoordinates);
            MMHKPLUS.HOMMK.WorldMap.prototype.center = injectAfter(MMHKPLUS.HOMMK.WorldMap.prototype.center, this._updateCoordinates);
            MMHKPLUS.HOMMK.setCurrentView = injectAfter(MMHKPLUS.HOMMK.setCurrentView, this._updateCoordinates);

            this.isInjected = true;
        }
		
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
				maxHeight : self.options.h
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
		this._loadMarks();
	},
	
	_createView : function()
	{
		var self = this;
		this.$elem.empty();
		var $header = $("<div>").css({height : "70px"}).appendTo(this.$elem);

		$("<label>").html("X :")
			.css({paddingRight : "10px"})
			.appendTo($header);
		var $x = $("<input>")
			.css({width : "45px"})
			.appendTo($header);
		
		$("<label>").html("Y :")
			.css({paddingLeft : "10px", marginTop : "10px", paddingRight : "10px"})
			.appendTo($header);
		var $y = $("<input>")
			.css({width : "45px", "margin-top" : "10px"})
			.appendTo($header);
		
		$("<br>").appendTo($header);
		
		$("<label>").html(MMHKPLUS.localize("DESCRIPTION") + " :")
			.css({marginTop : "10px", paddingRight : "10px"})
			.appendTo($header);
		var $desc = $("<input>")
			.attr("maxlength", 25)
			.css({width : "180px", marginTop : "10px"})
			.appendTo($header);
		
		$("<div>").button()
			.html(MMHKPLUS.localize("ADD"))
			.css({position:"relative", top : "-50px", left : "205px", height : "20px", width : "65px", lineHeight : "20px"})
			.click(function()
				{
					var coordx = parseInt($x.val());
					var coordy = parseInt($y.val());
					var description = $desc.val();
					
					$x.val(""); $y.val(""); $desc.val("");
					
					var s = MMHKPLUS.getElement("Player").get("worldSize");
					if(!coordx|| !coordy|| coordx < 1 || coordy < 1 || coordx > s || coordy > s)
					{
						return;
					}
					
					self._addMark(coordx, coordy, description);
					self._loadMarks();
				})
			.appendTo($header);

			
		$("<div>").addClass("MMHKPLUS_MarksContainer")
			.append(
				$("<table cellpadding='3'>").addClass("MMHKPLUS_Table MMHKPLUS_MarksTable"))
			.appendTo(this.$elem);
        this._updateCoordinates();
	},
	
	_addMark : function(x, y, description)
	{
		var store = MMHKPLUS.getElement("Store");
		var marksSName = store.options.prefix + store.options.marksName;
		
		var player = MMHKPLUS.getElement("Player");
		var worldId = player.get("worldId");
		var worldName = player.get("worldName");
		
		var marks = store.get(marksSName);
		if(!hasProperty(marks, worldId))
		{
			marks[worldId] = 
				{
					id : worldId,
					name : worldName,
					marks : []
				};
		}
		marks[worldId].marks.push(
			{
				date : $.now(),
				x : x,
				y : y,
				d : description
			}
		);
		store.set(marksSName, marks);
	},
	
	_removeMark : function(x, y, date)
	{
		var store = MMHKPLUS.getElement("Store");
		var marksSName = store.options.prefix + store.options.marksName;
		
		var player = MMHKPLUS.getElement("Player");
		var worldId = player.get("worldId");
		
		var marks = store.get(marksSName);
		if(hasProperty(marks, worldId))
		{
			var worldMarks = marks[worldId].marks;
			$.each(worldMarks, function(i)
                {
                    if(worldMarks[i].x == x && worldMarks[i].y == y && worldMarks[i].date == date)
                    {
                        worldMarks.splice(i,1);
                        return false;
                    }
                }
            );
			store.set(marksSName, marks);
		}
	},
	
	_loadMarks : function()
	{
		var self = this;
		var $table = this.$elem.find("table");
		$table.empty();
		
		var store = MMHKPLUS.getElement("Store");
		var marksSName = store.options.prefix + store.options.marksName;
		
		var player = MMHKPLUS.getElement("Player");
		var worldId = player.get("worldId");
		
		var marks = store.get(marksSName);
		if(hasProperty(marks, worldId))
		{
			var worldMarks = marks[worldId].marks;
			worldMarks.forEach(function(mark)
				{
					var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
					
					$("<td style='width:15px;'/>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
						.html("<img src='" + self.options.images + "delete.png' style='width:12px;height:12px;cursor:pointer;'/>")
						.click(function()
							{
								self._removeMark(mark.x, mark.y, mark.date);
								self._loadMarks();
							})
						.appendTo($line);
					$("<td style='width:65px;font-weight:bold;cursor:pointer;'/>")
						.addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
						.html("(" + mark.x + "," + mark.y + ")")
						.click(function()
							{
								MMHKPLUS.centerOn(mark.x, mark.y);
							})
						.appendTo($line);
					$("<td style='width:190px;'>").addClass("MMHKPLUS_Cell")
						.html(mark.d)
						.appendTo($line);
				}
			);
		}
	},

    _updateCoordinates : function()
    {
        var self = MMHKPLUS.getElement("Marks");
        if(self.options.opened)
        {
            setTimeout(function() 
                {
                    var $x = self.$elem.find("input").eq(0);
                    var $y = self.$elem.find("input").eq(1);
                    var $n = self.$elem.find("input").eq(2);
                    var x = MMHKPLUS.HOMMK.currentView.regionX || 1;
                    var y = MMHKPLUS.HOMMK.currentView.regionY || 1;
                    var details = MMHKPLUS.HOMMK.getRegionFromXY(x,y);
                    var n = "";
                    if(hasProperty(details, "content") && hasProperty(details.content, "cN"))
                        n = details.content.cN;
                    $x.val(x); $y.val(y); $n.val(n);
                },
                1200
            );
        }
    },
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
	}
});
