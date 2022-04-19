import React from 'react';
import './memmber-group.scss';

function MemberGroup() {
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
						<button> ++</button>
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
						<button> ++</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MemberGroup;
