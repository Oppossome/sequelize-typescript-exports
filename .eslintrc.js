/* eslint-disable no-undef */

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["prettier", "@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        //"plugin:prettier/recommended",
    ],
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
    },
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-types": "off",
    },
};
