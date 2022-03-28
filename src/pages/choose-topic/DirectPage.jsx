import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { checkApiToken } from 'reducers/redux-utils/auth';

export default function Direct() {
	const [search, setSearch] = useSearchParams();
	const newToken = search.get('token');
	const dispatch = useDispatch();
	const newEmail = localStorage.getItem('emailForgot');

	const checkToken = async () => {
		await dispatch(checkApiToken, newToken);
	};

	useEffect(() => {
		console.log('aaaaa');
		checkToken();
	});

	return (
		<>
			<button onClick={checkToken}>click me</button>
		</>
	);
}
