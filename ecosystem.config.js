module.exports = {
  apps: [{
    name: "john-rhey-portfolio",
    script: "./server.js",
    cwd: __dirname,
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    watch: false,
    max_memory_restart: "100M",
    env: {
      NODE_ENV: "production",
      HOST: "0.0.0.0"
    }
  }]
};
