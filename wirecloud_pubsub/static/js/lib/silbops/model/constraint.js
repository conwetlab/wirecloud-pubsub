/**
 * Represents a single constraint for an attribute. This class is not meant to
 * be used directly but as part of filters.
 * 
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	SilboPS.Constraint = function Constraint(operator, value) {
		
		SilboPS.Utils.require(SilboPS.Operator.isInstanceOf,
				"operator must be an instance of SilboPS.Operator: ", operator);
		
		var isExists = operator === SilboPS.Operator.EXISTS;
		
		if (!isExists) {
			
			SilboPS.Utils.requireInstanceOf(value, SilboPS.Value);
		}
		
		if (!operator.isValidOperand(value)) {
			
			throw new TypeError("operator " + operator.getName() +
								" isn't compatible with " + value.toJSON());
		}
		
		// EXISTS doesn't need a value
		if (isExists) {
			
			value = null;
		}
		
		/**
		 * True if the constraint is satisfied by the otherValue
		 *
		 * @param otherValue {SilboPS.Value} to compare to
		 * @return true if the constraint is satisfied, false otherwise
		 */
		this.match = function match(otherValue) {
			
			return operator.compare(otherValue, value);
		};
		
		this.equals = function equals(other) {
			
			if (this === other) {
				return true;
			}
			
			if (other instanceof SilboPS.Constraint) {
				
				return this.getOperator() === other.getOperator() &&
						SilboPS.Utils.equals(this.getValue(), other.getValue());
			}
			
			return false;
		}.bind(this);
		
		this.getOperator = function getOperator() {
			
			return operator;
		};
		
		this.getValue = function getValue() {
			
			return value;
		};
		
		/**
		 * Convert internal representation to JSON format.
		 * E.g. {"<=":6}
		 * 
		 * @returns {Object} {@link SilboPS.Operator} as keys and
		 * {@link SilboPS.Value} as values
		 */
		this.toJSON = function toJSON() {
			
			var val = operator === SilboPS.Operator.EXISTS ? "" : value.toJSON();
			var json = {};
			json[operator.toJSON()] = val;
			
			return json;
		};
	};
	
	/**
	 * @param type {@link Type} to decode the json
	 * @param json the JSON to decode
	 * @returns the {Type} instance for the given json
	 */
	SilboPS.Constraint.fromJSON = function fromJSON(type, json) {
		
		var keys = Object.keys(json);
		
		if (keys.length !== 1) {
			
			throw new TypeError("Malformed object: " + json);
		}
		
		var oper = SilboPS.Operator.fromJSON(keys[0]);
		var constr = oper === SilboPS.Operator.EXISTS ? SilboPS.Constraint.EXISTS : 
					new SilboPS.Constraint(oper, SilboPS.Value.fromJSON(type, json[keys[0]]));
		
		return constr;
	};
	
	// singleton
	SilboPS.Constraint.EXISTS = new SilboPS.Constraint(SilboPS.Operator.EXISTS, null);
	Object.seal(SilboPS.Constraint.EXISTS);
})(SilboPS);