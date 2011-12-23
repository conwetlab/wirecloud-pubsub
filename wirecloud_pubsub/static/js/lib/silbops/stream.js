// SilboPS Namespace
if (window.SilboPS === undefined) {
    window.SilboPS = {};
}

(function(SilboPS) {

    SilboPS.Stream = function Stream () {
        this._id = null;
        this._eventSource = null;
    };
    Events.extend(SilboPS.Stream.prototype);
    SilboPS.Stream.brokerUri = '/silbops/CometAPI';

    SilboPS.Stream.prototype.whenReady = function whenReady(handler) {
        if (this.isReady()) {
            handler(this._id);

        } else {
            if (!this.hasEventSource()) {
                this._init();
            }
            this.on("load", function() {
                handler(this._id);
            });
        }
    };

    SilboPS.Stream.prototype.isReady = function isReady() {
        return this._id !== null;
    };

    SilboPS.Stream.prototype.hasEventSource = function hasEventSource() {
        return this._eventSource !== null;
    };

    SilboPS.Stream.prototype._init = function _init() {

        this.COMMAND_MAPPING = {
            'SilboPS.setId': SilboPS.Stream.prototype.setId,
            'SilboPS.close': SilboPS.Stream.prototype.close,
            'SilboPS.recvMessage': SilboPS.recvMessage,
            'SilboPS.recvNotification': SilboPS.recvNotification
        };

        this._eventSource = new EventSource(SilboPS.Stream.brokerUri);
        this._eventSource.addEventListener('message', this._messageHandler.bind(this), true);
    };

    SilboPS.Stream.prototype._messageHandler = function _messageHandler(event) {

        var data = JSON.parse(event.data);
        var method = this.COMMAND_MAPPING[data.command];
        method.call(this, data.parameters);
    };

    SilboPS.Stream.prototype.setId = function setId(data) {
        var msg = JSON.parse(data.message);
        this._id = msg.streamid;
        SilboPS.startKeepAlive(this._id, msg.keepAlivePeriod);
        this.fire("load");
    };

    SilboPS.Stream.prototype.close = function close() {
        this._id = null;
        this.fire("close");
        this._eventSource.close();
        this._eventSource = null;
        this.clearHandlers();
        SilboPS.stopKeepAlive();
    };
})(window.SilboPS);