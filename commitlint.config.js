export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // 这里可以自定义规则，默认已经包含了 feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'build',
                'ci',
                'chore',
                'revert',
            ],
        ],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never'],
    },
};
