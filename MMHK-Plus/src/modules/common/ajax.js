MMHKPLUS.Ajax = MMHKPLUS.PanelElement.extend({
	elementType : "Ajax",
    jsonHandler : null,
    $ajaxLoaderImage : null, 
    pendingRequests : [],
    intervalTimeoutRequest : null,
	
	options : {
		url : "http://" + window.location.host, 
		getContentUrl : "/ajaxRequest/getContent"
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
        this.jsonHandler = new MMHKPLUS.HOMMK.JsonRequestHandler(MMHKPLUS.HOMMK.JSON_GETCONTENT_URL, {});
        
        this.setupRequestIndicator();
        
		return this;
	},
	
	setupRequestIndicator : function()
	{
		if(MMHKPLUS.getElement("EnhancedUI", true).options.showRequestIndicator) {
			this.$ajaxLoaderImage = $("<img>")
				.attr("id", "MMHKPLUS_Ajax_RequestIndicator")
		    	.attr("src", MMHKPLUS.URL_IMAGES + "ajax-loader.gif")
		    	.css({position: 'absolute', top : '25px', right : '5px'});
		    this.$ajaxLoaderImage.addClass("hidden"); // no request to begin
		    
		    $("div.sidebarTopContainer").first().append(this.$ajaxLoaderImage);
		    
		    var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent(this.$ajaxLoaderImage, function($container, $tip)
		    	{
		    		var self = MMHKPLUS.getElement("Ajax");
		    		self.pendingRequests.forEach(function(r)
		    			{
		    				$tip.append($("<p>").html(r.type));
		    			}
		    		);
		    	}
		    );
		    
		    this.intervalTimeoutRequest = setInterval(function()
		    	{
		    		var self = MMHKPLUS.getElement("Ajax");
		    		var timeout = $.now() - (30 * 1000);
		    		var toRemove = [];
		    		self.pendingRequests.forEach(function(r)
		    			{
		    				if(r.id < timeout) {
		    					toRemove.push(r);
		    				}
		    			}
		    		);
		    		if(toRemove.length > 0) {
		    			toRemove.forEach(function(r)
		    				{
		    					self._deletePendingRequest(r);
		    				}
		    			);
		    			toRemove = null;
		    		}
		    	},
		    	30000
		    );
		}
		else {
			if(this.$ajaxLoaderImage) {
				this.$ajaxLoaderImage.remove();
				this.$ajaxLoaderImage = null;
			}
			if(this.intervalTimeoutRequest) {
				clearInterval(this.intervalTimeoutRequest);
			}
			this.pendingRequests = [];
		}
	},
	
	_createPendingRequest : function(type)
	{
		if(this.$ajaxLoaderImage) {
			var request = { id : $.now(), type : type };
			
			this.pendingRequests.push(request);
			this.$ajaxLoaderImage.removeClass("hidden"); // at least one request!
			
			return request;
		}
		
		return {};
	},
	
	_deletePendingRequest : function(request)
	{
		if(this.$ajaxLoaderImage) {
			var self = MMHKPLUS.getElement("Ajax");
			self.pendingRequests.remove(request);
			if(self.pendingRequests.length == 0) {
				self.$ajaxLoaderImage.addClass("hidden");
			}
		}
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
	
	sendScoutingReport : function(report) 
	{
		var request = this._createPendingRequest("Sending scouting report");
		$.post(
    		MMHKPLUS.URL_API + "scouting/" + MMHKPLUS.getElement("Player").get("worldId"),
    		JSON.stringify(report)
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
	},

    getSpyReportsForSelectedRegion : function(callback)
    {
    	var request = this._createPendingRequest("Getting scouting reports for selected region");
    	$.post(
    		MMHKPLUS.URL_API + "scouting/region/" + MMHKPLUS.getElement("Player").get("worldId"),
    		JSON.stringify(
    			{
    				allianceId : MMHKPLUS.getElement("Player").get("allianceId"),
    				x : MMHKPLUS.HOMMK.worldMap.selectedRegion.content.x,
    				y : MMHKPLUS.HOMMK.worldMap.selectedRegion.content.y
    			}
    		),
    		function(json) { callback(JSON.parse(json));}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },

    getSpyReportContent : function(hash, callback)
    {
    	var request = this._createPendingRequest("Scouting report " + hash);
    	$.getJSON(
    		MMHKPLUS.URL_API + "scouting/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + hash,
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },

    getHeroes : function(targetedPlayerId, callback)
    {
    	var request = this._createPendingRequest("Heroes for player " + targetedPlayerId);
    	$.post(
    		MMHKPLUS.URL_API + "heroes/list/" + MMHKPLUS.getElement("Player").get("worldId"),
    		JSON.stringify(
    			{
    				allianceId : MMHKPLUS.getElement("Player").get("allianceId"),
    				targetedPlayerId : targetedPlayerId
    			}
    		),
    		function(json) { callback(json); },
    		"json"
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },

    getSpyHeroContent : function(targetedPlayerId, heroId, callback)
    {
    	var request = this._createPendingRequest("Hero " + heroId + " for player " + targetedPlayerId);
    	$.post(
    		MMHKPLUS.URL_API + "heroes/" + MMHKPLUS.getElement("Player").get("worldId"),
    		JSON.stringify(
    			{
    				allianceId : MMHKPLUS.getElement("Player").get("allianceId"),
    				targetedPlayerId : targetedPlayerId,
    				heroId : heroId
    			}
    		),
    		function(json) { callback(json); },
    		"json"
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },

    getCartographerData : function(callback)
    {
    	var request = this._createPendingRequest("Get Cartographer data");
    	$.getJSON(
    		MMHKPLUS.URL_API + "cartographer/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + MMHKPLUS.getElement("Player").get("worldSize"),
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    sendCartographerData: function(content)
    {
    	var request = this._createPendingRequest("Send data for Cartographer");
    	$.post(
    		MMHKPLUS.URL_API + "cartographer/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + MMHKPLUS.getElement("Player").get("worldSize"),
    		JSON.stringify(content)
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    requestCartographerUpdateCoordinates : function(callback) 
    {
    	var request = this._createPendingRequest("Get Cartographer coordinates to update");
    	$.getJSON(
			MMHKPLUS.URL_API + "cartographer/update/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + MMHKPLUS.getElement("Player").get("worldSize"),
			function(json) { callback(json); }
		).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    getMMHKPLUSServerTime : function(callback)
    {
    	var request = this._createPendingRequest("Get server time");
    	$.getJSON(
			MMHKPLUS.URL_API + "time",
			function(json) { callback(json); }
		).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    getMines : function(callback) 
    {
    	var request = this._createPendingRequest("Get world mines for MineFinder");
    	$.getJSON(
    		MMHKPLUS.URL_API + "mineFinder/" + MMHKPLUS.getElement("Player").get("worldId"),
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    getMinesCount : function(callback) 
    {
    	var request = this._createPendingRequest("Get discovered region count for MineFinder");
    	$.getJSON(
    		MMHKPLUS.URL_API + "mineFinder/count/" + MMHKPLUS.getElement("Player").get("worldId"),
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    searchMines : function(req, callback)
    {
    	var request = this._createPendingRequest("MineFinder search");
    	$.post(
    		MMHKPLUS.URL_API + "mineFinder/search/" + MMHKPLUS.getElement("Player").get("worldId"),
    		JSON.stringify(req),
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    sendMineFinderData : function(content)
    {
    	var request = this._createPendingRequest("Sending data for MineFinder");
    	$.post(
    		MMHKPLUS.URL_API + "mineFinder/" + MMHKPLUS.getElement("Player").get("worldId"),
    		JSON.stringify(content)
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    exportToImage : function(content, callback)
    {
    	var request = this._createPendingRequest("Exporting to PNG");
    	var filename = "toImage_" + $.now() + "_" + Math.floor((Math.random()*100000000)+1);
    	$.post(
			MMHKPLUS.URL_API + "export/png",
			JSON.stringify({filename: filename, content: LZW.compress(base64_encode(content))}),
			function(json) { callback(json) ; },
			"json"
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },

    getAllianceSpyReports : function(allianceId, playerId, location, x, y, page, callback)
    {
    	var request = this._createPendingRequest("Getting reports for current alliance");
        $.post(
    		MMHKPLUS.URL_API + "scouting/list/" + MMHKPLUS.getElement("Player").get("worldId"),
    		JSON.stringify(
    			{
    				allianceId : MMHKPLUS.getElement("Player").get("allianceId"),
    				targetedAllianceId : allianceId,
    				targetedPlayerId : playerId,
    				location : location,
    				x : x,
    				y : y,
    				page : page
    			}
    		),
    		function(json) { callback(json) ;},
    		"json"
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },

    getAlliances : function(callback)
    {
    	var request = this._createPendingRequest("Getting alliance list");
    	$.getJSON(
    		MMHKPLUS.URL_API + "alliances/" + MMHKPLUS.getElement("Player").get("worldId"),
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },

    getPlayers : function(allianceId, callback)
    {
    	var request = this._createPendingRequest("Getting player list");
    	$.getJSON(
    		MMHKPLUS.URL_API + "players/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + allianceId,
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    sendStatistics : function(stats)
    {
    	var request = this._createPendingRequest("Sending alliance statistics");
    	$.post(
    		MMHKPLUS.URL_API + "statistics/" + MMHKPLUS.getElement("Player").get("worldId"),
    		JSON.stringify(stats)
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    sendWorldStatistics : function(stats) 
    {
    	var request = this._createPendingRequest("Sending alliance statistics");
    	$.post(
    		MMHKPLUS.URL_API + "statistics/world/" + MMHKPLUS.getElement("Player").get("worldId"),
    		JSON.stringify(stats)
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    getRankingFrame : function(rank, callback, sync)
    {
    	return this._send(
			this.options.url + this.options.getContentUrl,
			{ "elParamList" : [ { 
					"elementType" : "RankingFrame", 
					"elementId" : MMHKPLUS.getElement("Player").get("playerId"),
					"rankingCategory":"BY_ALLIANCE",
					"rankingType":"DOMINATION",
					"searchType":"SEARCH_BY_POSITION",
					"searchParam": rank,
					"sortField":"position"
			} ] },
			callback,
			sync
		);
    },
    
    getAllianceMembersStatistics : function(callback)
    {
    	var request = this._createPendingRequest("Getting alliance members statistics");
    	$.getJSON(
    		MMHKPLUS.URL_API + "statistics/members/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + MMHKPLUS.getElement("Player").get("allianceId"),
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    getAllianceStatistics : function(callback)
    {
    	var request = this._createPendingRequest("Getting alliance statistics");
    	$.getJSON(
    		MMHKPLUS.URL_API + "statistics/alliance/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + MMHKPLUS.getElement("Player").get("allianceId"),
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    getWorldStatistics : function(callback)
    {
    	var request = this._createPendingRequest("Getting world statistics");
    	$.getJSON(
    		MMHKPLUS.URL_API + "statistics/world/" + MMHKPLUS.getElement("Player").get("worldId"),
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
    
    getStatisticsLastUpdate : function(callback) 
    {
    	var request = this._createPendingRequest("Getting statistics last update delta");
    	$.getJSON(
    		MMHKPLUS.URL_API + "statistics/lastupdate/" + MMHKPLUS.getElement("Player").get("worldId") + "/" + MMHKPLUS.getElement("Player").get("allianceId"),
    		function(json) { callback(json) ;}
    	).complete(function() { MMHKPLUS.getElement("Ajax")._deletePendingRequest(request); delete request; });
    },
	
	_send : function(url, json, callback, sync)
	{
		var self = this;
		var request = this._createPendingRequest("Asking data to Ubisoft");

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, !(isDefined(sync) && sync));
        xmlhttp.onreadystatechange=function() 
        {
        	MMHKPLUS.getElement("Ajax")._deletePendingRequest(request);
        	delete request;
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
        if(this.intervalTimeoutRequest) {
	        clearInterval(this.intervalTimeoutRequest);
	        this.intervalTimeoutRequest = null;
        }
        
    }
});
