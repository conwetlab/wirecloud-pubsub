// SilboPS Namespace
if (window.SilboPS === undefined) {
    window.SilboPS = {};
}

(function(SilboPS) {

    SilboPS.SubEndPoint = function SubEndPoint(handlers) {

        if (arguments.length != 0) {

            SilboPS.EndPoint.call(this, handlers, 'SUBSCRIBER');
        }
    }

    SilboPS.SubEndPoint.prototype = new SilboPS.EndPoint();

    SilboPS.SubEndPoint.prototype.subscribe = function subscribe(filters) {

        SilboPS.sendSubscribe(this, filters, true);
    }

    SilboPS.SubEndPoint.prototype.unsubscribe = function unsubscribe(filters) {

        SilboPS.sendSubscribe(this, filters, false);
    }

    // TODO missing
    // addNotificationListener(NotificationListener)
    // removeNotificationListener(NotificationListener)
    // sendFeedback(N msg, N feedback)
})(window.SilboPS);