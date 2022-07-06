import './charts-reading.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState, memo } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { getChartsByid } from 'reducers/redux-utils/chart';
import { useParams } from 'react-router-dom';

const ChartsReading = () => {
	const [chartsData, setChartsData] = useState({ month: '', year: '' });
	const [pagesMonth, setPagesMonth] = useState([]);
	const [BooksMonth, setBooksMonth] = useState([]);
	const dispatch = useDispatch();
	const { userId } = useParams();

	const fetchDataPage = async () => {
		const dob = new Date();
		const month = dob.getMonth() + 1;
		const year = dob.getFullYear();
		setChartsData({ month: month, year: year });
		try {
			const paramsBook = {
				count: 'numBookRead',
				by: 'month',
				userId: userId,
			};
			const data = await dispatch(getChartsByid(paramsBook)).unwrap();
			const pageMonth = data.filter(item => item.month === month);
			setPagesMonth(pageMonth);
			const paramsPage = {
				count: 'numPageRead',
				by: 'month',
				userId: userId,
			};
			const newData = await dispatch(getChartsByid(paramsPage)).unwrap();
			const bookMonth = newData.filter(item => item.month === month);
			setBooksMonth(bookMonth);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		fetchDataPage();
	}, []);

	return (
		<div className='charts__reading__container'>
			<div className='charts__reading__container__title'>Biểu đồ đọc sách</div>
			<div className='charts__reading__container__main'>
				<div className='charts__reading__container__main__month'>
					Tháng {`${chartsData.month} / ${chartsData.year}`}{' '}
				</div>
				{BooksMonth.map((item, index) => (
					// <div key={item.id} className='charts__reading__container__main__read'>
					<div key={index} className='charts__reading__container__main__read'>
						<div className='book__read__title'>Số sách đã đọc</div>
						<div className='book__read__number'>{item.count}</div>
					</div>
				))}
				{pagesMonth.map((item, index) => (
					// <div key={item.id} className='charts__reading__container__main__read'>
					<div key={index} className='charts__reading__container__main__read'>
						<div className='book__read__title'>Số trang đã đọc</div>
						<div className='book__read__number'>{item.count}</div>
					</div>
				))}

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

export default memo(ChartsReading);
