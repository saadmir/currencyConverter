#!/usr/bin/env node

var path = require('path');
var conf = require(path.join(__dirname, '../', 'conf.js'));
var app  = require(path.join(__dirname, '../', 'app','app.js'))(conf);

var port = process.env.PORT || '3000';
app.set('port', port);

var server = require('http').createServer(app);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log(app.data);

var request = require('supertest');
var should = require('should');
var assert = require("assert");

describe('GET /currencies', function(){
  it('respond with json', function(done){
    request(app)
      .get('/currencies')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done()
      });
  })
});

describe('GET /currencyConversion', function(){
  it('respond with json', function(done){
    request(app)
      .get('/currencyConversion/SAR/USD/10000')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        var converted = res.body;
        converted.should.be.a.Object;
        converted.should.have.ownProperty('code').equal('USD')
        converted.should.have.ownProperty('amount');
        (parseFloat(converted.amount)).should.be.a.Number;
        done()
      });
  })
});

describe('GET /conversionRate/BDT/PKR/', function(){
  it('respond with json', function(done){
    request(app)
      .get('/conversionRate/BDT/PKR/')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        res.body.should.be.a.String;
        (parseFloat(res.body)).should.be.a.Number;
        if (err) return done(err);
        done()
      });
  })
});

var max =  Number.MAX_SAFE_INTEGER - 10;
for (var i = max ; i < (max + 10) ; i++){
  describe('converter', function(){
    describe('#convert', function(){
      it('should return object', function(){
        var converted = app.services.converter.convert('USD','USD', i);
        converted.should.have.property('code', 'USD');
        (converted.amount).should.be.a.Number;
        //(parseFloat(converted.amount)).should.be.a.Number;
      })
    })
  });
};
