/**
 * Stream represents the multiplexer for endPoints having the same StreamID
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	// accepted events
	var messageEvent = "message";
	var loadEvent = "load";
	var closeEvent = "close";
	
	SilboPS.Stream = function Stream(eventSource) {
		
		SilboPS.Utils.requireInstanceOf(eventSource, EventSource, "eventSource");
		var that = this;
		var id = null;
		var nextId = 0;
		var endpoints = {};
		
		// add event support
		SilboPS.Events.extend(that, [loadEvent, closeEvent, messageEvent]);
		
		function isReady() {
			
			return id !== null;
		}
		
		function addEndPoint(endpoint) {
			
			nextId++;
			var endpointId = nextId.toString();
			endpoints[endpointId] = endpoint;
			endpoint.open(id, endpointId);
		}
		
		/**
		 * Register the given endPoint to the stream and execute the given handler
		 * @param endpoint               the endPoint to register.
		 * @param handlerFunc {Function} the handler to execute after registration
		 */
		this.whenReady = function whenReady(endpoint, handlerFunc) {
			
			if (isReady()) {
				
				addEndPoint(endpoint);
				handlerFunc(endpoint);

			} else {
				// delay the execution until streamID is ready
				that.on(loadEvent, function() {
					
					addEndPoint(endpoint);
					handlerFunc(endpoint);
				});
			}
		};
		/**
		 * @param endpointid {string} the endPoint's id 
		 * @returns the endpoint object, undefined if it en
		 */
		this.getEndPoint = function getEndPoint(endpointid) {
			
			return endpoints[endpointid];
		};
		
		/**
		 * @param endpoint removes the given endPoint from the stream
		 * @returns true if the endPoint is removed, false otherwise
		 * @throws {@link TypeError} exception if the endPoint isn't associated
		 * to the stream
		 */
		this.remove = function remove(endpoint) {
			
			if (endpoint.getStreamID() !== id) {
				
				throw new TypeError("Endpoint isn't associated to the stream:" +
									" streamID=" + id +
									", endpoint's streamID=" + endpoint.getStreamID());
			}
			
			var endpointID = endpoint.getEndPointID();
			var isPresent = endpointID in endpoints;
			delete endpoints[endpointID];
			
			return isPresent;
		};
		
		this.close = function close() {
			
			// idempotent method
			if (isReady()) {
				
				id = null;
				that.fire(closeEvent);
				that.clearHandlers();
				eventSource.close();
				eventSource = null;
				
				// fire "close" to all endPoints because here comes directly
				// from server side
				for (var endpointID in endpoints) {
					
					endpoints[endpointID].fire("close");
				}
				
				endpoints = {};
			}
		};
		
		this.setID = function setID(_id) {
			
			if (isReady()) {
				
				throw new TypeError("StreamID is already set: " + id);
			}
			
			id = SilboPS.Utils.requireString(_id, "streamID");
			that.fire(loadEvent);
		};
		
		this.getID = function getID() {
			
			return id;
		};
	};
})(SilboPS);