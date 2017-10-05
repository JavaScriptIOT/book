/*
 *
 *
 *
 *
 */

// define the root namespace object
_axUtils = {}

// ------------------------------------------------------------------------
// Makes an object bindable
// ------------------------------------------------------------------------
_axUtils.makeBindable = function (obj, events) {
    if (obj.registeredBindings != null) return;

    // copy the events
    obj.bindableEvents = events.slice();
    obj.registeredBindings = {};

    obj.bind = function (eventName, fn) {
        var binding = {};
        binding.eventName = eventName;
        binding.action = fn;

        var bindingList = this.registeredBindings[eventName];
        if (bindingList == null) {
            bindingList = [];
            this.registeredBindings[eventName] = bindingList;
        }
        bindingList[bindingList.length] = binding;
    };

    obj.unbind = function (eventName) {
        if (eventName.indexOf('.') >= 0) {
            this.registeredBindings[eventName] = null;
        } else {
            var event = eventName.split('.')[0];
            for (var bindingKey in this.registeredBindings) {
                if (bindingKey.split('.')[0] == event) {
                    this.registeredBindings[bindingKey] = null;
                }
            }
        }
    };

    obj.triggerEvent = function (eventName, arg) {
        for (var bindingKey in this.registeredBindings) {
            if (bindingKey.split('.')[0] == eventName) {
                var bindings = this.registeredBindings[bindingKey];
                for (var i = 0; i < bindings.length; i++) {
                    if (arg == null) {
                        bindings[i].action();
                    } else {
                        bindings[i].action(arg);
                    }
                }
            }
        }
    };
};


_axUtils.loadCSS = function (url) {
    $('head').append('<link text="text/css" href="' + url + '" rel="Stylesheet" />');
};

_axUtils.loadJS = function (url) {
    $('head').append('<script text="text/javascript" language="JavaScript" src="' + url + '"></script>');
};

_axUtils.curry = function (fn) {
    var curriedArgs = Array.prototype.slice.call(arguments, [1]);
    return function () {
        fn.apply(this, curriedArgs.concat(Array.prototype.slice.call(arguments)));
    }
};

_axUtils.succeeded = function (result) {
    return result && result.success;
};

_axUtils.createUniqueTag = function () {
    return Math.random().toString().substring(2) +
        Math.random().toString().substring(2) +
        Math.random().toString().substring(2) +
        Math.random().toString().substring(2);
};

_axUtils.formatDate = function (date) {
    var months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var hours = date.getHours();
    var amPm = (hours > 11 ? 'PM' : 'AM');
    hours = hours % 12;
    if(hours == '0') hours = '12';
    var minutes = date.getMinutes() + '';
    if(minutes.length == 1)
    {
        minutes = '0' + minutes;
    }
    return [
        months[date.getMonth()], ' ', date.getDate(), ' ', date.getFullYear(), ' ',
        hours, ':', minutes, ' ', amPm].join('');

};

//Function.prototype.curry = function () {
//    var method = this, args = Array.prototype.slice.call(arguments);
//    return function () {
//        return method.apply(this, args.concat(Array.prototype.slice.call(arguments)));
//    };
//};
