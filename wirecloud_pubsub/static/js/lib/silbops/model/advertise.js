/**
 * A Advertise is a set of {@link SilboPS.Attribute}
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	/**
	 * Creates an instance of Advertise.
	 * 
	 * @constructor
	 * @this {Advertise}
	 */
	SilboPS.Advertise = function Advertise() {
		
		var that = this;
		var _attributes = {};
		
		/**
		 * Invoked with two parameters it creates an attribute with the given
		 * name and type; if invoked with only one parameter it adds the given
		 * attribute to the advertise.
		 *  
		 * @param {string} name the name of the attribute
		 * @param {Type} type the Type of the attribute
		 * @returns {Advertise} for chaining
		 */
		this.attribute = function attribute(name, type) {
			
			var attr = name;
			
			if (!(attr instanceof SilboPS.Attribute)) {
				
				attr = new SilboPS.Attribute(name, type);
			}
			
			_attributes[attr.toJSON()] = attr;
			
			return that;
		};
		
		/**
		 * Compares the Advertise to the specified object. Returns true if the 
		 * argument is not null or undefined and is an Advertise with the same
		 * Attributes, false otherwise.
		 * 
		 * @param {Advertise} other the object to compare this Advertise against
		 * @returns {Boolean} true if it has the same content, false otherwise
		 */
		this.equals = function equals(other) {
			
			if (that === other) {
				return true;
			}
			
			if (other instanceof SilboPS.Advertise) {
				
				var thisKeys = Object.keys(_attributes);
				var otherKeys = other.getAttributes();
				
				if (thisKeys.length === otherKeys.length) {
					
					for (var i = 0; i < otherKeys.length; i++) {
						
						var key = otherKeys[i].toJSON();
						
						if (!(_attributes[key] instanceof SilboPS.Attribute)) {
							
							return false;
						}
					}
					
					return true;
				}
			}
			
			return false;
		};
		
		/**
		 * Returns an Array containing the attributes of this Advertise.
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
		 * @param advertise {SilboPS.Advertise} the whose presence is to be tested
		 * @returns true if this contains all attributes of the given advertise,
		 *          false otherwise.
		 */
		this.contains = function contains(advertise) {
			
			SilboPS.Utils.requireInstanceOf(advertise, SilboPS.Advertise);
			
			var attrArr = advertise.getAttributes();
			
			for (var i = 0; i < attrArr.length; i++) {
				
				if (!_attributes[attrArr[i].toJSON()]) {
					
					return false;
				}
			}
			
			return true;
		};
		
		/**
		 * Converts the internal representation into a JSON object, namely
		 * an {Array} of strings.
		 * E.g. ["attr1:long","attr2:double"]
		 * 
		 * @returns the JSON object.
		 */
		this.toJSON = function toJSON() {
			
			return Object.keys(_attributes);
		};
	};
	
	/**
	 * Converts the JSON representation into an Advertise.
	 * 
	 * @param json the JSON object to parse
	 * @returns {SilboPS.Advertise}
	 */
	SilboPS.Advertise.fromJSON = function fromJSON(json) {
		
		var advertise = new SilboPS.Advertise();
		
		for (var i = 0; i < json.length; i++) {
			
			advertise.attribute(SilboPS.Attribute.fromJSON(json[i]));
		}
		
		return advertise;
	};
	
	/**
	 * Returns a SilboPS.Advertise made with the keys found in attrIter.
	 * attrIter must support "getAttributes()" method
	 * 
	 * @param attrIter the object with attribute-key to convert
	 * (e.g. Filter, Notification...)
	 * @returns {SilboPS.Advertise}
	 */
	SilboPS.Advertise.asAdvertise = function asAdvertise(attrIter) {
		
		var advertise = new SilboPS.Advertise();
		var attrKeys = attrIter.getAttributes();
		
		for (var i = 0; i < attrKeys.length; i++) {
			
			advertise.attribute(attrKeys[i]);
		}
		
		return advertise;
	};
})(SilboPS);