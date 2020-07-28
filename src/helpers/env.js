//------------------------------------------------------------------------------
// App Env Vars ----------------------------------------------------------------
const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV,
  APP_ENV: process.env.APP_ENV,
  COMMIT_HASH: process.env.COMMIT_HASH,
  VERSION: process.env.VERSION,
  DATE: process.env.DATE,
  TITLE: process.env.TITLE,
  API_URL: process.env.API_URL,
});

export default env;
