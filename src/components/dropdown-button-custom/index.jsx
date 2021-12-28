import classNames from 'classnames';
import { BookIcon } from 'components/svg';
import React, { useState } from 'react';
import {useVisible} from 'shared/hooks';
import './dropdown-button-custom.scss';

const DropdownButtonCustom = () => {
	const { ref: showRef, isVisible: isShow, setIsVisible: setIsShow } = useVisible(false);
	const [currentStatus, setCurrentStatus] = useState({ 'title': 'Đang đọc', 'value': 'reading', 'icon': BookIcon });
	const settings = [
		{
			'title': 'Đang đọc',
			'value': 'reading',
			'icon': BookIcon,
		},
		{
			'title': 'Đã đọc',
			'value': 'readAlready',
		},
		{
			'title': 'Muốn đọc',
			'value': 'wantRead',
		},
	];

	const handleDropdown = () => {
		setIsShow(false);
	};
	return (
		<div className='dropdown--custom' ref={showRef} style={{['--color-fill']: 'primary' }} >
			<BookIcon className='dropdonw--custom__icon' fill='currentColor' />
			<button type='button' className='dropdown--custom__btn' onClick={() => setIsShow(!isShow)}>
				<span className={`dropdown ${isShow ? 'active-custom' : ''}`}>Đang đọc</span>
			</button>
			{isShow && (
				<ul className='dropdown--custom__list'>
					{settings.map(item => (
						<li key={item.title} className={classNames('dropdown--custom__item')} onClick={handleDropdown}>
							{item.title}
						</li>
					))}
				</ul>
			)}

			<span className='dropdown--custom__arrow' />
		</div>
	);
};

export default DropdownButtonCustom;
