var realWindow = window;

/*
  Old Chrome hack to retrieve unsafe window
  Since Chrome 27 it does not work. 
  //TODO find a solution?
  
	if (Boolean(window.chrome)) {
		var div = document.createElement("div");
		div.setAttribute("onclick", "return window;");
		realWindow = div.onclick();
		div = null;
	}

*/
