MMHKPLUS.AllianceStatistics = MMHKPLUS.PanelElement.extend({
    elementType : "AllianceStatistics",
    allianceMembersStatistics : null,
    allianceStatistics : null,
    worldStatistics : null,
    revertYAxis : false,
    
    options : {
        title : "",
        resizable : false,
        opened : false,
        x : "center",
        y : "center",
        w : 1000,
        h : 680,
        savePos : true,
        saveWidth : false,
        saveHeight : false,
        saveOpened : true
    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("ALLIANCE_STATISTICS");
        this.$elem = $("<div>");
        this._setupPanel();
        
        return this;
    },
    
    onOpen : function()
    {
        this._createView();
    },

    onSetup : function()
    {
        this.$elem.css(
            {
                overflow : "hidden"
            }
        );
    },
    
    onDragStart : function(event, ui) 
    {
    	this.$elem.children("div").children("div").children("div.MMHKPLUS_AllianceStatistics_GraphContainer").hide();
    },
    
	onDragStop : function(event, ui) 
	{
		this.$elem.children("div").children("div").children("div.MMHKPLUS_AllianceStatistics_GraphContainer").show();
	},

    _createView : function()
    {
    	var self = this;
        var $tabs = $("<div>")
        	.appendTo(this.$elem)
        	.append(
        		$("<ul>")
        			.append(
        				$("<li>")
        					.append(
    							$("<a>")
		        					.attr("href", "#MMHKPLUS_AllianceStatistics_Alliance")
		        					.html(MMHKPLUS.localize("ALLIANCE"))))
        			.append(
        				$("<li>")
        					.append(
    							$("<a>")
		        					.attr("href", "#MMHKPLUS_AllianceStatistics_World")
		        					.html(MMHKPLUS.localize("WORLD"))))
        			.append(
        				$("<li>")
        					.append(
    							$("<a>")
		        					.attr("href", "#MMHKPLUS_AllianceStatistics_Admin")
		        					.html(MMHKPLUS.localize("ADMINISTRATION"))))
        	);
        
        var $allianceTab = $("<div>")
	    	.appendTo($tabs)
	    	.attr("id", "MMHKPLUS_AllianceStatistics_Alliance");
        
        var $worldTab = $("<div>")
	    	.appendTo($tabs)
	    	.attr("id", "MMHKPLUS_AllianceStatistics_World");
        
        var $adminTab = $("<div>")
        	.appendTo($tabs)
        	.attr("id", "MMHKPLUS_AllianceStatistics_Admin");
        
        this._initAllianceTab($allianceTab);
        this._initWorldTab($worldTab);
        this._initAdministrationTab($adminTab);
        
        $tabs.tabs(
        	{
        		activate: function( event, ui ) { 
        			if(ui.newPanel.attr("id") != "MMHKPLUS_AllianceStatistics_Admin") {
        				self._updateGraph(ui.newPanel);
        			}
        		}
        	}
        );
        
        this._cleanGraph();
        
        MMHKPLUS.getElement("Ajax").getAllianceMembersStatistics(this._onAllianceMembersStatisticsReceived);
        MMHKPLUS.getElement("Ajax").getAllianceStatistics(this._onAllianceStatisticsReceived);
        MMHKPLUS.getElement("Ajax").getWorldStatistics(this._onWorldStatisticsReceived);
    },
    
    _onAllianceMembersStatisticsReceived : function(data)
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self.allianceMembersStatistics = data;
    },
    
    _onAllianceStatisticsReceived : function(data)
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self.allianceStatistics = data;
    	self._updateGraph($("#MMHKPLUS_AllianceStatistics_Alliance"));
    },
    
    _onWorldStatisticsReceived : function(data)
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self.worldStatistics = data;
    },
    
    _createRadioButton : function(value, group, checked)
	{
		return $("<input>")
			.attr("type", "radio")
			.attr("name", group)
            .attr("value", value)
            .attr("checked", checked);
	},
    
    _initAllianceTab : function($selector) 
    {
    	
    	var self = this;
    	$selector.empty();
    	
    	var $content = $("<div>")
    		.addClass("MMHKPLUS_100Width MMHKPLUS_TextCenter");
    	
    	$selector
    		.append(
    			$("<div>")
    				.addClass("MMHKPLUS_100Width MMHKPLUS_TextCenter")
    				.append(
						self._createRadioButton("Alliance", "allianceDataChoice", true)
				            .change(function()
				            	{
				            		if($(this).is(":checked")) {
    									$content.empty();
    									$content
	    									.append(
												self._createRadioButton("Ranking", "serieChoiceAlliance", true)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("RANKING")).css({marginRight: 15}))
										    .append(
										    	self._createRadioButton("TotalArmyPowerScore", "serieChoiceAlliance", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("ARMY_POWER")).css({marginRight: 15}))
										    .append(
										    	self._createRadioButton("PvPXPScore", "serieChoiceAlliance", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("PVP_XP")).css({marginRight: 15}))
										    .append(
										    	self._createRadioButton("RegionCountScore", "serieChoiceAlliance", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("TERRITORY_SCORE")).css({marginRight: 15}))
										    .append(
										    	self._createRadioButton("GrailBuildingsScore", "serieChoiceAlliance", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("GRAIL_SCORE")).css({marginRight: 15}));
    									if(MMHKPLUS.getElement("Player").isPVEWorld()) {
    										$content
	    										.append(
											    	self._createRadioButton("RunicFortressesScore", "serieChoiceAlliance", false)
											            .change(function() { self._updateGraph($selector); }))
											    .append($("<label>").html(MMHKPLUS.localize("RUNIC_SCORE")).css({marginRight: 15}));
    									}
    									else {
    										$content
	    										.append(
											    	self._createRadioButton("CapturedCitiesScore", "serieChoiceAlliance", false)
											            .change(function() { self._updateGraph($selector); }))
											    .append($("<label>").html(MMHKPLUS.localize("CITIES_SCORE")).css({marginRight: 15}))
											    .append(
											    	self._createRadioButton("PillageScore", "serieChoiceAlliance", false)
											            .change(function() { self._updateGraph($selector); }))
											    .append($("<label>").html(MMHKPLUS.localize("PILLAGE_SCORE")).css({marginRight: 15}));
    									}
    									
    									self._updateGraph($selector);
    								}
				            	}
				            ))
				    .append($("<label>").html(MMHKPLUS.localize("ALLIANCE")).css({marginRight: 25}))
					.append(
						self._createRadioButton("Members", "allianceDataChoice", false)
							.change(function()
				            	{
				            		if($(this).is(":checked")) {
    									$content.empty();
    									$content
    										.append(
    											self._createRadioButton("DominationScore", "serieChoiceAllianceMembers", true)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("DOMINATION") + " [" + MMHKPLUS.localize("SCORE") + "]").css({marginRight: 15}))
										    .append(
										    	self._createRadioButton("WealthScore", "serieChoiceAllianceMembers", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("WEALTH") + " [" + MMHKPLUS.localize("SCORE") + "]").css({marginRight: 15}))
										    .append(
										    	self._createRadioButton("HonorScore", "serieChoiceAllianceMembers", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("HONOR") + " [" + MMHKPLUS.localize("SCORE") + "]").css({marginRight: 15}))
										    .append("<br>")
										    .append(
										    	self._createRadioButton("DominationRanking", "serieChoiceAllianceMembers", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("DOMINATION") + " [" + MMHKPLUS.localize("RANKING") + "]").css({marginRight: 15}))
										    .append(
										    	self._createRadioButton("WealthRanking", "serieChoiceAllianceMembers", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("WEALTH") + " [" + MMHKPLUS.localize("RANKING") + "]").css({marginRight: 15}))
										    .append(
										    	self._createRadioButton("HonorRanking", "serieChoiceAllianceMembers", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("HONOR") + " [" + MMHKPLUS.localize("RANKING") + "]").css({marginRight: 15}))
										    .append("<br>")
										    .append(
										    	self._createRadioButton("Cities", "serieChoiceAllianceMembers", false)
										            .change(function() { self._updateGraph($selector); }))
										    .append($("<label>").html(MMHKPLUS.localize("CITIES_COUNT")));
    									
    									self._updateGraph($selector);
    								}
				            	}))
				     .append($("<label>").html(MMHKPLUS.localize("MEMBERS")))
    		);
    	
			$content.appendTo($selector);
			var $buttons = $('input[type=radio]:checked', $selector);
			$buttons.trigger("change");
    },
    
    _initWorldTab : function($selector)
    {
    	var self = this;
    	var $content = $("<div>")
			.addClass("MMHKPLUS_100Width MMHKPLUS_TextCenter");
    	$selector
		.append(
			$content
				.append(
					self._createRadioButton("WorldRanking", "serieChoiceWorld", true)
			            .change(function() { self._updateGraph($selector); }))
			    .append($("<label>").html(MMHKPLUS.localize("RANKING")).css({marginRight: 15}))
			    .append(
			    	self._createRadioButton("WorldTotalArmyPowerScore", "serieChoiceWorld", false)
			            .change(function() { self._updateGraph($selector); }))
			    .append($("<label>").html(MMHKPLUS.localize("ARMY_POWER")).css({marginRight: 15}))
			    .append(
			    	self._createRadioButton("WorldPvPXPScore", "serieChoiceWorld", false)
			            .change(function() { self._updateGraph($selector); }))
			    .append($("<label>").html(MMHKPLUS.localize("PVP_XP")).css({marginRight: 15}))
			    .append(
			    	self._createRadioButton("WorldRegionCountScore", "serieChoiceWorld", false)
			            .change(function() { self._updateGraph($selector); }))
			    .append($("<label>").html(MMHKPLUS.localize("TERRITORY_SCORE")).css({marginRight: 15}))
			    .append(
			    	self._createRadioButton("WorldGrailBuildingsScore", "serieChoiceWorld", false)
			            .change(function() { self._updateGraph($selector); }))
			    .append($("<label>").html(MMHKPLUS.localize("GRAIL_SCORE")).css({marginRight: 15}))
		);
		if(MMHKPLUS.getElement("Player").isPVEWorld()) {
			$content
				.append(
			    	self._createRadioButton("WorldRunicFortressesScore", "serieChoiceWorld", false)
			            .change(function() { self._updateGraph($selector); }))
			    .append($("<label>").html(MMHKPLUS.localize("RUNIC_SCORE")).css({marginRight: 15}));
		}
		else {
			$content
				.append(
			    	self._createRadioButton("WorldCapturedCitiesScore", "serieChoiceWorld", false)
			            .change(function() { self._updateGraph($selector); }))
			    .append($("<label>").html(MMHKPLUS.localize("CITIES_SCORE")).css({marginRight: 15}))
			    .append(
			    	self._createRadioButton("WorldPillageScore", "serieChoiceWorld", false)
			            .change(function() { self._updateGraph($selector); }))
			    .append($("<label>").html(MMHKPLUS.localize("PILLAGE_SCORE")).css({marginRight: 15}));
		}
    },
    
    _initAdministrationTab : function($selector) 
    {
    	var self = this;
    	$selector.append(
    		$("<div>")
    			.addClass("MMHKPLUS_AutoCenter MMHKPLUS_100Width MMHKPLUS_TextCenter")
    			.append(
    				$("<p>")
    					.attr("id", "MMHKPLUS_AllianceStatistics_CollectText")
    			)
    			.append(
    				$("<div>")
		    			.attr("id", "MMHKPLUS_AllianceStatistics_CollectButton")
		    			.html(MMHKPLUS.localize("COLLECT"))
		    			.button().button("option", "disabled", true)
		    			.click(function()
		    				{
		    					self._collectAllianceData($selector);
		    					$(this).button("option", "disabled", true);
		    				}
		    			)
	    		)
	    		.append($("<br>"))
    		);
    	
    	MMHKPLUS.getElement("Ajax").getStatisticsLastUpdate(function(a)
			{
    			var $text = $("#MMHKPLUS_AllianceStatistics_CollectText");
    			var $button = $("#MMHKPLUS_AllianceStatistics_CollectButton");
    			if(a && a.t != null) {
    				var d = new Date();
					d.setTime(a.t * 1000);
					$text.html(MMHKPLUS.localize("LAST_UPDATE") + ": " + d.countDown());
    				var delta = a.t - 11*3600;
    				if(delta >= 0) {
    					$button.button("option", "disabled", false);
    				} 
    			}
    			else {
    				$text.html(MMHKPLUS.localize("LAST_UPDATE") + ": " + MMHKPLUS.localize("NONE"));
    				$button.button("option", "disabled", false);
    			}
			}
    	);
    },
    
    _updateGraph : function($selector)
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self.revertYAxis = false;
    	var $buttons = $('input[type=radio]:checked', $selector);
    	var functionToUse = "_getSeriesFor" + $buttons.first().val() + ($buttons.last().val() != $buttons.first().val() ? $buttons.last().val() : "");
    	if(!self[functionToUse])
    		return;
    	var series = self[functionToUse].apply(self);
    	self._drawGraph($selector, series);
    },
    
    _getSeriesForWorldRanking : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self.revertYAxis = true;
    	return self._getSeriesWorld("pvpRanking");
    },
    
    _getSeriesForWorldTotalArmyPowerScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesWorld("pvpRankingArmyPowerScore");
    },
    
    _getSeriesForWorldPvPXPScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesWorld("pvpRankingXpWonScore");
    },
    
    _getSeriesForWorldRegionCountScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesWorld("pvpRankingTerritorySizeScore");
    },
    
    _getSeriesForWorldGrailBuildingsScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesWorld("pvpRankingGrailBuildingsScore");
    },
    
    _getSeriesForWorldRunicFortressesScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesWorld("pvpRankingIncomedScore");
    },
    
    _getSeriesForWorldCapturedCitiesScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesWorld("pvpRankingCitiesCapturedScore");
    },
    
    _getSeriesForWorldPillageScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesWorld("pvpRankingPillagedResourcesScore");
    },
    
    _getSeriesForAllianceRanking : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self.revertYAxis = true;
    	return self._getSeriesAlliance("pvpRanking");
    },
    
    _getSeriesForAllianceTotalArmyPowerScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesAlliance("pvpRankingArmyPowerScore");
    },
    
    _getSeriesForAlliancePvPXPScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesAlliance("pvpRankingXpWonScore");
    },
    
    _getSeriesForAllianceRegionCountScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesAlliance("pvpRankingTerritorySizeScore");
    },
    
    _getSeriesForAllianceGrailBuildingsScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesAlliance("pvpRankingGrailBuildingsScore");
    },
    
    _getSeriesForAllianceRunicFortressesScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesAlliance("pvpRankingIncomedScore");
    },
    
    _getSeriesForAllianceCapturedCitiesScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesAlliance("pvpRankingCitiesCapturedScore");
    },
    
    _getSeriesForAlliancePillageScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesAlliance("pvpRankingPillagedResourcesScore");
    },
    
    _getSeriesForMembersDominationScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesMembers("d", 1);
    },
    
    _getSeriesForMembersWealthScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesMembers("w", 1);
    },
    
    _getSeriesForMembersHonorScore : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesMembers("h", 1);
    },
    
    _getSeriesForMembersDominationRanking : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self.revertYAxis = true;
    	return self._getSeriesMembers("d", 0);
    },
    
    _getSeriesForMembersWealthRanking : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self.revertYAxis = true;
    	return self._getSeriesMembers("w", 0);
    },
    
    _getSeriesForMembersHonorRanking : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self.revertYAxis = true;
    	return self._getSeriesMembers("h", 0);
    },
    
    _getSeriesForMembersCities : function()
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	return self._getSeriesMembers("cC");
    },
    
    _getSeriesWorld : function(serieName)
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	series = [];
    	if(self.worldStatistics == null) {
    		return series;
    	}
    	self.worldStatistics.forEach(function(a)
    		{
    			aseries = [];
    			if(hasProperty(a, 'statistics')) {
    				a.statistics.forEach(function(s)
    					{
							aseries.push([parseInt(s.date)*1000, s.stats[serieName] || 0]);
    					}
    				);
    			}
    			series.push({data:aseries, label:a.allianceName});
    		}
    	);
    	return series;
    },
    
    _getSeriesAlliance : function(serieName)
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	series = [];
    	if(self.allianceStatistics == null) {
    		return series;
    	}
    	self.allianceStatistics.statistics.forEach(function(s)
    		{
    			series.push([parseInt(s.date)*1000, s.stats[serieName] || 0]);
    		}
    	);
    	return [{data:series, label:self.allianceStatistics.allianceName}];
    },
    
    _getSeriesMembers : function(serieName, index)
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	series = [];
    	if(self.allianceMembersStatistics == null) {
    		return series;
    	}
    	self.allianceMembersStatistics.forEach(function(p)
    		{
    			pseries = [];
    			if(hasProperty(p, 'statistics')) {
    				p.statistics.forEach(function(s)
    					{
    						if(serieName == "cC") {
    							pseries.push([parseInt(s.date)*1000, s.stats[serieName]]);
    						}
    						else {
    							pseries.push([parseInt(s.date)*1000, s.stats[serieName][index]]);
    						}
    					}
    				);
    			}
    			series.push({data:pseries, label:p.playerName});
    		}
    	);
    	return series;
    },
    
    _collectAllianceData : function($selector) 
    {
    	var processCollectedDataForAlliance = function()
    	{
    		var dataToSend = 
    			{
    				alliance : null,
    				players : []
    			};
    		
    		dataToSend.alliance = 
    			{
    				allianceId : allianceData.id,
    				allianceName : allianceData.name,
    				playerCount : allianceData.playerCount,
    				cumulTear : allianceData.cumulTear,
    				grailStructureBuildingCount : allianceData.grailStructureBuildingCount,
    				pvpRanking : allianceData.pvpRanking,
    				pvpRankingArmyPowerScore : allianceData.pvpRankingArmyPowerScore,
    				pvpRankingCitiesCapturedScore : allianceData.pvpRankingCitiesCapturedScore,
    				pvpRankingGrailBuildingsScore : allianceData.pvpRankingGrailBuildingsScore,
    				pvpRankingPillagedResourcesScore : allianceData.pvpRankingPillagedResourcesScore,
    				pvpRankingScore : allianceData.pvpRankingScore,
    				pvpRankingTerritorySizeScore : allianceData.pvpRankingTerritorySizeScore,
    				pvpRankingThreshold : allianceData.pvpRankingThreshold,
    				pvpRankingXpWonScore : allianceData.pvpRankingXpWonScore,
    				regionCount : allianceData.regionCount,
    			}
    		;
    		if(MMHKPLUS.getElement("Player").isPVEWorld()) {
    			dataToSend.regionBuildingCount = allianceData.regionBuildingCount;
    			dataToSend.pvpRankingIncomedScore = allianceData.pvpRankingIncomedScore || 0;
    		}
    		
    		players.forEach(function(p)
    			{
    				dataToSend.players.push(
    					{
    						allianceId : p.allianceId,
    						allianceName : p.allianceName,
    						playerId : p.id,
    						playerName : p.playerName,
    						stats : 
    							{
    								d : [p.dominationPosition, p.dominationScore],
    								w : [p.wealthPosition, p.wealthScore],
    								h : [p.honorPosition, p.honorScore],
    								cC : p.cityList.length,
    							}
    					}
    				);
    			}
    		);
    		
    		MMHKPLUS.getElement("Ajax").sendStatistics(dataToSend);
    		
    		setTimeout(function() {
    			MMHKPLUS.getElement("Ajax").getAllianceMembersStatistics(MMHKPLUS.getElement("AllianceStatistics")._onAllianceMembersStatisticsReceived);
    			MMHKPLUS.getElement("Ajax").getAllianceStatistics(MMHKPLUS.getElement("AllianceStatistics")._onAllianceStatisticsReceived);
    		}, 2000);
    	};
    	
    	var allianceId = MMHKPLUS.getElement("Player").get("allianceId");
    	var allianceData = null;
    	var worldData = null;
    	var players = [];
    	var alliances = [];
    	
    	var $container = $selector.find("div").first();
    	
    	// This is a sync request, script is blocked until it's done
    	// Need it to avoid multiple callback functions
    	MMHKPLUS.getElement("Ajax").getAllianceFrame(
    			allianceId,
			function(data)
				{
    				allianceData = data.d["ViewAllianceFrame" + allianceId];
				},
			true
		);
    	
    	MMHKPLUS.getElement("Ajax").getRankingFrame(
    		1,
			function(data)
				{
    				worldData = data.d["RankingFrame" + MMHKPLUS.getElement("Player").get("playerId")].rankingBY_ALLIANCEList || [];
				},
			true
		);
    	
    	$("<p>")
    		.html("<i>" + MMHKPLUS.localize("ALLIANCE_MEMBERS")  + "</i>")
    		.appendTo($container);
    	
    	var $playersProgress = $("<div>")
    		.appendTo($container)
    		.progressbar(
    			{
    				max : allianceData.attachedPlayerList.length,
    				value : 0
    			}
    		);
    	
    	allianceData.attachedPlayerList.forEach(function(p)
    		{
    			MMHKPLUS.getElement("Ajax").getProfileFrame(
    				p.id,
    				function(data)
    					{
    						players.push(data.d[Object.keys(data.d)[0]]);
    						var doneCount = $playersProgress.progressbar( "option", "value" ) + 1;
    						$playersProgress.progressbar("option", "value", doneCount);
    						if(doneCount == allianceData.attachedPlayerList.length) {
    							processCollectedDataForAlliance();
    						}
    					}
    			);
    		}
    	);
    	$("<br>").appendTo($container);
    	
    	$("<p>")
			.html("<i>" + MMHKPLUS.localize("ALLIANCE_TOP10")  + "</i>")
			.appendTo($container);
    	var $alliancesProgress = $("<div>")
		.appendTo($container)
		.progressbar(
			{
				max : Math.min(10, worldData.length),
				value : 0
			}
		);
    	
    	worldData.forEach(function(a)
        		{
    				if(a.position <= 10) {
	        			MMHKPLUS.getElement("Ajax").getAllianceFrame(
	        				a.id,
	        				function(data)
	        					{
	        						var allFrame = data.d[Object.keys(data.d)[0]];
		        					var aData = 
			        	    			{
		        							allianceId : allFrame.id,
			        	    				allianceName : allFrame.name,
			        	    				playerCount : allFrame.playerCount,
			        	    				cumulTear : allFrame.cumulTear,
			        	    				grailStructureBuildingCount : allFrame.grailStructureBuildingCount,
			        	    				pvpRanking : allFrame.pvpRanking,
			        	    				pvpRankingArmyPowerScore : allFrame.pvpRankingArmyPowerScore,
			        	    				pvpRankingCitiesCapturedScore : allFrame.pvpRankingCitiesCapturedScore,
			        	    				pvpRankingGrailBuildingsScore : allFrame.pvpRankingGrailBuildingsScore,
			        	    				pvpRankingPillagedResourcesScore : allFrame.pvpRankingPillagedResourcesScore,
			        	    				pvpRankingScore : allFrame.pvpRankingScore,
			        	    				pvpRankingTerritorySizeScore : allFrame.pvpRankingTerritorySizeScore,
			        	    				pvpRankingThreshold : allFrame.pvpRankingThreshold,
			        	    				pvpRankingXpWonScore : allFrame.pvpRankingXpWonScore,
			        	    				regionCount : allFrame.regionCount,
			        	    			};
			        	    		
			        	    		if(MMHKPLUS.getElement("Player").isPVEWorld()) {
			        	    			aData.regionBuildingCount = allFrame.regionBuildingCount;
			        	    			aData.pvpRankingIncomedScore = allFrame.pvpRankingIncomedScore || 0;
			        	    		}
			        	    		
			        	    		alliances.push(aData);
	        						var doneCount = $alliancesProgress.progressbar( "option", "value" ) + 1;
	        						$alliancesProgress.progressbar("option", "value", doneCount);
	        						if(doneCount == Math.min(10, worldData.length)) {
	        							MMHKPLUS.getElement("Ajax").sendWorldStatistics(alliances);
	        							setTimeout(function() {
	        				    			MMHKPLUS.getElement("Ajax").getWorldStatistics(MMHKPLUS.getElement("AllianceStatistics")._onWorldStatisticsReceived);
	        				    		}, 2000);
	        						}
	        					}
	        			);
    				}
        		}
        	);
    },
    
    _drawGraph : function($parent, series) 
    {
    	var self = MMHKPLUS.getElement("AllianceStatistics");
    	self._cleanGraph();
    	
    	var $container = $("<div>")
    		.addClass("MMHKPLUS_AllianceStatistics_GraphContainer")
    		.appendTo($parent);
    	
    	var $graph = $("<div>").addClass("MMHKPLUS_AutoCenter")
			.attr("id", "MMHKPLUS_AllianceStatistics_Graph")
			.css({width: 730, height: 380, float:"left", fontSize:"85%", marginBottom:"15px", marginLeft:"5px", marginTop:"5px"})
			.appendTo($container);
    	
    	var $overview = $("<div>")
    		.attr("id", "MMHKPLUS_AllianceStatistics_Overview")
			.css({width: 180, height: 100, marginTop:"5px", float:"right", fontSize:"80%"})
			.appendTo($container);
    	
    	var $reset = $("<div>")
    		.attr("id", "MMHKPLUS_AllianceStatistics_Reset")
    		.html(MMHKPLUS.localize("RESET"))
    		.css({float:"right", padding:"2px", marginRight:"10px", marginTop:"10px", marginBottom:"10px"})
    		.button()
    		.click(function() {self._updateGraph($parent);})
    		.appendTo($container);
    	
    	var $legend = $("<div>").addClass("MMHKPLUS_AllianceStatistics_LegendContainer MMHKPLUS_AutoCenter")
    		.appendTo($container);
    	
    	var $tooltip = $("#MMHKPLUS_AllianceStatistics_Tooltip");
    	if($tooltip.length == 0) {
    		$("<div>")
    			.attr("id", "MMHKPLUS_AllianceStatistics_Tooltip")
    			.addClass("MMHKPLUS_Tooltip")
    			.css("display", "none")
    			.appendTo($("body"));
    	}
    	
    	var options = 
    		{
    			tooltip : true,
    			tooltipOpts : {
    				xDateFormat: (MMHKPLUS.locale == "fr" ? "%d/%m" : "%m/%d") + " %H:%M",
    				content : function(label, xval, yval, item) 
    					{
    						var content = "<p class='MMHKPLUS_CellHeader MMHKPLUS_AutoCenter MMHKPLUS_TextCenter'>" + label + "</p>";
    						content += "<p class='MMHKPLUS_AutoCenter MMHKPLUS_TextCenter'>%x<br/>" + formatNumber(yval) + "</b></p>";
    						return content;
    					},
                    defaultTheme: false,
    				onHover : function(flotItem, $t) { $t.css({position:"absolute", top:flotItem.pageY + 5, left:flotItem.pageX + 5});}
    			},
				legend: {
					hideable : true,
					noColumns: 9,
				    margin: 2,
				    container: $legend
				},
				series: {
					lines: { show: true },
					points: { show: true }
				},
				grid: {
					hoverable: true,
					backgroundColor: { colors: [ "#fff", "#eee" ] },
					borderWidth: {
						top: 1,
						right: 2,
						bottom: 2,
						left: 1
					}
				},
				xaxis : {
					mode: "time",
				    timeformat: (MMHKPLUS.locale == "fr" ? "%d/%m" : "%m/%d") + "<br/>%H:%M"
				},
				yaxis : {
					tickFormatter: function (val, axis) 
						{
							if(val >= 1000000)
								return (val/1000000).toFixed(1) + "M"; 
							else if(val >= 10000)
								return (val/1000000).toFixed(2) + "M";
							else 
								return formatNumber(val);
						}
				},
				selection: {
					mode: "xy"
				}
			}
    	;
    	
    	if(self.revertYAxis) {
    		options.yaxis.min = 1; // revert Y axix = ranking graph, so min value is 1, not 0
    		options.yaxis.transform = function (v) { return -v; };
    		options.yaxis.inverseTransform = function (v) { return -v; };
    		options.yaxis.ticks = function piTickGenerator(axis) {
    		    var res = [];
    		    var diff = axis.max + 5 - Math.max(axis.min-5, 1);
    		    var o = Math.round(diff / 7);
    		    res.push(Math.round(Math.max(axis.min-5, 1)));
    		    for(var i = Math.max(axis.min-5, 1); i < axis.max+5; i++ ) {
    		    	if(i % o == 0)
    		    		res.push(i);
    		    };
    		    return res;
    		};
    		
    	}
    	
    	var optionsForOverview = $.extend({}, options,{
    		tooltip : false,
    		legend: {
				show: false
			},
    		series: {
    			lines: {
					show: true,
					lineWidth: 1
				},
				points: { show: false },
				shadowSize: 0
			},
			grid: {
				hoverable: false
			}
    	});
    	
    	var plot = $.plot("#MMHKPLUS_AllianceStatistics_Graph", series, options);
    	var overview = $.plot("#MMHKPLUS_AllianceStatistics_Overview", series, optionsForOverview);

		$("#MMHKPLUS_AllianceStatistics_Graph").bind("plotselected", function (event, ranges) {
			// clamp the zooming to prevent eternal zoom
			if (ranges.xaxis.to - ranges.xaxis.from < 0.00001) {
				ranges.xaxis.to = ranges.xaxis.from + 0.00001;
			}

			if (ranges.yaxis.to - ranges.yaxis.from < 0.00001) {
				ranges.yaxis.to = ranges.yaxis.from + 0.00001;
			}

			// do the zooming
			plot = $.plot(
				"#MMHKPLUS_AllianceStatistics_Graph", 
				plot.getData(),
				$.extend(true, {}, options, {
					xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
					yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
				})
			);
			// don't fire event on the overview to prevent eternal loop
			overview.setSelection(ranges, true);
		});

		$("#MMHKPLUS_AllianceStatistics_Overview").bind("plotselected", function (event, ranges) {
			plot.setSelection(ranges);
		});
    },
    
    _cleanGraph : function()
    {
    	$("div.MMHKPLUS_AllianceStatistics_GraphContainer").empty().remove();
    	$("#MMHKPLUS_AllianceStatistics_Graph").empty().remove();
    	$("#MMHKPLUS_AllianceStatistics_Overview").empty().remove();
    	$("div.MMHKPLUS_AllianceStatistics_LegendContainer").empty().remove();
    	$("#MMHKPLUS_AllianceStatistics_Reset").empty().remove();
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
    }
});
