module.exports = grammar({
    name: 'toytest',

    supertypes: $ => [
        $.expression,
        $.operator,
    ],
  
    rules: {
        // TODO: add the actual grammar rules
        source_file: $ => 'hello',

        op_plus: $ => '+',
        op_mul: $ => '-',

        operator: $ => choice(
            $.op_plus,
            $.op_mul,
        ),

        bin_op: $ => seq(
            field('left', $.expression),
            field('operator', $.operator),
            field('right', $.expression),
        ),

        attribute: $ => seq(
            field('value', $.expression),
            '.',
            field('name', $.identifier),
        ),

        subscript: $ => seq(
            field('value', $.expression),
            '[',
            field('index', $.expression),
            ']',
        ),

        call: $ => seq(
            field('function', $.expression),
            '(',
            optional(seq(field('arguments', $.expression), repeat(seq(',', field('arguments', $.expression))))),
            ')',
        ),

        list: $ => seq(
            '[',
            optional(seq(field('elements', $.expression), repeat(seq(',', field('elements', $.expression))))),
            ']',
        ),

        expression: $ => choice(
            $.integer,
            $.identifier,
            $.bin_op,
            $.attribute,
            $.subscript,
            $.call,
            $.list,
        ),

        identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]+/,
        integer: $ => /[0-9]+/,
    }
});
