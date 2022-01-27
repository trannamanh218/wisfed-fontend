import { Configure } from 'components/svg';
import PropTypes from 'prop-types';
import React from 'react';
import './filter-pane.scss';

const FilterPane = ({ children, title, subtitle }) => {
	return (
		<div className='filter-pane'>
			<div className='filter-pane__heading'>
				<h4 className='filter-pane__title'>
					{title}
					<span className='filter-pane__subtitle'>{subtitle}</span>
				</h4>
				<button className='filter-pane__btn'>
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
};

FilterPane.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string,
	subtitle: PropTypes.string,
};

export default FilterPane;
