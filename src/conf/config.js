module.exports = {
  "udp": {
		"server": {
			"port": "41235"
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