// ************************** GLOBAL VARS *********************************//

// A table to cache the outerHTML of the _rtf elements before the rollover
// state is applied.
var gv_OriginalTextCache = new Object();

// A table to cache the src image before the rollover
// state is applied.
var gv_OriginalImgSrc = new Object();

// A table to store all the vertical alignments of all the parents of the text
// objects.
var gv_vAlignTable = new Object();


// ************************************************************************//
//stored on each browser event
var windowEvent;

//Check if IE
var bIE = false;
if ((index = navigator.userAgent.indexOf("MSIE")) >= 0) {
    bIE = true;
}

var Forms = document.getElementsByTagName("FORM");
for (var i = 0; i < Forms.length; i++) {
    var Form = Forms(i);
    Form.onclick = SuppressBubble;
}

function SuppressBubble(event) {
    if (bIE) {
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    }
    else {
        if (event) {
            event.stopPropagation();
        }
    }
}

function InsertAfterBegin(dom, html) {
    if (!bIE) {
        var phtml; var range = dom.ownerDocument.createRange();
        range.selectNodeContents(dom);
        range.collapse(true);
        phtml = range.createContextualFragment(html);
        dom.insertBefore(phtml, dom.firstChild);
    } else {
        dom.insertAdjacentHTML("afterBegin", html);
    }
}

function InsertBeforeEnd(dom, html) {
    if (!bIE) {
        var phtml; var range = dom.ownerDocument.createRange();
        range.selectNodeContents(dom);
        range.collapse(dom);
        phtml = range.createContextualFragment(html);
        dom.appendChild(phtml);
    } else {
        dom.insertAdjacentHTML("beforeEnd", html);
    }
}

var MaxZIndex = 1000;
var MinZIndex = -1000;

//Get the id of the Workflow Dialog belonging to element with id = id
function Workflow(id) {
    return id + 'WF';
}

function BringToFront(id) {
    var target = document.getElementById(id);
    if (target == null) return;
    MaxZIndex = MaxZIndex + 1;
    target.style.zIndex = MaxZIndex;
}

function SendToBack(id) {
    var target = document.getElementById(id);
    if (target == null) return;
    MinZIndex = MinZIndex - 1;
    target.style.zIndex = MinZIndex;
}

function HideElement(id) {
    var source = document.getElementById(id);
    source.style.visibility = "hidden";
    RefreshScreen();
}

function RefreshScreen() {
    var oldColor = document.body.style.backgroundColor;
    var setColor = (oldColor == "rgb(0,0,0)") ? "#FFFFFF" : "#000000";
    document.body.style.backgroundColor = setColor;
    document.body.style.backgroundColor = oldColor;
}

function getAbsoluteLeft(node) {
    var currentNode = node;
    var left = 0;
    while (currentNode.tagName != "BODY") {
        left += currentNode.offsetLeft;
        currentNode = currentNode.offsetParent;
    }
    return left;
}

function getAbsoluteTop(node) {
    var currentNode = node;
    var top = 0;
    while (currentNode.tagName != "BODY") {
        top += currentNode.offsetTop;
        currentNode = currentNode.offsetParent;
    }
    return top;
}

// ******************  Annotation and Link Functions ****************** //

function GetAnnotationHtml(annJson) {
    var retVal = "";
    for (var noteName in annJson) {
        if (noteName != "label") {
            retVal += "<div class='annotationName'>" + noteName + "</div>";
            retVal += "<div class='annotation'>" + annJson[noteName] + "</div>";
        }
    }
    return retVal;
}

var dialogs = new Object();

