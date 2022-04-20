import { CloseIconX, CloseX } from 'components/svg';
import React from 'react';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import './style.scss';

const PopupInviteFriend = ({ handleClose }) => {
	return (
		<div className='popup-invite-friend-container'>
			<div className='title-popup'>
				<button onClick={handleClose}>
					<CloseIconX />
				</button>
				<h3>Mời bạn bè tham gia nhóm</h3>
			</div>
			<hr />
			<div className='search-friend'>
				<SearchField />
				<button>Xong</button>
			</div>

			<div className='main-action'>
				<div className='list-friend'>
					<h4>Danh sách bạn bè</h4>
					<div className='friend-item'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<label htmlFor='1'>Hoàng Thiên Quân</label>
						<input type='checkbox' id='1' />
					</div>
					<div className='friend-item'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<label htmlFor='3'>Hoàng Thiên Quân</label>
						<input type='checkbox' id='3' />
					</div>
					<div className='friend-item'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<label htmlFor='2'>Hoàng Thiên Quân</label>
						<input type='checkbox' id='2' />
					</div>
				</div>
				<div className='list-friend-select'>
					<h4>Danh sách đã chọn</h4>
					<div className='friend-item'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<span>Hoàng Thiên Quân</span>
						<button>
							<CloseX />
						</button>
					</div>
					<div className='friend-item'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<span>Hoàng Thiên Quân</span>
						<button>
							<CloseX />
						</button>
					</div>
					<div className='friend-item'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<span>Hoàng Thiên Quân</span>
						<button>
							<CloseX />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

PopupInviteFriend.propTypes = {
	handleClose: PropTypes.func,
};

export default PopupInviteFriend;
