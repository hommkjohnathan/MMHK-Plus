var readyStateCheckInterval = setInterval(function() 
	{
		if(document.readyState == "complete")
		{
			var div = document.createElement("script");
			div.setAttribute("type", "text/javascript");
			div.setAttribute("src", "${mmhk-plus.website.url}/script/download.php?.user.js");
			document.getElementsByTagName("body")[0].appendChild(div);
			clearInterval(readyStateCheckInterval);
			readyStateCheckInterval = null;
		}
	}, 
	200
);
