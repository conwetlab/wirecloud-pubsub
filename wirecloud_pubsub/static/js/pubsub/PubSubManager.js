/*global opManager, Wirecloud*/

(function (opmanager, SilboPS) {

    "use strict";

    var register_widget_endpoint, register_operator_endpoint, unload_widget, unload_operator,
        endpointsByWidget, endpointsByOperator, Manager, PubEndPoint, SubEndPoint;

    endpointsByWidget = {};
    endpointsByOperator = {};
    Manager = {};

    register_widget_endpoint = function register_widget_endpoint(iWidgetId, endpoint) {

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

    register_operator_endpoint = function register_operator_endpoint(iOperatorId, endpoint) {

        var iOperator;

        if (!(endpoint instanceof SilboPS.SubEndPoint) && !(endpoint instanceof SilboPS.PubEndPoint)) {
            throw new TypeError();
        }

        if (!(iOperatorId in endpointsByOperator)) {
            iOperator = opManager.activeWorkspace.wiring.ioperators[iOperatorId];
            endpointsByOperator[iOperatorId] = [];
            iOperator.addEventListener('unload', unload_operator);
        }

        endpointsByOperator[iOperatorId].push(endpoint);
    };

    unload_operator = function unload_operator(iOperator) {
        var i, endpoints;

        endpoints = endpointsByOperator[iOperator.id];
        for (i = 0; i < endpoints.length; i += 1) {
            endpoints[i].close();
        }

        delete endpointsByOperator[iOperator.id];
    };

    PubEndPoint = function PubEndPoint(type, id) {
        var args;

        if (arguments.length === 0) {
            return;
        }

        args = Array.prototype.slice.call(arguments, 2);
        SilboPS.PubEndPoint.apply(this, args);
        switch (type) {
        case "iwidget":
            register_widget_endpoint(id, this);
            break;
        case "ioperator":
            register_operator_endpoint(id, this);
            break;
        }
    };
    PubEndPoint.prototype = new SilboPS.PubEndPoint();

    SubEndPoint = function SubEndPoint(type, id) {
        var args;

        if (arguments.length === 0) {
            return;
        }

        args = Array.prototype.slice.call(arguments, 2);
        SilboPS.SubEndPoint.apply(this, args);
        switch (type) {
        case "iwidget":
            register_widget_endpoint(id, this);
            break;
        case "ioperator":
            register_operator_endpoint(id, this);
            break;
        }
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
