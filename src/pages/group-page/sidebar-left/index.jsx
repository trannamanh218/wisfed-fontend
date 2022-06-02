import { CircleActionsAlertQuestion, SettingIcon } from 'components/svg';
import React from 'react';
import './group-sibar.scss';
import PropTypes from 'prop-types';

const SidebarGroupLef = ({ handleChange, data }) => {
	const { groupType, description } = data;
	return (
		<div className='group-sibar-left__container'>
			<div className='group__manager'>
				<h3 className='group-sibar-left__title'>Quản lý nhóm</h3>
				<div className='group-sibar-left__description'>
					<div className='manage-item' onClick={() => handleChange('settingsQuestion')}>
						<span>
							<CircleActionsAlertQuestion /> Câu hỏi thành viên
						</span>
					</div>

					<span className='manage-item' onClick={() => handleChange('manageJoin')}>
						<p>99+</p> Yêu cầu làm thành viên
					</span>

					<span className='manage-item' onClick={() => handleChange('managePost')}>
						<p>99+</p> Bài viết đang chờ
					</span>

					<div className='manage-btn' onClick={() => handleChange('settings')}>
						<SettingIcon /> Cài đặt
					</div>
				</div>
			</div>
			<div className='group__intro'>
				<h3 className='group-sibar-left__title'>Giới thiệu</h3>
				<div className='group-sibar-left__description'>
					{/* <span>
					<img src='' alt='' /> Nhóm kín
				</span> */}
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Kiểu nội dung:</strong> {groupType}
						</span>
					</div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Giới thiệu:</strong> {description}
						</span>
					</div>
				</div>
			</div>

			<div className='group-sibar-left__btn'>
				<button>Xem thêm</button>
			</div>
			<div>
				<h3 className='group-sibar-left__title under-title'>Thành viên</h3>
				<div className='group-sibar-left__people'>
					<div className='group-sibar-left__people-admin'>
						<span>Quản trị viên</span>
						<div className='people-item'>
							<img
								src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
								alt=''
							/>
							<div className='people-item__text'>
								<span>Shadow</span>
								<div>02 bạn chung</div>
							</div>
						</div>
					</div>
					<div className='group-sibar-left__people-friends'>
						<span>Bạn bè</span>
						<div className='people-item'>
							<img
								src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
								alt=''
							/>
							<div className='people-item__text'>
								<span>Shadow</span>
								<div>02 bạn chung</div>
							</div>
						</div>
					</div>
					<div className='group-sibar-left__people-folowers'>
						<span>Người theo dõi</span>
						<div className='people-item'>
							<img
								src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
								alt=''
							/>
							<div className='people-item__text'>
								<span>Shadow</span>
								<div>02 bạn chung</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='group-sibar-left__btn'>
				<button>Xem tất cả</button>
			</div>
		</div>
	);
};

SidebarGroupLef.propTypes = {
	handleChange: PropTypes.func,
	data: PropTypes.object,
};

export default SidebarGroupLef;
