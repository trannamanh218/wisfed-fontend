import dropdownIcon from 'assets/images/dropdown.png';
import classNames from 'classnames';
import { CheckIcon } from 'components/svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useVisible } from 'shared/hooks';
import './select-box.scss';

const SelectBox = ({ defaultOption, list, onChangeOption, name }) => {
	const { ref, isVisible, setIsVisible } = useVisible(false);
	const [activeItem, setActiveItem] = useState({ value: 1, title: 1 });

	useEffect(() => {
		setActiveItem(defaultOption);
	}, [defaultOption]);

	const handleSelect = item => {
		if (activeItem.value !== item.value && item.value !== null) {
			setActiveItem(item);
			onChangeOption(item);
		}

		setIsVisible(false);
	};

	const handleOpen = () => {
		setIsVisible(prev => !prev);
	};

	return (
		<div className='select-box' ref={ref}>
			<div className='select-box__btn' onClick={handleOpen}>
				<span className='select-box__value'>{activeItem.title}</span>
				<img className='select-box__icon' src={dropdownIcon} alt='dropdown' />
			</div>
			{isVisible && !_.isEmpty(list) && (
				<ul className='select-box__list'>
					{list.map(item => (
						<li
							className={classNames('select-box__item', { 'active': item.value === activeItem.value })}
							key={`${name}-${item.title}`}
							onClick={() => handleSelect(item)}
						>
							<span>{item.title}</span>
							{item.value === activeItem.value && (
								<span>
									<CheckIcon />
								</span>
							)}
						</li>
					))}
					{/* <li className='select-box__item active'>
						<span>1</span>
						<span>
							<CheckIcon />
						</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li>
					<li className='select-box__item'>
						<span>1</span>
					</li> */}
				</ul>
			)}
		</div>
	);
};

SelectBox.propTypes = {
	defaultOption: PropTypes.shape({
		value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
		title: PropTypes.string.isRequired,
	}),
	list: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
			title: PropTypes.string.isRequired,
		})
	),
	onChangeOption: PropTypes.func,
	name: PropTypes.string.isRequired,
};

export default SelectBox;
