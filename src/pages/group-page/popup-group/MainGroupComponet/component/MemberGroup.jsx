import { MoreIcon } from 'components/svg';
import React, { useEffect, useState } from 'react';
import './memmber-group.scss';
import PropTypes from 'prop-types';

function MemberGroup({ memberGroups }) {
	const [listAdmin, setListAdmin] = useState(null);
	const [listMember, setListMember] = useState(null);
	useEffect(() => {
		const newItem = memberGroups?.filter(item => item.role === 'admin');
		setListAdmin(newItem);
		const newListMember = memberGroups?.filter(item => item.role === 'member');
		setListMember(newListMember);
	}, [memberGroups]);

	return (
		<div className='member-group__container'>
			<div className='member-group__admin'>
				<h2>Quản trị viên và người kiểm duyệt</h2>
				<div className='member-item'>
					<div className='member-item__info'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<div className='member-item__text'>
							<span>Hoàng Thiên Quân (Quản trị viên)</span>
							<p>02 bạn chung</p>
						</div>
					</div>

					<div>
						<button className='member-item__btn btn-folow'>Theo dõi</button>
						<button className='member-item__btn bnt-add-friend'>+ Thêm bạn</button>
						<button className='more-icon-btn-group'>
							<MoreIcon />
						</button>
					</div>
				</div>
				<div className='member-item'>
					<div className='member-item__info'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<div className='member-item__text'>
							<span>Hoàng Thiên Quân (Người kiểm duyệt)</span>
							<p>02 bạn chung</p>
						</div>
					</div>

					<div>
						<button className='member-item__btn btn-folow'>Theo dõi</button>
						<button className='member-item__btn bnt-add-friend'>+ Thêm bạn</button>
						<button className='more-icon-btn-group'>
							<MoreIcon />
						</button>
					</div>
				</div>
				<hr />
			</div>

			<div className='member-group__friends'>
				<h2>Bạn bè</h2>
				<div className='member-item'>
					<div className='member-item__info'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<div className='member-item__text'>
							<span>Hoàng Thiên Quân </span>
							<p>02 bạn chung</p>
						</div>
					</div>

					<div>
						<button className='member-item__btn btn-folow'>Theo dõi</button>
						<button className='member-item__btn bnt-add-friend'>+ Thêm bạn</button>
						<button className='more-icon-btn-group'>
							<MoreIcon />
						</button>
					</div>
				</div>
				<div className='member-item'>
					<div className='member-item__info'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<div className='member-item__text'>
							<span>Hoàng Thiên Quân </span>
							<p>02 bạn chung</p>
						</div>
					</div>

					<div>
						<button className='member-item__btn btn-folow'>Theo dõi</button>
						<button className='member-item__btn bnt-add-friend'>+ Thêm bạn</button>
						<button className='more-icon-btn-group'>
							<MoreIcon />
						</button>
					</div>
				</div>
				<hr />
			</div>

			<div className='member-group__folower'>
				<h2>Người theo dõi</h2>
				<div className='member-item'>
					<div className='member-item__info'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<div className='member-item__text'>
							<span>Hoàng Thiên Quân </span>
							<p>02 bạn chung</p>
						</div>
					</div>

					<div>
						<button className='member-item__btn btn-folow'>Theo dõi</button>
						<button className='member-item__btn bnt-add-friend'>+ Thêm bạn</button>
						<button className='more-icon-btn-group'>
							<MoreIcon />
						</button>
					</div>
				</div>
				<div className='member-item'>
					<div className='member-item__info'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<div className='member-item__text'>
							<span>Hoàng Thiên Quân </span>
							<p>02 bạn chung</p>
						</div>
					</div>

					<div>
						<button className='member-item__btn btn-folow'>Theo dõi</button>
						<button className='member-item__btn bnt-add-friend'>+ Thêm bạn</button>
						<button className='more-icon-btn-group'>
							<MoreIcon />
						</button>
					</div>
				</div>
				<div className='view-member-all'>
					<button>Xem tất cả</button>
				</div>
				<hr />
			</div>

			<div className='member-group__all-member'>
				<h2>Tất cả mọi người</h2>
				<div className='member-item'>
					<div className='member-item__info'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<div className='member-item__text'>
							<span>Hoàng Thiên Quân </span>
							<p>02 bạn chung</p>
						</div>
					</div>

					<div>
						<button className='member-item__btn btn-folow'>Theo dõi</button>
						<button className='member-item__btn bnt-add-friend'>+ Thêm bạn</button>
						<button className='more-icon-btn-group'>
							<MoreIcon />
						</button>
					</div>
				</div>
				<div className='member-item'>
					<div className='member-item__info'>
						<img
							src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
							alt=''
						/>
						<div className='member-item__text'>
							<span>Hoàng Thiên Quân </span>
							<p>02 bạn chung</p>
						</div>
					</div>

					<div>
						<button className='member-item__btn btn-folow'>Theo dõi</button>
						<button className='member-item__btn bnt-add-friend'>+ Thêm bạn</button>
						<button className='more-icon-btn-group'>
							<MoreIcon />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

MemberGroup.propTypes = {
	memberGroups: PropTypes.array,
};

export default MemberGroup;
