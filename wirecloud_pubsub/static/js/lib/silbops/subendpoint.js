var SubEndPoint;

(function() {
    // SilboPS Namespace
    if (SilboPS === undefined) {
        SilboPS = {};
    }

    SilboPS.SubEndPoint = function SubEndPoint(handlers) {

        SilboPS.EndPoint.call(this, handlers, 'SUBSCRIBER');
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
})();