/*global MashupPlatform*/

MashupPlatform.SilboPS = (function () {

    "use strict";

    var API = {},
        PubSubManager = window.parent.PubSubManager,
        PubEndPoint, SubEndPoint;


    PubEndPoint = function (options) {
        return PubSubManager.PubEndPoint('iwidget', MashupPlatform.widget.id, options);
    };

    SubEndPoint = function (options) {
        return PubSubManager.SubEndPoint('iwidget', MashupPlatform.widget.id, options);
    };

    Object.defineProperties(API, {
	"PubEndPoint": {value: PubEndPoint},
        "SubEndPoint": {value: SubEndPoint},
        "Type": {value: PubSubManager.Type},
        "Value": {value: PubSubManager.Value},
        "Operator": {value: PubSubManager.Operator},
        "Attribute": {value: PubSubManager.Attribute},
        "Advertise": {value: PubSubManager.Advertise},
        "Constraint": {value: PubSubManager.Constraint},
        "ContextFunction": {value: PubSubManager.ContextFunction},
        "Notification": {value: PubSubManager.Notification},
        "Context": {value: PubSubManager.Context},
        "Filter": {value: PubSubManager.Filter},
        "Net": {value: PubSubManager.Net}
    });

    return API;
})();
Object.defineProperty(MashupPlatform, 'SilboPS', {value: MashupPlatform.SilboPS});
