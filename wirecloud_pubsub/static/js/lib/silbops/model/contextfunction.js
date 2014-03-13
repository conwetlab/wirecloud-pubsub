/**
 * This JavaScript object represents the context function used to evaluate
 * context attributes. The main difference of this implementation w.r.t. the
 * Java one is that it stores only the values, thus the method "match" and the
 * copy constructor aren't implemented
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	SilboPS.ContextFunction = function ContextFunction() {
		
		var _constraintMap = {};
		var that = this;
		
		this.equals = function equals(other) {
			
			if (that === other) {
				return true;
			}
			
			if (other instanceof SilboPS.ContextFunction) {
				
				var thisKeys = that.getKeys();
				var otherKeys = other.getKeys();
				
				if (thisKeys.length === otherKeys.length) {
					
					for (var i = 0; i < otherKeys.length; i++) {
						
						var key = otherKeys[i];
						var value = _constraintMap[key];
						
						if (!(value instanceof SilboPS.Value) ||
							!value.equals(other.getValueFor(key))) {
							
							return false;
						}
					}
					
					return true;
				}
			}
			
			return false;
		};
		
		/**
		 * Adds the given constraint to the context function
		 * @param notifAttr {SilboPS.Attribute} the notification attribute
		 * @param subscriptionAttr {SilboPS.Attribute} the subscription attribute
		 * @param range {number} the maximum distance accepted between the two values
		 * @returns {this} to enable chaining
		 */
		this.addConstraint = function addConstraint(notifAttr, subscriptionAttr, range) {
			
			_constraintMap[toStringKey(notifAttr, subscriptionAttr)] = new SilboPS.Value(SilboPS.Type.DOUBLE, range);
			return that;
		};
		
		this.getKeys = function getKeys() {
			
			return Object.keys(_constraintMap);
		};
		
		this.getValueFor = function getValueFor(key) {
			
			return _constraintMap[key];
		};
		
		this.toJSON = function toJSON() {
			
			var json = {};
			
			for (var key in _constraintMap) {
				
				json[key] = _constraintMap[key].toJSON();
			}
			
			return json;
		};
	};
	
	SilboPS.ContextFunction.fromJSON = function fromJSON(json) {
		
		SilboPS.Utils.requireNotNull(json, "JSON object is " + json);
		var contextFunc = new SilboPS.ContextFunction();
		
		for (var key in json) {
			
			var attributes = JSON.parse(key);
			var notifAttr = SilboPS.Attribute.fromJSON(attributes["notAttr"]);
			var subscriptionAttr = SilboPS.Attribute.fromJSON(attributes["subscriptionAttr"]);
			var value = SilboPS.Value.fromJSON(SilboPS.Type.DOUBLE, json[key]);
			
			contextFunc.addConstraint(notifAttr, subscriptionAttr, value.getValue());
		}
		
		return contextFunc;
	};
		
	function toStringKey(notifAttr, subscriptionAttr) {
		
		SilboPS.Utils.requireInstanceOf(notifAttr, SilboPS.Attribute, "notifAttr");
		SilboPS.Utils.requireInstanceOf(subscriptionAttr, SilboPS.Attribute, "subscriptionAttr");
		
		if (notifAttr.getType() !== subscriptionAttr.getType()) {
			
			throw new TypeError("Attributes must have same type: "
								+ "notifAttr type="+ notifAttr.getType()
								+ ", subscriptionAttr type=" + subscriptionAttr.getType());
		}
		
		return JSON.stringify({ "notAttr" : notifAttr.toJSON(),
								"subscriptionAttr" : subscriptionAttr.toJSON() });
	};
})(SilboPS);