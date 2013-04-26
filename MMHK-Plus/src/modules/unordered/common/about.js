MMHKPLUS.About = MMHKPLUS.PanelElement.extend({
    elementType : "About",
    
    options : {
        title : "",
        resizable : false,
        opened : false,
        x : "center",
        y : "center",
        w : 500,
        h : 180,
        savePos : true,
        saveWidth : false,
        saveHeight : false,
        saveOpened : false
    },
    
    init : function(options)
    {
        this.options = $.extend({}, this.options, options);
        this.options.title = MMHKPLUS.localize("ABOUT");
        this.$elem = $("<div>");

        this._setupPanel();
        
        return this;
    },

    onOpen : function()
    {
        this._createView();
    },

    _createView : function()
    {
        $("<p>")
            .addClass("center").css("fontSize", 20)
            .html("<a class='MMHKPLUS_Link' target='_blank' href='" + MMHKPLUS.URL  + "'>" + MMHKPLUS.localize("SITE") + "</a>")
            .appendTo(this.$elem);

        $("<br>").appendTo(this.$elem);

        $("<p>")
            .addClass("center")
            .html(MMHKPLUS.localize("ABOUT_TEXT"))
            .appendTo(this.$elem);
    },

    unload : function()
    {
        MMHKPLUS.resetElement(this.$elem);
    }
});
