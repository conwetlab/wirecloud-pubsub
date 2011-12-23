// SilboPS Namespace
if (window.SilboPS === undefined) {
    window.SilboPS = {};
}

(function(SilboPS) {
    Events.extend(SilboPS);

    SilboPS.connections = {};
    SilboPS._stream = new SilboPS.Stream();

    SilboPS.register = function register(endpoint) {

        if (!(endpoint instanceof SilboPS.EndPoint)) {
            throw new TypeError("endpoint is not of type SilboPS.EndPoint");
        }

        SilboPS._stream.whenReady(function(streamid) {
            var endpointId = SilboPS.newEndPointId();
            // store the current endPoint
            SilboPS.connections[endpointId] = endpoint;
            endpoint.open(streamid, endpointId);

            // send the endpoint ID to servlet
            SilboPS.request("create_connection", {
                streamID : endpoint.streamid,
                endpointID : endpoint.endpointid,
                type : endpoint.type
            });
        });
    }

    SilboPS.newEndPointId = function() {
        var nextId = 1;
        return function newEndPointId() {
            return nextId++;
        };
    }();

    SilboPS.request = function request(action, params) {

        var options = new Object();
        options.method = 'post';
        options.parameters = Object.clone(params);
        options.parameters.action = action;
        // callback function to handle the reply
        options.onSuccess = function (transport) {
            SilboPS._stream._messageHandler({
                data: transport.responseText
                });
        };
        options.evalJS = false;
        new Ajax.Request(SilboPS.Stream.brokerUri, options);
    };

    SilboPS.recvNotification = function recvNotification(data) {

        var endpointID = data.endpointID;
        var endpoint = SilboPS.connections[endpointID];

        if (endpoint != undefined) {

            var message = JSON.parse(data.message);

            // handler dispatching
            endpoint.fire(message['type'], message['message'], this);
        }
    };


    // Internal API
    SilboPS.sendSubscribe = function sendSubscribe(endPoint, filters, toSubscribe) {

        var endpoint = SilboPS.connections[endPoint.endpointid];
        var JSONFilter = Object.toJSON(filters);
        var action = toSubscribe ? 'subscribe' : 'unsubscribe';

        SilboPS.request(action, {
            streamID : endpoint.streamid,
            endpointID : endpoint.endpointid,
            filter : JSONFilter,
            type : endpoint.type
        });
    }


    SilboPS.disconnect = function disconnect(endpoint) {

        var endP = SilboPS.connections[endpoint.endpointid];

        if (endP != null) {

            SilboPS.request('disconnect', {
                streamID : endP.streamid,
                endpointID : endP.endpointid,
                type : endP.type
            });
        }
    // No need to check the size because server notify when streamID is empty.
    // The removal is done when receiving the message "close" for an endpoint
    // from the server.
    }


    SilboPS.publish = function publish(endPoint, notification) {

        var endpoint = SilboPS.connections[endPoint.endpointid];

        SilboPS.request('publish', {
            streamID : endpoint.streamid,
            endpointID : endpoint.endpointid,
            type : endpoint.type,
            notification : Object.toJSON(notification)
        });
    }


    SilboPS.sendAdvertise = function sendAdvertise(endPoint, advertise, toAdvertise) {

        var endpoint = SilboPS.connections[endPoint.endpointid];
        var action = toAdvertise ? 'advertise' : 'unadvertise';

        if (!(advertise instanceof Object)) {
            throw new TypeError('advertise must be an object');
        }

        for (var key in advertise) {
            if (!(advertise[key] instanceof Array)) {
                throw new TypeError('advertise must contain arrays as attribute values');
            }
        }

        SilboPS.request(action, {
            streamID : endpoint.streamid,
            endpointID : endpoint.endpointid,
            type : endpoint.type,
            advertise : Object.toJSON(advertise)
        });
    }


    SilboPS.recvMessage = function recvMessage(data) {

        var endpointID = data['endpointID'];
        var message = data['message'];
        var endpoint = SilboPS.connections[endpointID];

        if (endpoint == undefined) {
            this.fire('message', message, this);
        }
        else {

            if (message === 'end success') {
                endpoint.fire("open");
            } else if (message.indexOf('disconnected') >= 0) {
                endpoint.fire("close");
                delete SilboPS.connections[endpoint.endpointid];
            }

            endpoint.fire('message', message, this);
        }
    }


    SilboPS.startKeepAlive = function startKeepAlive(streamid, keepAlivePeriod) {

        SilboPS.keepAlive = setInterval(SilboPS.request.bind(this,
            "keepAlive", {
                streamID : streamid
            }), keepAlivePeriod);
    }

    SilboPS.stopKeepAlive = function stopKeepAlive() {

        clearInterval(SilboPS.keepAlive);
        SilboPS.keepAlive = null;
    }

})(window.SilboPS);
