MMHKPLUS.ExtendableElement = {
	elementType : "ExtendableElement",
	
	store : null,
	
	save : function(property, value)
	{
		if(!this.store)
		{
			this.store = MMHKPLUS.getElement("Store");
		}
		this.store.setProperty(this.elementType, property, value);
	},
	
	load : function(property)
	{
		if(!this.store)
		{
			this.store = MMHKPLUS.getElement("Store");
		}
		return this.store.getProperty(this.elementType, property);
	},
	
	extend : function()
	{
		var newClass = {};
		$.extend(newClass, newClass, this);
		for(var i = 0 ; i < arguments.length ; i++)
		{
			$.extend(newClass, newClass, arguments[i]);
		}
		return newClass;
	},
	
	isset : function (property) 
	{
        return hasProperty(this, property);
    },
	
	get : function(property)
	{
		if(!this.isset(property))
			return null;
		return this[property];
	},
	
	set : function(property, value)
	{
		this[property] = value;
	},
	
	unload : function()
	{
		// Nothing
	}
};
