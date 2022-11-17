import { useEffect } from 'react';
import { useState } from 'react';
import './showTime.scss';
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

export default function ShowTime({ dataTime }) {
	const [day, setDay] = useState('');
	const [month, setMonth] = useState('');
	const [year, setYear] = useState('');
	const [hour, setHour] = useState('');

	useEffect(() => {
		if (dataTime) {
			const time = new Date(dataTime);

			setDay(time.getDate());
			setMonth(time.getMonth());
			setYear(time.getFullYear());
			setHour(`${moment(time).format('kk:mm')}`);
		}
	}, [dataTime]);

	return <div className='show-time-modal'>{`Ngày ${day} tháng ${month + 1} năm ${year} lúc ${hour}`}</div>;
}
