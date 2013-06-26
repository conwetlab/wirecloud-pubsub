// Create SilboPS Namespace
if (typeof SilboPS === "undefined") {
	"use strict";
	
	var SilboPS = {};
}

// -----------------------------------------------------------------------------
// Add startsWith(), endsWith() and contains() to string if not present
// To remove when all major browser will support these functions
// (IE isn't a browser)
// -----------------------------------------------------------------------------
if (!("startsWith" in String.prototype)) {
	
	String.prototype.startsWith = function startsWith(str) {
		
		return this.substring(0, str.length) === str;
	};
}

if (!("endsWith" in String.prototype)) {
	
	String.prototype.endsWith = function endsWith(str) {
		
		return this.substring(this.length - str.length, this.length) === str;
	};
}

if (!("contains" in String.prototype)) {
	
	String.prototype.contains = function contains(str, startIndex) {
		
		return this.indexOf(str, startIndex) !== -1;
	};
}
// -----------------------------------------------------------------------------

/**
 * Utility methods
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	
	SilboPS.Utils = {};
	
	/**
	 * Returns the same object if it isn't null or undefined, otherwise
	 * throws a ReferenceError exception with the given message.
	 * If no message is provided, "Object is null" is used.
	 * @param object  the object to check
	 * @param message the message to throw if object is null
	 * @returns object
	 * @throws {@link ReferenceError}
	 */
	SilboPS.Utils.requireNotNull = function requireNotNull(object, message) {
		
		if ((typeof object) === "undefined" || object === null) {
			
			var msg = message || "Object is null";
			
			throw new TypeError(msg);
		}
		
		return object;
	};
	
	/**
     * Returns true if the arguments are equal to each other and false otherwise.
     * Consequently, if both arguments are null or undefined, true is returned
     * and if exactly one argument is null or undefined false is returned.
     * Otherwise, equality is determined by using the equals method of the first
     * argument.
     *
     * @param a an object
     * @param b an object to be compared with a for equality
     * @return true if the arguments are equal to each other, false otherwise
     */
	SilboPS.Utils.equals = function equals(a, b) {
		
		var typeA = typeof a;
		
		return (a === b) || (typeA !== "undefined" && a !== null && a.equals(b));
	};
	
	/**
	 * @param object {object} the object to check type with "typeof"
	 * @param name {string} the parameter name to use into exception message
	 * @returns the given object is of type {string}
	 * @throws {@link TypeError} if the object isn't of type {string}
	 */
	SilboPS.Utils.requireString = function requireString(object, name) {
		
		if (typeof object !== "string") {
			
			throw new TypeError(name + " must be a string: " + JSON.stringify(object));
		}
		
		return object;
	};
	
	/**
	 * @param instance {object} the object to be checked
	 * @param instanceClass {Function}
	 * @param instanceName {string} the name to use for object into exception message
	 * @returns returns the object if it is an instance of instanceClass
	 * @throws {@link TypeError} if the object isn't an instance of instanceClass
	 */
	SilboPS.Utils.requireInstanceOf = function requireInstanceOf(instance, instanceClass, instanceName) {
		
		if (!(instance instanceof instanceClass)) {
			
			var strInst = instanceName || JSON.stringify(instance);
			var strClass = instanceClass.name || JSON.stringify(instanceClass);
			
			throw new TypeError(strInst + " isn't an instance of " + strClass);
		}
		
		return instance;
	};
	
	/**
	 * Throws a TypeError exception if the given parameter aren't valid
	 * according o the given function, otherwise returns the original parameter.
	 * Other parameters will be passed to the function.
	 * @param func the function to apply to the parameter
	 * @param message the message to throw with {@link TypeError} exception
	 * @param parameter the parameter to control
	 * @returns parameter the same parameter if the function returned true
	 * @throws {@link TypeError} if the function return false
	 */
	SilboPS.Utils.require = function require(func, message, parameter) {
		
		// removes "func" and "message" arguments
		var args = Array.prototype.slice.call(arguments, 2);
		
		if (!func.apply(this, args)) {
			
			throw new TypeError(message + parameter);
		}
		
		return parameter;
	};
})(SilboPS);