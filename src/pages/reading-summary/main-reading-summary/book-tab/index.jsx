import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import SelectBox from 'shared/select-box';
import caretChart from 'assets/images/caret-chart.png';
import './book-tab.scss';
import { getChartsByid, updateImg } from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';
import { useCurrentPng } from 'recharts-to-png';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';

const BookTab = () => {
	const [currentOption, setCurrentOption] = useState({ value: 'month', title: 'Tháng' });
	const [chartsData, setChartsData] = useState({});
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const options = [
		{ value: 'month', title: 'Tháng' },
		{ value: 'year', title: 'Năm' },
	];
	const [getAreaPng, { ref: areaRef }] = useCurrentPng();
	const { userId } = useParams();
	const navigate = useNavigate();
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

	function CustomTooltip(props) {
		const { label, payload } = props;
		return (
			<div className='custom-tooltip'>
				<p className='label'>{` ${currentOption.value === 'month' ? 'Tháng' : 'Năm'} ${label} : Đã đọc ${
					payload[0]?.payload.count
				} cuốn sách`}</p>
			</div>
		);
	}

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

	useEffect(() => {
		fetchData();
	}, [currentOption]);

	const onChangeOption = item => {
		setCurrentOption(item);
	};

	CustomTooltip.propTypes = {
		label: PropTypes.string,
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

			<div className='reading-summary-book-tab__chart-wrapper'>
				<img className='caretY' src={caretChart} />
				<img className='caretX' src={caretChart} />
				<BarChart
					width={900}
					height={500}
					data={chartsData}
					margin={{
						top: 50,
						right: 30,
						left: 20,
						bottom: 5,
					}}
					barSize={36}
					ref={areaRef}
				>
					<XAxis
						stroke='#6E7191'
						dataKey={currentOption.value === 'month' ? 'month' : 'year'}
						tick={<CustomizedAxisXTick />}
						strokeDasharray='5 5'
						strokeWidth={3}
						padding={{ right: 40 }}
					></XAxis>
					<YAxis
						label={{ value: 'Số sách', position: 'top', offset: 30 }}
						tick={<CustomizedAxisYTick />}
						allowDataOverflow={true}
						domain={['auto', 'auto']}
						tickCount={10}
						strokeDasharray='5 5'
						strokeWidth={3}
						stroke='#6e7191'
					></YAxis>
					<Tooltip cursor={false} content={<CustomTooltip />} />
					<Legend wrapperStyle={{ top: 460, left: 30 }} />
					<Bar dataKey='count' fill='#9ad0f5' name={currentOption.value === 'month' ? 'Tháng' : 'Năm'} />
				</BarChart>
			</div>

			<button className='btn reading-summary-book-tab__btn' onClick={handleAreaDownload}>
				Chia sẻ
			</button>
		</div>
	);
};

function formatNumber(number) {
	return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function CustomizedAxisXTick(props) {
	const { x, y, payload } = props;
	return (
		<g transform={`translate(${x},${y})`}>
			<text x={0} y={10} dy={16} textAnchor='middle' fill='#2d2c42'>
				{payload.value}
			</text>
		</g>
	);
}

function CustomizedAxisYTick(props) {
	const { x, y, payload } = props;
	const numberFomat = formatNumber(payload.value.toFixed());
	return (
		<g transform={`translate(${x},${y})`}>
			<text x={-8} y={0} textAnchor='end' fill='#2d2c42'>
				{numberFomat}
			</text>
		</g>
	);
}

BookTab.propTypes = {};

CustomizedAxisYTick.propTypes = {
	x: PropTypes.number,
	y: PropTypes.number,
	payload: PropTypes.object,
};

CustomizedAxisXTick.propTypes = {
	x: PropTypes.number,
	y: PropTypes.number,
	payload: PropTypes.object,
};

export default BookTab;
