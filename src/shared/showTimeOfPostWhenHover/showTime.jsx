import { useEffect } from 'react';
import { useState } from 'react';
import './showTime.scss';
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

export default function ShowTime({ dataTime }) {
	const [start, setStart] = useState('');

	useEffect(() => {
		if (dataTime) {
			setStart(new Date(dataTime));
		}
	}, [dataTime]);

	return (
		<div className='show-time-modal'>{`${moment(start).format('DD MMM')} lúc ${moment(start).format(
			'kk:mm'
		)}`}</div>
	);
}
