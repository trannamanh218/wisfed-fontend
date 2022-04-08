import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import SelectBox from 'shared/select-box';
import caretChart from 'assets/images/caret-chart.png';
import './book-tab.scss';

const BookTab = () => {
	const [currentOption, setCurrentOption] = useState({ value: 'month', title: 'Tháng' });

	const options = [
		{ value: 'month', title: 'Tháng' },
		{ value: 'year', title: 'Năm' },
	];

	const data = [
		{
			monthNumber: 'T1',
			numberOfBooks: 2400,
			color: '#FEC5BB',
		},
		{
			monthNumber: 'T2',
			numberOfBooks: 1398,
		},
		{
			monthNumber: 'T3',
			numberOfBooks: 9800,
		},
		{
			monthNumber: 'T4',
			numberOfBooks: 3908,
		},

		{
			monthNumber: 'T5',
			numberOfBooks: 3800,
		},
		{
			monthNumber: 'T6',
			numberOfBooks: 4300,
		},
		{
			monthNumber: 'T7',
			numberOfBooks: 4300,
		},
		{
			monthNumber: 'T8',
			numberOfBooks: 4300,
		},
		{
			monthNumber: 'T9',
			numberOfBooks: 4300,
		},
		{
			monthNumber: 'T10',
			numberOfBooks: 4300,
		},
		{
			monthNumber: 'T11',
			numberOfBooks: 4800,
		},
		{
			monthNumber: 'T12',
			numberOfBooks: 4300,
		},
	];

	const onChangeOption = item => {
		setCurrentOption(item);
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
					data={data}
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
						dataKey='monthNumber'
						tick={<CustomizedAxisXTick />}
						strokeDasharray='5 5'
						strokeWidth={3}
						padding={{ right: 40 }}
					></XAxis>
					<YAxis
						label={{ value: 'Số sách', position: 'top', offset: 30 }}
						tick={<CustomizedAxisYTick />}
						allowDataOverflow={true}
						domain={[0, 'dataMax + 1000']}
						strokeDasharray='5 5'
						strokeWidth={3}
						stroke='#6e7191'
					></YAxis>
					<Tooltip cursor={false} />
					<Legend wrapperStyle={{ top: 460, left: 30 }} />
					<Bar dataKey='numberOfBooks' fill='#9ad0f5' name='Tháng' />
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
				{payload.value}
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
