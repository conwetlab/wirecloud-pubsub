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

        endpoints = endpointsByWidget[iWidget.id];
        for (i = 0; i < endpoints.length; i += 1) {
            endpoints[i].close();
        }

        delete endpointsByWidget[iWidget.id];
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

    PubEndPoint = function PubEndPoint(type, id, options) {

        if (arguments.length === 0) {
            return;
        }

        // TODO add multi broker support
        SilboPS.Net.setBrokerUri(Wirecloud.URLs.DEFAULT_SILBOPS_BROKER);

        var silbops_endpoint = new SilboPS.PubEndPoint(options);

        switch (type) {
        case "iwidget":
            register_widget_endpoint(id, silbops_endpoint);
            break;
        case "ioperator":
            register_operator_endpoint(id, silbops_endpoint);
            break;
        }

        return silbops_endpoint;
    };

    SubEndPoint = function SubEndPoint(type, id, options) {

        if (arguments.length === 0) {
            return;
        }

        // TODO add multi broker support
        SilboPS.Net.setBrokerUri(Wirecloud.URLs.DEFAULT_SILBOPS_BROKER);

        var silbops_endpoint = new SilboPS.SubEndPoint(options);

        switch (type) {
        case "iwidget":
            register_widget_endpoint(id, silbops_endpoint);
            break;
        case "ioperator":
            register_operator_endpoint(id, silbops_endpoint);
            break;
        }
        
        return silbops_endpoint;
    };

    Object.defineProperties(Manager, {
	'PubEndPoint': {value: PubEndPoint},
        'SubEndPoint': {value: SubEndPoint},
        "Type": {value: SilboPS.Type},
        "Value": {value: SilboPS.Value},
        "Operator": {value: SilboPS.Operator},
        "Attribute": {value: SilboPS.Attribute},
        "Advertise": {value: SilboPS.Advertise},
        "Constraint": {value: SilboPS.Constraint},
        "ContextFunction": {value: SilboPS.ContextFunction},
        "Notification": {value: SilboPS.Notification},
        "Context": {value: SilboPS.Context},
        "Filter": {value: SilboPS.Filter},
        "Net": {value: SilboPS.Net}
    });

    window.PubSubManager = Manager;

})(OpManagerFactory.getInstance(), SilboPS);

delete window.SilboPS;
