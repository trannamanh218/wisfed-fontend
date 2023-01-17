import { BackArrow, MoreIcon } from 'components/svg';
import React, { useRef, useState } from 'react';
import SearchField from 'shared/search-field';
import SelectBox from 'shared/select-box';
import './manage-join.scss';
import PropTypes from 'prop-types';

function ManageJoin({ handleChange }) {
	const [inputSearch, setInputSearch] = useState('');
	const listKindOfJoin = [
		{ value: '1 day', title: '1 ngày trước' },
		{ value: 'moment', title: 'Vừa xong' },
		{ value: '1 month', title: '1 Tháng trước' },
	];
	const timeToJoin = [
		{ value: '1 day', title: '1 ngày trước' },
		{ value: 'moment', title: 'Vừa xong' },
		{ value: '1 month', title: '1 Tháng trước' },
	];

	const timeJoinGroup = useRef({ value: 'default', title: 'Thời gian gửi yêu cầu' });
	const kindOfJoinRef = useRef({ value: 'default', title: 'Được mời' });

	const onchangeKindOfJoin = data => {
		kindOfJoinRef.current = data;
	};
	const onchangeTimeJoin = data => {
		timeJoinGroup.current = data;
	};
	return (
		<div className='manage-join__container'>
			<div className='manage-join__title'>
				<button onClick={() => handleChange('tabs')}>
					<BackArrow />
				</button>
				<h2>
					Yêu cầu làm thành viên (<span>99+</span>)
				</h2>
			</div>
			<hr />
			<div className='manage-join__content'>
				<div className='manage-join__content-button'>
					<SearchField
						placeholder='Tìm kiếm thành viên'
						value={inputSearch}
						handleChange={e => setInputSearch(e.target.value)}
					/>
					<div className='manage-join__content-select'>
						<SelectBox
							className='select-box-1'
							name='kindofgroup'
							list={timeToJoin}
							defaultOption={timeJoinGroup.current}
							onChangeOption={onchangeTimeJoin}
						/>
						<SelectBox
							className='select-box-2'
							name='kindofgroup'
							list={listKindOfJoin}
							defaultOption={kindOfJoinRef.current}
							onChangeOption={onchangeKindOfJoin}
						/>
					</div>
				</div>
				<div className='join-group__member'>
					<div className='member-item'>
						<div className='member-item__info'>
							<img
								src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
								alt='image'
							/>
							<div className='member-item__text'>
								<span>Hoàng Thiên Quân </span>
								<p>Vừa xong</p>
							</div>
						</div>

						<div>
							<button className='member-item__btn btn-folow'>Theo dõi</button>
							<button className='member-item__btn bnt-add-friend'>Xóa</button>
							<button className='more-icon-btn-group'>
								<MoreIcon />
							</button>
						</div>
					</div>
					<div className='member-item'>
						<div className='member-item__info'>
							<img
								src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
								alt='image'
							/>
							<div className='member-item__text'>
								<span>Hoàng Thiên Quân </span>
								<p>Vừa xong</p>
							</div>
						</div>

						<div>
							<button className='member-item__btn btn-folow'>Theo dõi</button>
							<button className='member-item__btn bnt-add-friend'>Xóa</button>
							<button className='more-icon-btn-group'>
								<MoreIcon />
							</button>
						</div>
					</div>
					<div className='member-item'>
						<div className='member-item__info'>
							<img
								src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
								alt='image'
							/>
							<div className='member-item__text'>
								<span>Hoàng Thiên Quân </span>
								<p>Vừa xong</p>
							</div>
						</div>

						<div>
							<button className='member-item__btn btn-folow'>Theo dõi</button>
							<button className='member-item__btn bnt-add-friend'>Xóa</button>
							<button className='more-icon-btn-group'>
								<MoreIcon />
							</button>
						</div>
					</div>
					<div className='member-item'>
						<div className='member-item__info'>
							<img
								src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
								alt='image'
							/>
							<div className='member-item__text'>
								<span>Hoàng Thiên Quân </span>
								<p>Vừa xong</p>
							</div>
						</div>

						<div>
							<button className='member-item__btn btn-folow'>Theo dõi</button>
							<button className='member-item__btn bnt-add-friend'>Xóa</button>
							<button className='more-icon-btn-group'>
								<MoreIcon />
							</button>
						</div>
					</div>
					<div className='member-item'>
						<div className='member-item__info'>
							<img
								src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
								alt='image'
							/>
							<div className='member-item__text'>
								<span>Hoàng Thiên Quân </span>
								<p>Vừa xong</p>
							</div>
						</div>

						<div>
							<button className='member-item__btn btn-folow'>Theo dõi</button>
							<button className='member-item__btn bnt-add-friend'>Xóa</button>
							<button className='more-icon-btn-group'>
								<MoreIcon />
							</button>
						</div>
					</div>
					<div className='member-item'>
						<div className='member-item__info'>
							<img
								src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
								alt='image'
							/>
							<div className='member-item__text'>
								<span>Hoàng Thiên Quân </span>
								<p>Vừa xong</p>
							</div>
						</div>

						<div>
							<button className='member-item__btn btn-folow'>Theo dõi</button>
							<button className='member-item__btn bnt-add-friend'>Xóa</button>
							<button className='more-icon-btn-group'>
								<MoreIcon />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

ManageJoin.propTypes = {
	handleChange: PropTypes.func,
};

export default ManageJoin;
