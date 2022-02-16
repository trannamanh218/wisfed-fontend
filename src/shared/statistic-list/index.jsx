import React from 'react';
import PropTypes from 'prop-types';
import DualColumn from 'shared/dual-column';
import classNames from 'classnames';
import './statistic-list.scss';

const StatisticList = props => {
	const { background, list, title, isBackground, className } = props;

	return (
		<div className={classNames('statistic', { [`${className}`]: className })}>
			<h4 className={`statistic-title ${isBackground ? 'custom' : ''}`}>{title}</h4>
			<DualColumn list={list} isBackground={isBackground} background={background} />
		</div>
	);
};

StatisticList.defaultProps = {
	list: [],
	background: 'light',
	title: 'Tên chủ đề',
	className: '',
};

StatisticList.propTypes = {
	list: PropTypes.array,
	title: PropTypes.string.isRequired,
	isBackground: PropTypes.bool.isRequired,
	className: PropTypes.string,
	background: PropTypes.oneOf([
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
