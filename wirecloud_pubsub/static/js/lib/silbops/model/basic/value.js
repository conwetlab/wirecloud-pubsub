/**
 * Value: represents the value with its type
 * It is necessary in JavaScript to know the type (long or double) for number
 * to encode it properly in JSON and have the correct match against an attribute 
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	
	SilboPS.Value = function Value(type, value) {
		
		SilboPS.Utils.require(SilboPS.Type.isInstanceOf, "Type not valid: ", type);
		SilboPS.Utils.require(type.isCompatible, "Value not valid: ", value);
		
		this.equals = function equals(other) {
			
			if (this === other) {
				return true;
			}
			
			if (other instanceof SilboPS.Value) {
				
				return type === other.getType() && value === other.getValue();
			}
			
			return false;
		}.bind(this);
		
		this.getType = function getType() {
			
			return type;
		};
		
		this.getValue = function getValue() {
			
			return value;
		};
		
		this.toJSON = function toJSON() {
			
			return value;
		};
	};
	
	/**
	 * @param type {@link Type} to decode the json
	 * @param json the JSON to decode
	 * @returns the {SilboPS.Value} instance for the given json
	 */
	SilboPS.Value.fromJSON = function fromJSON(type, json) {
		
		return new SilboPS.Value(type, json);
	};
})(SilboPS);