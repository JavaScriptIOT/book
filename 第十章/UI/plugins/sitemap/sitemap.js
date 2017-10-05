// use this to isolate the scope
(function () {

    var SHOW_HIDE_ANIMATION_DURATION = 0;

    $(document).ready(function () {
        $axure.player.createPluginHost({
            id: 'sitemapHost',
            context: 'interface',
            title: 'Sitemap'
        });

        generateSitemap();

        $('.sitemapPlusMinusLink').toggle(collapse_click, expand_click);
        $('.sitemapPageLink').click(node_click);

        $('#linkscontainer').hide();
        $('#togglelinks').click(links_click);
        $('.sitemapLinkField').click(function () { this.select() })

        //        $('#sitemapHost').parent().resize(function () {
        //            $('#sitemapHost').height($(this).height());
        //        });

        // bind to the page load
        $axure.page.bind('load.sitemap', function () {
            var pageLoc = $axure.page.location.split("#")[0];
            var decodedPageLoc = decodeURI(pageLoc);
            var nodeUrl = decodedPageLoc.substr(decodedPageLoc.lastIndexOf('/') ? decodedPageLoc.lastIndexOf('/') + 1 : 0);

            $('.sitemapPageLink').removeClass('sitemapHighlight');
            $('.sitemapPageLink[nodeUrl=' + nodeUrl + ']').addClass('sitemapHighlight');


            $('#linkspagename').html($('.sitemapHighlight > .sitemapPageName').html());

            var playerLoc = $(location).attr('href').split("#")[0];
            var qString = "?Page=" + nodeUrl.substr(0, nodeUrl.lastIndexOf('.'));
            $('#linkwithplayer').val(playerLoc + qString);
            $('#linkwithoutplayer').val(pageLoc);

            $('#closeplayer').unbind('click');
            $('#closeplayer').click(function () { window.location.href = pageLoc; });

            return false;
        });


    });

    function collapse_click(event) {
        $(this)
            .children('.sitemapMinus').removeClass('sitemapMinus').addClass('sitemapPlus').end()
            .closest('li').children('ul').hide(SHOW_HIDE_ANIMATION_DURATION);
    }

    function expand_click(event) {
        $(this)
            .children('.sitemapPlus').removeClass('sitemapPlus').addClass('sitemapMinus').end()
            .closest('li').children('ul').show(SHOW_HIDE_ANIMATION_DURATION);
    }

    function node_click(event) {
        $axure.page.navigate(this.getAttribute('nodeUrl'));
    }

    function links_click(event) {
        $('#linkscontainer').toggle();
        if ($('#linkscontainer').is(":visible")) {
            $('#togglelinks').html('Hide Links');
        } else {
            $('#togglelinks').html('Show Links');
        }
    }

    function generateSitemap() {
        var treeUl = "<div id='sitemapTreeContainer'>";
        treeUl += "<div class='sitemapToolbar'><a id='togglelinks' class='sitemapToolbarButton'>Show Links</a><div id='linkscontainer'>";
        treeUl += "<span id='linkspagename'>Page Name</span>";
        treeUl += "<div class='sitemapLinkContainer'><span class='sitemapLinkLabel'>Link with sitemap</span><input id='linkwithplayer' type='text' class='sitemapLinkField'/></div>";
        treeUl += "<div class='sitemapLinkContainer'><span class='sitemapLinkLabel'>Link without sitemap - </span><a id='closeplayer'>link</a><input id='linkwithoutplayer' type='text' class='sitemapLinkField'/></div></div></div>";
        treeUl += "<ul class='sitemapTree'>";
        var rootNodes = sitemap.rootNodes;
        for (var i = 0; i < rootNodes.length; i++) {
            treeUl += generateNode(rootNodes[i]);
        }
        treeUl += "</ul></div>";

        $('#sitemapHost').html(treeUl);
    }

    function generateNode(node) {
        var hasChildren = (node.children && node.children.length > 0);
        if (hasChildren) {
            var returnVal = "<li class='sitemapNode sitemapExpandableNode'><div><a class='sitemapPlusMinusLink'><span class='sitemapMinus'></span></a>";
        } else {
            var returnVal = "<li class='sitemapNode sitemapLeafNode'><div>";
        }
        returnVal += "<a class='sitemapPageLink' nodeUrl='" + node.url + "'><span class='sitemapPageIcon";
        if (node.type == "Flow") { returnVal += " sitemapFlowIcon"; }
        returnVal += "'></span><span class='sitemapPageName'>"
        returnVal += $('<div/>').text(node.pageName).html();
        returnVal += "</span></a></div>";
        if (hasChildren) {
            returnVal += "<ul>";
            for (var i = 0; i < node.children.length; i++) {
                var child = node.children[i];
                returnVal += generateNode(child);
            }
            returnVal += "</ul>";
        }
        returnVal += "</li>";
        return returnVal;
    }

})();