function ToggleWorkflow(event, id, width, height, hasWorkflow) {

    if (dialogs[id]) {
        var $dialog = dialogs[id];
        // reset the dialog
        dialogs[id] = undefined;
        if ($dialog.dialog("isOpen")) {
            $dialog.dialog("close");
            return;
        }
    }
    
    // we'll need to save the scroll position just for stupid IE which will skip otherwise
    var win = $(window);
    var scrollY = win.scrollTop();
    var scrollX = win.scrollLeft();

	var target = document.getElementById(Workflow(id));
	var bufferH = 10;
	var bufferV = 10;
	var blnLeft = false;
	var blnAbove = false;
	var sourceTop = event.pageY - document.body.scrollTop;
	var sourceLeft = event.pageX - document.body.scrollLeft;

	if (sourceLeft > width + bufferH + document.body.scrollLeft) {
		blnLeft = true;
	}
	if (sourceTop > height + bufferV + document.body.scrollTop) {
		blnAbove = true;
	}

	var top = 0;
	var left = 0;
	if (blnAbove) top = sourceTop - height - 20;
	else top = sourceTop + 10;
	if (blnLeft) left = sourceLeft - width - 4;
	else left = sourceLeft - 6;
	
    if (bIE) height += 50;

    var ann = window[id + 'Ann'];
    var $dialog = $('<div></div>')
        .appendTo('body')
		.html(GetAnnotationHtml(ann))
		.dialog({
		    title: ann.label,
		    width: width,
		    height: height,
		    minHeight: 150,
            position: [left, top],
		    dialogClass: 'dialogFix'
		});
		dialogs[id] = $dialog;

    // scroll ... just for IE
    window.scrollTo(scrollX, scrollY);

    
}

function ToggleLinks(event, linksid) {
    var links = document.getElementById(linksid);
    if (links.style.visibility == "visible") { HideElement(linksid); }
    else {
        if (bIE) {
            links.style.top = window.event.y + document.body.scrollTop;
            links.style.left = window.event.x + document.body.scrollLeft;
        }
        else {
            links.style.top = event.pageY;
            links.style.left = event.pageX;
        }
        links.style.visibility = "visible";
        BringToFront(linksid);
    }
    RefreshScreen();
}

// ******************  Utils for Interaction Action Functions ****************** //

function IsTrueMouseOut(idNoSpace, e) {
    if (!e) var e = window.event;
    var tg = (window.event) ? e.srcElement : e.target;
    if (tg.id != idNoSpace && tg.id != 'o' + idNoSpace) return false;

    while (tg.nodeName != 'HTML') {
        if (tg.style.visibility == 'hidden') return false;
        tg = tg.parentNode;
    }

    var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
    while (reltg != null && reltg.nodeName != 'HTML') {
        var id = reltg.id
        var i = id.indexOf('Links')
        if (i > 0) {
            if (id.substring(0, i) == tg.id) {
                return false;
            }
        }
        reltg = reltg.parentNode;
        if (reltg.id == idNoSpace) return false;
    }
    return true;
}

function IsTrueMouseOver(idNoSpace, e) {
    if (!e) var e = window.event;
    var tg = (window.event) ? e.srcElement : e.target;
    if (tg.id != idNoSpace && tg.id != 'o' + idNoSpace) return false;
    var reltg = (e.relatedTarget) ? e.relatedTarget : e.fromElement;
    while (reltg != null && reltg.nodeName != 'HTML') {
        var id = reltg.id
        var i = id.indexOf('Links')
        if (i > 0) {
            if (id.substring(0, i) == tg.id) {
                return false;
            }
        }
        reltg = reltg.parentNode
        if (reltg.id == idNoSpace) return false;
    }
    return true;
}

// ******************  Interaction Action Functions ****************** //

function NewTab(hyperlink, name) {
    window.open(hyperlink, name);
}

function NewWindow(hyperlink, name, features, center, width, height) {
    if (center) {
        var winl = (screen.width - width) / 2;
        var wint = (screen.height - height) / 2;
        features = features + ', left=' + winl + ', top=' + wint;
    }
    window.open(hyperlink, name, features);
}

function ParentWindowNeedsReload(newPageName) {
    var reload = false;
    try {
        var oldParentUrl = top.opener.window.location.href.split("#")[0];
        var lastslash = oldParentUrl.lastIndexOf("/");
        if (lastslash > 0) {
            oldParentUrl = oldParentUrl.substring(lastslash + 1, oldParentUrl.length);
            if (oldParentUrl == encodeURI(newPageName)) {
                reload = true;
            }
        }
    } catch (e) { }
    return reload;
}

function FrameWindowNeedsReload(iframe, newPageName) {
    var reload = false;
    try {
        var oldFrameUrl = iframe.contentWindow.location.href.split("#")[0];
        var lastslash = oldFrameUrl.lastIndexOf("/");
        if (lastslash > 0) {
            oldFrameUrl = oldFrameUrl.substring(lastslash + 1, oldFrameUrl.length);
            if (oldFrameUrl == encodeURI(newPageName)) {
                reload = true;
            }
        }
    } catch (e) { }
    return reload;
}

