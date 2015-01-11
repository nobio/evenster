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
		"expire": "60000" // 60 sec
	},
	"logger": {
		"api": "logs/api.log",
		"exception": "logs/exceptions.log",
		"level": "debug"
	},
	"persistence": {
		"path_to_db": "./data",
		"flush_interval": "5000"
	}
};

//http://www.iana.org/assignments/multicast-addresses/multicast-addresses.xhtml