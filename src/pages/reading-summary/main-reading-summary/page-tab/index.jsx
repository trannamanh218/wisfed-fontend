import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import { Bar, BarChart, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import SelectBox from 'shared/select-box';
import './page-tab.scss';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';
import chart, { getChartsByid, updateImg } from 'reducers/redux-utils/chart';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';
import { useCurrentPng } from 'recharts-to-png';

const PageTab = () => {
	const [currentOption, setCurrentOption] = useState({ value: 'month', title: 'Theo tháng' });
	const [loading, setLoading] = useState(false);
	const { userId } = useParams();
	const [chartsData, setChartsData] = useState([]);
	const [width, setWidth] = useState(880);

	const dispatch = useDispatch();
	const [getAreaPng, { ref: areaRef }] = useCurrentPng();
	const navigate = useNavigate();
	const options = [
		{ value: 'month', title: 'Theo tháng' },
		{ value: 'year', title: 'Theo năm' },
	];

	useEffect(() => {
		fetchData();
	}, [currentOption]);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 1366 && window.innerWidth > 1280) {
				setWidth(730);
			} else if (window.innerWidth < 1280 && window.innerWidth > 1024) {
				setWidth(540);
			} else if (window.innerWidth < 1024 && window.innerWidth > 915) {
				setWidth(700);
			} else if (window.innerWidth < 915) {
				setWidth(560);
			} else {
				setWidth(880);
			}
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

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
		label: PropTypes.string,
		payload: PropTypes.object,
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
						<BarChart
							width={width}
							height={500}
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
					</div>

					<button className='btn reading-summary-page-tab__btn' onClick={handleAreaDownload}>
						Chia sẻ
					</button>
				</>
			) : (
				<h4 style={{ marginTop: '28px' }}>Không có dữ liệu</h4>
			)}
		</div>
	);
};

export default PageTab;