function ScrollToWidget(id, scrollX, scrollY) {
    var target = document.getElementById(id);
    var targetLeft = getAbsoluteLeft(target);
    var targetTop = getAbsoluteTop(target);
    if (scrollY) {
        document.body.scrollTop = targetTop;
    }
    if (scrollX) {
        document.body.scrollLeft = targetLeft;
    }
}

// ******************  Visibility and State Functions ****************** //

var widgetIdToShowFunction = new Object();
var widgetIdToHideFunction = new Object();

function SetPanelVisibility(dpId, value, easing, duration) {
    var dp = document.getElementById(dpId);
    if (value == 'toggle') {
        if (dp.style.visibility == 'hidden') {
            value = '';
        } else {
            value = 'hidden';
        }
    }

    if ((dp.style.visibility == 'hidden' && value == 'hidden') ||
        (dp.style.visibility == '' && value == '')) {
        return;
    }

    if (easing == 'none') {
        dp.style.display = '';
        dp.style.visibility = value;
    } else if (easing == 'fade') {
        if (value == 'hidden') {
            if (dp.style.visibility != 'hidden') {
                $('#' + dpId).fadeOut(duration, function () {
                    $('#' + dpId).css('visibility', 'hidden');
                });
            }
        } else {
            if (dp.style.visibility == 'hidden') {
                dp.style.display = 'none';
                dp.style.visibility = '';
                $('#' + dpId).fadeIn(duration, function () { });
            }
        }
    }

    if (value == 'hidden') {
        var hideFunction = widgetIdToHideFunction[dpId];
        if (hideFunction) {
            hideFunction();
        }
    } else {
        var showFunction = widgetIdToShowFunction[dpId];
        if (showFunction) {
            showFunction();
        }
    }
}

var widgetIdToPanelStateChangeFunction = new Object();

function SetPanelState(dpId, stateid, easingOut, directionOut, durationOut, easingIn, directionIn, durationIn) {
    if ($('#' + stateid).css('visibility') != "hidden" && $('#' + dpId).css('visibility') != "hidden") {
        return;
    }

    var width = $('#' + dpId).width();
    var height = $('#' + dpId).height();

    var oldStateId = GetPanelState(dpId);
    if (oldStateId == '') {
        $('#' + dpId + '> div[visibility!=hidden]').css('visibility', 'hidden');
        $('#' + dpId + '> div[visibility!=hidden]').css('display', '');
    } else {
        var oldState = $('#' + oldStateId);

        if (easingOut == 'none') {
            oldState.css('visibility', 'hidden');
            oldState.css('display', '');
            BringPanelStateToFront(dpId, stateid);
        } else if (easingOut == 'fade') {
            //for IE
            var oldTop = Number(oldState.css('top').replace("px", ""));
            var oldLeft = Number(oldState.css('left').replace("px", ""));
            var oldWidth = oldState.width();
            var oldHeight = oldState.height();
            oldState.css('width', width - oldLeft + "px");
            oldState.css('height', height - oldTop + "px");

            oldState.fadeOut(durationOut, function () {
                oldState.css('visibility', 'hidden');
                BringPanelStateToFront(dpId, stateid);
                oldState.css('width', oldWidth + "px");
                oldState.css('height', oldHeight + "px");
            });
        } else {
            var oldTop = oldState.css('top');
            var oldLeft = oldState.css('left');

            var onComplete = function () {
                oldState.css('visibility', 'hidden');
                oldState.css('top', oldTop);
                oldState.css('left', oldLeft);
                BringPanelStateToFront(dpId, stateid);
            };

            if (directionOut == "right") {
                MoveWidgetBy(oldStateId, width, 0, easingOut, durationOut, onComplete);
            } else if (directionOut == "left") {
                MoveWidgetBy(oldStateId, -width, 0, easingOut, durationOut, onComplete);
            } else if (directionOut == "up") {
                MoveWidgetBy(oldStateId, 0, -height, easingOut, durationOut, onComplete);
            } else if (directionOut == "down") {
                MoveWidgetBy(oldStateId, 0, height, easingOut, durationOut, onComplete);
            }

        }
    }

    $('#' + dpId).css('display', '');
    $('#' + dpId).css('visibility', '');

    var newState = $('#' + stateid);
    if (easingIn == 'none') {
        newState.css('visibility', '');
        newState.css('display', '');
    } else if (easingIn == 'fade') {
        newState.css('display','none');
        newState.css('visibility', '');
        newState.fadeIn(durationIn, function () {});
    } else {
        var oldTop = Number(newState.css('top').replace("px", ""));
        var oldLeft = Number(newState.css('left').replace("px", ""));

        if (directionIn == "right") {
            newState.css('left', oldLeft - width + 'px');
        } else if (directionIn == "left") {
            newState.css('left', oldLeft + width + 'px');
        } else if (directionIn == "up") {
            newState.css('top', oldTop + height + 'px');
        } else if (directionIn == "down") {
            newState.css('top', oldTop - height + 'px');
        }

        newState.css('display', '');
        newState.css('visibility', '');

        if (directionIn == "right") {
            MoveWidgetBy(stateid, width, 0, easingIn, durationIn);
        } else if (directionIn == "left") {
            MoveWidgetBy(stateid, -width, 0, easingIn, durationIn);
        } else if (directionIn == "up") {
            MoveWidgetBy(stateid, 0, -height, easingIn, durationIn);
        } else if (directionIn == "down") {
            MoveWidgetBy(stateid, 0, height, easingIn, durationIn);
        }
    }

    var panelStateChangeFunction = widgetIdToPanelStateChangeFunction[dpId];
    if (panelStateChangeFunction) {
        panelStateChangeFunction();
    }
}

