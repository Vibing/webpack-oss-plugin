module.exports = {
  "presets": [
    "@babel/env",
    // ["@babel/env", {
    //   "useBuiltIns": "usage",
    //   "corejs": "3.6.5"
    // }],
    "@babel/typescript",
  ],
  "plugins": [
    // ["@babel/plugin-proposal-class-properties", {
    //   "loose": true
    // }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ],
  // "compact": false,
  // "sourceType": 'unambiguous'
}
