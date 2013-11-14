MMHKPLUS.KingdomHeroesSpells = MMHKPLUS.PanelElement.extend({
	elementType : "KingdomHeroesSpells",
	heroes : [],
	
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
		this.options.title = MMHKPLUS.localize("HEROES_SPELLS");
		this.$elem = $("<div>");
		this._setupPanel();
		
		return this;
	},
	
	onSetup : function()
	{
		this.$elem.dialog(
			{
				minWidth : 650,
                minHeight : 120
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
		var params = $.map(MMHKPLUS.getElement("Player").getHeroes(), function(elem, i) { return (hasProperty(elem.content, "isWizard") && elem.content.isWizard ? [[elem.content.id]] : null);  });
		params.remove([]);
		this.setProgressContent(this, MMHKPLUS.getElement("Ajax").getHeroFrame, params, self._pushHero, self._createViewContent, self._abort);
	},
	
	_pushHero : function(json)
	{
		this.heroes.push(json.d[Object.keys(json.d)[0]]);
	},
	
	_createViewContent : function()
	{
		var self = this;
		this.$elem.empty();
		var isFirst = true;
		this.heroes.sort(function(a, b) { return b._level - a._level;});
		
		this.heroes.forEach(function(hero)
			{
				if(hasProperty(hero, "magicAllowed") && hero.magicAllowed && hasProperty(hero, "spellBookSpellStackList") && hero.spellBookSpellStackList.length > 0)
				{
					var $table = $("<table style='background-color:rgba(0, 255, 255, 0.05);'>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(self.$elem);
					var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
					$("<td style='width:10%;'>").addClass("MMHKPLUS_Cell").css({border : "none"})
						.append(
							MMHKPLUS.getCssSprite("Hero_" + hero.factionEntityTagName, "Hero" + hero.picture).addClass("MMHKPLUS_AutoCenter"))
						.append(
							$("<p>").addClass("MMHKPLUS_TextCenter").html(hero.name))
						.append(
							$("<p>").addClass("MMHKPLUS_TextCenter").html(MMHKPLUS.localize("LEVEL") + " " + hero._level))
						.appendTo($line);
					var $iTable = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table")
						.appendTo(
							$("<td style='width:90%;'>").addClass("MMHKPLUS_Cell").css({border : "none"})
								.appendTo($line));
					
					$("<tr>\
							<th class='MMHKPLUS_CellHeader' style='width:55px;'></th>\
							<th class='MMHKPLUS_CellHeader'>" + MMHKPLUS.localize("SPELL") + "</th>\
							<th class='MMHKPLUS_CellHeader' style='width:100px;'>" + MMHKPLUS.localize("READY_IN") + "</th>\
							<th class='MMHKPLUS_CellHeader' style='width:100px;'>" + MMHKPLUS.localize("IS_READY") + "</th>\
						</tr>"
					).appendTo($iTable);
					
								
					hero.spellBookSpellStackList.forEach(function(spell)
						{
							var $iLine = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($iTable);
							$("<td style='width:55px;'>").addClass("MMHKPLUS_Cell")
								.append(
									MMHKPLUS.getCssSprite("SpellStack_" + spell.attachedSpellEntity.magicSchoolEntityTagName, spell.attachedSpellEntity.tagName)
										.addClass("MMHKPLUS_AutoCenter"))
								.appendTo($iLine);
							$("<td>").addClass("MMHKPLUS_Cell")
								.append(
									$("<p>").html("<b>" + spell.spellEntityName + "</b>"))
								.append(
									$("<br>"))
								.append(
									$("<p style='padding-bottom:7px;'>").html(spell.spellEffectText))
								.appendTo($iLine);
								
							var cooldownDate = new Date();
							cooldownDate.setTime(spell.cooldownDate * 1000);
							if(spell.hasOwnProperty('cooldownDate') && cooldownDate > $.now())
							{
								var d = new Date();
								var d2 = new Date();
								d.setTime(spell.cooldownDate * 1000);
								d2.setTime(spell.cooldownDate * 1000 - d2.getTime());
								$("<td style='width:100px;'>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
									.append(
										$("<p>").html(d2.countDown()))
									.appendTo($iLine);
								$("<td style='width:100px;'>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
									.append(
										$("<p>").html(d.toShortFrenchFormat().replace(" ", "<br/>")))
									.appendTo($iLine);
							}
							else
							{
								$("<td style='width:100px;'>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
									.append(
										$("<p>").html(MMHKPLUS.localize("READY")))
									.appendTo($iLine);
								$("<td style='width:100px;'>").addClass("MMHKPLUS_Cell MMHKPLUS_TextCenter")
									.append(
										$("<p>").html(MMHKPLUS.localize("READY")))
									.appendTo($iLine);
							}
						}
					);
					self.$elem.append($("<br/><br/>"));
					isFirst = false;
				}
			}
		);
		
		this.heroes = null;
		this.heroes = [];
	},
	
	_abort : function()
	{
		this.heroes = null;
		this.heroes = [];
	},
	
	unload : function()
	{
		MMHKPLUS.resetElement(this.$elem);
		destroy(this.heroes); this.heroes = null;
	}
});
