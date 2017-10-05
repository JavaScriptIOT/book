$axure = function () { };
if (typeof console == 'undefined') console = {
    log: function () { }
};

function setUpController() {

    $axure.utils = _axUtils;

    $(document).ready(function () {
//        if (!CHROME_5_LOCAL) {
//            $('#mainFrame').bind('load', function () {
//                $axure.page.triggerEvent('load');
//            });
//        } else {
//            $('#axureEventDiv').bind('routedEventFired', function () {
//                var request = JSON.parse($(this).text());
//                if (request.message == 'pageLoad') {
//                    $axure.page.data = request.data;
//                    $axure.page.triggerEvent('load');
//                }
//            });
//        }
    });

    var _page = {};
    $axure.page = _page;

    _axUtils.makeBindable(_page, ['load']);

    var _player = function () { }
    $axure.player = _player;

    $axure.messageCenter.addStateListener('page.data', function (key, value) {
        for (var subKey in value) {
            _page[subKey] = value[subKey];
        }
        $axure.page.triggerEvent('load');
    });

    // ---------------------------------------------
    // Navigates the main frame (setting the currently visible page). If the link is relative,
    // this method should test if it is actually a prototype page being loaded and properly set
    // up all the controller for the page if it is
    // ---------------------------------------------
    _page.navigate = function (url) {
        var mainFrame = document.getElementById("mainFrame");
        //var mainFrame = window.parent.mainFrame;
        // if this is a relative url...
        if (url.indexOf(':') < 0 || url[0] == '/') {
            var winHref = window.location.href;
            var page = winHref.substring(0, winHref.lastIndexOf('/') + 1) + url;
            mainFrame.contentWindow.location.href = page;
        } else {
            mainFrame.contentWindow.location.href = url;
        }
    };

    var pluginIds = [];
    var currentVisibleHostId = null;
    // ---------------------------------------------
    // Adds a tool box frame from a url to the interface. This is useful for loading plugins
    // settings is an object that supports the following properties:
    //    - id : the id of the element for the plugin
    //    - context : the context to create the plugin host for
    //    - title : the user-visible caption for the plugin
    // ---------------------------------------------
    _player.createPluginHost = function (settings) {
        // right now we only understand an interface context
        if (!(!settings.context || settings.context === 'interface')) {
            throw ('unknown context type');
        }
        if (!settings.id) throw ('each plugin host needs an id');

        var host = $('<div id=' + settings.id + '></div>')
            .appendTo('#interfaceControlFrameContainer');

        var isCurrentDefault = (pluginIds.length == 0);
        if (!isCurrentDefault) {
            host.hide();
        } else {
            currentVisibleHostId = settings.id;
        }


        //$('#interfaceControlFrameHeader').append('<li>' + settings.title + '</li>');
        var headerLink = $('<a pluginId="' + settings.id + '" >' + settings.title + '</a>');

        headerLink
            .click($axure.utils.curry(interfaceControlHeaderButton_click, settings.id)).wrap('<li>')
            .parent().appendTo('#interfaceControlFrameHeader');

        if (isCurrentDefault) {
            headerLink.addClass('selected');
        }

        pluginIds[pluginIds.length] = settings.id;
    };

    // private methods
    var interfaceControlHeaderButton_click = function (id) {
        $('#interfaceControlFrameHeader a').removeClass('selected');
        $('#interfaceControlFrameHeader a[pluginId=' + id + ']').addClass('selected');

        $('#' + currentVisibleHostId).hide();
        $('#' + id).show();
        currentVisibleHostId = id;
    };
}

function setUpDocumentStateManager() {
    var mgr = $axure.prototype.documentStateManager = {};
    _axUtils.makeBindable(mgr, ['globalVariableChanged']);

    mgr.globalVariableValues = {};

    mgr.setGlobalVariable = function (varname, value, source) {
        var arg = {};
        arg.variableName = varname;
        arg.newValue = value;
        arg.oldValue = this.getGlobalVariable(varname);
        arg.source = source;

        mgr.globalVariableValues[varname] = value;
        this.triggerEvent('globalVariableChanged', arg);
    }

    mgr.getGlobalVariable = function (varname) {
        return mgr.globalVariableValues[varname];
    }
}


function setUpPageStateManager() {
    var mgr = $axure.prototype.pageStateManager = {};

    mgr.panelToStateIds = {};
}

//setUpController();
//setUpDocumentStateManager();
//setUpPageStateManager();
