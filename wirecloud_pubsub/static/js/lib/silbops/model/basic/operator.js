/**
 * Operator: represents the available operators
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	function Operator(symbol, name) {
		
		var that = this;
		
		this.getName = function getName() {
			
			return name;
		};
		
		this.toJSON = function JSON() {
			
			return symbol;
		};
		
		/**
		 * Checks if a value can be used together with the operator.
		 * 
		 * @param value {Value} the value to control
		 * @return true if the given value is compatible with this {Operator},
		 *         false otherwise
		 */
		this.isValidOperand = function isValidOperand(value) {
			
			if (that === SilboPS.Operator.EXISTS) {
				return true;
			}
			
			if (!(value instanceof SilboPS.Value)) {
				return false;
			}
			
			switch (that) {
				case SilboPS.Operator.STARTS_WITH:
				case SilboPS.Operator.ENDS_WITH:
				case SilboPS.Operator.CONTAINS:
					return value.getType() === SilboPS.Type.STRING;
				default:
					return true;
			}
		};
		
		/**
		 * Compares the two value using for this operator.
		 * It uses an infix semantics.
		 * 
		 * @param left the left SilboPS.Value to compare
		 * @param right the right SilboPS.Value to compare
		 * @return true if is compatible, false otherwise
		 */
		this.compare = function compare(left, right) {
			
			if (that == SilboPS.Operator.EXISTS) {
				
				return true;
			}
			
			if (!(left instanceof SilboPS.Value) ||	!(right instanceof SilboPS.Value)
										|| left.getType() != right.getType()) {
				
				return false;
			}
			// result: -1, 0 or 1
			var leftValue = left.getValue();
			var rightValue = right.getValue();
			var comp = (leftValue < rightValue) ?  -1 : (leftValue === rightValue) ? 0 : 1; 
			
			switch (that) {
				case SilboPS.Operator.EQ:
					return comp == 0;
				case SilboPS.Operator.NE:
					return comp != 0;
				case SilboPS.Operator.GT:
					return comp > 0;
				case SilboPS.Operator.GE:
					return comp >= 0;
				case SilboPS.Operator.LT:
					return comp < 0;
				case SilboPS.Operator.LE:
					return comp <= 0;
				case SilboPS.Operator.STARTS_WITH:
					return left.getType() == SilboPS.Type.STRING && leftValue.startsWith(rightValue);
				case SilboPS.Operator.ENDS_WITH:
					return left.getType() == SilboPS.Type.STRING && leftValue.endsWith(rightValue);
				case SilboPS.Operator.CONTAINS:
					return left.getType() == SilboPS.Type.STRING && leftValue.contains(rightValue);
				default:	// should never reach this point
					throw new IllegalArgumentException("Unknown operator: " + that.getName());
			}
		};
	};
	
	SilboPS.Operator = {
			EXISTS : new Operator("exists", "EXISTS"),		/** The attribute exists */
			EQ : new Operator("=", "EQ"),					/** Equal */
			NE : new Operator("!=", "NE"),					/** Not equal */
			GT : new Operator(">", "GT"),					/** Greater than */
			GE : new Operator(">=", "GE"),					/** Greater or equal */
			LT : new Operator("<", "LT"),					/** Less than */
			LE : new Operator("<=", "LE"),					/** Less or equal */
			STARTS_WITH : new Operator("^", "STARTS_WITH"),	/** Starts with a string */
			ENDS_WITH : new Operator("$", "ENDS_WITH"),		/** Ends with a string */
			CONTAINS : new Operator("*", "CONTAINS")		/** Contains a string */
	};
	
	// initialize reverseMap
	var reverseMap = {};
	
	for (var key in SilboPS.Operator) {
		
		var value = SilboPS.Operator[key];
		
		reverseMap[value.toJSON()] = value;
	}
	
	/**
	 * @param json {string} the JSON string to decode
	 * @returns the {Type} instance for the given json
	 */
	SilboPS.Operator.fromJSON = function fromJSON(json) {
		
		var operator = reverseMap[json];
		return SilboPS.Utils.requireNotNull(operator, "Malformed object: " + json);
	};
	
	/**
	 * @param other the operator to check
	 * @returns true if the given parameter is an instance of {SilboPS.Operator}, false otherwise
	 */
	SilboPS.Operator.isInstanceOf = function isInstanceOf(other) {
		
		return (other instanceof Operator);
	};
	
	Object.defineProperty(SilboPS.Operator, "fromJSON", { enumerable : false});
	Object.defineProperty(SilboPS.Operator, "isInstanceOf", { enumerable : false});
	Object.seal(SilboPS.Operator);
})(SilboPS);