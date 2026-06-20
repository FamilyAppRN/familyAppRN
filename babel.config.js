// babel-preset-expo con jsxImportSource de NativeWind + preset de NativeWind.
// NOTA: los aliases (@core, @shared, @features) NO se configuran aquí; se
// resuelven vía tsconfig.json paths (Metro nativo). No agregar module-resolver.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
