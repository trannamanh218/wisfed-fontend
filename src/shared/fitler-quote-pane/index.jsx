import React from 'react';
import PropTypes from 'prop-types';
import Button from 'shared/button';
import FitlerOptions from 'shared/filter-options';
import { Configure } from 'components/svg';
import './filter-quote-pane.scss';

const FilterQuotePane = ({ filterOptions, defaultOption, handleChangeOption, children }) => {
	return (
		<div className='filter-quote-pane'>
			<Button>+ Tạo Quotes</Button>
			<FitlerOptions
				list={filterOptions}
				defaultOption={defaultOption}
				handleChangeOption={handleChangeOption}
				name='filter-user'
				className='filter-quote-pane__options'
			/>
			<button className='filter-pane__btn'>
				<Configure />
			</button>

			<div className='filter-pane__content'>{children}</div>
		</div>
	);
};

FilterQuotePane.propTypes = {
	filterOptions: PropTypes.array,
	defaultOption: PropTypes.object,
	handleChangeOption: PropTypes.func,
	children: PropTypes.any,
};

export default FilterQuotePane;
