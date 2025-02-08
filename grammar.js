module.exports = grammar({
    name: 'toytest',

    supertypes: $ => [
        $.expression,
    ],

    rules: {
        // source_file: $ => $.expression,
        source_file: $ => repeat1(seq(field('exprs', $.expression), ';')),

        bin_op: $ => choice(
            prec.left(1, seq(
                field('left', $.expression),
                field('operator', $.op_plus),
                field('right', $.expression)
            )),
            prec.left(2, seq(
                field('left', $.expression),
                field('operator', $.op_mul),
                field('right', $.expression)
            )),
        ),

        attribute: $ => prec(3, seq(
            field('value', $.expression),
            token('.'),
            field('name', $.identifier),
        )),

        subscript: $ => prec(3, seq(
            field('value', $.expression),
            '[',
            field('index', $.expression),
            ']',
        )),

        call: $ => prec(3, seq(
            field('value', $.expression),
            '(',
            optional(seq(field('arguments', $.expression), repeat(seq(',', field('arguments', $.expression))))),
            ')',
        )),

        list: $ => seq(
            '[',
            optional(seq(field('elements', $.expression), repeat(seq(',', field('elements', $.expression))))),
            ']',
        ),

        paren_expr: $ => seq(
            '(',
            field('value', $.expression),
            ')',
        ),

        // Some examples that use 'alias'
        load: $ => alias($.identifier, 'load'),

        // We construct an alias in the definition of `expression` below, in which we re-use `paren_expr`
        _brace_expr: $ => seq('{', field('value', $.expression), '}'),

        // Alias constant text to a named string
        _not_this: $ => alias(seq('not', 'this'), 'not_this'),
        _or_that: $ => alias(seq('or', 'that'), 'or_that'),
        two_words_expr: $ => seq(
            $.integer,
            choice($._not_this, $._or_that),
            $.integer,
        ),

        expression: $ => choice(
            $.integer,
            $.load,
            $.bin_op,
            $.attribute,
            $.subscript,
            $.call,
            $.list,
            $.paren_expr,
            alias($._brace_expr, $.paren_expr),
            $.two_words_expr
        ),

        op_plus: $ => '+',
        op_mul: $ => '*',
        identifier: $ => token(/[a-zA-Z_][a-zA-Z0-9_]*/),
        integer: $ => token(/[0-9]+/),
    }
});
