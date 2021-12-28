import axios, { CancelToken } from 'axios';
import Storage from './Storage';
const source = null;

class Request {
	constructor() {
		this.token = '';
		const token = Storage.getAccessToken();
		this.partition = process.env.REACT_APP_PARTITION;
		const headers = {
			'Content-Type': 'application/json',
			'Partition': this.partition,
		};

		if (token) {
			this.token = token;
			Object.assign(headers, {
				Authorization: `Bearer ${this.token}`,
			});
		}

		this.axios = axios.create({
			baseURL: process.env.REACT_APP_API_URL,
			timeout: 30000,
			headers,
			responseType: 'json',
			transformResponse: [
				data => {
					if (data) {
						if (!data.hasOwnProperty('success') || data.success) return data;
						else {
							const err = { response: { data } };
							throw err;
						}
					} else {
						const err = { code: 404, message: 'NotFound' };
						throw err;
					}
				},
			],
			validateStatus: status => {
				if (status === 403) {
					window.location = `${window.location.origin}/#/403`;
				} else {
					return status >= 200 && status < 300; // default
				}
			},
		});

		this.axios.interceptors.request.use(
			config => {
				// Do something before request is sent
				return config;
			},
			error => {
				// Do something with request error
				return Promise.reject(error);
			}
		);

		this.axios.interceptors.response.use(
			response => {
				// Do something with response data
				return response;
			},
			error => {
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					return Promise.reject(error.response);
				} else if (error.request) {
					// The request was made but no response was received
					// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
					// http.ClientRequest in node.js
					return Promise.reject(error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					return Promise.reject(error);
				}
			}
		);
	}

	setToken(token = '', refresh_token = '') {
		Storage.setAccessToken(token);
		Storage.setRefreshToken(refresh_token);
		this.refresh_token = refresh_token;
		this.token = token;
		this.axios.defaults.headers.common.Authorization = `Bearer ${this.token}`;
		this.axios.defaults.headers.Authorization = `Bearer ${this.token}`;
	}

	clearToken() {
		Storage.removeAccessToken();
		Storage.removeRefreshToken();
		this.refresh_token = '';
		this.token = '';
		delete this.axios.defaults.headers.common.Authorization;
		delete this.axios.defaults.headers.Authorization;
	}

	_onError = error => {
		// throw error;
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			throw error.response;
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			throw error.request;
		} else {
			// Something happened in setting up the request that triggered an Error
			throw error;
		}
	};

	_mapConfig = config => {
		if (config.ignoreAuth) {
			config.validateStatus = status => {
				return status >= 200 && status < 300; // default
			};
		}
		return config;
	};

	cancelToken() {
		return CancelToken.source();
	}

	cancelRequest = () => {
		source.cancel();
	};

	makeRequest(config = {}) {
		config = this._mapConfig(config);
		this.axios.request(config).catch(this._onError);
	}

	makePost(url, data = {}, config = {}) {
		config = this._mapConfig(config);
		return this.axios.post(url, data, config).catch(this._onError);
	}

	makePostRaw(url, data = {}, config = {}) {
		config = this._mapConfig(config);
		return this.axios.post(url, JSON.stringify(data), config).catch(this._onError);
	}

	makePut(url, data = {}, config = {}) {
		config = this._mapConfig(config);
		return this.axios.put(url, data, config).catch(this._onError);
	}

	makePutRaw(url, data = {}, config = {}) {
		config = this._mapConfig(config);
		return this.axios.put(url, JSON.stringify(data), config).catch(this._onError);
	}

	makePatch(url, data = {}, config = {}) {
		config = this._mapConfig(config);
		return this.axios.patch(url, data, config).catch(this._onError);
	}

	makeGet(url, params = {}, config = {}) {
		config = this._mapConfig(config);
		Object.assign(config, {
			params,
		});
		return this.axios.get(url, config).catch(this._onError);
	}

	makeDelete(url, params = {}, config = {}) {
		config = this._mapConfig(config);
		Object.assign(config, {
			params,
		});
		return this.axios.delete(url, config).catch(this._onError);
	}

	makeDeleteRaw(url, data = {}, config = {}) {
		config = this._mapConfig(config);
		config.data = data;
		return this.axios.delete(url, config).catch(this._onError);
	}
}

export default new Request();
