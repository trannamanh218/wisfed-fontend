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
import ModalChart from './modal-sort';
import { updateImg, getChartsBooks } from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Circle from 'shared/loading/circle';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { getFilterSearch } from 'reducers/redux-utils/search';
import Storage from 'helpers/Storage';
import NotFound from 'pages/not-found';

const ReadingSummaryChartAuthor = () => {
	const [chartsData, setChartsData] = useState({});
	const [searchValue, setSearchValue] = useState('');
	const [booksId, setBooksId] = useState();
	const [showDropdownMenu, setShowDropdownMenu] = useState(false);
	const [sortValue, setSortValue] = useState('day');
	const [sortValueKey, setSortValueKey] = useState('read');
	const [nameBook, setNameBook] = useState('');
	const [changeValue, setChangeValue] = useState(false);
	const [getAreaPng, { ref: areaRef }] = useCurrentPng();
	const dispatch = useDispatch();
	const { bookId } = useParams();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [filter, setFilter] = useState('[]');
	const [resultSearch, setResultSearch] = useState([]);
	const [localStorage, setLocalStorage] = useState([]);
	const [checkRenderStorage, setCheckRenderStorage] = useState(false);
	const [directClick, setDirectClick] = useState(false);
	const [errorLoadPage, setErrorLoadPage] = useState(false);

	useEffect(() => {
		fetchData();
	}, [changeValue, booksId]);

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
				id: searchValue ? booksId : bookId,
			};

			const data = await dispatch(getChartsBooks(params)).unwrap();
			if (sortValue === 'day') {
				const newChart = data.data.map(item => {
					const time = dayjs(item.time).format('DD/MM');
					return { ...item, time };
				});
				setChartsData(newChart.reverse());
			} else {
				setChartsData(data.data);
			}
			setNameBook(data.book.name);
		} catch (err) {
			setErrorLoadPage(true);
			return;
		}
	};

	const handleAreaDownload = useCallback(async () => {
		setLoading(true);
		const png = await getAreaPng();
		if (png) {
			const arr = png.split(',');
			if (arr.length > 0) {
				const mime = arr[0].match(/:(.*?);/)[1];
				const bstr = atob(arr[1]);
				let n = bstr.length;
				const u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}

				const imageUploadedData = new File([u8arr], 'charts.png', { type: mime });
				const imgUploadder = [imageUploadedData];
				if (imageUploadedData) {
					setLoading(false);
					navigate('/');
					return dispatch(updateImg(imgUploadder));
				}
			}
		}
	}, [getAreaPng]);

	const renderHoverColumn = payload => {
		switch (sortValueKey) {
			case 'read':
				return ` Lượt đọc ${payload || ''}`;
			case 'addToLibrary':
				return ` Lượt thêm vào thư viện ${payload || ''}`;
			case 'likeBook':
				return ` Lượt like ${payload || ''}`;
			case 'rate':
				return ` Lượt Đánh giá ${payload || ''}`;
			case 'eeview':
				return ` Lượt Review ${payload || ''}`;
			case 'quote':
				return ` Lượt Quote ${payload || ''}`;
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
					{label} : {payload[0]?.payload && renderHoverColumn(payload[0]?.payload.count)}
				</p>
			</div>
		);
	}

	const handleRenderXTick = payload => {
		if (payload.value) {
			if (sortValue === 'month') {
				return `T${payload.value}`;
			} else if (sortValue === 'day') {
				return `${payload.value}`;
			}
		}
	};

	const handleChange = e => {
		setSearchValue(e.target.value);
		debounceSearch(e.target.value);
	};

	useEffect(async () => {
		const params = {
			q: filter,
		};
		try {
			if (searchValue.length > 0) {
				const result = await dispatch(getFilterSearch({ ...params })).unwrap();
				setResultSearch(result.books);
			} else {
				setResultSearch([]);
			}
		} catch (err) {
			return;
		}
	}, [filter]);

	const updateInputSearch = value => {
		if (value) {
			const filterValue = value.toLowerCase().trim();
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('[]');
		}
	};

	const handleClickBooks = item => {
		setBooksId(item.id);
		navigate(`/book-author-charts/${item.id}`);
		const newArr = localStorage?.filter(data => data.id === item.id);
		if (!newArr.length) {
			setLocalStorage(prev => [...prev, item]);
			setCheckRenderStorage(!checkRenderStorage);
			setDirectClick(true);
		}
	};

	useEffect(() => {
		const getDataLocal = JSON.parse(Storage.getItem('result-book-author'));
		if (getDataLocal) {
			setLocalStorage(getDataLocal);
		}
	}, [checkRenderStorage]);

	useEffect(() => {
		if (directClick) {
			if (localStorage.length < 4) {
				Storage.setItem('result-book-author', JSON.stringify(localStorage));
			} else {
				const filterData = localStorage.filter((item, index) => index !== 0);
				setLocalStorage(filterData);
				Storage.setItem('result-book-author', JSON.stringify(filterData));
			}
		}
	}, [checkRenderStorage]);

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 1000), []);

	function CustomizedAxisXTick(props) {
		const { x, y, payload } = props;

		return (
			<g transform={`translate(${x},${y})`}>
				<text x={0} y={15} textAnchor='middle'>
					{handleRenderXTick(payload)}
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
		<>
			{!errorLoadPage ? (
				<NormalContainer>
					<div className='book__author__charts'>
						<Circle loading={loading} />
						<div className='notification__main__container'>
							<Link to={'/'} className='notification__main__back'>
								<BackArrow />
							</Link>
							<div className='notification__main__title'>
								Biểu đồ tăng trưởng cuốn sách “{`${nameBook}`}”
							</div>
						</div>
						<div className='book__author__charts__main'>
							<div className='book__author__charts__search__main'>
								<div className='book__author__charts__search__main__container'>
									<SearchField
										placeholder='Tìm kiếm tên sách'
										handleChange={handleChange}
										value={searchValue}
									/>
									{searchValue.length > 0 ? (
										<div className='book__author__charts__search'>
											{resultSearch.slice(0, 3).map(item => (
												<div
													key={item.id}
													onClick={() => handleClickBooks(item)}
													className='result__search__main__left'
												>
													<div className='result__search__icon__time'>
														<TimeIcon />
													</div>

													<div className='result__search__name'>{item.name}</div>
												</div>
											))}
										</div>
									) : localStorage.length ? (
										<div className='book__author__charts__search'>
											<div className='chart__history__title'>Tìm kiếm gần đây</div>
											{localStorage.map(item => (
												<div
													key={item.id}
													onClick={() => handleClickBooks(item)}
													className='result__search__main__left'
												>
													<div className='result__search__icon__time'>
														<TimeIcon />
													</div>

													<div className='result__search__name'>{item.name}</div>
												</div>
											))}
										</div>
									) : (
										<div className='chart__history__titles'>Không có tìm kiếm nào gần đây</div>
									)}
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
									showDropdownMenu={showDropdownMenu}
									setShowDropdownMenu={setShowDropdownMenu}
								/>
								<div className='reading-summary-book-tab__chart-wrapper'>
									<BarChart
										width={880}
										height={500}
										data={chartsData}
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
											dataKey={sortValue === 'day' ? 'time' : 'month'}
											tick={<CustomizedAxisXTick />}
										></XAxis>
										<YAxis
											label={{
												// value: sortValueKey.charAt(0).toUpperCase() + sortValueKey.slice(1),
												position: 'top',
												offset: 30,
												value: renderHoverColumn(),
											}}
											tickCount={10}
											domain={['dataMin', `dataMax + 9`]}
										/>
										<Bar dataKey='count' fill='url(#colorUv-book-tab)' barSize={36} />
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
						<button className='btn reading-summary-book-tab__btn' onClick={handleAreaDownload}>
							Chia sẻ
						</button>
					</div>
				</NormalContainer>
			) : (
				<NotFound />
			)}
		</>
	);
};

export default ReadingSummaryChartAuthor;