function BringPanelStateToFront(dpId, stateid) {
    $('#' + stateid).appendTo($('#' + dpId));
}

// ******************  Move Functions ****************** //
var widgetIdToMoveFunction = new Object();
var widgetMoveInfo = new Object();

function MoveWidgetTo(id, x, y, easing, duration) {
    var target = document.getElementById(id);
    var deltaX = x - parseInt(target.style.left);
    var deltaY = y - parseInt(target.style.top);
    MoveWidgetBy(id, deltaX, deltaY, easing, duration);
}

function MoveWidgetBy(id, x, y, easing, duration, animationCompleteCallback) {
    LogMovedWidgetForDrag(id);
    if (easing == 'none') {
        var target = document.getElementById(id);
        target.style.left = parseInt(target.style.left) + x;
        target.style.top = parseInt(target.style.top) + y;
    } else {
        $('#' + id).animate({
            left: '+=' + x,
            top: '+=' + y
        },
           duration,
           easing,
           animationCompleteCallback
           );
    }

    var moveInfo = new Object();
    moveInfo.x = x;
    moveInfo.y = y;
    moveInfo.easing = easing;
    moveInfo.duration = duration;
    widgetMoveInfo[id] = moveInfo;

    var moveFunction = widgetIdToMoveFunction[id];
    if (moveFunction) {
        moveFunction();
    }

    //MovePinnedWidgets(id, x, y, easing, duration);
}

function MoveWidgetWithThis(id, srcId) {
    var moveInfo = widgetMoveInfo[srcId];
    if (moveInfo) {
        MoveWidgetBy(id, moveInfo.x, moveInfo.y, moveInfo.easing, moveInfo.duration);
    }
}

function MoveWidgetToLocationBeforeDrag(id, easing, duration) {
    if (widgetDragInfo.movedWidgets[id]) {
        var loc = widgetDragInfo.movedWidgets[id];
        MoveWidgetTo(id, loc.x, loc.y, easing, duration);
    }
}

function LogMovedWidgetForDrag(id) {
    if (widgetDragInfo.hasStarted) {
        var widget = document.getElementById(id);
        var x = parseInt(widget.style.left);
        var y = parseInt(widget.style.top);
        var movedWidgets = widgetDragInfo.movedWidgets;
        if (!movedWidgets[id]) {
            movedWidgets[id] = new Location(x, y);
        }
    }
}

// ******************  Drag Functions ****************** //

var widgetIdToStartDragFunction = new Object();
var widgetIdToDragFunction = new Object();
var widgetIdToDragDropFunction = new Object();

var widgetDragInfo = new Object();

function StartDragWidget(event, id) {
    var x, y;
    if (bIE) {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    }
    else {
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
        } else {
            x = event.pageX;
            y = event.pageY;
        }
    }
    widgetDragInfo.hasStarted = false;
    widgetDragInfo.widgetId = id;
    widgetDragInfo.cursorStartX = x;
    widgetDragInfo.cursorStartY = y;
    widgetDragInfo.lastX = x;
    widgetDragInfo.lastY = y;
    widgetDragInfo.currentX = x;
    widgetDragInfo.currentY = y;
    widgetDragInfo.movedWidgets = new Object();

    if (bIE) {
        document.attachEvent("onmousemove", DragWidget);
        document.attachEvent("onmouseup", StopDragWidget);
    }
    else {
        document.addEventListener("mousemove", DragWidget, true);
        document.addEventListener("mouseup", StopDragWidget, true);
        document.addEventListener("touchmove", DragWidget, true);
        document.addEventListener("touchend", StopDragWidget, true);
        event.preventDefault();
    }
    SuppressBubble(event);
}

