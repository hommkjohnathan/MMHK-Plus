var readyStateCheckInterval = setInterval(function() 
	{
		if(!!window.HOMMK && window.HOMMK.worldMap && window.HOMMK.worldMap.content && window.HOMMK.worldMap.content._size)
		{
			clearInterval(readyStateCheckInterval);
			readyStateCheckInterval = null;

			MMHKPLUS.init();
			console.log("MMHK-Plus : load complete");
		}
	}, 
	200
);

function onBeforeUnload() {
  MMHKPLUS.unload();
    console.log("MMHK-Plus : Unload complete");
};
window.addEventListener("beforeunload", onBeforeUnload, true);

})(realWindow, JQuery.jquery);