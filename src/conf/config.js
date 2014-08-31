module.exports = {
	"udp": {
		"server": {
			"port": "16503",
			"host": "233.252.124.67",
		},
		"message": {
			"type": {
				"ping"          : "PING",
				"pong"          : "PONG",
				"advertise"     : "ADVERTISE",
				"advertisement" : "ADVERTISEMENT"
			}
		}
	},
	"queue" : {
		"expire": "20000" // 20 sec
	},
	"logger": {
		"api": "logs/api.log",
		"exception": "logs/exceptions.log",
		"level": "debug"
	}
};

//http://www.iana.org/assignments/multicast-addresses/multicast-addresses.xhtml