module.exports = {
  apps: [
    {
      name: 'hacker-news',
      script: './dist/server.js',
      max_memory_restart: '1G',
      cron_restart: '0 */24 * * *',
      watch: ['views', 'dist'],
      ignore_watch: ['node_modules', 'public'],
      watch_delay: 1000,
      exp_backoff_restart_delay: 100, // 100ms
      exec_mode: 'cluster',
      instances: 3,
      out_file: '/dev/null',
      error_file: '/dev/null',
    },
  ],
};
