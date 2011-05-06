Yate.AST.block.js = function() {

    var role = this.role || 'output';
    var type = this.type();
    var inline = (type == Yate.Types.NODESET || type == Yate.Types.BOOLEAN);

    var defValue = "''";
    if (type == Yate.Types.NODESET) {
        defValue = '[]';
    } else if (type == Yate.Types.BOOLEAN) {
        defValue = 'false';
    }

    // Prologue.

    var prologue = '';
    if ((role == 'var' || role == 'return') && !inline) {
        prologue = 'var r' + this.$rid + ' = { buf: [], attrs: {} };\n'
    }
    /*
    if (role == 'return' && inline) {
        prologue += 'var r = ' + defValue + ';';
    }
    */

    // Epilogue.

    var epilogue = '';
    if (role == 'var') {
        if (type == Yate.Types.XML || type == Yate.Types.SCALAR) {
            epilogue += this.$varname + ' = r' + this.$rid + '.buf.join("");';
        } else if (type == Yate.Types.ATTR) {
            epilogue += this.$varname + ' = r' + this.$rid + '.attrs;';
        }
    } else if (role == 'return') {
        if (type == Yate.Types.XML || type == Yate.Types.SCALAR) {
            epilogue += 'return r' + this.$rid + '.buf.join("")';
        } else if (type == Yate.Types.ATTR) {
            epilogue += 'return r' + this.$rid + '.attrs;';
        } else if (inline) {
            epilogue += 'return r;';
        }
    }

    if (!inline) {
        this.$exprs.trigger(function() {
            this.role = 'output';
        });
    }

    var data = {
        $defs: this.$defs,
        $functions: this.$functions,
        $exprs: this.$exprs,
        $prologue: prologue,
        $epilogue: epilogue
    };

    return this._js(data);
};

Yate.AST.blockExprs.js = function() {
    var items = this.$items;
    var exprs = [];

    var role = this.role;
    var type = this.type();
    var inline = (type == Yate.Types.NODESET || type == Yate.Types.BOOLEAN);

    for (var i = 0, l = items.length; i < l; i++) {
        var expr = items[i];

        if (!expr.is('blockList')) {
            exprs.push(expr.js());
        } else if (role == 'var' && inline) {
            exprs.push(this.$varname + ' = ' + expr.js() + ';');
        } else if (role == 'return' && inline) {
            exprs.push('r = ' + expr.js() + ';');
        } else {
            exprs.push('r' + this.$rid + '.buf.push(' + expr.js() + ');'); // FIXME: Унести это в шаблоны.
        }

        /*
        if (expr.is('blockList')) {
            exprs.push('r' + this.$rid + '.buf.push(' + expr.js() + ');'); // FIXME: Унести это в шаблоны.
        } else {
            exprs.push(expr.js());
        }
        */
    }

    return exprs.join('\n');
};

Yate.AST.blockTemplates.options.js = {
    separator: '\n\n'
};

Yate.AST.blockDefs.options.js = {
    separator: '\n\n'
};
