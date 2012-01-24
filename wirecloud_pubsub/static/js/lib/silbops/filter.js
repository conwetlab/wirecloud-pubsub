//var filtro1 = {
//    "attr1": [{"eq": ["str", "val1"]}],
//    "attr2": []
//};
// SilboPS Namespace
if (window.SilboPS === undefined) {
    window.SilboPS = {};
}


(function(SilboPS) {

    var operatorList = [
    //'exists', these are handled separately
    'eq',
    'ne',
    'gt',
    'ge',
    'lt',
    'le',
    //    'prefix',
    //    'suffix',
    'contains'
    ];

    var Operator = {};
    Operator.EQ = {
        acceptsType: function() {
            return true;
        },
        toString: function() {
            return "eq";
        }
    }


    function Value(value) {
        this.value = value;
    }

    Value.prototype.toJSON = function toJSON() {

        var label = null;

        switch(typeof this.value) {

            case "string": {
                label = "str";
                break;
            }
            case "number": { // to differentiate between int and float (double)
                label = (this.value == parseInt(this.value, 10)) ? "int" : "float";
                break;
            }
            default:
                throw new TypeError("Invalid value type");
        }

        return [label, this.value];
    };


    function Constraint(operator, value) {
        this.value = new Value(value);
        this.operator = operator;
    }

    Constraint.prototype.toJSON = function toJSON() {
        var obj = {};
        obj[this.operator.toString()] = this.value;
        return obj;
    };

    Constraint.exist = (function () {

        var constraint_exist = new Constraint("exist", null);
        constraint_exist.toJSON = function toJSON() {
            return [];
        }

        return function exist() {
            return constraint_exist;
        }
    })();

    SilboPS.Filter = function Filter() {
        this.attributes = {};
    }

    SilboPS.Filter.prototype.addConstraint = function addConstraint(attribute, constraint) {

        if (!this.attributes[attribute]) {

            this.attributes[attribute] = [];
        }

        if (constraint.operator != "exist") {
            this.attributes[attribute].push(constraint);
        }
    };

    SilboPS.Filter.prototype.toJSON = function toJSON() {
        return Object.clone(this.attributes);
    };

    SilboPS.Filter.prototype.constrain = function constrain(attribute) {

        return new ConstraintBuilder(this, attribute);
    };

    function ConstraintBuilder(filter, attribute) {

        this._filter = filter;
        this.constrain(attribute);
    }

    ConstraintBuilder.prototype.filter = function filter() {

        return this._filter;
    };

    ConstraintBuilder.prototype.constrain = function constrain(attribute) {

        this._attribute = attribute;
        return this;
    };

    ConstraintBuilder.prototype.exist = function exist() {

        this._filter.addConstraint(this._attribute, Constraint.exist());
        return this;
    };

    ConstraintBuilder.prototype.startsWith = function startsWith(value) {

        this._filter.addConstraint(this._attribute, new Constraint("prefix", value));
        return this;
    };

    ConstraintBuilder.prototype.endsWith = function endsWith(value) {

        this._filter.addConstraint(this._attribute, new Constraint("suffix", value));
        return this;
    };

    // create all the constraints
    for (var i = 0; i < operatorList.length; i++) {

        (function(name) {

            ConstraintBuilder.prototype[name] = function (value) {

                this._filter.addConstraint(this._attribute, new Constraint(name, value));
                return this;
            };
        })(operatorList[i]);
    }
})(window.SilboPS);
