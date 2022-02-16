import React from 'react';
import PropTypes from 'prop-types';
import Button from 'shared/button';
import FitlerOptions from 'shared/filter-options';
import { Add, Configure } from 'components/svg';
import './filter-quote-pane.scss';
import MultipleRadio from 'shared/multiple-radio';
import MultipleCheckbox from 'shared/multiple-checkbox';

const FilterQuotePane = ({ filterOptions, defaultOption, handleChangeOption, children }) => {
	const radioOptions = [
		{
			value: 'default',
			title: 'Quote nhiều like nhất',
		},
	];

	const checkOptions = [
		{
			value: 'newest',
			title: 'Mới nhất',
		},
		{
			value: 'oldest',
			title: 'Cũ nhất',
		},
	];

	return (
		<div className='filter-quote-pane'>
			<div className='filter-quote-pane__heading'>
				<Button className='filter-quote-pane__btn' varient='primary-light'>
					<Add className='filter-quote-pane__icon' /> Tạo Quotes
				</Button>
				<FitlerOptions
					list={filterOptions}
					defaultOption={defaultOption}
					handleChangeOption={handleChangeOption}
					name='filter-user'
					className='filter-quote-pane__options'
				/>
				<div className='filter-quote-pane__config dropdown'>
					<button
						className='filter-pane__btn dropdown-toggle'
						id='filterQuoteMenu'
						data-bs-toggle='dropdown'
						aria-expanded='false'
					>
						<Configure />
					</button>
					<div className='filter-quote-pane__setting dropdown-menu' aria-labelledby='filterQuoteMenu'>
						<div className='filter-quote-pane__setting__group'>
							<h6 className='filter-quote-pane__setting__title'>Mặc định</h6>
							<MultipleRadio list={radioOptions} name='quote-filter' value='default' />
						</div>
						<div className='filter-quote-pane__setting__group'>
							<h6 className='filter-quote-pane__setting__title'>Theo thời gian tạo</h6>
							<MultipleCheckbox list={checkOptions} name='quote-filter-default' value='newest' />
						</div>
						<Button className='filter-quote-pane__setting__btn'>Xác nhận</Button>
					</div>
				</div>
			</div>

			<div className='filter-quote-pane__content'>{children}</div>
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
