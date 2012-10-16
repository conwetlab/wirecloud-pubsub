/*global opManager, Wirecloud*/

(function (opmanager, SilboPS) {

    "use strict";

    var register_endpoint, unload_gadget, endpointsByGadget, Manager,
        PubEndPoint, SubEndPoint;

    endpointsByGadget = {};
    Manager = {};

    register_endpoint = function register_endpoint(iGadgetId, endpoint) {

        var iGadget;

        if (!(endpoint instanceof SilboPS.SubEndPoint) && !(endpoint instanceof SilboPS.PubEndPoint)) {
            throw new TypeError();
        }

        iGadget = opManager.activeWorkspace.getIWidget(iGadgetId);

        if (!(iGadgetId in endpointsByGadget)) {
            endpointsByGadget[iGadgetId] = [];
            iGadget.addEventListener('unload', this._iwidget_unload_listener);
        }

        endpointsByGadget[iGadgetId].push(endpoint);
    };

    unload_gadget = function unload_gadget(iGadget) {
        var endpoints, endpoint;

        endpoints = endpointsByGadget[iGadget.getId()];
        for (endpoint in endpoints) {
            endpoint.close();
        }

        delete endpointsByGadget[iGadget.getId()];
    };

    PubEndPoint = function PubEndPoint(iGadgetId) {
        var args;

        if (arguments.length === 0) {
            return;
        }

        iGadgetId = arguments[0];
        args = Array.prototype.slice.call(arguments, 1);
        SilboPS.PubEndPoint.apply(this, args);
        register_endpoint(iGadgetId, this);
    };
    PubEndPoint.prototype = new SilboPS.PubEndPoint();

    SubEndPoint = function SubEndPoint() {
        var args, iGadgetId;

        if (arguments.length === 0) {
            return;
        }

        iGadgetId = arguments[0];
        args = Array.prototype.slice.call(arguments, 1);
        SilboPS.SubEndPoint.apply(this, args);
        register_endpoint(iGadgetId, this);
    };
    SubEndPoint.prototype = new SilboPS.SubEndPoint();

    Object.defineProperty(Manager, 'PubEndPoint', {
        value: PubEndPoint
    });

    Object.defineProperty(Manager, 'SubEndPoint', {
        value: SubEndPoint
    });

    Object.defineProperty(Manager, 'Filter', {
        value: SilboPS.Filter
    });

    SilboPS.Stream.brokerUri = Wirecloud.URLs.DEFAULT_SILBOPS_BROKER;

    window.PubSubManager = Manager;

})(OpManagerFactory.getInstance(), SilboPS);

delete window.SilboPS;
