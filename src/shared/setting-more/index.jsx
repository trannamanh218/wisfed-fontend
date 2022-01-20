import React from 'react';
import { useVisible } from 'shared/hooks';
import SettingMoreList from 'shared/setting-more/components/SettingMoreList';
import './setting-more.scss';

const SettingMore = () => {
	const { ref, isVisible, setIsVisible } = useVisible(false);
	const handleClose = () => {
		setIsVisible(!isVisible);
	};

	return (
		<div className='setting-more' ref={ref}>
			<button className='setting-more__btn' onClick={handleClose}>
				<span className='setting-more__dot' />
				<span className='setting-more__dot' />
			</button>
			<SettingMoreList isVisible={isVisible} handleClose={handleClose} />
		</div>
	);
};

export default SettingMore;
