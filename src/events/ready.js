// =============================================
//   Event: ready — Fires when bot logs in
// =============================================

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`
 ██████╗██████╗  █████╗ ███████╗██╗   ██╗██████╗  ██████╗ ████████╗
██╔════╝██╔══██╗██╔══██╗╚══███╔╝╚██╗ ██╔╝██╔══██╗██╔═══██╗╚══██╔══╝
██║     ██████╔╝███████║  ███╔╝  ╚████╔╝ ██████╔╝██║   ██║   ██║   
██║     ██╔══██╗██╔══██║ ███╔╝    ╚██╔╝  ██╔══██╗██║   ██║   ██║   
╚██████╗██║  ██║██║  ██║███████╗   ██║   ██████╔╝╚██████╔╝   ██║   
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═════╝  ╚═════╝    ╚═╝  
    `);
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`📡 Serving ${client.guilds.cache.size} server(s)`);
    console.log(`🎮 ${client.slashCommands.size} slash commands loaded`);
    console.log(`⚡ ${client.prefixCommands.size} prefix command entries loaded`);

    // Rotating "crazy" status messages
    const statuses = [
      { name: '🎉 /party to start the disco!', type: 0 },
      { name: '🤖 Impersonating your friends...', type: 3 },
      { name: '🎱 Ask me anything!', type: 3 },
      { name: '🌈 Sending colored text chaos', type: 0 },
      { name: '🔥 Try /roast on someone!', type: 0 },
    ];

    let i = 0;
    const setStatus = () => {
      const s = statuses[i % statuses.length];
      client.user.setActivity(s.name, { type: s.type });
      i++;
    };
    setStatus();
    setInterval(setStatus, 15000);
  },
};
