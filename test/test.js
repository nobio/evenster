var assert = require("assert")
var udpClient = require('../src/net/udp-client');


describe('Array', function() {
	describe('#indexOfasdasdasd()', function() {
    	it('should return -1 when the value is not present', function(){
      		assert.equal(-1, [1,2,3].indexOf(5));
      		assert.equal(-1, [1,2,3].indexOf(0));
    	});
  	})
});

describe('UDP Client', function(){
  describe('#ping()', function(){
    it('should be called without any error', function() {
    	var httpcode = udpClient.ping();
    	console.log(httpcode);
    	assert.equal(200, httpcode);
    });
  })
});


