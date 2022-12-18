import { useEffect, useState, useCallback, useRef } from 'react';
import NormalContainer from 'components/layout/normal-container';
import './reading-summary-author.scss';
import { Bar, BarChart, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import { useCurrentPng } from 'recharts-to-png';
import ModalChart from './modal-sort';
import { handleSetImageToShare, getChartsBooks } from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Circle from 'shared/loading/circle';
import { useNavigate } from 'react-router-dom';
import NotFound from 'pages/not-found';
import BackButton from 'shared/back-button';
import BookAuthorChartSearch from './search-component';
import SearchIcon from 'assets/icons/search.svg';
import { GROWTH_CHART_VERB_SHARE } from 'constants';
import { saveDataShare } from 'reducers/redux-utils/post';

const ReadingSummaryChartAuthor = () => {
	const [chartsData, setChartsData] = useState({});
	const [searchValue, setSearchValue] = useState('');
	const [booksId, setBooksId] = useState();
	const [showDropdownMenu, setShowDropdownMenu] = useState(false);
	const [sortValue, setSortValue] = useState('day');
	const [sortValueKey, setSortValueKey] = useState('read');
	const [nameBook, setNameBook] = useState('');
	const [authorName, setAuthorName] = useState('');
	const [changeValue, setChangeValue] = useState(false);
	const [getAreaPng, { ref: areaRef }] = useCurrentPng();
	const dispatch = useDispatch();
	const { bookId } = useParams();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [errorLoadPage, setErrorLoadPage] = useState(false);
	const [show, setShow] = useState(true);

	const smallScreenSearchModal = useRef(null);

	useEffect(() => {
		fetchData();
	}, [changeValue, booksId, bookId]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (smallScreenSearchModal.current && !smallScreenSearchModal.current.contains(event.target)) {
				setShow(true);
			}
		}
		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [smallScreenSearchModal]);

	useEffect(() => {
		if (!show) {
			const arr = document.getElementsByClassName('search-field__input');
			arr[1].focus();
		}
	}, [show]);

	const fetchData = async () => {
		setLoading(true);
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
			const authorData = data.book.authors.map(item => item.authorName).join(', ');
			setAuthorName(authorData);
		} catch (err) {
			setErrorLoadPage(true);
		} finally {
			setLoading(false);
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
					const dataToShare = {
						type: 'growthChart',
						verb: GROWTH_CHART_VERB_SHARE,
						nameBook: nameBook,
						authorName: authorName,
						bookId: bookId,
					};
					dispatch(saveDataShare(dataToShare));
					dispatch(handleSetImageToShare(imgUploadder));
					navigate('/');
				}
			}
		}
	}, [getAreaPng, nameBook, authorName]);

	const renderHoverColumn = data => {
		switch (sortValueKey) {
			case 'read':
				return ` Lượt đọc ${data !== undefined ? `: ${data}` : ''}`;
			case 'addToLibrary':
				return ` Lượt thêm vào thư viện ${data !== undefined ? `: ${data}` : ''}`;
			case 'likeBook':
				return ` Lượt like ${data !== undefined ? `: ${data}` : ''}`;
			case 'rate':
				return ` Lượt Đánh giá ${data !== undefined ? `: ${data}` : ''}`;
			case 'review':
				return ` Lượt Review ${data !== undefined ? `: ${data}` : ''}`;
			case 'quote':
				return ` Lượt Quote ${data !== undefined ? `: ${data}` : ''}`;
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
		label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		payload: PropTypes.array,
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
							<BackButton destination={-1} />
							<div className='notification__main__title'>
								Biểu đồ tăng trưởng cuốn sách “{`${nameBook}`}”
							</div>
						</div>
						<div className='book__author__charts__main'>
							<div className='book__author__charts__main__small-screen-hide'>
								<BookAuthorChartSearch
									setBooksId={setBooksId}
									searchValue={searchValue}
									setSearchValue={setSearchValue}
								/>
							</div>

							<div className='book__author__recharts'>
								{/* this search component appears when screen is 1024 */}
								<div className='book__author__recharts__small-search-button'>
									<div style={{ position: 'relative' }}>
										<div
											className={`book__author__recharts__small-search-button__icon ${
												show && 'show'
											}`}
											onClick={() => setShow(false)}
										>
											<img className='search-field__icon' src={SearchIcon} alt='search-icon' />
										</div>
										<div
											className={`book__author__recharts__small-search-button__modal ${
												!show && 'show'
											}`}
											ref={smallScreenSearchModal}
										>
											<BookAuthorChartSearch
												setBooksId={setBooksId}
												searchValue={searchValue}
												setSearchValue={setSearchValue}
												setShow={setShow}
											/>
										</div>
									</div>
								</div>

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
									<ResponsiveContainer width='100%' height={500}>
										<BarChart
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
									</ResponsiveContainer>
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
