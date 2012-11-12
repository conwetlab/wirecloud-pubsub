/*global opManager, Wirecloud*/

(function (opmanager, SilboPS) {

    "use strict";

    var register_endpoint, unload_widget, endpointsByWidget, Manager,
        PubEndPoint, SubEndPoint;

    endpointsByWidget = {};
    Manager = {};

    register_endpoint = function register_endpoint(iWidgetId, endpoint) {

        var iWidget;

        if (!(endpoint instanceof SilboPS.SubEndPoint) && !(endpoint instanceof SilboPS.PubEndPoint)) {
            throw new TypeError();
        }

        if (!(iWidgetId in endpointsByWidget)) {
            iWidget = opManager.activeWorkspace.getIWidget(iWidgetId);
            endpointsByWidget[iWidgetId] = [];
            iWidget.addEventListener('unload', unload_widget);
        }

        endpointsByWidget[iWidgetId].push(endpoint);
    };

    unload_widget = function unload_widget(iWidget) {
        var i, endpoints;

        endpoints = endpointsByWidget[iWidget.getId()];
        for (i = 0; i < endpoints.length; i += 1) {
            endpoints[i].close();
        }

        delete endpointsByWidget[iWidget.getId()];
    };

    PubEndPoint = function PubEndPoint(iWidgetId) {
        var args;

        if (arguments.length === 0) {
            return;
        }

        iWidgetId = arguments[0];
        args = Array.prototype.slice.call(arguments, 1);
        SilboPS.PubEndPoint.apply(this, args);
        register_endpoint(iWidgetId, this);
    };
    PubEndPoint.prototype = new SilboPS.PubEndPoint();

    SubEndPoint = function SubEndPoint() {
        var args, iWidgetId;

        if (arguments.length === 0) {
            return;
        }

        iWidgetId = arguments[0];
        args = Array.prototype.slice.call(arguments, 1);
        SilboPS.SubEndPoint.apply(this, args);
        register_endpoint(iWidgetId, this);
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
