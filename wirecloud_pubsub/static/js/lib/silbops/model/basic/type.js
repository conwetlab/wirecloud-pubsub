/**
 * Type: represents the type of attributes
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	/**
	 * Private constructor
	 * @param value {string} the name of value type to store
	 * @param jsType {string} the JavaScript value type
	 */
	function Type(value, jsType) {
		
		/**
		 * @param value the value to check
		 * @returns {Boolean} true if the given value is compatible with
		 *          this {SilboPS.Type}, false otherwise
		 */
		this.isCompatible = function isCompatible(value) {
			
			return typeof value === jsType;
		};
		
		this.toJSON = function toJSON() {
			
			return value;
		};
	};
	
	/**
	 * Enumeration for allowed types
	 * @enum {string}
	 * @returns the enumeration.
	 */
	SilboPS.Type = function() {
		
		var long = new Type("long");
		long.isCompatible = function isCompatible(value) {
			// check that number is an proper long and not a double
			return (typeof value === "number") && value === parseInt(value, 10);
		};
		
		return {STRING : new Type("str", "string"),
				DOUBLE : new Type("double", "number"),
				LONG : long};
	}();
	
	var reverseMap = {"double" : SilboPS.Type.DOUBLE,
						"long" : SilboPS.Type.LONG,
						"str" : SilboPS.Type.STRING};
	
	/**
	 * @param json {string} the JSON string to decode
	 * @returns the {SilboPS.Type} instance for the given json
	 */
	SilboPS.Type.fromJSON = function fromJSON(json) {
		
		var type = reverseMap[json];
		return SilboPS.Utils.requireNotNull(type, "Malformed object: " + json);
	};
	
	/**
	 * @param other the type to check
	 * @returns true if the given parameter is an instance of {SilboPS.Type}, false otherwise
	 */
	SilboPS.Type.isInstanceOf = function isInstanceOf(other) {
		
		return (other instanceof Type);
	};
	
	Object.defineProperty(SilboPS.Type, "fromJSON", { enumerable : false});
	Object.defineProperty(SilboPS.Type, "isInstanceOf", { enumerable : false});
	Object.seal(SilboPS.Type);
})(SilboPS);