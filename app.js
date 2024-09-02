require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authentication = require('./middleware/authentication')
//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
//connectDB
const connectDB = require('./db/connect')

//security
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const cors = require('cors')

app.set('trust proxy', 1);
app.use(rateLimiter({windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, }))// Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.)

app.use(express.json());
app.use(helmet())
app.use(xss())
app.use(cors())
// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authentication ,jobsRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => 
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
