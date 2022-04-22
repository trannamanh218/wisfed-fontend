import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import SelectBox from 'shared/select-box';
import caretChart from 'assets/images/caret-chart.png';
import './book-tab.scss';
import { getChartsByid } from 'reducers/redux-utils/chart';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';

const BookTab = () => {
	const [currentOption, setCurrentOption] = useState({ value: 'month', title: 'Tháng' });
	const [chartsData, setChartsData] = useState([]);
	const dispatch = useDispatch();
	const options = [
		{ value: 'month', title: 'Tháng' },
		{ value: 'year', title: 'Năm' },
	];
	const { userId } = useParams();
	const fetchData = async () => {
		try {
			if (currentOption.value === 'month') {
				const params = {
					count: 'book',
					by: 'month',
					userId: userId,
				};
				const data = await dispatch(getChartsByid(params)).unwrap();
				setChartsData(data);
			} else {
				const params = {
					count: 'book',
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

			<button className='btn reading-summary-book-tab__btn'>Chia sẻ</button>
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

function CustomizedAxisYTick(props) {
	const { x, y, payload } = props;
	return (
		<g transform={`translate(${x},${y})`}>
			<text x={-8} y={0} textAnchor='end' fill='#2d2c42'>
				{payload.value.toFixed()}
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
