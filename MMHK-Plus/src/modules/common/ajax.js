MMHKPLUS.Ajax = MMHKPLUS.PanelElement.extend({
	elementType : "Ajax",
    jsonHandler : null,
	
	options : {
		url : "http://" + window.location.host, 
		getContentUrl : "/ajaxRequest/getContent"
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
        this.jsonHandler = new MMHKPLUS.HOMMK.JsonRequestHandler(MMHKPLUS.HOMMK.JSON_GETCONTENT_URL, {});
		return this;
	},
	
	getProfileFrame :  function(id, callback, sync)
	{
		return this._send(
			this.options.url + this.options.getContentUrl,
			{ "elParamList" : [ { "elementType" : "ProfileFrame", "elementId" : id } ] },
			callback,
			sync
		);
	},
	
	getAllianceFrame : function(id, callback, sync)
	{
		return this._send(
			this.options.url + this.options.getContentUrl,
			{ "elParamList" : [ { "elementType" : "ViewAllianceFrame", "elementId" : id} ] },
			callback,
			sync
		);
		
	},
	
	getHeroFrame : function(id, callback, sync)
	{
		return this._send(
			this.options.url + this.options.getContentUrl,
			{ "elParamList" : [ { "elementType" : "HeroFrame", "elementId" : id } ] },
			callback,
			sync
		);
	},
	
	getCityRecruitmentFrame : function(id, callback, sync)
	{
		return this._send(
			this.options.url + this.options.getContentUrl,
			{ "elParamList" : [ { "elementType" : "RecruitmentFrame", "elementId" : id } ] },
			callback,
			sync
		);
	},
	
	getMagicGuildFrame : function(id, callback, sync)
	{
		return this._send(
			this.options.url + this.options.getContentUrl,
			{ "elParamList" : [ { "elementType" : "MagicGuildFrame", "elementId" : id } ] },
			callback,
			sync
		);
	},

    getCityBuildings : function(id, callback, sync)
    {
        return this._send(
            this.options.url + this.options.getContentUrl,
            { "elParamList" : [ { "elementType" : "CityView", "elementId" : id } ] },
            callback,
            sync
        );
    },

    getRegionMap : function(id, callback, sync)
    {
        return this._send(
            this.options.url + this.options.getContentUrl,
            { "elParamList" : [ { "elementId" : id, "elementType" : "RegionMap" } ] },
            callback,
            sync
        );
    },

    getRegionMapXY : function(x, y, callback, sync)
    {
        return this._send(
            this.options.url + this.options.getContentUrl,
            { "elParamList" : [ { "elementId" : 0, "x" : x, "y" : y, "elementType" : "RegionMap"}]},
            callback,
            sync
        );
    },
	
	getHeroMove : function(worldId, x, y, w, h, callback, sync)
	{
		return this._send(
			this.options.url + this.options.getContentUrl,
			{"elParamList": [ {"elementType":"HeroMove", "ownerType":"WorldMap", "ownerId":  worldId, "x": Math.floor( x ), "y": Math.floor( y ), "w": Math.floor( w ), "h": Math.floor( h ) } ] },
			callback,
			sync
		);
	},
	
	getRegion : function(worldId, x, y, w, h, callback, sync)
	{
		return this._send(
			this.options.url + this.options.getContentUrl,
			{"elParamList": [ {"elementType":"Region", "ownerType":"WorldMap", "ownerId":  worldId, "x": Math.floor( x ), "y": Math.floor( y ), "w": Math.floor( w ), "h": Math.floor( h ) } ] },
			callback,
			sync
		);
	},

    getWorldmap : function(x, y, w, h, callback, sync)
    {
        return this._send(
            this.options.url + this.options.getContentUrl,
            { "elParamList" : [ { "elementType" : "WorldMap", "elementId" :  MMHKPLUS.getElement("Player").get("worldId"), "x": x,"y": y,"w": w+1,"h": w+1,"regionId":null}]},
            callback,
            sync
        );
    },
	
	getRiftRegionBuildingFrame : function(id, callback, sync)
	{
		return this._send(
			this.options.url + this.options.getContentUrl,
			{ "elParamList" : [ { "elementType" : "RiftRegionBuildingFrame", "elementId" : id } ] },
			callback,
			sync
		);
	},
	
	getMarketPlaceFrame : function(id, callback, sync)
	{
		return this._send(
			this.options.url + this.options.getContentUrl,
			{ "elParamList" : [ { "elementType" : "MarketPlaceFrame", "elementId" : id } ] },
			callback,
			sync
		);
	},

    getSpyReportsForSelectedRegion : function()
    {
        $.getScript(MMHKPLUS.URL_PHP + "get_spy_report.php?" 
            + "worldId=" + MMHKPLUS.getElement("Player").get("worldId")
            + "&allianceId=" + MMHKPLUS.getElement("Player").get("allianceId")
            + "&curX=" + MMHKPLUS.HOMMK.worldMap.selectedRegion.content.x
            + "&curY=" + MMHKPLUS.HOMMK.worldMap.selectedRegion.content.y
            + "&referenceId=" + MMHKPLUS.HOMMK.worldMap.selectedRegion.content.id
        );
    },

    getSpyReportContent : function(reportId)
    {
        $.getScript(MMHKPLUS.URL_PHP + "get_spy_report.php?" 
            + "worldId=" + MMHKPLUS.getElement("Player").get("worldId")
            + "&allianceId=" + MMHKPLUS.getElement("Player").get("allianceId")
            + "&reportId=" + reportId
        );
    },

    getHeroes : function(targetedPlayerId)
    {
        $.getScript(MMHKPLUS.URL_PHP + "heroes.php?" 
            + "worldId=" + MMHKPLUS.getElement("Player").get("worldId")
            + "&allianceId=" + MMHKPLUS.getElement("Player").get("allianceId")
            + "&playerId=" + targetedPlayerId
        );
    },

    getSpyHeroContent : function(targetedPlayerId, heroId)
    {
        $.getScript(MMHKPLUS.URL_PHP + "heroes.php?" 
            + "worldId=" + MMHKPLUS.getElement("Player").get("worldId")
            + "&allianceId=" + MMHKPLUS.getElement("Player").get("allianceId")
            + "&targetedPlayerId=" + targetedPlayerId
            + "&heroId=" + heroId
        );
    },

    getCartographerData : function(callback)
    {
    	$.getJSON(
    		MMHKPLUS.URL_API + "cartographer/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + MMHKPLUS.getElement("Player").get("worldSize"),
    		function(json) { callback(json) ;}
    	);
    },
    
    sendCartographerData: function(content)
    {
    	$.post(
    		MMHKPLUS.URL_API + "cartographer/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + MMHKPLUS.getElement("Player").get("worldSize"),
    		JSON.stringify(content)
    	);
    },
    
    requestCartographerUpdateCoordinates : function(callback) 
    {
    	$.getJSON(
			MMHKPLUS.URL_API + "cartographer/update/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + MMHKPLUS.getElement("Player").get("worldSize"),
			function(json) { callback(json); }
		);
    },
    
    getMMHKPLUSServerTime : function(callback)
    {
    	$.getJSON(
			MMHKPLUS.URL_API + "time",
			function(json) { callback(json); }
		);
    },

    sendSpyReport : function(content)
    {
        var time = $.now();
        var myIframeSender = document.createElement('iframe');
        myIframeSender.id = "MMHKPLUS_AjaxHackIFrame" + time ;
        myIframeSender.style.position = "absolute";
        myIframeSender.style.top = "1px";
        myIframeSender.style.left = "-15px";
        myIframeSender.style.width = "1px";
        myIframeSender.style.height = "1px";
        document.body.appendChild(myIframeSender);
        var doc = myIframeSender.document;
        if(myIframeSender.contentDocument)
            doc = myIframeSender.contentDocument;
        else if(myIframeSender.contentWindow)
            doc = myIframeSender.contentWindow.document;
        var player = MMHKPLUS.getElement("Player");
        doc.open();
        doc.write(
            "<form action='" + MMHKPLUS.URL_PHP + "insert_spy_report.php' method='post'>" 
                + "<input type='hidden' name='worldId' value='" + player.get("worldId") + "' />" 
                + "<input type='hidden' name='allianceId' value='" + player.get("allianceId") + "' />" 
                + "<input type='hidden' name='allianceName' value='" + player.get("allianceName") + "' />" 
                + "<input type='hidden' name='worldSize' value='" + player.get("worldSize") + "'  />" 
                + "<input type='hidden' name='content' value='" + JSON.stringify(content).replace(/'/g, "&#130;") + "'  />" 
                + "<input type='hidden' name='onlySpy' value='true'  />" 
                + "<input type=submit />" 
            + "</form>" 
            + "<script type='text/javascript'>document.forms[0].submit();</script>");
        doc.close();
        setTimeout(function(){$("#MMHKPLUS_AjaxHackIFrame" + time).remove();}, 15000);
    },
    
    exportToImage : function(content, callback)
    {
    	var filename = "toImage_" + $.now() + "_" + Math.floor((Math.random()*100000000)+1);
    	$.post(
			MMHKPLUS.URL_API + "export/png",
			JSON.stringify({filename: filename, content: content}),
			function(json) { console.log(json); callback(JSON.parse(json)) ; }
    	);
    },

    getAllianceSpyReports : function(allianceId, playerId, location, x, y, page)
    {
        $.getScript(MMHKPLUS.URL_PHP + "spy_archives.php?" 
            + "worldId=" + MMHKPLUS.getElement("Player").get("worldId")
            + "&allianceId=" + MMHKPLUS.getElement("Player").get("allianceId")
            + "&allianceName=" + allianceId
            + "&playerName=" + playerId
            + "&location=" + location
            + "&x=" + x
            + "&y=" + y
            + "&page=" + page
        );
    },

    getAlliances : function()
    {
        $.getScript(MMHKPLUS.URL_PHP + "get_alliances.php?" 
            + "worldId=" + MMHKPLUS.getElement("Player").get("worldId")
            + "&allianceId=" + MMHKPLUS.getElement("Player").get("allianceId")
        );
    },

    getPlayers : function(allianceId)
    {
        $.getScript(MMHKPLUS.URL_PHP + "get_players.php?" 
            + "worldId=" + MMHKPLUS.getElement("Player").get("worldId")
            + "&allianceId=" + allianceId
        );
    },
	
	_send : function(url, json, callback, sync)
	{
		var self = this;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, !(isDefined(sync) && sync));
        xmlhttp.onreadystatechange=function() 
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
            {
                var result = JSON.parse(xmlhttp.responseText);
                callback( result );
                // self._processData( result );
                self.jsonHandler.defaultOnComplete(result);

                delete xmlhttp;
            }
        };
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        xmlhttp.setRequestHeader("X-Request", "JSON");
        xmlhttp.send('json=' + JSON.stringify(json));
        return xmlhttp;
	},
	
	_processData : function(d)
	{
        var b = d[MMHKPLUS.HOMMK.JSON_RESPONSE_DATA_PARAM_NAME];
        var f = d[MMHKPLUS.HOMMK.JSON_RESPONSE_TIME_PARAM_NAME];
        var a = d[MMHKPLUS.HOMMK.JSON_RESPONSE_ERROR_PARAM_NAME];
        var g = d[MMHKPLUS.HOMMK.JSON_RESPONSE_UPDATEPUSH_PARAM_NAME] || new Array();
        if (!a || a == 0) {
            g.each(function (k) {
                console.log("Update element : ",  k)
                if (MMHKPLUS.HOMMK.issetElement(k.elementType, k.elementId)) {
                    var j = MMHKPLUS.HOMMK.getElement(k.elementType, k.elementId)
                }
                console.log("            j = ", j);
                switch (k.type) {
                case MMHKPLUS.HOMMK.UPDATEPUSH_TYPE_CONTENT_UPDATE:
                    if (j && j.options && j.options.acceptsPush) {
                        j.updateRefreshable(k.content, f);

                        if(typeof j.getParentElement == "function" && k.elementType && k.elementType.indexOf("RegionCitySummary") != -1)
                        {
                            var f = j;
                            var maxLoop = 20;
                            while(typeof f.getParentElement == "function" && f.getParentElement() && maxLoop != 0)
                            {
                                f = f.getParentElement();
                                console.log("             parent elementType = " + f.elementType);
                                if(f.elementType && f.elementType == "RegionCity")
                                {
                                    console.log("             parent RegionCity found, updating...");

                                    var region = MMHKPLUS.HOMMK.elementPool.obj.RegionCity.obj[f.content.id];
                                    setTimeout(function() { new window.HOMMK.JsonRequestHandler(region.options.refreshablePage, {
                                        onOKResponse: function (l, k) {
                                            window.HOMMK.elementJsonRequestPool[region.getJsonRequestId()] = false;
                                            region.update(l[region.getJsonRequestId()], k);
                                        },
                                        onKOResponse: function (k) {
                                            window.HOMMK.elementJsonRequestPool[region.getJsonRequestId()] = false;
                                        }
                                    }).send({
                                        elParamList: [region.options.refreshableParams]
                                    });}, 3000);


                                    break;
                                }
                                maxLoop --;
                            }
                        }
                        console.log("             done");
                    }
                    break;
                case MMHKPLUS.HOMMK.UPDATEPUSH_TYPE_UPDATE:
                    if (j && j.options && j.options.acceptsPush) {
                        j.updateRefreshable();
                        console.log("             done");
                    }
                    break;
                case MMHKPLUS.HOMMK.UPDATEPUSH_TYPE_LIST_CONTENT_UPDATE:
                    if (j && j.options && j.options.acceptsPush) {
                        j[k.elementListName].updateRefreshable(k.content, f);
                        console.log("             done");
                    }
                    break;
                case MMHKPLUS.HOMMK.UPDATEPUSH_TYPE_LIST_UPDATE:
                    if (j && j.options && j.options.acceptsPush) {
                        j[k.elementListName].updateRefreshable();
                        console.log("             done");
                    }
                    break;
                case MMHKPLUS.HOMMK.UPDATEPUSH_TYPE_DELETE:
                    if (j && j.options && j.options.acceptsPush) {
                        j.immediateTrash();
                        console.log("             done");
                    }
                    break;
                case MMHKPLUS.HOMMK.UPDATEPUSH_TYPE_ADD:
                    if (!j) {
                        var h = window.$A([]);
                        if (k.parentId) {
                            if (MMHKPLUS.HOMMK.issetElement(k.parentType, k.parentId)) {
                                h.include(MMHKPLUS.HOMMK.getElement(k.parentType, k.parentId))
                            }
                        } else {
                            h = MMHKPLUS.HOMMK.getElementListArray(k.parentType)
                        }
                        h.each(function (l) {
                            if (l.isValid) {
                                l["add" + k.elementType + "Content"](k.content, f, true)
                            }
                        });
                        console.log("             done");
                    }
                    break;
                case MMHKPLUS.HOMMK.UPDATEPUSH_TYPE_ACTION:
                    if (j && j.options && j.options.acceptsPush) {
                        j[k.actionName].attempt(k.actionParams ? k.actionParams.split(MMHKPLUS.HOMMK.UPDATEPUSH_ACTION_PARAMS_SEPARATOR) : null, j);
                        console.log("             done");
                    }
                    break;
                default:
                    console.log("Invalid update push type : " + k.type);
                    break
                }
            });
        }
	},

    unload : function()
    {
        delete this.jsonHandler ;
        this.jsonHandler = null;
    }
});
