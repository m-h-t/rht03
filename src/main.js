import { EventEmitter } from 'events';
import wpi from 'wiring-pi';

class RHT03 extends EventEmitter {
	constructor(conf) {
		super()

		let temperature = 0, humidity = 0;

		wpi.setup('wpi');

		this.interval = setInterval(() => {
			let data = wpi.readRHT03(conf.pin);

			if (data[0] == true) {
				if (conf.continuously == true) {
					this.emit('temperature', data[1] / 10, '°C');
					this.emit('humidity', data[2] / 10, '%');
				} else {
					if (data[1] != temperature * 10) {
						temperature = data[1] / 10;
						this.emit('temperature', temperature, '°C');
					}

					if (data[2] != humidity * 10) {
						humidity = data[2] / 10;
						this.emit('humidity', humidity, '%');
					}
				}
			}
		}, conf.interval || 1000);
	}
}

module.exports = RHT03;
