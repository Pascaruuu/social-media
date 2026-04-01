import prettier from 'eslint-config-prettier'
import path from 'node:path'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'
import svelteConfig from './svelte.config.js'

const gitignore_path = path.resolve(import.meta.dirname, '.gitignore')
// ESLint cache serializes config, so keep only serializable Svelte compiler options.
const svelte_config_for_eslint = {
	compilerOptions: {
		...svelteConfig.compilerOptions,
		runes: true,
	},
}

export default defineConfig(
	includeIgnoreFile(gitignore_path),
	{
		ignores: [
			'.svelte-kit/**',
			'dist/**',
			'build/**',
			'coverage/**',
			'src/**/*.d.ts',
			'src/**/*.svelte',
		],
	},
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,

	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			'no-undef': 'off',
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'allow',
				},
				{
					selector: 'function',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'allow',
				},
			],
		},
	},

	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig: svelte_config_for_eslint,
			},
		},
	},
)
