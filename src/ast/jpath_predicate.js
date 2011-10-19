Yate.AST.jpath_predicate = {

    action: function() {
        var key = this.Expr.yate(); // Каноническая запись предиката.

        var state = this.state;

        // Если этот jpath еще не хранится в state, то добаляем его туда.
        var pid = state.pkeys[key];
        if (!pid) {
            pid = state.pkeys[key] = state.pid++;
            state.predicates.push(this);
        }

        this.Pid = pid;
        this.Key = key;
    },

    isLocal: function() {
        return this.Expr.isLocal();
    },

    prepare: function() {
        this.Expr.cast(Yate.Types.BOOLEAN);
    },

    validate: function() {
        if (!this.Expr.type( Yate.Types.BOOLEAN )) {
            this.Expr.error('Type must be BOOLEAN');
        }
    }

};