function DragWidget(event) {
    var x, y;
    if (bIE) {
        x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    }
    else {
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
        } else {
            x = event.pageX;
            y = event.pageY;
        }
    }
    widgetDragInfo.xDelta = x - widgetDragInfo.currentX;
    widgetDragInfo.yDelta = y - widgetDragInfo.currentY;
    widgetDragInfo.lastX = widgetDragInfo.currentX;
    widgetDragInfo.lastY = widgetDragInfo.currentY;
    widgetDragInfo.currentX = x;
    widgetDragInfo.currentY = y;

    SuppressBubble(event);

    if (!widgetDragInfo.hasStarted) {
        widgetDragInfo.hasStarted = true;
        var startFunction = widgetIdToStartDragFunction[widgetDragInfo.widgetId];
        if (startFunction) {
            startFunction();
        }
        widgetDragInfo.oldBodyCursor = document.body.style.cursor;
        document.body.style.cursor = 'move';
        var widget = document.getElementById(widgetDragInfo.widgetId);
        widgetDragInfo.oldCursor = widget.style.cursor;
        widget.style.cursor = 'move';
    }

    var dragFunction = widgetIdToDragFunction[widgetDragInfo.widgetId];
    if (dragFunction) {
        dragFunction();
    }
}

function StopDragWidget(event) {
    if (bIE) {
        document.detachEvent("onmousemove", DragWidget);
        document.detachEvent("onmouseup", StopDragWidget);
    }
    else {
        document.removeEventListener("mousemove", DragWidget, true);
        document.removeEventListener("mouseup", StopDragWidget, true);
        document.removeEventListener("touchmove", DragWidget, true);
        document.removeEventListener("touchend", StopDragWidget, true);
    }

    if (widgetDragInfo.hasStarted) {
        var dragDropFunction = widgetIdToDragDropFunction[widgetDragInfo.widgetId];
        if (dragDropFunction) {
            dragDropFunction();
        }

        document.body.style.cursor = widgetDragInfo.oldBodyCursor;
        var widget = document.getElementById(widgetDragInfo.widgetId);
        widget.style.cursor = widgetDragInfo.oldCursor;
    }
    widgetDragInfo.hasStarted = false;
    widgetDragInfo.movedWidgets = new Object();
}

function GetDragCursorRectangles() {
    var rects = new Object();
    rects.lastRect = new Rectangle(widgetDragInfo.lastX, widgetDragInfo.lastY, 1, 1);
    rects.currentRect = new Rectangle(widgetDragInfo.currentX, widgetDragInfo.currentY, 1, 1);
    return rects;
}

function GetWidgetRectangles(id) {
    var widget = document.getElementById(id);
    var rects = new Object();
    rects.lastRect = new Rectangle(getAbsoluteLeft(widget), getAbsoluteTop(widget), Number($('#' + id).css('width').replace("px", "")), Number($('#' + id).css('height').replace("px", "")));
    rects.currentRect = rects.lastRect;
    return rects;
}

function IsEntering(movingRects, targetRects) {
    return !movingRects.lastRect.IntersectsWith(targetRects.currentRect) && movingRects.currentRect.IntersectsWith(targetRects.currentRect);
}

function IsLeaving(movingRects, targetRects) {
    return movingRects.lastRect.IntersectsWith(targetRects.currentRect) && !movingRects.currentRect.IntersectsWith(targetRects.currentRect);
}

function IsOver(movingRects, targetRects) {
    return movingRects.currentRect.IntersectsWith(targetRects.currentRect);
}

function IsNotOver(movingRects, targetRects) {
    return !IsOver(movingRects, targetRects);
}

function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.right = x + width;
    this.bottom = y + height;

    this.IntersectsWith = IntersectsWith;

    function IntersectsWith(rect) {
        return this.x < rect.right && this.right > rect.x && this.y < rect.bottom && this.bottom > rect.y;
    }
}

function Location(x, y) {
    this.x = x;
    this.y = y;
}

