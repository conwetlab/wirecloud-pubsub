// SilboPS Namespace
if (window.SilboPS === undefined) {
    window.SilboPS = {};
}

(function(SilboPS) {

    SilboPS.PubEndPoint = function PubEndPoint(handlers) {

        if (arguments.length != 0) {

            SilboPS.EndPoint.call(this, handlers, 'PUBLISHER');
        }
    };

    SilboPS.PubEndPoint.prototype = new SilboPS.EndPoint();

    SilboPS.PubEndPoint.prototype.publish = function publish(notification) {
		
        SilboPS.publish(this, notification);
    }

    SilboPS.PubEndPoint.prototype.advertise = function advertise(advertise) {

        SilboPS.sendAdvertise(this, advertise, true);
    }

    SilboPS.PubEndPoint.prototype.unadvertise = function unadvertise(advertise) {

        SilboPS.sendAdvertise(this, advertise, false);
    }

    // addFeedbackListener(NotificationListener)
    // removeFeedbackListener(NotificationListener)
})(window.SilboPS);