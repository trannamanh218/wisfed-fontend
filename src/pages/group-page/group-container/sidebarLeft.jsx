import defaultAvatar from 'assets/images/Rectangle 17435.png';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SidebarLeft = ({ listMyGroup, listAdminMyGroup }) => {
	const defaultItems = 3;

	return (
		<>
			{listAdminMyGroup.length > 0 && (
				<div className='list-group__container'>
					<h3>Nhóm do bạn quản lý</h3>
					{listAdminMyGroup.slice(0, defaultItems).map((item, index) => {
						return (
							<Link key={index} to={`/group/${item.id}`}>
								<div className='item-list-group'>
									<img
										src={item.avatar}
										onError={e => e.target.setAttribute('src', defaultAvatar)}
										alt='image'
									/>
									<div className='item-infor'>
										<span className='item-infor__name' title={item.name}>
											{item.name}
										</span>
										<div className='item-update'>
											<span>{item.countPost} Bài viết mới</span>
											<span className='item-update__dash'>-</span>
											<span>1 ngày trước</span>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
					{listAdminMyGroup.length > defaultItems && (
						<Link className='sidebar__view-more-btn--blue' to='/my-group'>
							Xem thêm
						</Link>
					)}
				</div>
			)}

			{listMyGroup.length > 0 && (
				<div className='list-group__container your-join-group'>
					<h3>Nhóm bạn đã tham gia</h3>
					{listMyGroup.slice(0, defaultItems).map((item, index) => {
						return (
							<Link key={index} to={`/group/${item.id}`}>
								<div className='item-list-group'>
									<img
										src={item.avatar}
										onError={e => e.target.setAttribute('src', defaultAvatar)}
										alt='image'
									/>
									<div className='item-infor'>
										<span className='item-infor__name' title={item.name}>
											{item.name}
										</span>
										<div className='item-update'>
											<span>{item.countPost} Bài viết mới</span>
											<span className='item-update__dash'>-</span>
											<span>1 ngày trước</span>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
					{listMyGroup.length > defaultItems && (
						<Link className='sidebar__view-more-btn--blue' to='/my-group'>
							Xem thêm
						</Link>
					)}
				</div>
			)}
		</>
	);
};

SidebarLeft.propTypes = {
	listMyGroup: PropTypes.array,
	listAdminMyGroup: PropTypes.array,
};

export default SidebarLeft;
