var createError = require('http-errors');
// import * as dotenv from 'dotenv'
import config from 'config';
import cors from 'cors';
import express from 'express';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { indexRouter } from './routes/index';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { eventsRouter } from './routes/event';
import { purchasesRouter } from './routes/purchase';
import { paymentsRouter } from './routes/payment';
import { statsRouter } from './routes/stats';

var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// const envpath = path.join(__dirname, '../.env');
// console.log('env path', envpath)
// dotenv.config({path: envpath});

app.use('/api', indexRouter);
// #region ================== AUTH ROUTES
app.use('/api/auth', authRouter);
//  #endregion

app.use('/api/user', userRouter);
app.use('/api/events', eventsRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin/stats', statsRouter);

// serve only the static files from the dist directory
app.use(express.static(path.join(__dirname, '../public/fe')));
app.use('/public/uploads', express.static(path.join(__dirname, '../public/uploads')));

//#region  ======= CREATE SERVER AND START ===============
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '9000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//#endregion

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
    next(createError(404));
});

// error handler
app.use((err: { message: any; status: any }, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    // res.status(err.status || 500);
    // res.render('error');

    console.log('Error thrown by our error handler');

    res.status(404).sendFile(path.join(__dirname, '../public/fe/index.html'));
});

// DB Connection
try {
    mongoose.connect(
        config.get('CONN_STR'),
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        },
        (err: mongoose.CallbackError) => {
            if (err) {
                console.log({ error: err.message });
            } else {
                console.log('Database connection successful');
            }
        }
    );
} catch (error: any) {
    console.log('Error', error);
}

// Some other functions
function onError(error: { syscall: string; code: any }) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('App started on port: ', bind);
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
module.exports = app;
