// ==UserScript==
// @name            MMHK-Plus
// @author          ${mmhk-plus.author.name}
// @version         ${mmhk-plus.script.version}
// @description     ${mmhk-plus.script.description}
// @include         http://mightandmagicheroeskingdoms.ubi.com/play*
// @include         http://mightandmagicheroeskingdoms.ubi.com/play#*
// @include         http://mightandmagicheroeskingdoms.ubi.com/play
// ==/UserScript==

${mmhk-plus.licence}

var realWindow = window;

if (Boolean(window.chrome)) {
	var div = document.createElement("div");
	div.setAttribute("onclick", "return window;");
	realWindow = div.onclick();
	div = null;
}
