import { useEffect } from 'react';
import { useState } from 'react';
import './showTime.scss';
import moment from 'moment';
import 'moment/locale/vi';
import Proptypes from 'prop-types';
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
			setHour(`${moment(time).format('HH:mm')}`);
		}
	}, [dataTime]);

	return <div className='show-time-modal'>{`${day} tháng ${month + 1}, ${year} lúc ${hour}`}</div>;
}

ShowTime.propTypes = {
	dataTime: Proptypes.string,
};
