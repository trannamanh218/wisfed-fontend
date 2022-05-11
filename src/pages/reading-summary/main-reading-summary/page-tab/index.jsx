import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import SelectBox from 'shared/select-box';
import caretChart from 'assets/images/caret-chart.png';
import './page-tab.scss';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';
import { getChartsByid, updateImg } from 'reducers/redux-utils/chart';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';
import { useCurrentPng } from 'recharts-to-png';

const PageTab = () => {
	const [currentOption, setCurrentOption] = useState({ value: 'month', title: 'Tháng' });
	const [loading, setLoading] = useState(false);
	const { userId } = useParams();
	const [chartsData, setChartsData] = useState([]);
	const dispatch = useDispatch();
	const [getAreaPng, { ref: areaRef }] = useCurrentPng();
	const navigate = useNavigate();
	const options = [
		{ value: 'month', title: 'Tháng' },
		{ value: 'year', title: 'Năm' },
	];

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

	function CustomTooltip(props) {
		const { label, payload } = props;
		return (
			<div className='custom-tooltip'>
				<p className='label'>{` ${currentOption.value === 'month' ? 'Tháng' : 'Năm'} ${label} : Đã đọc ${
					payload[0]?.payload.count
				} trang`}</p>
			</div>
		);
	}

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
		<div className='reading-summary-page-tab'>
			<Circle loading={loading} />
			<SelectBox
				className='select-box--custom'
				name='library'
				list={options}
				defaultOption={currentOption}
				onChangeOption={onChangeOption}
			/>

			<div className='reading-summary-page-tab__chart-wrapper'>
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
						label={{ value: 'Số trang', position: 'top', offset: 30 }}
						tick={<CustomizedAxisYTick />}
						allowDataOverflow={true}
						domain={[0, 'auto']}
						strokeDasharray='5 5'
						tickCount={10}
						strokeWidth={3}
						stroke='#6e7191'
					></YAxis>
					<Tooltip cursor={false} content={<CustomTooltip />} />
					<Legend wrapperStyle={{ top: 460, left: 30 }} />
					<Bar dataKey='count' fill='#9ad0f5' name={currentOption.value === 'month' ? 'Tháng' : 'Năm'} />
				</BarChart>
			</div>

			<button className='btn reading-summary-page-tab__btn' onClick={handleAreaDownload}>
				Chia sẻ
			</button>
		</div>
	);
};

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

function formatNumber(number) {
	return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function CustomizedAxisYTick(props) {
	const { x, y, payload } = props;
	const numberFomat = formatNumber(payload.value);
	return (
		<g transform={`translate(${x},${y})`}>
			<text x={-8} y={0} textAnchor='end' fill='#2d2c42'>
				{numberFomat}
			</text>
		</g>
	);
}

PageTab.propTypes = {};
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

export default PageTab;
