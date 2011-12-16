var Events = {};
(function() {
    Events.extend = function extend(object) {
        for (var key in this) {
            if (key !== 'extend') {
                object[key] = this[key];
            }
        }
        return object;
    };
    
    function getHandlers() {
        if (!this.__handlers) {
            this.__handlers = {};
        }
        return this.__handlers;
    }

    Events.on = function on(eventName, handler) {
        var handlers = getHandlers.call(this);
        if (!handlers[eventName]) {
            handlers[eventName] = [];
        }
        handlers[eventName].push(handler);
        return this;
    };

    Events.clearHandlers = function clearHandlers() {
        this.__handlers = {};
    };

    Events.fire = function fire(eventName) {
        var handlers = getHandlers.call(this)[eventName];
        if (handlers) {
            var args = Array.prototype.slice.call(arguments, 0);
            args[0] = this;
            for (var i = 0; i < handlers.length; i++) {
                var handler = handlers[i];
                if (typeof handler == 'function') {
                    handler.apply(this, args);
                }
            }
        }
        return this;
    };
})();
