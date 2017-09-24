module.exports = class RefStore {
	constructor() {
		this.keys = [];
		this.values = [];
	}

	set(key, value) {
		this.keys.push(key);
		this.values.push(value);
	}

	getRef(value) {
		const index = this.values.indexOf(value);

		return index === -1 ? null : this.keys[index];
	}

	getRefIndex(value) {
		return this.values.indexOf(value);
	}

	getRefByIndex(index) {
		return this.values[index];
	}
};
