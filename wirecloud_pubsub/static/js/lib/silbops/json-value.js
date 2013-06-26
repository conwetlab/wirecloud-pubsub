/**
 * Provides function to fix JSON strigify for double-typed values, so to easy
 * server side decoding. This modify is transparent w.r.t. other libraries and 
 * full compatibility is expected
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	SilboPS.Parser = function Parser() {
		
		var fieldStack = [];		// contains } or ] to mark scope
		var enableDoubleFix = false;
		var isKey = false;
		var stackThreshold = Number.POSITIVE_INFINITY; // lower bound for substitution
		var position = 0;
		var output = "";
		
		this.parse = function parse(string) {
			
			for (position = 0; position < string.length; position++) {
				
				var currentChar = string.charAt(position);
				output += currentChar;
				
				switch (currentChar) {
				
					case "{": // object start
						isKey = true;
						fieldStack.push("}");
						break;
					case "}": // object end
						this.pop(currentChar);
						break;
					case "[": // array start
						fieldStack.push("]");
						break;
					case "]": // array end
						this.pop(currentChar);
						break;
					case '"': // string type
						this.readKey(string);
						break;
					case ":" : // key-value separator
						isKey = false;
						break;
					case "," :
						this.endFixScope();
						isKey = fieldStack[fieldStack.length - 1] === "}";
						break;
					default: // other chars like "[space]" or [0-9]
						this.readValue(string);
				}
			}
		};
				
		this.pop = function pop(char) {
			
			var tos = fieldStack.pop();
			
			if (!tos || tos !== char) {
				
				throw new TypeError("Stack char mismatch: expected " + tos + " found " + char);
			}
			
			this.endFixScope();
		};
		
		this.endFixScope = function endFixScope() {
			
			if (stackThreshold >= fieldStack.length) {
				
				stackThreshold = Number.POSITIVE_INFINITY;
				enableDoubleFix = false;
				isKey = false;
			}
		};
		
		/**
		 * Reads the string until key field is ended, updates position and
		 * typeStack according to the key's type
		 * 
		 * @param string {string} the string to extract key field
		 */
		this.readKey = function readKey(string) {
			
			//position++;
			var key = this.readString(string);
			var tos = fieldStack[fieldStack.length - 1];
			
			if (isKey && tos === "}" && key.contains(":double")) {
				
				enableDoubleFix = true;
				stackThreshold = fieldStack.length;
			}
		};
		
		this.readString = function readString(string) {
			
			// termination chars are ":  ",  "}  "] if " isn't escaped
			var selection = string.slice(position);
			var end = selection.search(/[^\\]"\s*[:,}\]]/) + 2;
			var key = selection.slice(0, end);
			output += key.slice(1); // since heading " has already been copied
			position += end - 1;	// to compensate next position++; call
			
			return key;
		};
		
		this.readValue = function readValue(string) {
			
			var char = string.charAt(position);
			
			if (/[\d]/.test(char)) { // it's a number
				
				var number = this.readNumber(string);
				number = this.fixDouble(number);
				output += number.slice(1); // the first char has already been copied
			}
		};
				
		this.readNumber = function readNumber(string) {
			
			// we must accept number in as 5, 1.2, 1e+2, 1.4E-3...
			var selection = string.substring(position);
			var end = selection.search(/[\]},\s]/);
			var number = selection.slice(0, end);
			position += end - 1;	// to compensate next position++; call
			
			return number;
		};
		
		this.fixDouble = function fixDouble(number) {
			
			if (enableDoubleFix) {
				
				var lowerCase = number.toLowerCase();
				
				if (!lowerCase.contains(".") && !lowerCase.contains("e")) {
					
					number += ".0";
				}
			}
			
			return number;
		};
		
		this.getOutput = function getOutput() {
			
			return output;
		};
	};
	
	/**
	 * Trails double-typed values with a ".0", to ease server-side decoding.
	 *  
	 * @param jsonString {string} the json string to modify
	 * @returns {string} the json string modified
	 */
	SilboPS.fixJSONdouble = function fixJSONdouble(jsonString) {
		
		var parser = new SilboPS.Parser();
		parser.parse(jsonString);
		
		return parser.getOutput();
	};
}(SilboPS));