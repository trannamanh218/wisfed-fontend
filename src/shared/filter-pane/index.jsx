import { Configure } from 'components/svg';
import PropTypes from 'prop-types';
import React from 'react';
import './filter-pane.scss';

const FilterPane = ({ children, title, subtitle, onFilter }) => {
	return (
		<div className='filter-pane'>
			<div className='filter-pane__heading'>
				<h4 className='filter-pane__title'>
					{title}
					<span className='filter-pane__subtitle'>{subtitle}</span>
				</h4>
				<button className='filter-pane__btn' onClick={onFilter}>
					<Configure />
				</button>
			</div>
			<div className='filter-pane__content'>{children}</div>
		</div>
	);
};

FilterPane.defaultProps = {
	title: '',
	subtitle: '',
	onFilter: () => {},
};

FilterPane.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string,
	subtitle: PropTypes.string,
	onFilter: PropTypes.func,
};

export default FilterPane;
