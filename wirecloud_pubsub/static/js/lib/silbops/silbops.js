/**
 * SilboPS handlers common method to serialize and deserialize messages
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	// -------------------------------------------------------------------------
	// "static" functions, don't depend on "this"
	// -------------------------------------------------------------------------
	function createEndpointObj(endpoint) {
		
		return {"streamID" : endpoint.getStreamID(),
				"endpointID" : endpoint.getEndPointID(),
				"type" : endpoint.getType()
				};
	}
		
	function checkEndpointType(endpoint, type) {
		
		SilboPS.Utils.requireInstanceOf(endpoint, SilboPS.PubEndPoint.prototype.constructor, "Endpoint");
		
		if (type && type !== endpoint.getType()) {
			
			throw new TypeError("Invalid endpoint type: " + endpoint.getType() +
								" required: " + type);
		}
		
		return endpoint;
	}
	
	function decodeAdvertiseMsg(payload) {
		
		return [ SilboPS.Advertise.fromJSON(payload.advertise),
		         SilboPS.Advertise.fromJSON(payload.context)];
	}
	
	function decodeNotificationMsg(payload) {
		
		return [SilboPS.Notification.fromJSON(payload.notification)];
	}
	
	var DECODE_MAP = { "advertise" : decodeAdvertiseMsg,
					"unadvertise" : decodeAdvertiseMsg,
					"notify" : decodeNotificationMsg };	
	// -------------------------------------------------------------------------
	
	SilboPS.NET = function NET() {
		
		var that = this;
		var idToKeepAlive = {};			// maps streamID to keepAlive ID
		var idToStreams = {};			// maps streamID to stream object
		var idToBrokerUri = {};			// maps streamID to brokerUri
		var brokerUriToStreams = {};	// maps brokerUri to stream object
		
		var selectedBrokerUri = null;	// current brokerUri to use when creating streams
		var COMMAND_MAPPING = {
				"SilboPS.openStream" : openStream,
				"SilboPS.closeStream" : closeStream,
				"SilboPS.recvMessage" : recvMessage,
				"SilboPS.recvSystemMessage" : recvSystemMessage
			};
		
		// dispatching function
		function messageHandler(stream, event) {
			
			var data = JSON.parse(event.data);
			var method = COMMAND_MAPPING[data.command];
			method.call(null, stream, data.parameters);
		}
		
		function streamToBrokerUri(stream) {
			
			for (var brokerUri in brokerUriToStreams) {
				
				if (stream === brokerUriToStreams[brokerUri]) {
					
					return brokerUri;
				}
			}
			
			throw new TypeError("Stream not found, ID: " + stream.getID());
		}
		
		function startKeepAlive(streamID, keepAlivePeriod) {

			idToKeepAlive[streamID] = setInterval(request.bind(this, "keepAlive",
														{ "streamID" : streamID}),
																keepAlivePeriod);
		}

		function stopKeepAlive(streamID) {

			clearInterval(idToKeepAlive[streamID]);
			delete idToKeepAlive[streamID];
		}
		
		/**
		 * params is { "message" : json } and json is the JSON string form of
		 * { "streamid" : "val", "keepAlivePeriod" : num }
		 * 
		 * @param stream the associated stream
		 * @param params the parameters for this method
		 */
		function openStream(stream, params) {
			// TODO is possible to avoid nested encoding?
			var msg = JSON.parse(params.message);
			var streamID = msg.streamID;
			
			SilboPS.Utils.requireString(streamID, "StreamID");
			
			if (streamID in idToStreams) {
				
				throw new TypeError("StreamID already in use: " + streamID);
			}
			
			if (stream.getID() !== null) {
				
				throw new TypeError("Stream[id=" + stream.getID() +
									"] already in use: streamID=" + streamID);
			}
			
			idToStreams[streamID] = stream;
			idToBrokerUri[streamID] = streamToBrokerUri(stream);
			startKeepAlive(streamID, msg.keepAlivePeriod);
			stream.setID(streamID);
		}
		
		function closeStream(stream, params) {
			// since we use only one stream per brokerURI, we can close the stream
			// without looking at params
			
			// closing the stream set its id to null, so we must save it
			var streamID = stream.getID();
			var brokerUri = idToBrokerUri[streamID];
			
			stream.close();
			
			// delete stream mapping
			stopKeepAlive(streamID);
			delete idToStreams[streamID];
			delete idToBrokerUri[streamID];
			delete brokerUriToStreams[brokerUri];
		}
		
		/**
		 * BrokerURI parameter is optional, if it is provided stream is fetched
		 * using it.
		 * 
		 * @param action    {string} the action to send
		 * @param params    {object} the parameters to send
		 * @param brokerURI {string} the brokerURI to use (optional)
		 */
		function request(action, params, brokerURI) {

			var options = {};
			options.evalJS = false;
			options.method = "post";
			options.parameters = params;
			options.parameters.action = action;
			
			var streamID = null;
			var stream = null;
			var brokerUri = null;
			
			// can't use (!brokerURI) because with an empty string returns false
			if (brokerURI !== null && typeof brokerURI !== "undefined") {
				
				brokerUri = brokerURI;
				stream = brokerUriToStreams[brokerURI];
				streamID = stream.getID();
				
			} else {
				streamID = params["streamID"];
				stream = idToStreams[streamID];
				brokerUri = idToBrokerUri[streamID];
			}
			
			
			// callback function to handle HTTP reply
			options.onSuccess = function (response) {
				
				messageHandler(stream, { "data" : response.responseText });
			};
			
			new Ajax.Request(brokerUri, options);
		}
				
		// handles dispatching and unwrapping for client's messages:
		// (un)advertise [with context] and notification
		function recvMessage(stream, params) {
			
			var endpoint = stream.getEndPoint(params.endpointID);
			SilboPS.Utils.requireNotNull(endpoint, "Endpoint[id=" + params.endpointID +
												" ] not found in stream[id=" +
												stream.getID() + "]");
			// TODO is possible to avoid nested encoding?
			var message = JSON.parse(params.message);
			// Using toLowerCase() for enum compatibility
			var type = message.type.toLowerCase();
			var decoded = DECODE_MAP[type].call(null, message.payload);
			endpoint.fire(type, decoded[0], decoded[1]);
		}
		
		// plain text messages, no JSON
		// Replies to options.onSuccess() of Ajax.Request
		function recvSystemMessage(stream, params) {
			
			var endpoint = stream.getEndPoint(params.endpointID);
			var message = params.message;

			if (typeof endpoint === "undefined") {
				// message for stream
				stream.fire("message", message);
				
			} else {
				// message for specific endPoint
				if (message === "connected") {
					endpoint.fire("open");
				} else if (message === "disconnected") {
					endpoint.fire("close");
					stream.remove(endpoint);
				}

				endpoint.fire("message", message);
			}
		}
		
		// ---------------------------------------------------------------------
		// Internal API for endPoints
		// ---------------------------------------------------------------------
		/**
		 * @returns {string} the current broker URI
		 */
		this.getBrokerUri = function getBrokerUri() {
			
			return selectedBrokerUri;
		};
		
		/**
		 * Sets the current broker to be used when creating connections.
		 * 
		 * @param brokerUri {string} the URI to use as default broker
		 */
		this.setBrokerUri = function setBrokerUri(brokerUri) {
			
			SilboPS.Utils.requireString(brokerUri, "brokerUri");
			selectedBrokerUri = brokerUri;
			
			if (!brokerUriToStreams[selectedBrokerUri]) {
				
				// create EventSource and Stream objects
				var eventSource = new EventSource(selectedBrokerUri);
				var stream = new SilboPS.Stream(eventSource);
				var handler = messageHandler.bind(null, stream);
				brokerUriToStreams[selectedBrokerUri] = stream;
				eventSource.addEventListener("message", handler, true);
				eventSource.openConnectionXHR();
			}
		};
		
		/**
		 * Connects the given endPoint to the broker.
		 * This call is no-blocking, so user has to wait the "open" event
		 * before use the endPoint.
		 * 
		 * @param endpoint {SilboPS.PubEndPoint|SilboPS.SubEndPoint}
		 */
		this.connect = function connect(endpoint) {
			// As default use the stream mapped by the selected brokerUri
			// it is possible to change policy in the future to support
			// multiple streams per brokerUri
			
			checkEndpointType(endpoint);
			that.setBrokerUri(selectedBrokerUri);
			var stream = brokerUriToStreams[selectedBrokerUri];
			
			// Closure to delay endPoint evaluation until function execution
			stream.whenReady(endpoint, function(endpoint, brokerURI) {
				
				request("connect", createEndpointObj(endpoint), brokerURI);
			}.bind(that, endpoint, selectedBrokerUri));
		};
		
		/**
		 * Disconnect the endPoint from the broker.
		 * @param endpoint {SilboPS.PubEndPoint|SilboPS.SubEndPoint}
		 */
		this.disconnect = function disconnect(endpoint) {
			// No need to check the size because server notifies when streamID is empty.
			// The removal is done when receiving the message "close" for an endPoint
			// from the server.
			
			checkEndpointType(endpoint);
			request("disconnect", createEndpointObj(endpoint));
		};
		
		/**
		 * Publish the notification with context
		 * 
		 * @param endpoint {SilboPS.PubEndPoint|SilboPS.SubEndPoint}
		 * @param notification {SilboPS.Notification}
		 * @param context {SilboPS.Context}
		 */
		this.sendNotification = function sendNotification(endpoint, notification, context) {
			
			checkEndpointType(endpoint, SilboPS.EndPoint.PUBLISHER);
			SilboPS.Utils.requireInstanceOf(notification, SilboPS.Notification);
			SilboPS.Utils.requireInstanceOf(context, SilboPS.Context);
			
			var param = createEndpointObj(endpoint);
			var jsonNotif = JSON.stringify(notification.toJSON());
			var jsonCxt = JSON.stringify(context.toJSON());
			param["notification"] = SilboPS.fixJSONdouble(jsonNotif);
			param["context"] = SilboPS.fixJSONdouble(jsonCxt);
			
			request("publish", param);
		};
		
		/**
		 * Sends the advertise and its context advertise to the broker.
		 * 
		 * @param endpoint {SilboPS.PubEndPoint}
		 * @param advertise {SilboPS.Advertise} the advertise
		 * @param cxtAdvertise {SilboPS.Advertise} the context advertise
		 * @param toAdvertise {boolean} true if the message is an advertise,
		 *                              false if it is unadvertise.
		 */
		this.sendAdvertise = function sendAdvertise(endpoint, advertise, cxtAdvertise, toAdvertise) {
			
			checkEndpointType(endpoint, SilboPS.EndPoint.PUBLISHER);
			SilboPS.Utils.requireInstanceOf(advertise, SilboPS.Advertise);
			var action = toAdvertise ? "advertise" : "unadvertise";
			var param = createEndpointObj(endpoint);
			var jsonAdv = JSON.stringify(advertise.toJSON());
			var jsonCxt = JSON.stringify(cxtAdvertise.toJSON());
			param["advertise"] = SilboPS.fixJSONdouble(jsonAdv);
			param["context"] = SilboPS.fixJSONdouble(jsonCxt);
			
			request(action, param);
		};
		
		this.sendSubscribe = function sendSubscribe(endpoint, filter, toSubscribe) {
			
			checkEndpointType(endpoint, SilboPS.EndPoint.SUBSCRIBER);
			SilboPS.Utils.requireInstanceOf(filter, SilboPS.Filter);
			
			var action = toSubscribe ? "subscribe" : "unsubscribe";
			var param = createEndpointObj(endpoint);
			param["filter"] = SilboPS.fixJSONdouble(JSON.stringify(filter.toJSON()));
			request(action, param);
		};
		
		this.sendContext = function sendContext(endpoint, context) {
			
			checkEndpointType(endpoint, SilboPS.EndPoint.SUBSCRIBER);
			SilboPS.Utils.requireInstanceOf(context, SilboPS.Context);
			
			var param = createEndpointObj(endpoint);
			param["context"] = SilboPS.fixJSONdouble(JSON.stringify(context.toJSON()));
			request("context", param);
		};
	};
	
	SilboPS.Net = new SilboPS.NET();
})(SilboPS);
