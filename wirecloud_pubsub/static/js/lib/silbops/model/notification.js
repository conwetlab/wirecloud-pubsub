/**
 * A Notification is a set of {@link SilboPS.Attribute} with a
 * {@link SilboPS.Value}. A Context Message has the same structure as
 * notification but different semantic.
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	/**
	 * Creates an instance to map attribute -> value
	 * @param instanceClass the object to use as class reference for equals method
	 * 
	 * @constructor
	 */
	function Mapping(instanceClass) {
		
		// avoid properties creation on prototype call
		if (arguments.length === 0) {
			return;
		}
		
		var that = this;
		var _attributes = {};
		var _values = {};
		
		/**
		 * Invoked with two parameters it creates the mapping between the given
		 * attribute and value; if invoked with three parameters first create a
		 * {@link SilboPS.Attribute} object with the given name and type;
		 * then maps it to the given value.
		 *  
		 * @param {string}        name the name of the attribute
		 * @param {string|number} value the attribute value
		 * @param {SilboPS.Type}  type the Type of the attribute
		 * @returns {this} for chaining
		 */
		this.attribute = function attribute(name, value, type) {
			
			var attr = name;
			var val = null;
			
			if (!(attr instanceof SilboPS.Attribute)) {
				
				attr = new SilboPS.Attribute(name, type);
			}
			
			val = new SilboPS.Value(attr.getType(), value);
			
			var key = attr.toJSON();
			_attributes[key] = attr;
			_values[key] = val;
			
			return that;
		};
		
		/**
		 * Returns an Array containing the attributes of this Notification/Context.
		 * @returns {Array} of {Attribute}
		 */
		this.getAttributes = function getAttributes() {
			
			var keys = Object.keys(_attributes);
			var attrs = [];
			
			for (var i = 0; i < keys.length; i++) {
				
				attrs.push(_attributes[keys[i]]);
			}
			
			return attrs;
		};
		
		/**
		 * Invoked with two parameters creates an attribute with the given
		 * name and type and returns the mapped value for the attribute.
		 * Can be invoked directly with an attribute too.
		 *  
		 * @param name {string}       name the attribute name
		 * @param type {SilboPS.Type} type the attribute type
		 * @returns {SilboPS.Value} the mapped value, undefined if it doesn't
		 * exist the mapping.
		 */
		this.getValue = function getValue(name, type) {
			
			var attr = name;
			
			if (!(attr instanceof SilboPS.Attribute)) {
				
				attr = new SilboPS.Attribute(name, type);
			}
			
			return _values[attr.toJSON()];
		};
		
		this.equals = function equals(other) {
			
			if (that === other) {
				return true;
			}
			
			if (other instanceof instanceClass) {
				
				var thisKeys = Object.keys(_attributes);
				var otherAttr = other.getAttributes();
				
				if (thisKeys.length === otherAttr.length) {
					
					for (var i = 0; i < otherAttr.length; i++) {
						
						var keyAttr = otherAttr[i];
						var key = keyAttr.toJSON();
						
						if (!keyAttr.equals(_attributes[key]) ||
							!other.getValue(keyAttr).equals(_values[key])) {
							
							return false;
						}
					}
					
					return true;
				}
			}
			
			return false;
		};
		
		/**
		 * Converts internal representation to JSON format
		 * E.g. {"attr1:long":5,"attr2:double":3.5}
		 * 
		 * @returns {Object} with {@link SilboPS.Attribute} as keys and
		 * {@link SilboPS.Value} as values
		 */
		this.toJSON = function toJSON() {
			
			var json = {};
			
			for (var key in _attributes) {
				
				json[key] = _values[key].toJSON();
			}
			
			return json;
		};
	}
	
	function jsonConv(json, instance) {
		
		SilboPS.Utils.requireNotNull(json, "JSON object is " + json);
		
		for (var key in json) {
			
			var attr = SilboPS.Attribute.fromJSON(key);
			instance.attribute(attr, json[key]);
		}
		
		return instance;
	}
	
	//--------------------------------------------------------------------------
	/**
	 * Creates a Notification instance
	 * @constructor
	 */
	SilboPS.Notification = function Notification() {
		
		Mapping.call(this, SilboPS.Notification);
	};
	
	SilboPS.Notification.prototype = new Mapping();
	
	SilboPS.Notification.fromJSON = function fromJSON(json) {
		
		return jsonConv(json, new SilboPS.Notification());
	};
	
	/**
	 * Creates a Context instance
	 * @constructor
	 */
	SilboPS.Context = function Context() {
		
		Mapping.call(this, SilboPS.Context);
	};
	
	SilboPS.Context.prototype = new Mapping();
	
	SilboPS.Context.fromJSON = function fromJSON(json) {
		
		return jsonConv(json, new SilboPS.Context());
	};
})(SilboPS);