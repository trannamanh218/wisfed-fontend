import classNames from 'classnames';
import { CircleCheckIcon } from 'components/svg';
import WrapIcon from 'components/wrap-icon';
import React, { useState } from 'react';
import { useVisible } from 'shared/hooks';
import { readingStatus } from 'constants';
import './dropdown-status-book.scss';

const DropdownIconButton = () => {
	const { ref: showRef, isVisible: isShow, setIsVisible: setIsShow } = useVisible(false);
	const [currentStatus, setCurrentStatus] = useState({
		'title': 'Đã đọc',
		'value': 'readAlready',
		'icon': CircleCheckIcon,
	});

	const handleDropdown = item => {
		setIsShow(false);
		setCurrentStatus(item);
	};

	const renderReadingStatus = () => {
		return (
			<ul className='dropdown--custom__list'>
				{readingStatus.map(item => {
					if (item.value !== currentStatus.value) {
						return (
							<li
								key={item.title}
								className={classNames('dropdown--custom__item opacity-primary')}
								onClick={() => handleDropdown(item)}
								data-tesid='dropdown--custom__item'
							>
								<WrapIcon component={item.icon} />
								<span> {item.title}</span>
							</li>
						);
					}
					return null;
				})}
			</ul>
		);
	};

	return (
		<div className='dropdown--custom btn-primary dropdown--custom--book' ref={showRef}>
			<WrapIcon component={currentStatus.icon} className='dropdonw--custom__icon' />
			<button type='button' className='dropdown--custom__btn' onClick={() => setIsShow(!isShow)}>
				<span className={`dropdown ${isShow ? 'active-custom' : ''}`}>{currentStatus.title}</span>
			</button>
			{isShow && renderReadingStatus()}
			<span className='dropdown--custom__arrow' />
		</div>
	);
};

export default DropdownIconButton;
