module.exports = {
	"udp": {
		"server": {
			"port": "17501",
			"host": "224.0.0.55",
			"_host": "192.168.2.255"
		},
		"message": {
			"type": {
				"ping": "PING",
				"pong": "PONG"
			}
		}
	},
	"logger": {
		"api": "logs/api.log",
		"exception": "logs/exceptions.log",
		"level": "debug"
	}
};

//http://www.iana.org/assignments/multicast-addresses/multicast-addresses.xhtml