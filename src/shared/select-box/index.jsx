import dropdownIcon from 'assets/images/dropdown.png';
import classNames from 'classnames';
import { CheckIcon } from 'components/svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useVisible } from 'shared/hooks';
import './select-box.scss';

const SelectBox = ({ defaultOption, list, onChangeOption, name, className }) => {
	const { ref, isVisible, setIsVisible } = useVisible(false);
	const [activeItem, setActiveItem] = useState(defaultOption);

	useEffect(() => {
		setActiveItem(defaultOption);
	}, [defaultOption]);

	const handleSelect = item => {
		if (
			(activeItem.value !== item.value && item.value !== null) ||
			(activeItem.id !== item.id && item.id !== null)
		) {
			setActiveItem(item);
			onChangeOption(item);
		}

		setIsVisible(false);
	};

	const handleOpen = () => {
		setIsVisible(prev => !prev);
	};

	const isActive = item => {
		return (item.value && item.value === activeItem.value) || (item.id && item.id === activeItem.id);
	};

	return (
		<div className={`select-box ${className ? className : ''}`} ref={ref}>
			<div className='select-box__btn' onClick={handleOpen}>
				<span className='select-box__value'>
					{activeItem.img ? activeItem.img : ''}
					{activeItem.title || activeItem.name}
				</span>
				<img className='select-box__icon' src={dropdownIcon} alt='dropdown' />
			</div>
			{isVisible && !_.isEmpty(list) && (
				<ul className='select-box__list'>
					{list.map((item, index) => {
						return (
							<li
								className={classNames('select-box__item', {
									'active': isActive(item),
								})}
								key={`${name}-${index}`}
								onClick={() => handleSelect(item)}
							>
								<span>
									{item.img ? item.img : ''} {item.title || item.name}
								</span>
								{isActive(item) && (
									<span>
										<CheckIcon />
									</span>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

SelectBox.propTypes = {
	defaultOption: PropTypes.shape({
		value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		title: PropTypes.string,
	}),
	list: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
			title: PropTypes.string,
			img: PropTypes.string,
		})
	),
	onChangeOption: PropTypes.func,
	name: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default SelectBox;
