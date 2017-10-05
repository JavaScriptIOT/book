// use this to isolate the scope
(function () {

    if (!configuration.showPageNotes) { return; }

    var SHOW_HIDE_ANIMATION_DURATION = 0;

    $(document).ready(function () {
        $axure.player.createPluginHost({
            id: 'pageNotesHost',
            context: 'interface',
            title: 'Page Notes'
        });

        generatePageNotes();

        //        $('#pageNotesHost').parent().resize(function () {
        //            $('#pageNotesHost').height($(this).height());
        //        });

        // bind to the page load
        $axure.page.bind('load.page_notes', function () {

            $('#pageNameHeader').html("");
            $('#pageNotesContent').html("");

            //populate the notes
            var notes = $axure.page.notes;
            if (notes) {
                var pageName = notes["pageName"];
                $('#pageNameHeader').html(pageName);
                var showNames = notes["showNotesNames"] == "True";

                for (var noteName in notes) {
                    if (noteName != "pageName" && noteName != "showNotesNames") {
                        if (showNames) {
                            $('#pageNotesContent').append("<div class='pageNoteName'>" + noteName + "</div>");
                        }
                        $('#pageNotesContent').append("<div class='pageNote'>" + notes[noteName] + "</div>");
                    }
                }
            }

            return false;
        });


    });

    function generatePageNotes() {
        var pageNotesUI = "<div id='pageNotesScrollContainer'>";
        pageNotesUI += "<div id='pageNotesContainer'>";
        pageNotesUI += "<div id='pageNameHeader'></div>";
        pageNotesUI += "<span id='pageNotesContent'></span>";
        pageNotesUI += "</div></div>";

        $('#pageNotesHost').html(pageNotesUI);
    }

})();   