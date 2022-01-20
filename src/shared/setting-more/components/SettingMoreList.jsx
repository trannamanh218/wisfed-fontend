import React from 'react';
import featherIcon from 'assets/images/feather.png';
import convertIcon from 'assets/images/convert.png';
import clockIcon from 'assets/images/clock.png';
import trashIcon from 'assets/images/trash.png';
import PropsTypes from 'prop-types';
import './setting-more-list.scss';

const SettingMoreList = ({ isVisible, handleClose }) => {
	const handleSetting = () => {
		handleClose();
	};

	if (isVisible) {
		return (
			<ul className='setting-more__list'>
				<li className='setting-more__item' onClick={handleSetting}>
					<img className='setting-more__icon' alt='icon' src={featherIcon} />
					<span className='setting-more__text'>Xem bài review</span>
				</li>
				<li className='setting-more__item' onClick={handleSetting}>
					<img className='setting-more__icon' alt='icon' src={convertIcon} />
					<span className='setting-more__text'>Chuyển tới giá sách khác</span>
				</li>
				<li className='setting-more__item' onClick={handleSetting}>
					<img className='setting-more__icon' alt='icon' src={clockIcon} />
					<span className='setting-more__text'>Lịch sử đọc</span>
				</li>
				<li className='setting-more__item' onClick={handleSetting}>
					<img className='setting-more__icon' alt='icon' src={trashIcon} />
					<span className='setting-more__text'>Xóa</span>
				</li>
			</ul>
		);
	}
	return null;
};

SettingMoreList.defaultProps = {
	isVisible: false,
	handleClose: () => {},
};

SettingMoreList.propTypes = {
	isVisible: PropsTypes.bool.isRequired,
	handleClose: PropsTypes.func,
};

export default SettingMoreList;
