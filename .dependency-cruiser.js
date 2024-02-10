module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-discord.js-in-command-bundles',
      severity: 'error',
      from: { path: '^src/command-bundles/' },
      to: { path: 'discord.js' },
    },
  ],
  options: {
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    doNotFollow: {
      path: 'node_modules|.*\\.spec\\.ts$',
    },
  },
};
