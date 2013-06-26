/**
 * Filter: a set of constraints over attributes
 * 
 * var filter = {
 * 		"attr1:double": [{"=" : 5.5}],
 * 		"attr2:long": [{">=" : 5}, {"<" : 10}]
 * 		"attr3:str": [{"^" : "hello"}, {"$" : "world!"}]
 * 	};
 * 
 * @param SilboPS the object to use as namespace root
 * @author sergio
 */
(function(SilboPS) {
	"use strict";
	
	// compares using toJSON() string representation
	var compare = function(a, b) {
		
		var first = JSON.stringify(a.toJSON());
		var second = JSON.stringify(b.toJSON());
		
		return first.localeCompare(second);
	};
	
	/**
	 * Creates an instance of SilboPS.Filter
	 * 
	 * @constructor
	 */
	SilboPS.Filter = function Filter() {
		
		var that = this;
		var _id = "";
		var _attributes = {};
		var _constraints = {};
		var _contextFunction = new SilboPS.ContextFunction();
		
		// ---------------------------------------------------------------------
		// plain getters and setters
		//
		this.getID = function getID() {
			
			return _id;
		};
		
		this.setID = function setID(id) {
			
			_id = SilboPS.Utils.requireString(id, "id");
		};
		
		this.getContextFunction = function getContextFunction() {
			
			return _contextFunction;
		};
		
		this.setContextFunction = function setContextFunction(contextFunction) {
			
			SilboPS.Utils.requireInstanceOf(contextFunction, SilboPS.ContextFunction);
			_contextFunction = contextFunction;
		};
		// ---------------------------------------------------------------------
		
		/**
		 * Should be used only by Constraint Builder object and fromJSON() 
		 * 
		 * @param attribute {SilboPS.Attribute} the attribute to constraint
		 * @param constraint {SilboPS.Constraint} the constraint to add
		 * @throws {@link TypeError} if the parameters aren't valid
		 */
		this._addConstraint = function _addConstraint(attribute, constraint) {
			
			SilboPS.Utils.requireInstanceOf(attribute, SilboPS.Attribute);
			SilboPS.Utils.requireInstanceOf(constraint, SilboPS.Constraint);
			
			// if isn't EXIST, perform type check between attribute and value
			if (!SilboPS.Constraint.EXISTS.equals(constraint) &&
				attribute.getType() !== constraint.getValue().getType()) {
				
				throw new TypeError("Constraint and Attribute doesn't have the same type:"
						+ " attribute type=" + attribute.getType().toJSON()
						+ ", constraint type=" + constraint.getValue().getType().toJSON());
			}
			
			var key = attribute.toJSON();
			var list = _constraints[key];
			
			if (typeof list === "undefined") {
				
				list = [];
				_attributes[key] = attribute;
				_constraints[key] = list;
			}
			
			// don't add duplicates
			for (var i = 0; i < list.length; i++) {
				
				if (constraint.equals(list[i])) {
					// found a copy
					return;
				}
			}
			
			list.push(constraint);
		};
		
		this.equals = function equals(other) {
			
			if (that === other) {
				return true;
			}
			
			if (other instanceof SilboPS.Filter) {
				
				var thisKeys = Object.keys(_attributes);
				var otherAttr = other.getAttributes();
				
				if (thisKeys.length === otherAttr.length &&
					_id === other.getID() &&
					_contextFunction.equals(other.getContextFunction())) {
					
					// checks attributes
					for (var i = 0; i < otherAttr.length; i++) {
						
						var keyAttr = otherAttr[i];
						var key = keyAttr.toJSON();
						
						var thisConst = that.getConstraints(keyAttr);
						var otherConst = other.getConstraints(keyAttr);
						
						// checks constraints for an attribute
						if (keyAttr.equals(_attributes[key]) &&
							thisConst.length === otherConst.length) {

							// sort the arrays to have same order
							// it doesn't matter if it's a browsers-specific sort
							thisConst.sort(compare);
							otherConst.sort(compare);

							for (var j = 0; j < thisConst.length; j++) {
								
								if(!thisConst[j].equals(otherConst[j])) {
									
									return false;
								}
							}
						} else {
							return false;
						}
					}
					
					return true;
				}
			}
			
			return false;
		};
		
		/**
		 * Selects the given attribute to start chaining constraints on it.
		 * If called with only one parameter use directly as a
		 * {SilboPS.Attribute} object.
		 * 
		 * @param {string}       name the name of the attribute
		 * @param {SilboPS.Type} type the type of the attribute
		 * @returns {ConstraintBuilder} the builder object.
		 */
		this.constrain = function constrain(name, type) {
			
			var attrib = name;
			
			if (!(attrib instanceof SilboPS.Attribute)) {
				
				attrib = new SilboPS.Attribute(name, type);
			}
			
			return new ConstraintBuilder(that, attrib);
		};
				
		/**
		 * Returns an Array containing the attributes of this Filter.
		 * @returns {Array} of {Attribute}
		 */
		this.getAttributes = function getAttributes() {
			
			var keys = Object.keys(_constraints);
			var attrs = [];
			
			for (var i = 0; i < keys.length; i++) {
				
				attrs.push(_attributes[keys[i]]);
			}
			
			return attrs;
		};
		
		/**
		 * Returns an Array containing the constraints for the given attribute,
		 * an empty array if the attribute isn't present.
		 * @param attribute the {Attribute} to select
		 * @returns {Array} of {Attribute}
		 */
		this.getConstraints = function getConstraints(attribute) {
			
			var constr = _constraints[attribute.toJSON()];
			
			return (typeof constr === "undefined") ? [] : constr.slice(0);
		};
		
		/**
		 * Converts internal representation to JSON format.
		 * E.g. "{"id":"","contextFunction":{}, "constraints":
		 * {"attr1:long":[{"<=":55},{">":4}],
		 * "attr2:double":[{">":33.12}]}}"
		 * 
		 * @returns {Object} with id, contextFunction and constraints as key
		 * and {string}, {@link SilboPS.ContextFunction} and an {Array} of
		 * {@link SilboPS.Constraint} as value respectively
		 */
		this.toJSON = function toJSON() {
			
			var jsonConstr = {};
			
			for (var key in _attributes) {
				
				var list = [];
				var constr = _constraints[key];
				
				for (var i = 0; i < constr.length; i++) {
					
					list.push(constr[i].toJSON());
				}
				
				jsonConstr[key] = list;
			}
			
			return {"id" : _id,
					"contextFunction" : _contextFunction.toJSON(),
					"constraints" : jsonConstr};
		};
	};
	
	SilboPS.Filter.fromJSON = function fromJSON(json) {
		
		SilboPS.Utils.requireNotNull(json, "JSON object is " + json);
		
		var cxtFunc = SilboPS.ContextFunction.fromJSON(json["contextFunction"]);
		var jsonConstr = json["constraints"];
		
		var filter = new SilboPS.Filter();
		filter.setID(json["id"]);
		filter.setContextFunction(cxtFunc);
		
		for (var key in jsonConstr) {
			
			var attr = SilboPS.Attribute.fromJSON(key);
			var constrList = jsonConstr[key];
			
			for (var i = 0; i < constrList.length; i++) {
				
				var constr = SilboPS.Constraint.fromJSON(attr.getType(), constrList[i]);
				
				filter._addConstraint(attr, constr);
			}
		}
		
		return filter;
	};
	
	
	// *************************************************************************
	// *          C O N S T R A I N T    B U I L D E R                         *
	// *************************************************************************
	function ConstraintBuilder(filter, attribute) {
		
		this._filter = SilboPS.Utils.requireInstanceOf(filter, SilboPS.Filter);
		this.constrain(attribute);
	}

	ConstraintBuilder.prototype.filter = function filter() {

		return this._filter;
	};
	
	/**
	 * Select the given attribute (name and type) to be constrained.
	 * If called with one parameter it assumes it's a {@link SilboPS.Attribute}
	 * object.
	 * 
	 * @param name {string}             the attribute name
	 * @param type {@link SilboPS.Type} the attribute type
	 * @returns {ConstraintBuilder} the builder used to create the Filter.
	 */
	ConstraintBuilder.prototype.constrain = function constrain(name, type) {
		
		var attr = name;
		
		if (!(attr instanceof SilboPS.Attribute)) {
			
			attr = new SilboPS.Attribute(name, type);
		}
		
		this._attribute = attr;
		return this;
	};

	ConstraintBuilder.prototype.exists = function exists() {

		this._filter._addConstraint(this._attribute, SilboPS.Constraint.EXISTS);
		return this;
	};
	
	// create all builder's remaining constraint functions
	var opExist = SilboPS.Operator.EXISTS.getName();
	var operatorList = Object.keys(SilboPS.Operator);
	operatorList.splice(operatorList.indexOf(opExist), 1);
	
	var toCamelCase = function(match) {
		
		// transform "_[a-z]" -> "[A-Z]"
		return match.substr(1).toUpperCase();
	};
	
	for (var i = 0; i < operatorList.length; i++) {

		(function(name) {
			
			var opFuncName = name.toLowerCase().replace(/_[a-z]/, toCamelCase);
			
			ConstraintBuilder.prototype[opFuncName] = function(value) {
				
				var val = new SilboPS.Value(this._attribute.getType(), value);
				var cons = new SilboPS.Constraint(SilboPS.Operator[name], val);
				
				this._filter._addConstraint(this._attribute, cons);
				return this;
			};
		})(operatorList[i]);
	}
})(SilboPS);
