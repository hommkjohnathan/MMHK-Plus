MMHKPLUS.Cartographer = MMHKPLUS.PanelElement.extend({
    elementType : "Cartographer",
    $canvas : null,
    $container : null,
    $content : null,
    $marker : null,
    coords : [],
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
    initLoad : false,
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
        for(var x = 1 ; x <= this.wS ; x += this.options.hop - 1)
            for(var y = 1; y <= this.wS; y += this.options.hop - 1)
                this.coords.push({x : x, y : y});
        this.baseSize = Math.floor(400 / this.wS);
        this.coeff = this.baseSize * this.zoomLevel;

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

        if(!this.initLoad)
        {
            MMHKPLUS.getElement("Ajax").getCartographerData();
            this.initLoad = true;
        }

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
            $("<p>")
                .css("paddingLeft", 25)
                .html(MMHKPLUS.localize("PLAYER") + " : " + (hasProperty(region, "pN") ? region.pN : self.cache[region.ref].pN))
                .appendTo(self.$content);
            $("<p>")
                .css("paddingLeft", 25)
                .html(MMHKPLUS.localize("ALLIANCE") + " : " + (hasProperty(region, "aN") ? region.aN : self.cache[region.ref].aN))
                .appendTo(self.$content);

            $("<br>").appendTo(self.$content);
            if(self._hasCity(region))
            {
                $("<p>")
                    .css("paddingLeft", 25)
                    .html(MMHKPLUS.localize("CITY") + " : " + region.cN)
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
            if(self._hasInfluence(region) || (hasProperty(region, "ref") && self._hasInfluence(self.cache[region.ref])))
            {
                $("<div>").css(
                    {
                        "position" : "absolute",
                        "top" : "31px",
                        "left" : "0px",
                        "background-image" : "url(" + MMHKPLUS.URL_IMAGES + "map/color_" + (hasProperty(region, "c") ? region.c : self.cache[region.ref].c)+ ".png)",
                        "opacity" : "0.7",
                        "width" : "62px",
                        "height" : "32px"
                    }
                ).appendTo($result);
            }

            // City Image
            if(self._hasCity(region))
            {
                MMHKPLUS.getCssSprite("Region_Zoom2", MMHKPLUS.factions[region.f] + "_cityLevel" + region.d + (self._isInactive(region) ? "_neutral" : "") + (self._hasGrail(region) ? "_tear" : ""))
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
                MMHKPLUS.getCssSprite("Region_Zoom2", "NEUTRAL_" + region.t)
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

                $.each(this.cache, function(i, r)
                    {
                        self._drawRegion(r, xStart, yStart);
                    }
                );
            }
            else
            {
                $.each(this.cache, function(i, r)
                    {
                        self._drawRegionWithoutCenter(r);
                    }
                );
            }
            
        }
    },

    _drawRegion : function(region, xStart, yStart)
    {
        xStart--; yStart--;
        var self = this;

        var x = (region.x - 1 + xStart) * self.coeff;
        if(x > self.canvasWidth) x -= self.canvasWidth;
        var y = (region.y - 1 + yStart) * self.coeff;
        if(y > self.canvasHeight) y -= self.canvasHeight;
        this.$canvas.drawRect(
            {
                fillStyle: getColor(hasProperty(region, "c") ? region.c : self.cache[region.ref].c),
                x: x,
                y: y,
                width: self.coeff,
                height: self.coeff,
                fromCenter: false
            }
        );
    },

    _drawRegionWithoutCenter : function(region)
    {
        var self = this;
        this.$canvas.drawRect(
            {
                fillStyle: getColor(hasProperty(region, "c") ? region.c : self.cache[region.ref].c),
                x: (region.x - 1) * self.coeff,
                y: (region.y - 1) * self.coeff,
                width: self.coeff,
                height: self.coeff,
                fromCenter: false
            }
        );
    },

    _initRequests : function()
    {
        this.intervalRequest = setInterval((function(self) { return function() { self._doRequest(); } })(this), 25 * 60 * 1000);
        this._doRequest();
    },

    _doRequest : function()
    {
        if(this.coords.length == 0)
        {
            MMHKPLUS.clearInterval(this.intervalRequest); 
            this.intervalRequest = null;
            return;
        }

        var c = this.coords[Math.floor(Math.random() * this.coords.length)];
        this.coords.remove(c);
        MMHKPLUS.getElement("Ajax").getWorldmap(c.x, c.y, this.options.hop, this.options.hop, this._extractAndSend);
    },

    _extractAndSend : function(json)
    {
        var self = MMHKPLUS.getElement("Cartographer");
        var regions = json.d[Object.keys(json.d)[0]].attachedRegionList;
        var toSend = [];
        regions.forEach(function(r)
            {
                self.cache[r.x + "_" + r.y] = 
                    {
                        f : (hasProperty(r, "fctN") ? MMHKPLUS.factions.indexOf(r.fctN) : -1),
                        d : (hasProperty(r, "dL") ? r.dL : -1),
                        cN : (hasProperty(r, "cN") ? "" + r.cN : ""),
                        pN : (hasProperty(r, "pN") ? "" + r.pN : ""),
                        aN : (hasProperty(r, "iAN") ? "" + r.iAN : ""),
                        pId : (hasProperty(r, "pId") ? r.pId : -1),
                        aId : (hasProperty(r, "_iaId") ? r._iaId : -1),
                        g : (hasProperty(r, "hG") ? r.hG : -1),
                        pbId : (hasProperty(r, "pBgNb") ? r.pBgNb : -1),
                        ppId : (hasProperty(r, "pPNb") ? r.pPNb : -1),
                        piId : (hasProperty(r, "pINb") ? r.pINb : -1),
                        t : r.type,
                        c : (hasProperty(r, "_iaCol") ? r._iaCol : (hasProperty(r, "_ipCol") ? r._ipCol : -1)),
                        x : r.x,
                        y : r.y,
                        rB : (hasProperty(r, "rB") ? r.rB.rBE.tN : ""),
                        a : hasProperty(r, "iN") && r.iN == true
                    };
                toSend.push(self.cache[r.x + "_" + r.y]);
                // if(self.options.opened)
                //     self._drawRegion(self.cache[r.x + "_" + r.y], 1, 1);
                if(hasProperty(r, "aRL"))
                {
                    r.aRL.forEach(function(a)
                        {
                            if(!hasProperty(self.cache, a[0] + "_" + a[1]))
                            {
                                self.cache[a[0] + "_" + a[1]] = {x : a[0], y: a[1], ref : r.x + "_" + r.y};
                                // if(self.options.opened)
                                //     self._drawRegion(self.cache[a[0] + "_" + a[1]], 1, 1);
                                toSend.push(self.cache[a[0] + "_" + a[1]]);
                            }
                        }
                    );
                }
            }
        );
        MMHKPLUS.getElement("Ajax").sendCartographerData(toSend);
    },

    _hasInfluence : function(region)
    {
        return hasProperty(region, "c") && region.c != -1;
    },

    _hasCity : function(region)
    {
        return hasProperty(region, "cN") && ("" + region.cN).trim() != "";
    },

    _isInactive : function(region)
    {
        return this._hasCity(region) && hasProperty(region, "a") && region.a;
    },

    _hasGrail : function(region)
    {
        return this._hasCity(region) && hasProperty(region, "g") && region.g == 1;
    },

    _hasRegionBuilding : function(region)
    {
        return hasProperty(region, "rB") && region.rB.trim() != "";
    },

    _hasDecoration : function(region)
    {
        return hasProperty(region, "t") && region.t != "plain";
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
