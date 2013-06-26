/*global MashupPlatform*/

MashupPlatform.SilboPS = (function () {

    "use strict";

    var API = {},
        PubSubManager = window.parent.PubSubManager,
        PubEndPoint, SubEndPoint;


    PubEndPoint = function () {
        PubSubManager.PubEndPoint.apply(this, ['ioperator', MashupPlatform.operator.id].concat(Array.prototype.slice.call(arguments)));
    };
    PubEndPoint.prototype = new PubSubManager.PubEndPoint();

    SubEndPoint = function () {
        PubSubManager.SubEndPoint.apply(this, ['ioperator', MashupPlatform.operator.id].concat(Array.prototype.slice.call(arguments)));
    };
    SubEndPoint.prototype = new PubSubManager.SubEndPoint();

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
