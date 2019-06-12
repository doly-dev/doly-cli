const path = require('path');

module.exports = function ({
  extraPresets=[],
  extraPlugins=[],
  browsers=['last 2 versions'],
  typescript=false
}) {
  const targets = {
    browsers
  };

  const exclude = [
    'transform-typeof-symbol',
    'transform-unicode-regex',
    'transform-sticky-regex',
    'transform-new-target',
    'transform-modules-umd',
    'transform-modules-systemjs',
    'transform-modules-amd',
    'transform-literals',
  ];

  const plugins = [

    // Stage 0
    require.resolve("@babel/plugin-proposal-function-bind"),

    // Stage 1
    require.resolve("@babel/plugin-proposal-export-default-from"),
    require.resolve("@babel/plugin-proposal-logical-assignment-operators"),
    [require.resolve("@babel/plugin-proposal-optional-chaining"), { "loose": false }],
    [require.resolve("@babel/plugin-proposal-pipeline-operator"), { "proposal": "minimal" }],
    [require.resolve("@babel/plugin-proposal-nullish-coalescing-operator"), { "loose": false }],
    require.resolve("@babel/plugin-proposal-do-expressions"),

    // Stage 2
    [require.resolve("@babel/plugin-proposal-decorators"), { "legacy": true }],
    require.resolve("@babel/plugin-proposal-function-sent"),
    require.resolve("@babel/plugin-proposal-export-namespace-from"),
    // require.resolve("@babel/plugin-proposal-numeric-separator"),
    // require.resolve("@babel/plugin-proposal-throw-expressions"),

    // Stage 3
    require.resolve("@babel/plugin-syntax-dynamic-import"),
    require.resolve("@babel/plugin-syntax-import-meta"),
    [require.resolve("@babel/plugin-proposal-class-properties"), { "loose": true }],
    // require.resolve("@babel/plugin-proposal-json-strings")

    // Define
    [
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      {
        useBuiltIns: true,
      },
    ],
    require.resolve('@babel/plugin-proposal-async-generator-functions'),
    require.resolve('@babel/plugin-transform-object-assign'),
    require.resolve('babel-plugin-macros'),
    ...extraPlugins,
    [
      require.resolve('babel-plugin-named-asset-import'),
      {
        loaderMap: {
          svg: {
            ReactComponent:
              '@svgr/webpack?-prettier,-svgo![path]',
          },
        },
      },
    ]
  ];

  if(process.env.NODE_ENV === 'production'){
    plugins.push(
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          absoluteRuntime: path.dirname(
            require.resolve('@babel/runtime/package.json')
          )
        },
      ],
      require.resolve('@babel/plugin-transform-modules-commonjs')
    )
  }

  const presets = [
    [require.resolve("@babel/preset-env"), {
      targets,
      exclude
    }], 
    require.resolve("@babel/preset-react"),
    ...extraPresets,
  ];

  if(typescript){
    presets.push(require.resolve("@babel/preset-typescript"));
  }

  return {
    presets,
    plugins
  }
}