// ******************  String Function ****************** //

function ValueContains(inputString, value) {
    return inputString.indexOf(value) > -1;
}

function ValueNotContains(inputString, value) {
    return !ValueContains(inputString, value);
}

// ******************  Date Functions ****************** //

function GetDayString(day) {
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[day];
}

function GetMonthString(m) {
    var month = new Array(12);
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    return month[m];
}

// ******************  Sim Functions ****************** //
function SetCheckState(id, value) {
    var boolValue = Boolean(value);
    if (value == 'false') {
        boolValue = false;
    }
    document.getElementById(id).checked = boolValue;
}

function SetSelectedOption(id, value) {
    document.getElementById(id).value = value;
}

function SetGlobalVariableValue(id, value) {
    if (value.length > 200) {
        value = value.substring(0, 200);
    }
    eval(id + ' = value');
    try {
        eval('if (top.opener) { top.opener.' + id + ' = value }');
    } catch (e) { }
}

function SetWidgetFormText(id, value) {
    var value = PopulateVariables(value.toString());
    document.getElementById(id).value = value;
}

function SetFocusedWidgetText(value) {
    if (lastFocusedControl) {
        var value = PopulateVariables(value.toString());
        lastFocusedControl.focus();
        lastFocusedControl.value = value;        
    }
}

function SetWidgetRichText(id, value) {
    var value = PopulateVariables(value);
    var rtfElement = document.getElementById(id + '_rtf');
    var oldHeight = rtfElement.offsetHeight;
    rtfElement.innerHTML = value;
    var newHeight = rtfElement.offsetHeight;

    var oldTop = Number($('#' + id).css('top').replace("px", ""));
    var vAlign = gv_vAlignTable[id];

    if (vAlign == "center") {
        var newTop = oldTop - (newHeight - oldHeight) / 2;
        $('#' + id).css('top', newTop + 'px');
    } else if (vAlign == "bottom") {
        var newTop = oldTop - newHeight + oldHeight;
        $('#' + id).css('top', newTop + 'px');
    } // do nothing if the alignment is top  

    if (gv_OriginalTextCache[id]) {
        CacheOriginalText(id);
    }
}

function GetCheckState(id) {
    return document.getElementById(id).checked;
}

function GetSelectedOption(id) {
    return document.getElementById(id).value;
}

function GetNum(str) {
    if (!str) return "";
    return isNaN(str) ? str : Number(str);
}

function GetGlobalVariableValue(id) {
    return eval(id);
}

function GetGlobalVariableLength(id) {
    return GetGlobalVariableValue(id).length;
}

function GetWidgetFormText(id) {
    return document.getElementById(id).value;
}

function GetFocusedWidgetText(id) {
    if (lastFocusedControl) {
        return lastFocusedControl.value;
    } else {
        return "";
    }
}

function GetWidgetValueLength(id) {
    return document.getElementById(id).value.length;
}

function GetWidgetVisibility(id) {
    if (document.getElementById(id).style.visibility == 'hidden') {
        return false;
    } else { return true; }
}

function GetPanelState(id) {
    var el = document.getElementById(id);
    if (el.style.visibility == 'hidden') { return ''; }

    var children = el.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].style) {
            if (children[i].style.visibility != 'hidden') {
                return children[i].id;
            }
        }
    }
    return '';
}

// *****************  Validation Functions ***************** //

function IsValueAlpha(val) {
    var isAlphaRegex = new RegExp("^[a-z\\s]+$", "gi");
    return isAlphaRegex.test(val);
}

function IsValueNumeric(val) {
    var isNumericRegex = new RegExp("^[0-9,\\.\\s]+$", "gi");
    return isNumericRegex.test(val);
}

function IsValueAlphaNumeric(val) {
    var isAlphaNumericRegex = new RegExp("^[0-9a-z\\s]+$", "gi");
    return isAlphaNumericRegex.test(val);
}

function IsValueOneOf(val, values) {
    for (i = 0; i < values.length; i++) {
        var option = values[i];
        if (val == option) return true;
    }
    // by default, return false
    return false;
}

function IsValueNotAlpha(val) {
    return !IsValueAlpha(val);
}

function IsValueNotNumeric(val) {
    return !IsValueNumeric(val);
}

function IsValueNotAlphaNumeric(val) {
    return !IsValueAlphaNumeric(val);
}

