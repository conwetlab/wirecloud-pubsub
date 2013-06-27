/**
 * It extends the given object with events support
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	SilboPS.Events = function Events(eventList) {
		
		SilboPS.Utils.requireInstanceOf(eventList, Array, "eventList");
		var _handlers = {};
		
		/**
		 * Adds the given handler mapped to the given eventName.
		 * 
		 * @param eventName {string} the name to fire handlers
		 * @param handler {function} the handler to register
		 */
		this.on = function on(eventName, handler) {
			
			SilboPS.Utils.requireString(eventName, "eventName");
			
			if (typeof handler !== "function") {
				
				throw new TypeError("handler isn't an instance of Function");
			}
			
			if (eventList.length > 0 && eventList.indexOf(eventName) < 0) {
				
				throw new TypeError("Unknown eventName: " + eventName);
			}
			
			var list = _handlers[eventName];
			
			if (!list) {
				
				list = [];
				_handlers[eventName] = list;
			}
			
			list.push(handler);
		};
		
		/**
		 * Fires the registered handlers for the given eventName.
		 * The current "this" will be passed to the handler
		 * 
		 * @param eventName {string} the even to fire
		 */
		this.fire = function fire(eventName) {
			
			var list = _handlers[eventName];
			
			if (list) {
				
				// substitute eventName with the endPoint
				var args = Array.prototype.slice.call(arguments, 0);
				args[0] = this;
				
				for (var i = 0; i < list.length; i++) {
					
					list[i].apply(this, args);
				}
			}
		};
		
		/**
		 * removes all handlers
		 */
		this.clearHandlers = function clearHandlers() {
			
			_handlers = {};
		};
		
		/**
		 * @returns {Array} the current list of restricted events for this
		 * object; an empty list if there are no restrictions.
		 */
		this.getEventList = function getEventList() {
			
			return eventList;
		};
	};
	
	/**
	 * Extends the given object with {@link SilboPS.Event} property:
	 * on(), fire(), clearHandlers() and getEventList()
	 * 
	 * @param object the object to instrument.
	 * @param eventList a list of {string} of accepted events; only selected
	 * events will be accepted by SilboPS.Events.on(). If the list is empty
	 * no restriction will be applied
	 */
	SilboPS.Events.extend = function extend(object, eventList) {
		
		var instance = new SilboPS.Events(eventList);
		
		for (var key in instance) {
			
			if (key !== "extend") {
				
				object[key] = instance[key];
			}
		}
	};
})(SilboPS);
