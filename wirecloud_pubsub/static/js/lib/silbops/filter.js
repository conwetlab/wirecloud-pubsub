
var filtro1 = {
    "attr1": [{"eq": ["str", "val1"]}],
    "attr2": []
};


/*var OPERATORS = [
    'exists',
    'eq',
    'ne',
    'gt',
    'ge',
    'lt',
    'le',
    'prefix',
    'suffix',
    'contains'
];*/

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
    var type = typeof this.value;
    
    if (type === "string") {
        return ["str", this.value];
    }
    if (type === "number") {
        return ["num", this.value];
    }

    throw new TypeError("Invalid value type");
}


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

Constraint.eq = function eq(value) {
    return new Constraint("eq", value);
};



function Filter() {
    this.attributes = {};
}
Filter.prototype.addConstraint = function addConstraint(attribute, constraint) {
    if (this.attributres[attribute]) {
        this.attributres[attribute] = [];
    }
    this.attributres[attribute].push(constraint);
};
Filter.prototype.toJSON = function toJSON() {
    return Object.clone(this.attributes);
};
(function() {
    Filter.prototype.constrain = function constrain(attribute) {
        return new ConstraintBuilder(this, attribute);
    };

    function ConstraintBuilder(filter, attribute) {
        this.filter = filter;
        this.constrain(attribute);
    }

    ConstraintBuilder.prototype.filter = function filter() {
        return this.filter;
    };

    ConstraintBuilder.prototype.constrain = function constrain(attribute) {
        this.attribute = attribute;
        return this;
    };

    ConstraintBuilder.prototype.exists = function exists() {
        this.filter.addConstraint(attribute, Constraint.exist());
        return this;
    };

    ConstraintBuilder.prototype.eq = function eq(value) {
        this.filter.addConstraint(attribute, Constraint.eq(value));
        return this;
    };
});


