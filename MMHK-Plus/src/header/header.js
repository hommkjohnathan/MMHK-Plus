var realWindow = window;

if (Boolean(window.chrome)) {
	var div = document.createElement("div");
	div.setAttribute("onclick", "return window;");
	realWindow = div.onclick();
	div = null;
}
