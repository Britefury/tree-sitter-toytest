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

        load: $ => alias($.identifier, 'load'),

        expression: $ => choice(
            $.integer,
            $.load,
            $.bin_op,
            $.attribute,
            $.subscript,
            $.call,
            $.list,
            $.paren_expr,
        ),

        op_plus: $ => '+',
        op_mul: $ => '*',
        identifier: $ => token(/[a-zA-Z_][a-zA-Z0-9_]*/),
        integer: $ => token(/[0-9]+/),
    }
});
