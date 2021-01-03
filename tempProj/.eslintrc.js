module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    "window": false,
    "document": false,
    "navigator": false
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    'prettier',
    'prettier/vue'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ["prettier"],
  rules: {
    "no-eval": 0,
    "no-console": process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-debugger": process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-void": 0,
    "no-bitwise": 0,
    "no-new": 0,
    "no-shadow": 0,
    "camelcase": [0, {
      "properties": "always"
    }],
    "func-names": 0,
    "no-console": 0,
    "no-plusplus": 0,
    "arrow-parens": 2,
    "comma-dangle": 0,
    "default-case": 0,
    "prefer-template": 0,
    "consistent-return": 0,
    "no-param-reassign": 0,
    "no-nested-ternary": 0,
    "operator-linebreak": 0,
    "object-curly-newline": 0,
    "no-underscore-dangle": 0,
    "no-unused-expressions": 0,
    "no-restricted-globals": 0,
    "function-paren-newline": 0,
    "class-methods-use-this": 0,
    "implicit-arrow-linebreak": 0,
    "space-before-function-paren": 0,
    "max-len": ["error", {
      "code": 150
    }],
    "no-extra-boolean-cast": 0,
    // "prefer-destructuring": ["error", {
    //     "object": true,
    //     "array": false
    // }],
    "prefer-destructuring": 0,
    "import/no-extraneous-dependencies": 0,
    "import/prefer-default-export": 0,
    "vue/no-v-html": 0,
    "vue/attributes-order": 0,
    "vue/require-v-for-key": 0,
    "vue/require-default-prop": 0,
    "vue/no-unused-components": ["error", {
      "ignoreWhenBindingPresent": false
    }],
    "vue/no-unused-vars": 2, // "error"
    // "vue/max-attributes-per-line": ["error", {
    //   "singleline": 1,
    //   "multiline": {
    //     "max": 1,
    //     "allowFirstLine": false
    //   }
    // }],
    "vue/max-attributes-per-line": 0,
    "vue/singleline-html-element-content-newline": 0,
    "vue/multiline-html-element-content-newline": 0,
    "vue/name-property-casing": ["error", "kebab-case"],
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    "vue/html-closing-bracket-newline": 2,
    "vue/name-property-casing": 0,
    "prettier/prettier": "error"
  }
}
