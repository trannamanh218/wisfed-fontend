import './charts-reading.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState, memo } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { getChartsByid } from 'reducers/redux-utils/chart';
import { useParams } from 'react-router-dom';

const ChartsReading = ({ setShowChartReading }) => {
	const [chartsData, setChartsData] = useState({ month: '', year: '' });
	const [pagesMonth, setPagesMonth] = useState({});
	const [booksMonth, setBooksMonth] = useState({});
	const dispatch = useDispatch();
	const { userId } = useParams();

	const fetchDataPage = async () => {
		const dob = new Date();
		let month = dob.getMonth() + 1;
		const year = dob.getFullYear();
		setChartsData({ month: month, year: year });

		try {
			const params = {
				count: 'numPageRead',
				by: 'year',
				userId: userId,
			};
			const data = await dispatch(getChartsByid(params)).unwrap();
			if (data && data.length === 0) {
				// Kiểm tra xem nếu user chưa từng đọc cuốn sách nào thì ẩn component đi
				setShowChartReading(false);
			} else {
				try {
					const paramsPage = {
						count: 'numPageRead',
						by: 'month',
						userId: userId,
					};
					const newData = await dispatch(getChartsByid(paramsPage)).unwrap();

					// Lấy tháng gần nhất có đọc sách
					for (let i = month - 1; i > 0; i--) {
						if (newData[i].count > 0) {
							setPagesMonth(newData[i]);
							month = newData[i].month;
							break;
						}
					}

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
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		fetchDataPage();
	}, [userId]);

	return (
		<div className='charts__reading__container'>
			<div className='charts__reading__container__title'>Biểu đồ đọc sách</div>
			<div className='charts__reading__container__main'>
				<div className='charts__reading__container__main__month'>
					Tháng {`${chartsData.month}/${chartsData.year}`}{' '}
				</div>
				<div className='charts__reading__container__main__read'>
					<div className='book__read__title'>Số sách đã đọc</div>
					<div className='book__read__number'>{booksMonth.count}</div>
				</div>
				<div className='charts__reading__container__main__read'>
					<div className='book__read__title'>Số trang đã đọc</div>
					<div className='book__read__number'>{pagesMonth.count}</div>
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

export default memo(ChartsReading);
