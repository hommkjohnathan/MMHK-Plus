MMHKPLUS.KingdomHeroes = MMHKPLUS.PanelElement.extend({
	elementType : "KingdomHeroes",
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
		saveOpened : true,
		images : MMHKPLUS.URL_RESOURCES + "/images/kingdom/"
	},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this.options.title = MMHKPLUS.localize("HEROES");
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
	
	_createView : function()
	{
		var self = this;
		var params = $.map(MMHKPLUS.getElement("Player").getHeroes(), function(elem, i) { return [[elem.content.id]] ; });
		this.setProgressContent(this, MMHKPLUS.getElement("Ajax").getHeroFrame, params, self._pushHero, self._createViewContent, self._abort);    
	},
	
	_pushHero : function(json)
	{
		var key = Object.keys(json.d)[0];
		this.heroes.push(json.d[key]);
	},
	
	_createHeroStatContent : function(self, $parent, hero)
	{
		var bonusAtt = 0; var bonusDef = 0; var bonusMag = 0;
		hero.equipedArtefacts.forEach(function(a)
			{
				if(hasProperty(a, "defenseBonusAdd"))
					bonusDef += a.defenseBonusAdd;
				if(hasProperty(a, "attackBonusAdd"))
					bonusAtt += a.attackBonusAdd;
				if(hasProperty(a, "magicBonusAdd"))
					bonusMag += a.magicBonusAdd;
					
				if(hasProperty(a, "defenseBonusMult"))
					bonusDef += hero.defense * a.defenseBonusMult / 100;
				if(hasProperty(a, "attackBonusMult"))
					bonusAtt += hero.attack * a.attackBonusMult / 100;
				if(hasProperty(a, "magicBonusMult"))
					bonusMag += hero.magic * a.magicBonusMult / 100;
			}
		);
		
		$("<div>").addClass("MMHKPLUS_KingdomHeroesStats").css(
			{
				"background-image" : "url(" + self.options.images + "heroAttack_20.png)",
			}
		).html(parseInt(hero.attack + bonusAtt)).appendTo($parent);
		$("<div>").addClass("MMHKPLUS_KingdomHeroesStats").css(
			{
				"background-image" : "url(" + self.options.images + "heroDefense_20.png)",
			}
		).html(parseInt(hero.defense + bonusDef)).appendTo($parent);
		$("<div>").addClass("MMHKPLUS_KingdomHeroesStats").css(
			{
				"background-image" : "url(" + self.options.images + "heroMagic_20.png)",
			}
		).html(parseInt(hero.magic + bonusMag)).appendTo($parent);
		
		if(hasProperty(hero, "effectListAndOrigin"))
		{
			var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($parent, function($container, $tip)
				{
					var isFirst = true;
					hero.effectListAndOrigin.forEach(function(effect)
						{
							if(hasProperty(effect, "effects") && effect.effects.length > 0)
							{
								if(!isFirst)
								{
									$("<br>").appendTo($tip);
								}
								$("<p>").addClass("MMHKPLUS_TextCenter").html((effect.id == -1 ? MMHKPLUS.localize("ARTIFACTS") : effect.name)).appendTo($tip);
								$("<br>").appendTo($tip);
								effect.effects.forEach(function(e)
									{
										$("<p style='margin-left=10px'>").addClass("MMHKPLUS_100Width").html("- " + e.effectName).appendTo($tip);
									}
								);
								
								isFirst = false;
							}
						}
					);
					$tip = null;
					$container = null;
				}
			);
		}
	},
	
	_createClassContent : function(self, $parent, hero)
	{
		var $comp_img = $("<img>")
			.attr("src", self.options.images + "skills" + (hasProperty(hero, "learntClasses") && hero.learntClasses.length > 0 ? '' : "_disable") + ".png")
			.addClass("MMHKPLUS_KingdomHeroesCompImage")
			.appendTo($parent);
		if(hasProperty(hero, "learntClasses") && hero.learntClasses.length > 0)
		{
			var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($comp_img, function($container, $tip)
				{
					var $skillsTable = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo($tip);
					hero.learntClasses.forEach(function(classe)
						{
							var $line = $("<tr>").appendTo($skillsTable);
							var $classImgBlock = $("<td>").appendTo($line);
							MMHKPLUS.getCssSprite("HeroClass", classe.heroClassEntityTagName).addClass("MMHKPLUS_AutoCenter").appendTo($classImgBlock);
							$("<p>").addClass("center").html(classe.heroClassEntityName).appendTo($classImgBlock);
							var $classCompBlock = $("<td style='padding:5px';/>").appendTo($line);
							var $compTable = $("<table>").addClass("MMHKPLUS_KingdomHeroesSkillsTable").appendTo($classCompBlock);
							classe.skillList.forEach(function(skill)
								{
									if(skill.level > 0)
									{
										var $skillLine = $("<tr>").appendTo($compTable);
										var $skillImgBlock = $("<td>").addClass("MMHKPLUS_KingdomHeroesSkillImage").appendTo($skillLine);
										MMHKPLUS.getCssSprite("HeroClassSkill", skill.heroClassSkillEntityTagName).addClass("MMHKPLUS_AutoCenter").appendTo($skillImgBlock);
										$("<p>").addClass("center").html(skill.heroClassSkillEntityName + " (" + skill.level + ")").appendTo($skillImgBlock);
										$("<td>").addClass("MMHKPLUS_Cell").css({maxWidth : "350px"}).html(skill.currentLevelEffect.desc).appendTo($skillLine);
									}
								}
							);
						}
					);
					$tip = null;
					$container = null;
				}
			);
		}
	},
	
	_createSpellContent : function(self, $parent, hero)
	{
		var $spells_img = $("<img>")
			.attr("src", self.options.images + "spells" + (hasProperty(hero, "magicAllowed") && hero.magicAllowed ? "" : "_disable") + ".png")
			.addClass("MMHKPLUS_KingdomHeroesCompImage")
			.appendTo($parent);
		if(hasProperty(hero, "magicAllowed") && hero.magicAllowed && hasProperty(hero, "spellBookSpellStackList") && hero.spellBookSpellStackList.length > 0)
		{
			var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($spells_img, function($container, $tip)
				{
					var $spellTable = $("<table>").addClass("MMHKPLUS_100Width").appendTo($tip);
					hero.spellBookSpellStackList.forEach(function(s)
						{
							var $line = $("<tr>").appendTo($spellTable);
							var $spellImgBlock = $("<td>").addClass("MMHKPLUS_Cell").appendTo($line);
							MMHKPLUS.getCssSprite("SpellStack_" + s.attachedSpellEntity.magicSchoolEntityTagName, s.attachedSpellEntity.tagName)
								.addClass("MMHKPLUS_AutoCenter")
								.appendTo($spellImgBlock);
							$("<td>").addClass("MMHKPLUS_Cell MMHKPLUS_KingdomHeroesSpellNameCell center").html(s.spellEntityName).appendTo($line);
							$("<td>").addClass("MMHKPLUS_Cell").html(s.spellEffectText).appendTo($line);
						}
					);
					$tip = null;
					$container = null;
				}
			);
		}
	},
	
	_createArtefactContent : function(self, $parent, hero)
	{
		var $bg = $("<div/>").addClass("MMHKPLUS_KingdomHeroesArtifactsBg").appendTo($parent);
		var num = 0;
		hero.equipedArtefacts.forEach(function(artefact)
			{
				var $arteDiv = self._createArtefactImage(artefact, num).appendTo($bg);
				var $tooltip = MMHKPLUS.getElement("Tooltip", true).setContent($arteDiv, function($container, $tip)
					{
						$("<p>").addClass("MMHKPLUS_100Width center").html(artefact.artefactEntity.name).appendTo($tip);
						$("<br>").appendTo($tip);
						var eff = 1;
						while(hasProperty(artefact.artefactEntity, "effect" + eff))
						{
							$("<p style='margin-left=10px'>").addClass("MMHKPLUS_100Width").html("- " + artefact.artefactEntity["effect" + eff].desc).appendTo($tip);
							eff++;
						}
						$("<br>").appendTo($tip);
						$("<p>").addClass("MMHKPLUS_100Width center").html("<i>" + MMHKPLUS.localize("BODY_PART") + " : " + artefact.artefactEntity.bodyPartLoc + "</i>").appendTo($tip);
						
						$tip = null;
						$container = null;
					}
				);
				num++; 
			}
		);
	},
	
	_createArtefactImage : function(artefact, num)
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
		var $image = MMHKPLUS.getCssSprite(name, artefact.artefactEntity.tagName);
		var correctY = -1;
		var correctX = 12;
		var currentTop = num * 36;
		var positions =
			{
				HEAD : {x : 5, y : 6},
				NECKLACE : {x : 48, y : 6},
				RING : {x : 91, y : 6},
				LEFT_HAND : {x : 134, y : 6},
				CHEST : {x : 177, y : 6},
				RIGHT_HAND : {x : 221, y : 6},
				FEET : {x : 264, y : 6},
				CAPE : {x : 307, y : 6}
			};
		$image.css(
			{
				"position" : "relative",
				"top" : (positions[artefact.artefactEntity.bodyPart].y + correctY - currentTop) + "px",
				"left" : (positions[artefact.artefactEntity.bodyPart].x + correctX - 41)+ "px"
			}
		);
		return $image;
	},
	
	_createViewContent : function()
	{
		this.heroes.sort(function(a, b)
			{
				return b._level - a._level;
			}
		);

		var self = this;
		this.$elem.empty();
		var $table = $("<table>").addClass("MMHKPLUS_100Width MMHKPLUS_Table").appendTo(this.$elem);
		
		this.heroes.forEach(function(hero)
			{
				var $line = $("<tr>").addClass("MMHKPLUS_100Width").appendTo($table);
		
				var $heroAvatar = $("<td>").addClass("MMHKPLUS_KingdomArmiesCell MMHKPLUS_TextCenter").appendTo($line);
				MMHKPLUS.getCssSprite("Hero_" + hero.factionEntityTagName, "Hero" + hero.picture)
					.addClass("MMHKPLUS_AutoCenter")
					.appendTo($heroAvatar);
				$("<p>").html(hero.name).appendTo($heroAvatar);
				$("<p>").html(MMHKPLUS.localize("LEVEL") + " " + hero._level).appendTo($heroAvatar);
				
				var $stats = $("<td>").addClass("MMHKPLUS_Cell").appendTo($line);
				self._createHeroStatContent(self, $stats, hero);
				
				var $comp = $("<td>").addClass("MMHKPLUS_Cell").appendTo($line);
				self._createClassContent(self, $comp, hero);

				var $spells = $("<td>").addClass("MMHKPLUS_Cell").appendTo($line);
				self._createSpellContent(self, $spells, hero);
				
				var $arte = $("<td>").addClass("MMHKPLUS_Cell").appendTo($line);
				self._createArtefactContent(self, $arte, hero);
				
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
