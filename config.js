const fs = require('fs');
const { Sequelize } = require('sequelize');
const isVPS = !(__dirname.startsWith("/rgnk") || __dirname.startsWith("/skl"));
const isHeroku = __dirname.startsWith("/skl");
const isKoyeb = __dirname.startsWith("/rgnk");
const isRailway = __dirname.startsWith("/railway");
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true',fault2='on') {
    return ((text === fault) || (text === fault2));
}
const settingsMenu = [
    {title: "PM antispam block", env_var: "PM_ANTISPAM"},
    {title: "Auto read all messages", env_var: "READ_MESSAGES"},
    {title: "Auto read command messages", env_var: "READ_COMMAND"},
    {title: "Auto read status updates", env_var: "AUTO_READ_STATUS"},
    {title: "Admin sudo acces mode (group commands only)", env_var: "ADMIN_ACCESS"},
    {title: "With & without handler mode", env_var: "MULTI_HANDLERS"},
    {title: "Auto reject calls", env_var: "REJECT_CALLS"},
    {title: "Always online", env_var: "ALWAYS_ONLINE"},
    {title: "PM Auto blocker", env_var: "PMB_VAR"},
    {title: "Disable bot in PM", env_var: "DIS_PM"}
  ]
DATABASE_URL = process.env.DATABASE_URL === undefined ? './bot.db' : process.env.DATABASE_URL;
DEBUG = process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG);
SESSION_ID: process.env.SESSION_ID || "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ0JkZVp5dXVqTWZ2MHdPbzliYlk0Z0t6Z1NCNmRZa0lnbTVYWTdhc0dXbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib2pOQ01jdTdLemJHeFVYcEFsT0ZhV3ZBTG9XNlEreFVuSmFSTHI2STdnTT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxUEthWDlEZnNDV2Y1ZWtGL2lRN0RoQWc5NGpvTk54MnZNRUJFWW5CMEc0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLcSszSXJzKzNaNklhaXlTZ0p6U2VXOUFBNjBmWVFncFBmSlA0bGIvK1IwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNJaE44Z3dqQiszbkJYN3V2OXUyUVVMSldMREt2NWtDanFBVHRIY054bnM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkVqMlFSU3Fid0VRS2dubDZKS1dxd29sS0g4bHd2TDFXSnpGVEVreDZpMzQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidVBjdjNyUk1CdTZQUlZYUXNhSE5HeHpQOTdQT2liWW55Mkc5WGhsdVltbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieXJKZWdLVFd0cXNBZFFITWNLUXFiOVBreG9GQ0ljemhXMnZWNTdmeGtuUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjYyWFZYUGtWZmJxTEs4eUZ5MS8wS2NXeEJXSW9ucnIzcHUyM0JWbStMOEpNbTlMQ2VmdXVtTmxoL3J5SmZkTFM3U0ZPMUszcVh4MWRjb0JxTFR6VWhRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NDUsImFkdlNlY3JldEtleSI6ImZKTlJKWitPVFI5S1hUSmY1SFlNZU5nWDZva3FYR2JlZGVzRzlSb1V4d3M9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiMjMzNTQ0OTM3OTAyQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjU5Mjc2NTJFNThCODM0RDZCM0NFNjc3MzUxQTZCNjVDIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Mjk1NTgxODN9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6InU3RHc0LWdhUjZPUUZTdU5RSFlrM1EiLCJwaG9uZUlkIjoiNDdmOTlhYjYtNDIxNC00YTUyLTljOWEtODZmY2Q4Y2VkOTU1IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkpMcHpuL2I1Q2pVRDZhVXZTVS9BTDI1NitHYz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxTlBXWUJDaFh3VXNKWGFKWXhwa0dhV3cyWlU9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiWUg1NVlBWUciLCJtZSI6eyJpZCI6IjIzMzU0NDkzNzkwMjoyM0BzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJULWpheSBvcmlnaW5hbCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS25lcytJRUVKYnQyN2dHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiVkpCOVNQNW1CVHZFc052aWVSTEk2N1BLVlNhM2sxaHl3eEU3SzZ6cDFHST0iLCJhY2NvdW50U2lnbmF0dXJlIjoic211VmFJT1FGemR1OEt1SFlvN2ZrY01PWFlZK1FCRkwvVzM2MkhtVXBNN1lWV1lCOEI3WXJ4MFRtZWJGLzZpTFlkdVJlcFphWTFQaDhBdklFS2hXRFE9PSIsImRldmljZVNpZ25hdHVyZSI6IkJqeGNtQTlFQmtVclkyNjg5aEtwM2JZd1lxbTliMzlpNlBoYW1VcDNvZzU1Rit2UUo4eTlqS2FxcmxqeVM2bHRDK2hUSFd4T1M0NnFOYnBoYVVvMWdnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjMzNTQ0OTM3OTAyOjIzQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlZTUWZVaitaZ1U3eExEYjRua1N5T3V6eWxVbXQ1Tlljc01ST3l1czZkUmkifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Mjk1NTgxNzksIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTDltIn0=",
module.exports = {
    VERSION: 'v4.0.0',
    ALIVE: process.env.ALIVE || "https://i.imgur.com/KCnoMM2.jpg Hey {sender}, I'm alive \n Uptime: {uptime}",
    BLOCK_CHAT: process.env.BLOCK_CHAT || '',
    PM_ANTISPAM: convertToBool(process.env.PM_ANTISPAM) || '',
    ALWAYS_ONLINE: convertToBool(process.env.ALWAYS_ONLINE) || false,
    MANGLISH_CHATBOT: convertToBool(process.env.MANGLISH_CHATBOT) || false,
    ADMIN_ACCESS: convertToBool(process.env.ADMIN_ACCESS) || false,
    PLATFORM:isHeroku?"Heroku":isRailway?"Railway":isKoyeb?"Koyeb":"Other server",isHeroku,isKoyeb,isVPS,isRailway,
    AUTOMUTE_MSG: process.env.AUTOMUTE_MSG || '_Group automuted!_\n_(edit AUTOMUTE_MSG)_',
    ANTIWORD_WARN: process.env.ANTIWORD_WARN || '',
    ANTI_SPAM: process.env.ANTI_SPAM || '919074309534-1632403322@g.us',
    MULTI_HANDLERS: convertToBool(process.env.MULTI_HANDLERS) || false,
    DISABLE_START_MESSAGE: convertToBool(process.env.DISABLE_START_MESSAGE) || false,
    NOLOG: process.env.NOLOG || false,
    DISABLED_COMMANDS: (process.env.DISABLED_COMMANDS ? process.env.DISABLED_COMMANDS.split(",") : undefined) || [],
    ANTI_BOT: process.env.ANTI_BOT || '',
    ANTISPAM_COUNT: process.env.ANTISPAM_COUNT || '6/10', // msgs/sec
    AUTOUNMUTE_MSG: process.env.AUTOUNMUTE_MSG || '_Group auto unmuted!_\n_(edit AUTOUNMUTE_MSG)_',
    AUTO_READ_STATUS: convertToBool(process.env.AUTO_READ_STATUS) || false,
    READ_MESSAGES: convertToBool(process.env.READ_MESSAGES) || false,
    PMB_VAR: convertToBool(process.env.PMB_VAR) || false,
    DIS_PM: convertToBool(process.env.DIS_PM) || false,
    REJECT_CALLS: convertToBool(process.env.REJECT_CALLS) || false,
    PMB: process.env.PMB || '_Personal messages not allowed, BLOCKED!_',
    READ_COMMAND: convertToBool(process.env.READ_COMMAND) || true,
    SESSION: (process.env.SESSION || process.env.SESSION_ID || '').trim() || '',
    IMGBB_KEY: ["76a050f031972d9f27e329d767dd988f", "deb80cd12ababea1c9b9a8ad6ce3fab2", "78c84c62b32a88e86daf87dd509a657a"],
    RG: process.env.RG || '919074309534-1632403322@g.us,120363116963909366@g.us',
    BOT_INFO: process.env.BOT_INFO || 'Raganork;Skl11;0;https://i.imgur.com/P7ziVhr.jpeg;https://chat.whatsapp.com/Dt3C4wrQmt0GG6io1IBIHb',
    RBG_KEY: process.env.RBG_KEY || '',
    ALLOWED: process.env.ALLOWED || '91,94,2',
    NOT_ALLOWED: process.env.ALLOWED || '91,94,212',
    CHATBOT: process.env.CHATBOT || 'off',
    HANDLERS: process.env.HANDLERS || '.,',
    STICKER_DATA: process.env.STICKER_DATA || "Raganork",
    BOT_NAME: process.env.BOT_NAME || 'Raganork',
    AUDIO_DATA: process.env.AUDIO_DATA === undefined || process.env.AUDIO_DATA === "private" ? 'ꪶ͢٭𝑺𝜣𝑼𝑹𝛢𝑽𝑲𝑳¹¹ꫂ;Raganork MD bot;https://i.imgur.com/P7ziVhr.jpeg' : process.env.AUDIO_DATA,
    TAKE_KEY: process.env.TAKE_KEY || '',
    MODE: process.env.MODE || 'private',
    WARN: process.env.WARN || '4',
    ANTILINK_WARN: process.env.ANTILINK_WARN || '',
    HEROKU: {
        HEROKU: process.env.HEROKU === undefined ? false : convertToBool(process.env.HEROKU),
        API_KEY: process.env.HEROKU_API_KEY || '',
        APP_NAME: process.env.HEROKU_APP_NAME || ''
    },
    DATABASE_URL: DATABASE_URL,
    DATABASE: DATABASE_URL === './bot.db' ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: DEBUG }) : new Sequelize(DATABASE_URL, { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }, logging: DEBUG }),
    SUDO: process.env.SUDO || "",
    LANGUAGE: process.env.LANGUAGE || 'english',
    DEBUG: DEBUG,
    ACR_A: "ff489a0160188cf5f0750eaf486eee74",
    ACR_S: "ytu3AdkCu7fkRVuENhXxs9jsOW4YJtDXimAWMpJp",
    settingsMenu
};
