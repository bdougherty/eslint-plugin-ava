'use strict';

module.exports = {
	rules: {
		'no-cb-test': require('./rules/no-cb-test'),
		'no-identical-title': require('./rules/no-identical-title'),
		'no-skip-assert': require('./rules/no-skip-assert'),
		'no-skip-test': require('./rules/no-skip-test'),
		'prefer-power-assert': require('./rules/prefer-power-assert'),
		'test-ended': require('./rules/test-ended'),
		'test-title': require('./rules/test-title')
	},
	configs: {
		recommended: {
			env: {
				es6: true
			},
			parserOptions: {
				ecmaVersion: 6,
				sourceType: 'module'
			},
			rules: {
				'no-cb-test': 0,
				'no-identical-title': 2,
				'no-skip-assert': 2,
				'no-skip-test': 2,
				'prefer-power-assert': 0,
				'test-ended': 2,
				'test-title': [2, 'always']
			}
		}
	}
};
