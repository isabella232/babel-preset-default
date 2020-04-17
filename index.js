const { declare } = require('@babel/helper-plugin-utils');

const defaultTargets = ['> 1%', 'ie >= 11', 'Firefox ESR', 'last 2 versions'];

module.exports = declare((api, options) => {
	const {
		modules = 'auto',
		wordpress = false,
		debug = false,
		removePropTypes = {},
		targets = defaultTargets,
	} = options;

	const development =
		typeof options.development === 'boolean' ? options.development : api.env(['development']);
	const runtimeESModules =
		typeof options.runtimeESModules === 'boolean' ? options.runtimeESModules : !modules;
	const presets = [
		[
			require.resolve('@babel/preset-env'),
			{
				debug,
				useBuiltIns: 'usage',
				corejs: { version: 3, proposals: true },
				bugfixes: true,
				modules,
				targets,
			},
		],
	];

	presets.push([require.resolve('@babel/preset-react'), { development }]);

	if (wordpress) {
		presets.push(require.resolve('@wordpress/babel-preset-default'));
	}

	return {
		presets,
		plugins: [
			!development
				? [
						require.resolve('babel-plugin-transform-react-remove-prop-types'),
						{
							mode: 'remove',
							removeImport: true,
							...removePropTypes,
						},
				  ]
				: null,
			[
				require.resolve('@babel/plugin-transform-runtime'),
				{ useESModules: runtimeESModules, corejs: { version: 3, proposals: true } },
			],
		].filter(Boolean),
	};
});