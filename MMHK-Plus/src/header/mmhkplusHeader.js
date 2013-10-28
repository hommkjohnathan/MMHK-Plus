var MMHKPLUS = {};
MMHKPLUS.version = "${mmhk-plus.script.version}";
MMHKPLUS.contact = "${mmhk-plus.author.email}";
MMHKPLUS.HOMMK = window.HOMMK;
MMHKPLUS.locale = "fr";
MMHKPLUS.URL = "${mmhk-plus.website.url}";
MMHKPLUS.URL_JACTARI = "${mmhk-plus.jactari.website.url}";
MMHKPLUS.URL_IMAGES = MMHKPLUS.URL + "/script/images/";
MMHKPLUS.URL_PHP = MMHKPLUS.URL + "/script/php/";
MMHKPLUS.URL_API = (MMHKPLUS.URL + "/api/v1/").replace("http://www.", "http://"); // Need to remove www since we get a 301 http response with it (?)

MMHKPLUS.elementPool = {};
MMHKPLUS.resources = [ "GOLD", "WOOD", "ORE", "MERCURY", "CRYSTAL", "SULFUR", "GEM" ];
MMHKPLUS.factions = [ "ACADEMY", "HAVEN", "INFERNO", "NECROPOLIS", "SYLVAN", "DUNGEON", "DWELLING", "NEUTRAL", "FORTRESS", "COMMON"];

