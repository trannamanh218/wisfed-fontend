import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import { Bar, BarChart, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import SelectBox from 'shared/select-box';
import './book-tab.scss';
import { getChartsByid, updateImg } from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';
import { useCurrentPng } from 'recharts-to-png';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';

const BookTab = () => {
	const [currentOption, setCurrentOption] = useState({ value: 'month', title: 'Theo tháng' });
	const [chartsData, setChartsData] = useState({});
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const options = [
		{ value: 'month', title: 'Theo tháng' },
		{ value: 'year', title: 'Theo năm' },
	];
	const [getAreaPng, { ref: areaRef }] = useCurrentPng();
	const { userId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		fetchData();
	}, [currentOption]);

	const fetchData = async () => {
		try {
			if (currentOption.value === 'month') {
				const params = {
					count: 'numBookRead',
					by: 'month',
					userId: userId,
				};
				const data = await dispatch(getChartsByid(params)).unwrap();
				setChartsData(data);
			} else {
				const params = {
					count: 'numBookRead',
					by: 'year',
					userId: userId,
				};

				const data = await dispatch(getChartsByid(params)).unwrap();
				const newData = data.map(item => {
					if (item.count?.length > 0) {
						return { ...item, count: JSON.parse(item.count) };
					}
					return item;
				});
				setChartsData(newData);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAreaDownload = useCallback(async () => {
		// setLoading(true);
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
				} cuốn`}</p>
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
		chartsData.forEach(item => {
			if (item.count > max) {
				max = item.count;
			}
		});
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
		<div className='reading-summary-book-tab'>
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
								dataKey={currentOption.value === 'month' ? 'month' : 'year'}
								tick={<CustomizedAxisXTick />}
							></XAxis>
							<YAxis
								label={{ value: 'Lượt đọc', position: 'top', offset: 30 }}
								tickCount={handleTickYCount()}
							/>
							<Bar
								dataKey='count'
								fill='url(#colorUv-book-tab)'
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

					<button className='btn reading-summary-book-tab__btn' onClick={handleAreaDownload}>
						Chia sẻ
					</button>
				</>
			) : (
				<h4 style={{ marginTop: '28px' }}>Không có dữ liệu</h4>
			)}
		</div>
	);
};

export default BookTab;
