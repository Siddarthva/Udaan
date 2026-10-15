/**
 * TEST/DEMO AID ONLY: runs the real Express app against the in-memory Supabase fake so the frontend can be
 * exercised without a database. Data is lost on restart. Never used by `npm start`.
 *
 *   node test/helpers/devServer.js        (listens on PORT or 8000)
 */
process.env.DEBUG_TESTS = '1';
const { fake } = require('./harness');
const http = require('http');
const app = require('../../src/app');

const port = Number(process.env.PORT) || 8000;
http.createServer(app).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[DEV-FAKE] UDAAN API on http://localhost:${port}/api backed by an in-memory fake (users: ${fake.users.size})`);
});