function IsValueNotOneOf(val, values) {
    return !IsValueOneOf(val, values);
}

// ******************  Rollover Functions ****************** //

function SetWidgetOriginal(id, bringFront) {
    var textid = 'u' + (parseInt(id.substring(1)) + 1);
    var json = '';
    ApplyImageAndTextJson(id, textid, json, bringFront, true);
}

function SetWidgetHover(id, bringFront) {
    if (IsWidgetSelected(id)) { return; }

    var textid = 'u' + (parseInt(id.substring(1)) + 1);
    var json = '';
    if (window['Json' + id + '_hover']) {
        json = window['Json' + id + '_hover'];
    }
    ApplyImageAndTextJson(id, textid, json, bringFront, false);
}

function SetWidgetNotHover(id, bringFront) {
    if (IsWidgetSelected(id)) { return; }

    SetWidgetOriginal(id, bringFront);
}

function SetWidgetMouseDown(id, bringFront) {
    if (IsWidgetSelected(id)) { return; }

    var textid = 'u' + (parseInt(id.substring(1)) + 1);
    var json = '';
    if (window['Json' + id + '_down']) {
        json = window['Json' + id + '_down'];
    }
    ApplyImageAndTextJson(id, textid, json, bringFront, false);
}

function SetWidgetNotMouseDown(id, bringFront) {
    if (IsWidgetSelected(id)) { return; }
    if (window['Json' + id + '_hover']) {
        SetWidgetHover(id, bringFront);
    } else {
        SetWidgetOriginal(id, bringFront);
    }
}

var gv_SelectedWidgets = new Object();

function SetWidgetSelected(id) {
    var group = $('#' + id).attr('selectiongroup');
    if (group) {
        $("[selectiongroup='" + group + "'][visibility!='hidden']").each(function (i,obj) {
            SetWidgetNotSelected($(obj).attr('id'));
        });
    }

    var textid = 'u' + (parseInt(id.substring(1)) + 1);
    var json = '';
    if (window['Json' + id + '_selected']) {
        json = window['Json' + id + '_selected'];
    }
    ApplyImageAndTextJson(id, textid, json, false, false);

    gv_SelectedWidgets[id] = 'true';
}

function SetWidgetNotSelected(id) {
    SetWidgetOriginal(id, false);

    gv_SelectedWidgets[id] = 'false';
}

function IsWidgetSelected(id) {    
    if (gv_SelectedWidgets[id] && gv_SelectedWidgets[id] == 'true') { return true; }
    return false;
}

function DisableImageWidget(id) {
    document.getElementById(id).style.visibility = 'hidden';

    var textid = 'u' + (parseInt(id.substring(1)) + 1);
    var json = '';
    if (window['Json' + id + '_disabled']) {
        json = window['Json' + id + '_disabled'];
    }
    ApplyImageAndTextJson(id, textid, json, false, false);
}

function EnableImageWidget(id) {
    document.getElementById(id).style.visibility = '';

    SetWidgetOriginal(id, false);
}

function ApplyImageAndTextJson(id, textid, json, bringToFront, isOriginal) {

    var obj = document.getElementById(id);
    if (obj && obj.style.visibility == 'hidden' && isOriginal) { return; }

    ResetImagesAndTextJson(id, textid);

    if (json != '') {
        ApplyImageStyle(id, json);
        ApplyTextStyle(textid, json); 
    }

    if (bringToFront) { BringToFront(id + '_container'); BringToFront(id); BringToFront(id + 'ann'); }
}

function ApplyImageStyle(id, json) {
    CacheOriginalImgSrc(id)

    if (json['imgclass']) {
        $('#' + id + '_img').removeClass().empty();
        $('#' + id + '_img').addClass(json['imgclass']);
    } else if (json['imgsrc']) {
        $('#' + id + '_img').removeClass().empty();
        var src = json['imgsrc'];
        $('#' + id + '_img').html("<IMG src='" + src + "' class='raw_image'>");
    }
}

function CacheOriginalImgSrc(id) {
    if (!gv_OriginalImgSrc[id + '_img']) {
        var src = $('#' + id + '_img > img').attr('src');
        if (src) gv_OriginalImgSrc[id + '_img'] = src;
        else gv_OriginalImgSrc[id + '_img'] = 'none';
    }
}

