// eslint-disable-next-line import/no-extraneous-dependencies
import express from 'express';
import yall, { yallMorgan } from '../src';

const app = express();

// connect YALL morgan middleware
// set GET/HEAD call log level to info
app.use(yallMorgan({ readLevel: 'info' }));

// respond with generic text to any request
app.use((req, res) => res.send(`Hello, you have sent ${req.method} to path ${req.url}`));

// start server on port 8080
app.listen(8080, () => yall.info('Listening on port 8080...'));
