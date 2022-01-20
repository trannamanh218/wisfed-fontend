import React from 'react';
import PropsTypes from 'prop-types';
import DualColumn from 'shared/dual-column';
import './statistic-list.scss';

const StatisticList = props => {
	const { background, list, title, isBackground } = props;

	return (
		<div className='statistic'>
			<h4 className={`statistic-title ${isBackground ? 'custom' : ''}`}>{title}</h4>
			<DualColumn list={list} isBackground={isBackground} background={background} />
		</div>
	);
};

StatisticList.defaultProps = {
	list: [],
	background: 'light',
	title: 'Tên chủ đề',
};

StatisticList.propTypes = {
	list: PropsTypes.array,
	title: PropsTypes.string.isRequired,
	isBackground: PropsTypes.bool.isRequired,
	background: PropsTypes.oneOf([
		'primary',
		'primary-light',
		'primary-dark',
		'secondary',
		'success',
		'success-dark',
		'warning',
		'info',
		'light',
		'dark',
	]),
};
export default StatisticList;
