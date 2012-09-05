EzWebAPI.SilboPS = (function () {;

    var API = {},
        PubSubManager = this.window.parent.PubSubManager,
        PubEndPoint, SubEndPoint;


    PubEndPoint = function () {
        PubSubManager.PubEndPoint.apply(this, [EzWebAPI.getId()].concat(arguments));
    };
    PubEndPoint.prototype = new PubSubManager.PubEndPoint();

    SubEndPoint = function () {
        PubSubManager.SubEndPoint.apply(this, [EzWebAPI.getId()].concat(arguments));
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
Object.defineProperty(EzWebAPI, 'SilboPS', {value: EzWebAPI.SilboPS});
