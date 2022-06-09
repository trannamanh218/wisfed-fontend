import React, { useEffect, useState, useCallback } from 'react';
import NormalContainer from 'components/layout/normal-container';
import './reading-summary-author.scss';
import { BackArrow } from 'components/svg';
import { Link } from 'react-router-dom';
import SearchField from 'shared/search-field';
import { TimeIcon } from 'components/svg';
import { Bar, BarChart, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import PropTypes from 'prop-types';
import { useCurrentPng } from 'recharts-to-png';
import { NotificationError } from 'helpers/Error';
import ModalChart from './modal-sort';
import { updateImg, getChartsBooks } from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const ReadingSummaryChartAuthor = () => {
	const [chartsData, setChartsData] = useState({});
	const [sortValue, setSortValue] = useState('day');
	const [sortValueKey, setSortValueKey] = useState('read');
	const [changeValue, setChangeValue] = useState(false);
	const [getAreaPng, { ref: areaRef }] = useCurrentPng();
	const dispatch = useDispatch();
	const { bookId } = useParams();

	useEffect(() => {
		fetchData();
	}, [changeValue]);

	const fetchData = async () => {
		try {
			let by = '';
			if (sortValue === 'day') {
				by = 'day';
			} else if (sortValue === 'month') {
				by = 'month';
			} else if (sortValue === 'year') {
				by = 'year';
			}
			const params = {
				reportType: sortValueKey,
				by: by,
				id: bookId,
			};

			const data = await dispatch(getChartsBooks(params)).unwrap();
			setChartsData(data);
		} catch (err) {
			NotificationError(err);
		}
	};

	const renderHoverColumn = payload => {
		switch (sortValueKey) {
			case 'read':
				return ` Lượt đọc ${payload}`;
			case 'addToLibrary':
				return ` Lượt thêm vào thư viện ${payload}`;
			case 'likeBook':
				return ` Lượt like ${payload}`;
			case 'rate':
				return ` Lượt Đánh giá ${payload}`;
			case 'eeview':
				return ` Lượt Review ${payload}`;
			case 'quote':
				return ` Lượt Quote ${payload}`;
			default:
				return;
		}
	};

	function CustomTooltip(props) {
		const { label, payload } = props;
		return (
			<div className='custom-tooltip'>
				<p className='label'>
					{sortValue === 'month' ? 'T' : ''}
					{label} : {renderHoverColumn(payload[0]?.payload.count)}
				</p>
			</div>
		);
	}

	function CustomizedAxisXTick(props) {
		const { x, y, payload } = props;
		return (
			<g transform={`translate(${x},${y})`}>
				<text x={0} y={15} textAnchor='middle'>
					{sortValue === 'month' && 'T'}
					{payload.value}
				</text>
			</g>
		);
	}

	CustomTooltip.propTypes = {
		label: PropTypes.string,
		payload: PropTypes.object,
	};

	CustomizedAxisXTick.propTypes = {
		x: PropTypes.number,
		y: PropTypes.number,
		payload: PropTypes.object,
	};

	return (
		<NormalContainer>
			<div className='book__author__charts'>
				<div className='notificaiton__main__container'>
					<Link to={'/'} className='notificaiton__main__back'>
						<BackArrow />
					</Link>
					<div className='notificaiton__main__title'>
						Biểu đồ tăng trưởng cuốn sách “{`${chartsData.book?.name}`}”
					</div>
				</div>
				<div className='book__author__charts__main'>
					<div className='book__author__charts__search'>
						<SearchField placeholder='Tìm kiếm tên sách' />
						<div className='chart__history__title'>Tìm kiếm gần đây</div>
						<div className='result__search__main__left'>
							<div className='result__search__icon__time'>
								<TimeIcon />
							</div>
							<div className='result__search__name'>Yêu người không yêu hơ hơ</div>
						</div>
						<div className='result__search__main__left'>
							<div className='result__search__icon__time'>
								<TimeIcon />
							</div>
							<div className='result__search__name'>Yêu người không yêu hơ hơ</div>
						</div>
						<div className='result__search__main__left'>
							<div className='result__search__icon__time'>
								<TimeIcon />
							</div>
							<div className='result__search__name'>Yêu người không yêu hơ hơ</div>
						</div>
					</div>
					<div className='book__author__recharts '>
						<ModalChart
							setSortValue={setSortValue}
							sortValueKey={sortValueKey}
							setSortValueKey={setSortValueKey}
							sortValue={sortValue}
							setChangeValue={setChangeValue}
							changeValue={changeValue}
						/>
						<div className='reading-summary-book-tab__chart-wrapper'>
							<BarChart
								width={880}
								height={500}
								data={chartsData.data}
								ref={areaRef}
								margin={{
									top: 50,
									left: 30,
								}}
							>
								<defs>
									<linearGradient id='colorUv-book-tab' x1='0' y1='0' x2='0' y2='1'>
										<stop offset='70%' stopColor='#FFA933' />
										<stop offset='100%' stopColor='#FFDDAE' />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis
									stroke='#6E7191'
									dataKey={sortValue === 'month' ? 'month' : 'year'}
									tick={<CustomizedAxisXTick />}
								></XAxis>
								<YAxis
									label={{
										value: sortValueKey.charAt(0).toUpperCase() + sortValueKey.slice(1),
										position: 'top',
										offset: 30,
									}}
									tickCount={10}
								/>
								<Bar
									dataKey='count'
									fill='url(#colorUv-book-tab)'
									name={sortValue.value === 'month' ? 'Tháng' : 'Năm'}
									barSize={36}
								/>
								<Tooltip
									cursor={false}
									content={<CustomTooltip />}
									wrapperStyle={{
										backgroundColor: 'white',
										borderRadius: '10px',
										padding: '12px 16px',
										border: '#ccc 1px solid',
										fontWeight: 600,
										fontSize: '0.875rem',
									}}
								/>
							</BarChart>
						</div>
					</div>
				</div>
				<button className='btn reading-summary-book-tab__btn'>Chia sẻ</button>
			</div>
		</NormalContainer>
	);
};

export default ReadingSummaryChartAuthor;
