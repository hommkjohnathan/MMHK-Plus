MMHKPLUS.KingdomCitiesSpells = MMHKPLUS.PanelElement.extend({
	elementType : "KingdomCitiesSpells",
	cities : [],
	
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
		this.options.title = MMHKPLUS.localize("CITIES_SPELLS");
		this.$elem = $("<div>");
		this._setupPanel();
		
		return this;
	},
	
	onSetup : function()
	{
		this.$elem.dialog(
			{
				minWidth : 500,
                minHeight : 170
			}
		);
	},
	
	onOpen : function()
	{
		this._createView();
	},
	
	_createView : function()
	{
		var self = this;
		var params = $.map(MMHKPLUS.getElement("Player").getCities(), function(elem, i) { return [[elem.content.id]] ; });
		this.setProgressContent(this, MMHKPLUS.getElement("Ajax").getMagicGuildFrame, params, self._pushCityGuild, self._createViewContent, self._abort);
	},

	_pushCityGuild : function(json)
	{
		var key = Object.keys(json.d)[0];
		this.cities.push(
			{
				id : json.d[key].id || -1,
				captureDate : MMHKPLUS.getElement("Player").getCity(json.d[key].id).content.captureDate || 0,
				spellsList : json.d[key].spellStackList || []
			}
		);
	},
	
	getMagicSchools : function(spellsList)
	{
		var result = [];
		spellsList.forEach(function(s)
			{
				if(result.indexOf(s.attachedSpellEntity.magicSchoolEntityTagName) == -1)
					result.push(s.attachedSpellEntity.magicSchoolEntityTagName);
			}
		);
		return result;
	},
	
	getSpell : function(magicSchool, level, spellsList)
	{
		var spell = null;
		spellsList.forEach(function(s)
			{
				if(level == 5 && s.attachedSpellEntity.magicSchoolLevel == level)
					spell = s
				else if(s.attachedSpellEntity.magicSchoolEntityTagName == magicSchool && s.attachedSpellEntity.magicSchoolLevel == level)
					spell = s;
			}
		);
		
		if(spell == null)
			return "";
		
		var $result = MMHKPLUS.getCssSprite("SpellStack_" + spell.attachedSpellEntity.magicSchoolEntityTagName, spell.spellEntityTagName).addClass("MMHKPLUS_AutoCenter");
		var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($result, function($container, $tip)
			{
				$("<p>").addClass("MMHKPLUS_TextCenter")
					.html("<b>" + spell.spellEntityName + " - " + MMHKPLUS.localize("LEVEL") + " " + spell.attachedSpellEntity.magicSchoolLevel + "</b>")
					.appendTo($tip);
				$("<br>").appendTo($tip);
				$("<p>").addClass("MMHKPLUS_TextCenter")
					.html(spell.attachedSpellEntity.description)
					.appendTo($tip);
				
				$tip = null;
				$container = null;
			}
		);
		return $result;
	},
	
	_createTableContent : function(self, $parent, spellsList)
	{
		var $firstLine = $parent.find("tr");
		var $secondLine = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($parent);
		
		var magicSchools = self.getMagicSchools(spellsList);
		
		for(var i = 0 ; i < 4 ; i++)
		{
			$("<td style='width:20%; padding:10px;'>")
				.append(self.getSpell(magicSchools[0], i+1, spellsList))
				.appendTo($firstLine);
		}
		for(var i = 0 ; i < 4 ; i++)
		{
			$("<td style='width:20%; padding:10px;'>")
				.append(self.getSpell(magicSchools[1], i+1, spellsList))
				.appendTo($secondLine);
		}
		$("<td style='width:20%; padding:10px;' rowspan='2'>")
			.append(self.getSpell("", 5, spellsList))
			.appendTo($firstLine);
	},
	
	_createViewContent : function()
	{
		var self = this;
		this.cities.sort(function(a, b) { return a.captureDate - b.captureDate ; });
		
		this.cities.forEach(function(c)
			{
				if(c.spellsList.length > 0)
				{
					var city = MMHKPLUS.getElement("Player").getCity(c.id);
					
					var $table = $("<table style='background-color:rgba(0, 255, 255, 0.05);'>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(self.$elem);
					var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
					$("<td style='width:20%;' rowspan='2'>").addClass("MMHKPLUS_Cell").css({border : "none"})
						.append(
							MMHKPLUS.getCssSprite("City_" + city.content.factionEntityTagName, "Level" + city.content.displayLevel).addClass("MMHKPLUS_AutoCenter"))
						.append(
							$("<p style='margin-bottom:10px;'>").addClass("MMHKPLUS_TextCenter").html(city.content.cityName))
						.appendTo($line);
					
					self._createTableContent(self, $table, c.spellsList);
					
					self.$elem.append($("<br/><br/>"));
				}
			}
		);

		this.cities = null;
		this.cities = [];
	},
	
	_abort : function()
	{
		this.cities = null;
		this.cities = [];
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
		destroy(this.cities); this.cities = null;
	}
});
