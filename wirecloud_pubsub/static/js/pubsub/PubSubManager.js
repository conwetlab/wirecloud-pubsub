var PubSubManager = (function(opmanager, SilboPS) {
    var endpointsByGadget = {};
    var Manager = {};

    var register_endpoint = function(iGadgetId, endpoint) {
        if (!(endpoint instanceof SilboPS.SubEndPoint) && !(endpoint instanceof SilboPS.PubEndPoint)) {
            throw new TypeError();
        }

        if (!(iGadgetId in endpointsByGadget)) {
            endpointsByGadget[iGadgetId] = [];
        }

        endpointsByGadget[iGadgetId].push(endpoint);
    };

    var PubEndPoint = function (iGadgetId) {
        if (arguments.length == 0) {
            return;
        }

        var args = Array.prototype.slice.call(arguments, 1);
        SilboPS.PubEndPoint.apply(this, args);
        register_endpoint(iGadgetId, this);
    };
    PubEndPoint.prototype = new SilboPS.PubEndPoint();

    var SubEndPoint = function () {
        if (arguments.length == 0) {
            return;
        }

        var args = Array.prototype.slice.call(arguments, 1);
        SilboPS.SubEndPoint.apply(this, args);
        register_endpoint(iGadgetId, this);
    };
    SubEndPoint.prototype = new SilboPS.SubEndPoint();

    Object.defineProperty(Manager, 'PubEndPoint', {
        value: PubEndPoint,
    });

    Object.defineProperty(Manager, 'SubEndPoint', {
        value: SubEndPoint,
    });

    /*
    var unload_gadget = function(gadget) {
        var endpoints = endpointsByGadget[gadget];
        for (endpoint in endpoints) {
            endpoint.close();
        }

        delete endpointsByGadget[gadget];
    };

    opmanager.listen('igadget_unload', unload_gadget);
    */

    return Manager;
})(OpManagerFactory.getInstance(), SilboPS);

delete SilboPS;