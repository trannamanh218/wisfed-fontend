class Storage {
	getAccessToken() {
		return this.getItem('accessToken');
	}

	getRefreshToken() {
		return this.getItem('refreshToken');
	}

	setAccessToken(value) {
		return this.setItem('accessToken', value);
	}

	sessionPartitionStorage() {
		return this.sessionPartition('partition');
	}

	getPartition() {
		return this.getItem('partition');
	}

	setPartition(value) {
		return this.setItem('partition', value);
	}

	setRefreshToken(value) {
		return this.setItem('refreshToken', value);
	}

	removeAccessToken() {
		return this.removeItem('accessToken');
	}

	removeRefreshToken() {
		return this.removeItem('refreshToken');
	}

	getItem(name) {
		return localStorage.getItem(name);
	}

	setItem(key, value) {
		localStorage.setItem(key, value);
		return value;
	}

	setSession(key, value) {
		sessionStorage.setItem(key, value);
		return value;
	}

	removeItem(key) {
		localStorage.removeItem(key);
	}

	sessionPartition(key) {
		return sessionStorage.getItem(key);
	}
}

export default new Storage();
