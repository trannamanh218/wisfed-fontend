import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import { Bar, BarChart, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import SelectBox from 'shared/select-box';
import './page-tab.scss';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';
import { getChartsByid, handleSetImageToShare } from 'reducers/redux-utils/chart';
import Circle from 'shared/loading/circle';
import { useCurrentPng } from 'recharts-to-png';
import { CHART_VERB_SHARE } from 'constants';
import { saveDataShare } from 'reducers/redux-utils/post';
import CreatePostModalContent from 'pages/home/components/newfeed/components/create-post-modal-content';
import { blockAndAllowScroll } from 'api/blockAndAllowScroll.hook';

const PageTab = () => {
	const [currentOption, setCurrentOption] = useState({ value: 'month', title: 'Theo tháng' });
	const [loading, setLoading] = useState(false);
	const { userId } = useParams();
	const [chartsData, setChartsData] = useState([]);
	const [showModalCreatePost, setShowModalCreatePost] = useState(false);

	const userInfo = useSelector(state => state.auth.userInfo);

	const dispatch = useDispatch();

	blockAndAllowScroll(showModalCreatePost);

	const [getAreaPng, { ref: areaRef }] = useCurrentPng();

	const options = [
		{ value: 'month', title: 'Theo tháng' },
		{ value: 'year', title: 'Theo năm' },
	];

	useEffect(() => {
		fetchData();
	}, [currentOption]);

	const fetchData = async () => {
		try {
			if (currentOption.value === 'month') {
				const params = {
					count: 'numPageRead',
					by: 'month',
					userId: userId,
				};
				const data = await dispatch(getChartsByid(params)).unwrap();
				setChartsData(data);
			} else {
				const params = {
					count: 'numPageRead',
					by: 'year',
					userId: userId,
				};
				const data = await dispatch(getChartsByid(params)).unwrap();
				// Vì count đang là string nên chuyển sang định dạng số
				data.forEach(item => (item.count = Number(item.count)));
				setChartsData(data);
			}
		} catch (err) {
			NotificationError(err);
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

				// convert to file
				const imageUploadedData = new File([u8arr], 'charts.png', { type: 'image/png' });
				const imgUploadder = [imageUploadedData];

				if (imageUploadedData) {
					setLoading(false);
					const dataToShare = {
						type: 'readingChart',
						verb: CHART_VERB_SHARE,
						by: currentOption.value,
						userId: userId,
						isReadedChart: false,
					};
					dispatch(saveDataShare(dataToShare));
					dispatch(handleSetImageToShare(imgUploadder));
					setShowModalCreatePost(true);
				}
			}
		}
	}, [getAreaPng, currentOption]);

	const onChangeOption = item => {
		setCurrentOption(item);
	};

	function CustomTooltip(props) {
		const { label, payload } = props;
		return (
			<div className='custom-tooltip'>
				<p className='label'>{`${currentOption.value === 'month' ? 'T' : ''}${label} : Đã đọc ${
					payload[0]?.payload.count
				} trang`}</p>
			</div>
		);
	}

	function CustomizedAxisXTick(props) {
		const { x, y, payload } = props;
		return (
			<g transform={`translate(${x},${y})`}>
				<text x={0} y={15} textAnchor='middle'>
					{currentOption.value === 'month' && 'T'}
					{payload.value}
				</text>
			</g>
		);
	}

	const handleTickYCount = () => {
		let max = 1;
		max = Math.max(...chartsData.map(item => item.count));
		if (max < 10) {
			return max + 1;
		} else {
			return 11;
		}
	};

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
		<div className='reading-summary-page-tab'>
			<Circle loading={loading} />
			<SelectBox
				className='select-box--custom'
				name='library'
				list={options}
				defaultOption={currentOption}
				onChangeOption={onChangeOption}
			/>

			{chartsData.length > 0 ? (
				<>
					<div className='reading-summary-page-tab__chart-wrapper'>
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
									<linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
										<stop offset='70%' stopColor='#FFA933' />
										<stop offset='100%' stopColor='#FFDDAE' />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis
									stroke='#6E7191'
									dataKey={currentOption.value === 'month' ? 'month' : 'year'}
									tick={<CustomizedAxisXTick />}
								></XAxis>
								<YAxis
									label={{ value: 'Số trang', position: 'top', offset: 30 }}
									tickCount={handleTickYCount()}
								/>
								<Bar
									dataKey='count'
									fill='url(#colorUv)'
									name={currentOption.value === 'month' ? 'Tháng' : 'Năm'}
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
						</ResponsiveContainer>
					</div>

					{userInfo.id === userId && (
						<button className='btn reading-summary-page-tab__btn' onClick={handleAreaDownload}>
							Chia sẻ
						</button>
					)}
				</>
			) : (
				<h4 style={{ marginTop: '28px' }}>Không có dữ liệu</h4>
			)}
			{showModalCreatePost && <CreatePostModalContent setShowModalCreatePost={setShowModalCreatePost} />}
		</div>
	);
};

export default PageTab;
