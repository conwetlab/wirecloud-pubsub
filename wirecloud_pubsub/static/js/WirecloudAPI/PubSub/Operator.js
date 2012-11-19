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

    Object.defineProperty(API, 'PubEndPoint', {
        value: PubEndPoint,
        enumerable: true
    });

    Object.defineProperty(API, 'SubEndPoint', {
        value: SubEndPoint,
        enumerable: true
    });

    Object.defineProperty(API, 'Filter', {
        value: PubSubManager.Filter,
        enumerable: true
    });

    return API;
})();
Object.defineProperty(MashupPlatform, 'SilboPS', {value: MashupPlatform.SilboPS});
