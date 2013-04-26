MMHKPLUS.KingdomArtifacts = MMHKPLUS.PanelElement.extend({
	elementType : "KingdomArtifacts",
	informations : [],
	
	options : {
		title : "",
		resizable : true,
		opened : false,
		x : "center",
		y : "center",
		w : 800,
		h : 350,
		savePos : true,
		saveWidth : true,
		saveHeight : true,
		saveOpened : true
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("ARTIFACTS");
		this.$elem = $("<div>");
		this._setupPanel();
		
		return this;
	},
	
	onSetup : function()
	{
		this.$elem.dialog(
			{
				minWidth : 700,
                minHeight : 120
			}
		);
	},
	
	onOpen : function()
	{
		this._createView();
	},
	
	_isInInformations : function(id)
	{
		var found = false;
		this.informations.forEach(function(i)
			{
				if(i.id == id)
					found = true;
			}
		);
		return found;
	},
	
	_createView : function()
	{
		var self = this;
		var params = $.map(MMHKPLUS.getElement("Player").getHeroes(), function(elem, i) { return [[elem.content.id]] ; });
		$("<p style='margin-bottom:10px;font-style:italic;'>").addClass("MMHKPLUS_TextCenter MMHKPLUS_100_Width").html(MMHKPLUS.localize("SEARCH_HEROES")).appendTo(self.$elem);
		this.setProgressContent(this, MMHKPLUS.getElement("Ajax").getHeroFrame, params, self._pushHeroInformation, self._getCitiesInformations, self._abort);
	},
	
	_getCitiesInformations : function()
	{
		var self = this;
		var params = $.map(MMHKPLUS.getElement("Player").getCities(), function(elem, i) { return [[elem.content.id]] ; });
		var toRemove = [];
		params.forEach(function(p)
			{
				if(self._isInInformations(p[0]))
					toRemove.push(p);
			}
		);
		toRemove.forEach(function(p)
			{
				params.remove(p);
			}
		);

        if(params.length != 0)
        {
            setTimeout(function() 
                {
                    self.$elem.empty();
                    $("<p style='margin-bottom:10px;font-style:italic;'>").addClass("MMHKPLUS_TextCenter MMHKPLUS_100_Width").html(MMHKPLUS.localize("SEARCH_CITIES")).appendTo(self.$elem);
                    self.setProgressContent(self, MMHKPLUS.getElement("Ajax").getMarketPlaceFrame, params, self._pushCityInformation, self._createViewContent, self._abort);
                },
                100
            );
        }
        else
        {
            self._createViewContent();
        }
		
	},
	
	_pushHeroInformation : function(json)
	{
		var found = false;
		var heroFrame = json.d[Object.keys(json.d)[0]];
		if((hasProperty(heroFrame, "regionArtefacts") && heroFrame.regionArtefacts.length > 0)
			|| (hasProperty(heroFrame, "backpackArtefacts") && heroFrame.backpackArtefacts.length > 0)
			|| (hasProperty(heroFrame, "equipedArtefacts") && heroFrame.equipedArtefacts.length > 0))
		{
			this.informations.forEach(function(i)
				{
					if(i.id == heroFrame.regionId)
					{
						found = true;
						i[heroFrame.id] = heroFrame;
					}
				}
			);
			if(!found)
			{
				var i = { id : heroFrame.regionId || -1 };
				i[heroFrame.id] = heroFrame;
				i.artefacts = (hasProperty(heroFrame, "regionArtefacts") ? heroFrame.regionArtefacts : []);
				this.informations.push(i);
			}
		}
	},
	
	_pushCityInformation : function(json)
	{
		var key = Object.keys(json.d)[0];
		this.informations.push({id : key.replace("MarketPlaceFrame", ""),  artefacts : json.d[key].cityArtefactList || [] });
	},
	
	_createLineContent : function(self, $parent, artefact, name, owner, color)
	{
		var $line = $("<tr style='background-color:" + color + ";'>").addClass("MMHKPLUS_100Width").appendTo($parent);
		$("<td>").addClass("MMHKPLUS_Cell")
			.append(
				MMHKPLUS.getCssSprite(self._getArtefactSpriteName(artefact), artefact.artefactEntity.tagName).addClass("MMHKPLUS_AutoCenter"))
			.appendTo($line);
		var $desc = $("<td>").addClass("MMHKPLUS_Cell")
			.append(
				$("<p>").html("<b>" + artefact.artefactEntity.name + "</b>"))
			.append(
				$("<br>"))
			.appendTo($line);
		var eff = 1;
		while(hasProperty(artefact.artefactEntity, "effect" + eff))
		{
			$("<p style='margin-left=10px'>").addClass("MMHKPLUS_100Width").html("- " + artefact.artefactEntity["effect" + eff].desc).appendTo($desc);
			eff++;
		}
		$desc
			.append(
				$("<br>"))
			.append(
				$("<p style='padding-bottom:5px;'>").html("<i>" + MMHKPLUS.localize("BODY_PART") + " : " + artefact.artefactEntity.bodyPartLoc + "</i>"));
		$("<td>").addClass("MMHKPLUS_Cell center")
			.append(
				$("<p>").html(name))
			.appendTo($line);
		$("<td>").addClass("MMHKPLUS_Cell center")
			.append(
				$("<p>").html(owner))
			.appendTo($line);
	},
	
	_createViewContent : function()
	{
		var self = this;
		this.$elem.empty();
		
		var $table = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(this.$elem);
		$("<tr>\
				<th class='MMHKPLUS_CellHeader' style='width:55px;'>" + "" + "</th>\
				<th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("ARTIFACT") + "</th>\
				<th class='MMHKPLUS_CellHeader' style='width:120px;'>" + MMHKPLUS.localize("CITY") + "</th>\
				<th class='MMHKPLUS_CellHeader' style='width:120px;'>" + MMHKPLUS.localize("OWNER") + "</th>\
			</tr>"
		).appendTo($table);
		
		
		this.informations.forEach(function(info)
			{
				var city = MMHKPLUS.getElement("Player").getCity(info.id);
				var name = "?";
				if(city)
				{
					name = city.content.cityName;
				}
				
				info.artefacts.forEach(function(artefact)
					{
						self._createLineContent(self, $table, artefact, name, name, "rgba(50, 205, 50, 0.25)");
					}
				);
				
				for(var i in info)
				{
					if(i != "artefacts" && i != "id")
					{
						var equiped = info[i].equipedArtefacts || [];
						var backpack = info[i].backpackArtefacts || [];
						
						equiped.forEach(function(artefact)
							{
								self._createLineContent(self, $table, artefact, name, info[i].name + "<br/>(" + MMHKPLUS.localize("EQUIPPED") + ")", "rgba(166, 42, 42, 0.25)");
							}
						);
						backpack.forEach(function(artefact)
							{
								var binded = "";
								if(hasProperty(artefact, "binded") && artefact.binded == 1 && (!hasProperty(artefact, "unbindDate") || artefact.unbindDate * 1000 - $.now() > 0))
								{
									binded += "<br/>";
									var d = new Date(); d.setTime(artefact.unbindDate * 1000 - d.getTime());
									binded += MMHKPLUS.localize("UNBIND_IN") + " " + d.countDown();
								}
								self._createLineContent(self, $table, artefact, name, info[i].name + "<br/>(" + MMHKPLUS.localize("BACKPACK") + ")" + binded, "rgba(0, 0, 156, 0.25)");
							}
						);
					}
				}
			}
		);
		
		this.informations = null;
		this.informations = [];
	},
	
	_getArtefactSpriteName : function(artefact)
	{
		var name = "" ;
		if (artefact.artefactEntity.artefactType == MMHKPLUS.HOMMK.ARTEFACT_TYPE_REWARD || artefact.artefactType == MMHKPLUS.HOMMK.ARTEFACT_TYPE_REGION_BUILDING_LOOT) 
		{
			name = "Artefact_REWARD";
		} else 
		{
			if (artefact.artefactEntity.artefactType == MMHKPLUS.HOMMK.ARTEFACT_TYPE_HEREDITY) 
			{
				name = "Artefact_HEREDITY";
			} else 
			{
				if (artefact.artefactEntity.artefactType == "event" || artefact.artefactSetEntityId != null) 
				{
					name = "Artefact_SET";
				} else 
				{
					name = "Artefact_COMMON";
				}
			}
		}
		return name;
	},
	
	_abort : function()
	{
		this.informations = null;
		this.informations = [];
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
		destroy(this.informations); this.informations = null;
	}
});