function ResetImagesAndTextJson(id, textid) {
    CacheOriginalImgSrc(id);

    $('#' + id + '_img').removeClass().empty();
    if (gv_OriginalImgSrc[id + '_img'] && gv_OriginalImgSrc[id + '_img'] != 'none') {
        $('#' + id + '_img').html("<IMG src='" + gv_OriginalImgSrc[id + '_img'] + "' class='raw_image'>");
    } else {
        $('#' + id + '_img').addClass(id + '_original');
    }

    var cacheObject = gv_OriginalTextCache[textid];
    if (cacheObject) {
        var rtfElement = document.getElementById(textid + '_rtf');
        var container = document.getElementById(textid);
        rtfElement.innerHTML = cacheObject.innerHTML;
        container.style.top = cacheObject.top;
    }
}

//-------------------------------------------------------------------------
// ApplyTextRollover
//
// Applies a rollover style to a text element.
//       id : the id of the text object to set.
//       styleProperties : an object mapping style properties to values. eg:
//                         { 'fontWeight' : 'bold',
//                           'fontStyle' : 'italic' }
//-------------------------------------------------------------------------
function ApplyTextStyle(id, styleProperties) {

    if (!gv_OriginalTextCache[id]) { CacheOriginalText(id); }

    var rtfElement = document.getElementById(id + '_rtf');
    if (!rtfElement) return;

    var oldHeight = rtfElement.offsetHeight;

    for (var prop in styleProperties) {
        if (prop != "imgclass") {
            ApplyTextProperty(rtfElement, prop, styleProperties[prop]);
        }
    }

    // now handle vertical alignment
    var newHeight = rtfElement.offsetHeight;
    var container = document.getElementById(id);
    var oldTop = Number($('#' + id).css('top').replace("px", ""));
    var vAlign = gv_vAlignTable[id];

    if (vAlign == "center") {
        var newTop = oldTop - (newHeight - oldHeight) / 2;
        $('#' + id).css('top', newTop + 'px');
    } else if (vAlign == "bottom") {
        var newTop = oldTop - newHeight + oldHeight;
        $('#' + id).css('top',newTop + 'px');
    } // do nothing if the alignment is top      


    //--------------------------------------------------------------------------
    // ApplyStyleRecursive
    //
    // Applies a style recursively to all span and div tags including elementNode
    // and all of its children.
    //
    //     element : the element to apply the style to
    //     styleName : the name of the style property to set (eg. 'font-weight')     
    //     styleValue : the value of the style to set (eg. 'bold')
    //--------------------------------------------------------------------------
    function ApplyStyleRecursive(element, styleName, styleValue) {
        var nodeName = element.nodeName.toLowerCase();

        if (nodeName == 'div' || nodeName == 'span' || nodeName == 'p') {
            element.style[styleName] = styleValue;
        }

        for (var i = 0; i < element.childNodes.length; i++) {
            ApplyStyleRecursive(element.childNodes[i], styleName, styleValue);
        }
    }

    //---------------------------------------------------------------------------
    // ApplyTextProperty
    //
    // Applies a text property to rtfElement.
    //
    //     rtfElement : the the root text element of the rtf object (this is the
    //                  element named <id>_rtf
    //     prop : the style property to set.
    //     value : the style value to set.
    //---------------------------------------------------------------------------
    function ApplyTextProperty(rtfElement, prop, value) {
        var oldHtml = rtfElement.innerHTML;
        if (prop == 'fontWeight') {
            rtfElement.innerHTML = oldHtml.replace(/< *b *\/?>/gi, "");
        } else if (prop == 'fontStyle') {
            rtfElement.innerHTML = oldHtml.replace(/< *i *\/?>/gi, "");
        } else if (prop == 'textDecoration') {
            rtfElement.innerHTML = oldHtml.replace(/< *u *\/?>/gi, "");
        }

        for (var i = 0; i < rtfElement.childNodes.length; i++) {
            ApplyStyleRecursive(rtfElement.childNodes[i], prop, value);
        }
    }
}

//---------------------------------------------------------------------------
// GetAndCacheOriginalText
//
// Gets the html for the pre-rollover state and returns the Html representing
// the Rich text.
//---------------------------------------------------------------------------
function CacheOriginalText(id) {
    var rtfElement = document.getElementById(id + '_rtf');
    if (!rtfElement) return;

    var cacheObject = new Object();
    cacheObject.innerHTML = rtfElement.innerHTML;
    cacheObject.top = $('#' + id).css('top');

    gv_OriginalTextCache[id] = cacheObject;
}
