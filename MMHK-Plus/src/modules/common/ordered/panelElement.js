MMHKPLUS.PanelElement = MMHKPLUS.ExtendableElement.extend({
	elementType : "PanelElement",
	
	isProgressContentRunning : false,
	currentRequests : [],
	
	options : {
		title : "",
		resizable : false,
		opened : false,
		x : "center",
		y : "center",
		w : 100,
		h : 100,
		savePos : true,
		saveWidth : true,
		saveHeight : true,
		saveOpened : false
	},

	display : function()
	{
		this._setupPanel();
		if(!this.$elem.dialog("isOpen"))
		{
			this.$elem.dialog("open");
		}
	},
	
	onSetup    : function() {},
	onClose    : function(event, ui) {},
	onOpen     : function(event, ui) {},
    onDragStart : function(event, ui) {},
	onDragStop : function(event, ui) {},
	onResize   : function(event, ui) {},
	
	setProgressContent : function(referer, ajaxRequestFunction, ajaxArgArray, AjaxCallback, endFunction, abordFunction)
	{
		try {
			if(this.isProgressContentRunning)
				return;
			
			this.isProgressContentRunning = true;
			
			var $progress = $("<div/>")
				.progressbar({max : ajaxArgArray.length, value : 0})
				.appendTo(this.$elem);
			
			var newCallback = function(json)
			{
				if(referer.options.opened)
				{
					AjaxCallback.call(referer, json);
					$progress.progressbar( "option", "value", $progress.progressbar( "option", "value" ) + 1 );
					if($progress.progressbar( "option", "value" ) == ajaxArgArray.length)
					{
						MMHKPLUS.resetElement($progress);
						$progress = null;
						endFunction.call(referer);
						referer.currentRequests = null ; referer.currentRequests = [];
						referer.isProgressContentRunning = false;
					}
				}
				else
				{
					referer.currentRequests.forEach(function(r)
						{
							r.abort();
						}
					);
					referer.currentRequests = null ; referer.currentRequests = [];
					abordFunction.call(referer);
					referer.isProgressContentRunning = false;
				}
				
			};
			ajaxArgArray.forEach(function(iteration)
				{
					iteration.push(newCallback);
					referer.currentRequests.push(ajaxRequestFunction.apply(MMHKPLUS.getElement("Ajax"), iteration));
				}
			);
		} 
		catch (g) 
		{
			abordFunction.call(referer);
			console.log("Error in setProgressContent : " + (referer.elementType || ""));
			MMHKPLUS.alert("Error", "Error while getting informations for element " +  (referer.elementType || "") + "<br/>" + (g.message || ""));
			console.trace();
		}
	},
	
	_setupPanel : function()
	{
		if(this.options.savePos)
		{
			this.options.x = this.load("x") || this.options.x;
			this.options.y = this.load("y") || this.options.y;
		}
		if(this.options.saveWidth)
		{
			this.options.w = this.load("w") || this.options.w;
		}
		if(this.options.saveHeight)
		{
			this.options.h = this.load("h") || this.options.h;
		}
		if(this.options.saveOpened)
		{
			this.options.opened = this.load("o") || this.options.opened;
		}
		var self = this;

		this.$elem.dialog(
			{
				autoOpen : false,
                title : self.options.title,
                zIndex : 90000,
                resizable : self.options.resizable,
                stack : true,
                tolerance : "pointer",
				
				open : function(event, ui)
				{
					self.options.opened = true;
					if(self.options.saveOpened)
					{
						self.save("o", self.options.opened);
					}
					$(this).dialog(
						{
							position : [self.options.x, self.options.y],
							width : self.options.w,
							height : self.options.h
						}
					);
					self.onOpen(event, ui);
				},
				
				close : function(event, ui)
				{
					self.onClose(event, ui);
					self.options.opened = false;
					if(self.options.saveOpened)
					{
						self.save("o", self.options.opened);
					}
					$(this).dialog("destroy");
					MMHKPLUS.resetElement($(this));
				},
				
				resize : function(event, ui)
				{
					self.onResize(event, ui);
				},
				
				resizeStop : function(event, ui)
				{
					self.options.w = ui.size.width;
					self.options.h = ui.size.height;
					self.options.y = ui.position.top;
					self.options.x = ui.position.left;
					if(self.options.saveWidth)
					{
						self.save("w", parseInt(self.options.w));
					}
					if(self.options.saveHeight)
					{
						self.save("h", parseInt(self.options.h));
					}
					if(self.options.savePos)
					{
						self.save("x", parseInt(self.options.x));
						self.save("y", parseInt(self.options.y));
					}
				},

                dragStart : function(event, ui)
                {
                    self.onDragStart(event, ui);
                },
				
				dragStop : function(event, ui)
				{
					self.options.y = ui.position.top;
					self.options.x = ui.position.left;
					if(self.options.savePos)
					{
						self.save("x", parseInt(self.options.x));
						self.save("y", parseInt(self.options.y));
					}
					self.onDragStop(event, ui);
				}
			}
		);
		this.$elem.addClass("MMHKPLUS_BlackBg");
		this.onSetup();
	}
});
