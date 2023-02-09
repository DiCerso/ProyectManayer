require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const cors = require('cors');
const checkToken = require('./middlewares/checkToken');
const connectDB = require('./database/config');


const whiteList = [process.env.URL_FRONTEND];
const corsOptions = {
  origin : function (origin, callback) {
    if(whiteList.includes(origin)){
      callback(null, true)
    }else{
      cb(new Error('Error de Cors'))
    }
  }
}

const authroutes = require('./routes/auth.routes');
const taskroutes = require('./routes/task.routes');
const proyectroutes = require('./routes/proyect.routes');
const profileroutes = require('./routes/users.routes')


var app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions))

connectDB()

//Routes

app.use('/api/auth', authroutes);
app.use('/api/task', taskroutes);
app.use('/api/projects',checkToken, proyectroutes);
app.use('/api/prifile', profileroutes);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    ok : false,
    msg : err.message? err.message : "Ups, hubo un Error!"
  });
});

module.exports = app;
