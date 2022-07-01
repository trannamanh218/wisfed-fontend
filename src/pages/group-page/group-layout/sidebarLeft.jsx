import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import defaultAvatar from 'assets/images/Rectangle 17435.png';

const SidebarLeft = ({ listMyGroup, listAdminMyGroup }) => {
	return (
		<div>
			<div className='list-group__container'>
				<h3>Nhóm do bạn quản lý</h3>
				{listAdminMyGroup.map((item, index) => {
					return (
						<>
							{index < 3 && (
								<Link to={`/group/${item.id}`}>
									<div className='item-list-group'>
										<img
											src={item.avatar}
											onError={e => e.target.setAttribute('src', defaultAvatar)}
											alt=''
										/>
										<div className='item-infor'>
											<span className='item-infor__name'>{item.name}</span>
											<div className='item-update'>
												<span> {item.countPost} Bài viết mới</span> <span>-</span>{' '}
												<span>1 ngày trước</span>
											</div>
										</div>
									</div>
								</Link>
							)}
						</>
					);
				})}
			</div>
			<div className='list-group__container your-join-group'>
				<h3>Nhóm bạn đã tham gia</h3>
				{listMyGroup.map((item, index) => {
					return (
						<>
							{index < 3 && (
								<Link to={`/group/${item.id}`}>
									<div className='item-list-group'>
										<img
											src={item.avatar}
											onError={e => e.target.setAttribute('src', defaultAvatar)}
											alt=''
										/>
										<div className='item-infor'>
											<span className='item-infor__name'>{item.name}</span>
											<div className='item-update'>
												<span> {item.countPost} Bài viết mới</span> <span>-</span>{' '}
												<span>1 ngày trước</span>
											</div>
										</div>
									</div>
								</Link>
							)}
						</>
					);
				})}
			</div>
		</div>
	);
};

SidebarLeft.propTypes = {
	listMyGroup: PropTypes.array,
	listAdminMyGroup: PropTypes.array,
};

export default SidebarLeft;
