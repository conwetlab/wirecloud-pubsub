// SilboPS Namespace
if (window.SilboPS === undefined) {
    window.SilboPS = {};
}

(function(SilboPS) {

    SilboPS.EndPoint = function EndPoint (handlers, type) {

        if (arguments.length === 0) {
            return; // to have inheritance but to avoid creating on loading page
        }

        this.streamid = null;
        this.endpointid = null;
        this.type = type;

        this.setHandlers(handlers);

        var events = ['open', 'close', 'error', 'notify', 'message', 'advertise', 'unadvertise'];

        for (var i=0; i < events.length; i += 1) {(function() {

            var event = events[i];
            var handler = 'on' + event;

            this.on(event, function() {
                if (typeof this[handler] === 'function') {
                    var args = Array.prototype.slice.call(arguments, 0);
                    this[handler].apply(this, args);
                }
            });
        }).call(this)}

        SilboPS.register(this);
    };
    Events.extend(SilboPS.EndPoint.prototype);

    SilboPS.EndPoint.prototype.setHandlers = function setHandlers(handlers) {
        for (var name in handlers) {
            if (/^on[a-zA-Z]+$/.test(name)) {
                this[name] = handlers[name];
            }
        }
        return this;
    };

    SilboPS.EndPoint.prototype.open = function open(streamid, endpointid) {
        this.streamid = streamid;
        this.endpointid = endpointid;
    };

    SilboPS.EndPoint.prototype.close = function close() {

        SilboPS.disconnect(this);
    };
})(SilboPS);