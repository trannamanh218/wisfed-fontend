import './charts-reading.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState, memo } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { getChartsByid } from 'reducers/redux-utils/chart';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const ChartsReading = () => {
	const [chartsData, setChartsData] = useState({ month: '', year: '' });
	const [pagesMonth, setPagesMonth] = useState({});
	const [booksMonth, setBooksMonth] = useState({});
	const dispatch = useDispatch();
	const { userId } = useParams();

	useEffect(() => {
		fetchDataPage();
	}, [userId]);

	const fetchDataPage = async () => {
		const dob = new Date();
		const month = dob.getMonth() + 1;
		const year = dob.getFullYear();
		setChartsData({ month: month, year: year });

		try {
			const paramsPage = {
				count: 'numPageRead',
				by: 'month',
				userId: userId,
			};
			const newData = await dispatch(getChartsByid(paramsPage)).unwrap();
			const pageMonth = newData.find(item => item.month === month);
			setPagesMonth(pageMonth);

			const paramsBook = {
				count: 'numBookRead',
				by: 'month',
				userId: userId,
			};
			const data = await dispatch(getChartsByid(paramsBook)).unwrap();
			const bookMonth = data.find(item => item.month === month);
			setBooksMonth(bookMonth);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='charts__reading__container'>
			<div className='charts__reading__container__title'>Biểu đồ đọc sách</div>
			<div className='charts__reading__container__main'>
				<div className='charts__reading__container__main__month'>
					Tháng {`${chartsData.month}/${chartsData.year}`}{' '}
				</div>
				<div className='charts__reading__container__main__read'>
					<div className='book__read__title'>Số sách đã đọc</div>
					<div className='book__read__number'>{booksMonth?.count || 0}</div>
				</div>
				<div className='charts__reading__container__main__read'>
					<div className='book__read__title'>Số trang đã đọc</div>
					<div className='book__read__number'>{pagesMonth?.count || 0}</div>
				</div>

				<Link
					to={`/reading-summary/${userId}`}
					style={{ 'cursor': 'pointer' }}
					className='sidebar__view-more-btn--blue'
				>
					Xem chi tiết
				</Link>
			</div>
		</div>
	);
};

ChartsReading.propTypes = {
	setShowChartReading: PropTypes.func,
};

export default memo(ChartsReading);
