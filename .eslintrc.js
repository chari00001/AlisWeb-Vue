module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    indent: "off",
    quotes: "off",
    semi: "off",
    "comma-dangle": "off",
    "space-before-function-paren": "off",
    "space-before-blocks": "off",
    "keyword-spacing": "off",
    "space-infix-ops": "off",
    eqeqeq: "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "vue/multi-word-component-names": "off",
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
};
