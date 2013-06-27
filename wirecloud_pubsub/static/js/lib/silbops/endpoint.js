/**
 * EndPoint represents a full-duplex connection to a broker.
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	// supported events
	var subscriberEvents = ["advertise", "unadvertise", "notify"];
	var events = Object.freeze(["open", "close", "error", "message"]);
	var allEvents = Object.freeze(events.concat(subscriberEvents));
	
	// endpoint's types
	SilboPS.EndPoint = Object.freeze({"PUBLISHER" : "PUBLISHER",
									"SUBSCRIBER" : "SUBSCRIBER"});
	
	Object.freeze(SilboPS.EndPoint);
	
	function EndPoint(eventList, handlers, type) {

		if (arguments.length !== 3) {
			return; // to have inheritance but to avoid creating functions
					// when not required
		}
		
		SilboPS.Utils.requireNotNull(handlers, "handlers must not be null");
		
		var that = this;
		var _streamid = null;
		var _endpointid = null;
		
		this.open = function open(streamid, endpointid) {
			
			if (_streamid !== null) {
				
				throw new TypeError("Endpoint is already open");
			}
			
			_streamid = SilboPS.Utils.requireString(streamid, "streamid");
			_endpointid = SilboPS.Utils.requireString(endpointid, "endpointid");
		};
		
		this.close = function close() {

			SilboPS.Net.disconnect(that);
		};
		
		this.getStreamID = function getStreamID() {
			
			return _streamid;
		};
		
		this.getEndPointID = function getEndPointID() {
			
			return _endpointid;
		};
		
		this.getType = function getType() {
			
			return type;
		};
		
		// add user's handlers
		SilboPS.Events.extend(that, eventList);
		
		for (var event in handlers) {
			
			that.on(event, handlers[event]);
		}
		
		SilboPS.Net.connect(that);
	};
		
	// =========================================================================
	// Typed EndPoints: Publisher and Subscriber
	// =========================================================================
	/**
	 * PubEndPoint is used by publisher to send {@link SilboPS.Advertise}
	 * @param handlers the handlers to use
	 */
	SilboPS.PubEndPoint = function PubEndPoint(handlers) {
		
		EndPoint.call(this, events, handlers, SilboPS.EndPoint.PUBLISHER);
		
		var that = this;
		var _context = new SilboPS.Context();
		
		this.publish = function publish(notification) {
			
			SilboPS.Net.sendNotification(that, notification, _context);
		};
		
		this.setContext = function setContext(context) {
			
			_context = SilboPS.Utils.requireInstanceOf(context, SilboPS.Context);
		};
		
		this.advertise = function advertise(advertise) {
			
			var cxtAdv = SilboPS.Advertise.asAdvertise(_context);
			
			SilboPS.Net.sendAdvertise(that, advertise, cxtAdv, true);
		};
		
		this.unadvertise = function unadvertise(advertise) {
			
			var cxtAdv = SilboPS.Advertise.asAdvertise(_context);
			
			SilboPS.Net.sendAdvertise(that, advertise, cxtAdv, false);
		};
	};
	
	SilboPS.PubEndPoint.prototype = new EndPoint();
	// -------------------------------------------------------------------------
	/**
	 * SubEndPoint is used by subscriber to send {@link SilboPS.Filter} and
	 * to receive {@link SilboPS.Advertise} and {@link SilboPS.Notification}.
	 * 
	 * @param handlers the handlers to use
	 */
	SilboPS.SubEndPoint = function SubEndPoint(handlers) {
		
		EndPoint.call(this, allEvents, handlers, SilboPS.EndPoint.SUBSCRIBER);
		
		var that = this;
		var _context = null;
		
		function sendSubscribe(filter, contextFunc, toSubscribe) {
			
			if (!_context) {
				
				that.setContext(new SilboPS.Context());
			}
			
			filter.setContextFunction(contextFunc);
			
			SilboPS.Net.sendSubscribe(that, filter, toSubscribe);
		}
		
		this.setContext = function setContext(context) {
			
			_context = SilboPS.Utils.requireInstanceOf(context, SilboPS.Context);
			SilboPS.Net.sendContext(that, context);
		};
		
		this.subscribe = function subscribe(filter, contextFunc) {
			
			sendSubscribe(filter, contextFunc, true);
		};
		
		this.unsubscribe = function unsubscribe(filter, contextFunc) {
			
			sendSubscribe(filter, contextFunc, false);
		};
	};
	
	SilboPS.SubEndPoint.prototype = new EndPoint();
})(SilboPS);