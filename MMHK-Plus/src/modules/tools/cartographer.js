MMHKPLUS.Cartographer = MMHKPLUS.PanelElement.extend({
    elementType : "Cartographer",
    $canvas : null,
    $container : null,
    $content : null,
    $marker : null,
    wS : 0,
    baseSize : 2,
    zoomLevel : 1,
    intervalRequest : null,
    cache : {},
    order : [{x:2,y:-2}, 
             {x:1,y:-2}, {x:2,y:-1}, 
             {x:0,y:-2}, {x:1,y:-1}, {x:2,y:0}, 
             {x:-1,y:-2}, {x:0,y:-1}, {x:1,y:0}, {x:2,y:1}, 
             {x:-2,y:-2}, {x:-1,y:-1}, {x:0,y:0}, {x:1,y:1}, {x:2,y:2}, 
             {x:-2,y:-1}, {x:-1,y:0}, {x:0,y:1}, {x:1,y:2}, 
             {x:-2,y:0}, {x:-1,y:1}, {x:0,y:2}, 
             {x:-2,y:1}, {x:-1,y:2}, 
             {x:-2,y:2}],
    intervalPos : null,
    xOrigin : 0,
    yOrigin : 0,
    coeff : 0,
    canvasWidth : 0,
    canvasHeight : 0,
    
    options : {
        title : "",
        resizable : false,
        opened : false,
        x : "center",
        y : "center",
        w : 425,
        h : 505,
        savePos : true,
        saveWidth : false,
        saveHeight : false,
        saveOpened : true,
        hop : 35,
        showDetails : false,
        centerOnFirstCity : false,
        images : MMHKPLUS.URL_IMAGES + "carto/"
    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("CARTO");
        this.$elem = $("<div>");

        this.options.centerOnFirstCity = (this.load("cFC") != null ? this.load("cFC") : this.options.centerOnFirstCity);
        this.xOrigin = MMHKPLUS.getElement("Player").getCities()[0].content.x;
        this.yOrigin = MMHKPLUS.getElement("Player").getCities()[0].content.y;
        
        this._setupPanel();

        this.wS = MMHKPLUS.getElement("Player").get("worldSize");
        this.baseSize = Math.floor(400 / this.wS);
        this.coeff = this.baseSize * this.zoomLevel;
       
        MMHKPLUS.getElement("Ajax").getCartographerData(this._dataReceived);
        
        var self = this;
        setTimeout((function(self) { return function() { self._initRequests(); }})(this), 1000);
        
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
        ).css("overflow", "hidden");
    },
    
    onOpen : function()
    {
        this._createView();
        this.zoomLevel = 1;
        this._redraw(true);

        this.intervalPos = setInterval((function(self) { return function() { self._updatePos(); }})(this), 1000);
        this._updatePos();
    },

    onClose : function()
    {
        MMHKPLUS.clearInterval(this.intervalPos);
        this.intervalPos = null;
    },

    onDragStart : function(e, ui)
    {
        this.$canvas.hide();
    },

    onDragStop : function(e, ui)
    {
        this.$canvas.show();
    },

    _updatePos : function()
    {
        var self = MMHKPLUS.getElement("Cartographer");
        if(self.options.centerOnFirstCity)
        {
            // var xStart =  self.xOrigin + self.wS / 2; if(xStart > self.wS) xStart -= self.wS;
            // var yStart =  self.wS / 2 - self.yOrigin; if(yStart < 1) yStart += self.wS;
            var xStart =  self.wS / 2 - self.xOrigin; if(xStart < 1) xStart += self.wS; if(xStart > self.wS) xStart -= self.wS;
            var yStart =  self.wS / 2 - self.yOrigin; if(yStart < 1) yStart += self.wS; if(yStart > self.wS) yStart -= self.wS;
            xStart--; yStart--;
        }
        else
        {
            var xStart = 0;
            var yStart = 0;
        }
        
        var x = (MMHKPLUS.HOMMK.currentView.regionX + xStart) * self.baseSize * self.zoomLevel;
        if(x > self.$canvas.width()) x -= self.$canvas.width();
        var y = (MMHKPLUS.HOMMK.currentView.regionY + yStart) * self.baseSize * self.zoomLevel;
        if(y > self.$canvas.height()) y -= self.$canvas.height();

        
        if(!self.$marker)
            return;

        if(-400 + y - 50 + self.padding - 2 < -400)
        {
            self.$marker.addClass("MMHKPLUS_CartographerRotate");
        }
        else
        {
            self.$marker.removeClass("MMHKPLUS_CartographerRotate");
        }

        self.$marker.css(
            {
                top : -400 + y - (self.$marker.hasClass("MMHKPLUS_CartographerRotate") ? 5 : 50) + self.padding - 2, 
                left : x - 25 + self.padding
            }
        );
        self.$elem.find("p").eq(0).html(MMHKPLUS.localize("ACTUAL") + " (" + MMHKPLUS.HOMMK.currentView.regionX + "," + MMHKPLUS.HOMMK.currentView.regionY + ")");
    },

    _dataReceived : function(data)
    {
        var self = MMHKPLUS.getElement("Cartographer");
        data.forEach(function(r)
            {
                if(!hasProperty(self.cache, r.x + "_" + r.y))
                    self.cache[r.x + "_" + r.y] = r;
            }
        );
        if(self.options.opened)
            self._redraw(true);
    },
    
    _createView : function()
    {
        var self = this;
        $("<p>")
            .css("marginLeft", "10px")
            .css("height", "25px")
            .html(MMHKPLUS.localize("ACTUAL") + " (" + MMHKPLUS.HOMMK.currentView.regionX + "," + MMHKPLUS.HOMMK.currentView.regionY + ")")
            .appendTo(this.$elem);
        $("<p>")
            .css({position:"absolute", "top":"7px", left:"170px"})
            .css("height", "25px")
            .appendTo(this.$elem);
        $("<div>").button()
            .css("padding", 3)
            .css({position:"absolute",top:"5px", left:"350px"})
            .html(MMHKPLUS.localize("DETAILS"))
            .click(function() { self._toggleDetails();})
            .appendTo(this.$elem);
        this.$container = $("<div>")
            .css("border", "1px solid #FFFFFF")
            .css("width", "400px")
            .css("height", "400px")
            .appendTo(this.$elem);
        this.$canvas = $("<canvas>")
            .appendTo(this.$container);

        this.$marker = $("<img>")
                .attr("src", MMHKPLUS.URL_IMAGES + "carto/marker.png")
                .css({position:"relative", width:"50px", height:"50px"}).appendTo(this.$container);
        this.$marker.mousemove(this._onMouseMove);
        this.$marker.mouseleave(this._onMouseLeave);
        this.$marker.click(this._onClick);

        this.$canvas.mousemove(this._onMouseMove);
        this.$canvas.mouseleave(this._onMouseLeave);
        this.$canvas.click(this._onClick);
        //this._redraw();

        this.$content = $("<div>")
            .css({position:"absolute", left:"425px", top:"45px", width:"320px"})
            .appendTo(this.$elem);

        $("<div>")
            .css({position:"absolute", bottom:"10px", left: "1Opx", width: "400px"})
            .addClass("MMHKPLUS_TextCenter")
            .append(
                $("<input>")
                    .attr("type", "checkbox")
                    .attr("checked", self.options.centerOnFirstCity)
                    .change(function()
                        {
                            self.options.centerOnFirstCity = $(this).is(":checked");
                            self.save("cFC", self.options.centerOnFirstCity);
                            self._redraw(true);
                        }))
            .append(
                $("<label>")
                    .html(MMHKPLUS.localize("CENTER_FIRST_CITY")))
            .appendTo(this.$elem);
    },

    _toggleDetails : function()
    {
        this.options.showDetails = !this.options.showDetails;
        if(this.options.showDetails)
        {
            this.$elem.dialog({width:750});
        }
        else
        {
            this.$elem.dialog({width:425});
        }
    },

    _onMouseMove : function(event)
    {
        var self = MMHKPLUS.getElement("Cartographer");
        var xx = event.pageX - self.$canvas.offset().left;
        var yy = event.pageY - self.$canvas.offset().top;
        xx = parseInt(xx/(self.coeff));
        yy = parseInt(yy/(self.coeff));

        if(xx <= 0) xx = 1; if(xx > self.wS) xx = self.wS;
        if(yy <= 0) yy = 1; if(yy > self.wS) yy = self.wS;

        if(self.options.centerOnFirstCity)
        {
            var xStart =  xx + self.xOrigin + self.wS / 2;
            var yStart = yy + 1 - (self.wS / 2 - self.yOrigin); 

            if(yStart > self.wS) yStart -= self.wS; if(yStart < 1) yStart += self.wS;
            if(xStart > self.wS) xStart -= self.wS; if(xStart < 1) xStart += self.wS;
            var x = 1;
            if(xStart > self.wS) x = xStart - self.wS;

            self._setContent((xStart > self.wS ? x : xStart), yStart);
        }
        else
        {
            self._setContent(xx, yy);
        }
    },

    _setContent : function(x, y)
    {
        var self = MMHKPLUS.getElement("Cartographer");
        self.$content.empty();
        
        var $bg = $("<div>")
            .addClass("MMHKPLUS_AutoCenter")
            .css({backgroundImage:"url(" + self.options.images + "block.png)", width:"320px", height:"160px"})
            .appendTo(self.$content);

        self.$elem.find("p").eq(0).html(MMHKPLUS.localize("ACTUAL") + " (" + MMHKPLUS.HOMMK.currentView.regionX + "," + MMHKPLUS.HOMMK.currentView.regionY + ")");
        self.$elem.find("p").eq(1).html(MMHKPLUS.localize("CURSOR") + " (" + (x) + "," + (y) + ")");
        self.order.forEach(function(o)
            {
                self.$content.append(self._drawRegionContent(self, x, y, o.x, o.y));   
            }
        );

        $("<br>").appendTo(self.$content);

        if(hasProperty(this.cache, x + "_" + y))
        {
            var region = this.cache[x + "_" + y];
            if(self._hasInfluence(region) || hasProperty(region, "r")) {
	            $("<p>")
	                .css("paddingLeft", 25)
	                .html(MMHKPLUS.localize("PLAYER") + " : " + (hasProperty(region, "player") ? region.player.n : self.cache[region.r.x + "_" + region.r.y].player.n))
	                .appendTo(self.$content);
	            if(hasProperty(region, "alliance") || hasProperty(self.cache[region.r.x + "_" + region.r.y], "alliance")) {
		            $("<p>")
		                .css("paddingLeft", 25)
		                .html(MMHKPLUS.localize("ALLIANCE") + " : " + (hasProperty(region, "alliance") ? region.alliance.n : self.cache[region.r.x + "_" + region.r.y].alliance.n))
		                .appendTo(self.$content);
	            }
            }

            $("<br>").appendTo(self.$content);
            if(self._hasCity(region))
            {
                $("<p>")
                    .css("paddingLeft", 25)
                    .html(MMHKPLUS.localize("CITY") + " : " + region.city.n)
                    .appendTo(self.$content);
            }
            $("<p>")
                .css("paddingLeft", 25)
                .html("X : " + region.x)
                .appendTo(self.$content);
             $("<p>")
                .css("paddingLeft", 25)
                .html("Y : " + region.y)
                .appendTo(self.$content);
        }
    },

    _onMouseLeave : function()
    {
        var self = MMHKPLUS.getElement("Cartographer");
        if(self.$content)
            self.$content.empty();
        self.$elem.find("p").eq(1).html("");
    },

    _onClick : function(event)
    {
        var self = MMHKPLUS.getElement("Cartographer");
        var xx = event.pageX - self.$canvas.offset().left;
        var yy = event.pageY - self.$canvas.offset().top;
        xx = parseInt(xx/(self.baseSize*self.zoomLevel));
        yy = parseInt(yy/(self.baseSize*self.zoomLevel));

        if(xx <= 0) xx = 1; if(xx > self.wS) xx = self.wS;
        if(yy <= 0) yy = 1; if(yy > self.wS) yy = self.wS;

        if(self.options.centerOnFirstCity)
        {
            var xStart =  xx + self.xOrigin + self.wS / 2;
            var yStart = yy + 1 - (self.wS / 2 - self.yOrigin); 

            if(yStart > self.wS) yStart -= self.wS; if(yStart < 1) yStart += self.wS;
            if(xStart > self.wS) xStart -= self.wS; if(xStart < 1) xStart += self.wS;
            var x = 1;
            if(xStart > self.wS) x = xStart - self.wS;

            MMHKPLUS.centerOn((xStart > self.wS ? x : xStart), yStart);
        }
        else
        {
            MMHKPLUS.centerOn(xx, yy);
        }
    },

    _drawRegionContent : function(self, x, y, relx, rely)
    {
        var $result = $("<div>")
            .css({position:"absolute", left: 128 + relx*32 + rely*32 + "px", top : 32 - 15*relx + rely*15 + "px"});

        var realX = x + relx ; if(realX < 1) realX += this.wS; if(realX > this.wS) realX -= this.wS;
        var realY = y + rely ; if(realY < 1) realY += this.wS; if(realY > this.wS) realY -= this.wS;

        if(hasProperty(this.cache, realX + "_" + realY))
        {
            var region = this.cache[realX + "_" + realY];

            // Influence
            if(self._hasInfluence(region) || hasProperty(region, "r"))
            {
                $("<div>").css(
                    {
                        "position" : "absolute",
                        "top" : "31px",
                        "left" : "0px",
                        "background-image" : "url(" + MMHKPLUS.URL_IMAGES + "map/color_" + self._getColor(region) + ".png)",
                        "opacity" : "0.7",
                        "width" : "62px",
                        "height" : "32px"
                    }
                ).appendTo($result);
            }

            // City Image
            if(self._hasCity(region))
            {
                MMHKPLUS.getCssSprite("Region_Zoom2", region.city.f + "_cityLevel" + region.city.dL + (self._isInactive(region) ? "_neutral" : "") + (self._hasGrail(region) ? "_tear" : ""))
                    .css({position:"absolute",left:"0px", top:"0px", zIndex:1000})
                    .appendTo($result);
            }

            // Region building
            if(self._hasRegionBuilding(region))
            {
                MMHKPLUS.getCssSprite("regionBuildingsZoom2", "NEUTRAL_" + region.rB)
                    .css({position:"absolute",left:"0px", top:"0px", zIndex:1000})
                    .appendTo($result);
            }

            // Decors
            if(self._hasDecoration(region))
            {
                MMHKPLUS.getCssSprite("Region_Zoom2", "NEUTRAL_" + region.type)
                    .css({position:"absolute",left:"0px", top:"0px", zIndex:1000})
                    .appendTo($result);
            }
        }

        return $result;
    },

    _redraw : function(now)
    {
        if(this.$content)
            this.$content.empty();
        this.$canvas[0].getContext("2d").clearRect(0, 0, this.$canvas.attr("width"), this.$canvas.attr("height"));
        this.$canvas.attr("width", this.baseSize * this.zoomLevel * this.wS).attr("height", this.baseSize * this.zoomLevel * this.wS);
        this.canvasWidth = this.$canvas.width();
        this.canvasHeight = this.$canvas.height();
        if(this.baseSize * this.zoomLevel * this.wS >= 400)
        {
            this.$canvas.css("margin", 0);
            this.$container.css("overflow", "auto");
            this.padding = 0;
        }
        else
        {
            this.$canvas.css("margin", (400 - this.baseSize * this.zoomLevel * this.wS) / 2);
            this.$container.css("overflow", "hidden");
            this.padding = (400 - this.baseSize * this.zoomLevel * this.wS) / 2;
        }

        var self = this;
        if(isDefined(now) && now)
        {
            if(self.options.centerOnFirstCity)
            {
                var xStart =  self.wS / 2 - self.xOrigin; if(xStart < 1) xStart += self.wS; if(xStart > self.wS) xStart -= self.wS;
                var yStart =  self.wS / 2 - self.yOrigin; if(yStart < 1) yStart += self.wS; if(yStart > self.wS) yStart -= self.wS;

                xStart--; yStart--;
                
                $.each(this.cache, function(i, r)
                    {
	                	var x = (r.x - 1 + xStart) * self.coeff;
	                    if(x > self.canvasWidth) x -= self.canvasWidth;
	                    var y = (r.y - 1 + yStart) * self.coeff;
	                    if(y > self.canvasHeight) y -= self.canvasHeight;
                        self._drawRegion(r, x, y);
                    }
                );
            }
            else
            {
                $.each(this.cache, function(i, r)
                    {
	                	 var x = (r.x - 1) * self.coeff;
	                     var y = (r.y - 1) * self.coeff;
                        self._drawRegion(r, x, y);
                    }
                );
            }
            
        }
    },

    _drawRegion : function(region, x, y)
    {
        var color = getColor(this._getColor(region));
        this._drawRectOnCanvas(color, x, y, false);
    },

    _drawRectOnCanvas : function(color, x, y, fromCenter)
    {
    	var self = MMHKPLUS.getElement("Cartographer");
    	self.$canvas.drawRect(
            {
                fillStyle: "" + color,
                x: x,
                y: y,
                width: self.coeff,
                height: self.coeff,
                fromCenter: fromCenter
            }
        );
    },

    _initRequests : function()
    {
        this.intervalRequest = setInterval((function(self) { return function() { self._askCoordinatesToUpdate(); } })(this), 15 * 60 * 1000);
        this._askCoordinatesToUpdate();
    },
    
    _askCoordinatesToUpdate : function()
    {
    	var self = MMHKPLUS.getElement("Cartographer");
    	 MMHKPLUS.getElement("Ajax").requestCartographerUpdateCoordinates(self._doRequest);
    },

    _doRequest : function(coordinates)
    {
    	var self = MMHKPLUS.getElement("Cartographer");
    	// We receive an array of coordinates
    	if(coordinates.length == 0) {
    		// Update is complete for now!
    		MMHKPLUS.clearInterval(self.intervalRequest); 
            self.intervalRequest = null;
    	}
    	else {
    		self.lastX = coordinates[0].x;
    		self.lastY = coordinates[0].y;
    		MMHKPLUS.getElement("Ajax").getWorldmap(self.lastX, self.lastY, self.options.hop, self.options.hop, self._extract);
    	}
    },

    _extract : function(json)
    {
    	var self = MMHKPLUS.getElement("Cartographer");
        var regions = json.d[Object.keys(json.d)[0]].attachedRegionList;
        self._prepareAndSend(regions);
    },
    
    _prepareAndSend : function(regions)
    {
    	var self = MMHKPLUS.getElement("Cartographer");
    	var toSend = [];
    	var toSendObj = {};
        regions.forEach(function(r)
            {
        		var cachedRegion = 
        			{
                		x : r.x,
                		y : r.y,
                		type : r.type, // plain, oasis,...
                	}
        		;
        		
        		if(hasProperty(r, "cN")) {
        			cachedRegion['city'] = 
        				{
        					iN : hasProperty(r, 'iN') && r.iN, // isNeutral
        					n : r.cN, // cityName
        					dL : r.dL, //displayLevel
        					f : r.fctN, // factionTagName
        					hG : hasProperty(r.hG) && r.hG == 1 // hasGrail
        				}
        			;
        			cachedRegion['player'] = 
        				{
        					id : r.pId, // playerId
        					n : r.pN, // playerName
        					bgNb : r.pBgNb, // playerBackgroundNumber
        					iNb : r.pINb, // playerIconNumber
        					pNb : r.pPNb // playerPatternNumber
        				}
        			;
        			if(hasProperty(r, "_ipCol")) {
        				cachedRegion.player['c'] = r._ipCol; // player color
        			}
        		}
        		
        		if(hasProperty(r, '_iaId')) {
    				cachedRegion['alliance'] = 
        				{
        					id : r._iaId, // allianceId
        					n : r.iAN, // allianceName
        					c : r._iaCol //allianceColor
        				}
        			;
    			}
        		
        		if(hasProperty(r, 'rB')) {
        			cachedRegion['rB'] = r.rB.rBE.tN; // regionBuildingTagName
        		}
        		
                self.cache[r.x + "_" + r.y] = cachedRegion;
                
                toSend.push(cachedRegion);
                toSendObj[r.x + "_" + r.y] = 1;
                // For attached region list (influenced regions)
                if(hasProperty(r, "aRL"))
                {
                    r.aRL.forEach(function(a)
                        {
                            if(!hasProperty(self.cache, a[0] + "_" + a[1]))
                            {
                            	self.cache[a[0] + "_" + a[1]] = {x : a[0], y: a[1], r : {x : r.x , y: r.y}};
                                toSend.push(self.cache[a[0] + "_" + a[1]]);
                                toSendObj[[a[0] + "_" + a[1]]] = 1;
                            }
                        }
                    );
                }
            }
        );
        
        for(var i = self.lastX; i <= self.lastX + self.options.hop && i <= self.wS; i++) {
        	for(var j = self.lastY; j <= self.lastY + self.options.hop && j <= self.wS; j++) {
            	if(!hasProperty(toSendObj, "" + i + "_" + j)) {
            		// Plain region without influence
            		toSend.push({x : i, y: j});
            	}
            }
        }
        
        MMHKPLUS.getElement("Ajax").sendCartographerData(toSend);
        if(self.options.opened)
            self._redraw(true);
    },
    
    _getColor : function(region) 
    {
    	if(this._hasInfluence(region)) {
    		return (hasProperty(region, "alliance") ? region.alliance.c : region.player.c);
    	}
    	else if(hasProperty(region, "r")) {
    		return this._getColor(this.cache[region.r.x + "_" + region.r.y]);
    	}
    	else {
    		return -1;
    	}
    },

    _hasInfluence : function(region)
    {
        return hasProperty(region, "alliance") || hasProperty(region, "player");
    },

    _hasCity : function(region)
    {
        return hasProperty(region, "city");
    },

    _isInactive : function(region)
    {
        return this._hasCity(region) && region.city.iN;
    },

    _hasGrail : function(region)
    {
        return this._hasCity(region) && region.city.hG;
    },

    _hasRegionBuilding : function(region)
    {
        return hasProperty(region, "rB");
    },

    _hasDecoration : function(region)
    {
        return hasProperty(region, "type") && region.type != "plain";
    },
    
    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
        MMHKPLUS.clearInterval(this.intervalRequest); 
        this.intervalRequest = null;
        delete this.cache;
        MMHKPLUS.clearInterval(this.intervalPos);
        this.intervalPos = null;
    }
});
