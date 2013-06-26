/**
 * Attribute is a pair of name and type.
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	/**
	 * Creates an instance of {Attribute}
	 * 
	 * @constructor
	 * @param name {string} the attribute name
	 * @param type {Type} the type of attribute
	 * @throws Exception if parameters are undefined, null or not valid
	 */
	SilboPS.Attribute = function Attribute(name, type) {
		
		// parameters validation
		SilboPS.Utils.requireString(name, "name");
		SilboPS.Utils.require(SilboPS.Type.isInstanceOf, "Type not valid: ", type);
		
		/**
		 * Compares the Attribute to the specified object. Returns true if the 
		 * argument is not null or undefined and is an Attribute with the same
		 * name and type, false otherwise.
		 * 
		 * @param other the object to compare this Advertise against
		 * @returns {Boolean} true if it has the same content, false otherwise
		 */
		this.equals = function equals(other) {
			
			if (this === other) {
				return true;
			}
			
			if (other instanceof SilboPS.Attribute) {
				
				return name === other.getName() && type === other.getType();
			}
			
			return false;
		}.bind(this);
		
		/**
		 * @returns the attribute name
		 */
		this.getName = function getName() {
			
			return name;
		};
		
		/**
		 * @returns the attribute type
		 */
		this.getType = function getType() {
			
			return type;
		};
		
		/**
		 * This representation isn't escaped.
		 * 
		 * @returns {String} the JSON representation of Attribute
		 */
		this.toJSON = function toJSON() {
			
			return name + ":" + type.toJSON();
		};
	};
	
	/**
	 * Converts the JSON representation into an {Attribute}
	 * 
	 * @param json the JSON representation to decode
	 * @returns {SilboPS.Attribute} the Attribute
	 */
	SilboPS.Attribute.fromJSON = function fromJSON(json) {
		
		var fields = json.split(":", 2);
		
		return new SilboPS.Attribute(fields[0], SilboPS.Type.fromJSON(fields[1]));
	};
})(SilboPS);