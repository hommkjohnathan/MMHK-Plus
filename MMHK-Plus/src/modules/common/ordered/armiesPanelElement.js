MMHKPLUS.ArmiesPanelElement = MMHKPLUS.PanelElement.extend({
	elementType : "ArmiesPanelElement",
	
	sortStack : function(a, b)
	{
		if(a.tier == b.tier)
		{
			if(a.factionEntityTagName < b.factionEntityTagName)
				return -1;
			if(a.factionEntityTagName > b.factionEntityTagName)
				return 1;
			return 0;
		}
		else
		{   
			if(a.tier < b.tier)
				return -1;
			if(a.tier > b.tier)
				return 1;
		}
	},
	
	pushStack : function(stack, armies)
	{
		var rank = -1; var i = 0;
		armies.forEach(function(army)
			{
				if(army.tier == stack.tier && army.factionEntityTagName == stack.factionEntityTagName)
				{
					rank = i;
				}
				i++;
			}
		);
		if(rank == -1)
		{
			armies.push(
				{
					factionEntityTagName : stack.factionEntityTagName,
					tier : stack.tier,
					quantity : stack.quantity,
					unitEntityBombardPower : stack.unitEntityBombardPower,
					unitEntityName : stack.unitEntityName,
					unitEntityTagName : stack.unitEntityTagName,
					unitEntityPower : stack.unitEntityPower,
					unitEntityType : stack.unitEntityType
				}
			);
		}
		else
		{
			armies[rank].quantity += stack.quantity;
		}
	},
	
	getStacks : function(tier, armies)
	{
		var result = [];
		armies.forEach(function(army)
			{
				if(army.tier.indexOf(tier + "") != -1)
				{
					result.push(army);
				}
			}
		);
		result.sort(this.sortStack);
		return result;
	},
	
	getPower : function(armies)
	{
		var result = 0;
		armies.forEach(function(stack)
			{
				result += (hasProperty(stack, "avail") ? stack.avail : stack.quantity) * (hasProperty(stack, "power") ? stack.power : stack.unitEntityPower);
			}
		);
        return result;
	}
});
