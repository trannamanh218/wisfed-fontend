import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Direct() {
	const [search, setSearch] = useSearchParams();

	search.get('token');
	console.log(search.get('token'));
	return <>ok</>;
}
