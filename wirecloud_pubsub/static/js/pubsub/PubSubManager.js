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

        iWidget = opManager.activeWorkspace.getIWidget(iWidgetId);

        if (!(iWidgetId in endpointsByWidget)) {
            endpointsByWidget[iWidgetId] = [];
            iWidget.addEventListener('unload', this._iwidget_unload_listener);
        }

        endpointsByWidget[iWidgetId].push(endpoint);
    };

    unload_widget = function unload_widget(iWidget) {
        var endpoints, endpoint;

        endpoints = endpointsByWidget[iWidget.getId()];
        for (endpoint in endpoints) {
            endpoint.close();
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
