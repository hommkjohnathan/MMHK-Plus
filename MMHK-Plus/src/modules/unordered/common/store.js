MMHKPLUS.Store = MMHKPLUS.ExtendableElement.extend({
	elementType : "Store",
	
	options : {
		oldName : "MMHKPLUS_LOCAL_STORAGE",
		version : 1,
		prefix : "MMHKPLUS_",
		pStorageName : "PREFERENCES",
		worldsName : "WORLDS",
		marksName : "MARKS",
		notepadName : "NOTEPAD",
		quota : 2.3 * 1024 * 1024
	},
	
	cache : {},
	
	init : function(options)
	{
		this.options = $.extend({}, this.options, options);
		this._initStorage();
		
		return this;
	},
	
	get : function(id)
	{
		var object = null;
		if(hasProperty(this.cache, id))
		{
			object = this.cache[id];
		}
		else
		{
			object = JSON.parse(localStorage.getItem(id));
			this.cache[id] = object;
		}
		return object;
	},
	
	set : function(id, value)
	{
		if(this._isQuotaReached())
		{
			this._displayQuotaError();
			return;
		}
		try 
		{
			localStorage.setItem(id, JSON.stringify(value));
			if(hasProperty(this.cache, id))
			{
				delete this.cache[id];
			}
		}
		catch(e)
		{
			console.log(e);
			this._displayQuotaError();
		}
	},
	
	getProperty : function(id, property)
	{
		var object = null;
		if(hasProperty(this.cache, id))
		{
			object = this.cache[id];
			if(object && isDefined(property))
			{
				object = (object[property] != null ? object[property] :  null);
			}
		}
		else
		{
			object = localStorage.getItem(this.options.prefix + this.options.pStorageName);
			object = JSON.parse(object)[id] || null;
			this.cache[id] = object;
			if(object && isDefined(property))
			{
				object = (object[property] != null ? object[property] :  null);
			}
		}
		return object;
	},
	
	setProperty : function(id, property, value)
	{
		if(this._isQuotaReached())
		{
			this._displayQuotaError();
			return;
		}
		if(!isDefined(value))
		{
			value = property;
			property = null;
		}
		
		var object = JSON.parse(localStorage.getItem(this.options.prefix + this.options.pStorageName));
		if(!object) object = {};
		if(isDefined(property))
		{
			if(!object[id]) object[id] = {};
			object[id][property] = value;
		}
		else
		{
			object[id] = value;
		}
		try 
		{
			localStorage.setItem(this.options.prefix + this.options.pStorageName, JSON.stringify(object));
			if(hasProperty(this.cache, id))
			{
				delete this.cache[id];
			}
		}
		catch(e)
		{
			console.log(e);
			this._displayQuotaError();
		}
	},

    spaceUsed : function()
    {
        return unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
    },
	
	_initStorage : function()
	{
		var needDeletion = [];
		var keep  = 
			[
				this.options.prefix + this.elementType + "_" + this.options.version,
				this.options.prefix + this.options.pStorageName,  
				this.options.prefix + this.options.worldsName, 
				this.options.prefix + this.options.marksName, 
				this.options.prefix + this.options.notepadName
			];
		for(var i = 0 ; i < localStorage.length ; i++)
		{
			if(keep.indexOf(localStorage.key(i)) == -1)
				needDeletion.push(localStorage.key(i));
		}
		needDeletion.forEach(function(k)
			{
				localStorage.removeItem(k);
			}
		);
	
		var storeName = this.options.prefix + this.elementType + "_" + this.options.version;
		if(!localStorage.getItem(storeName))
		{
			this.set(storeName, storeName);
		}
		if(!localStorage.getItem(this.options.prefix + this.options.pStorageName))
		{
			this.set(this.options.prefix + this.options.pStorageName, {});
		}
		if(!localStorage.getItem(this.options.prefix + this.options.worldsName))
		{
			this.set(this.options.prefix + this.options.worldsName, {});
		}
		if(!localStorage.getItem(this.options.prefix + this.options.marksName))
		{
			this.set(this.options.prefix + this.options.marksName, {});
		}
		if(!localStorage.getItem(this.options.prefix + this.options.notepadName))
		{
			this.set(this.options.prefix + this.options.notepadName, {});
		}
	},

	_isQuotaReached : function()
	{
		return this.options.quota - this.spaceUsed() < 1000; 
	},
	
	_displayQuotaError : function()
	{
		MMHKPLUS.alert(MMHKPLUS.localize("QUOTA_REACHED"), MMHKPLUS.localize("QUOTA_REACHED_TEXT"));
	},
	
	unload : function()
	{
		destroy(this.cache);
	}
});
