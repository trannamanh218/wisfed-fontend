import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import defaultAvatar from 'assets/images/Rectangle 17435.png';
import caretIcon from 'assets/images/caret.png';

const SidebarLeft = ({ listMyGroup, listAdminMyGroup }) => {
	let defaultItems = 3;
	let maxItems = 10;

	const [isExpandAdmin, setIsExpandAdmin] = useState(false);
	const [isExpandMyGroup, setIsExpandMyGroup] = useState(false);
	const [rows, setRows] = useState(defaultItems);
	const [rows1, setRows1] = useState(defaultItems);

	const handleViewMoreAdmin = () => {
		const lengthAdminMyGroup = listAdminMyGroup.length;
		let maxLength;
		if (lengthAdminMyGroup <= maxItems) {
			maxLength = lengthAdminMyGroup;
		} else {
			maxLength = maxItems;
		}
		const newRows = isExpandAdmin ? defaultItems : maxLength;
		setRows(newRows);
		setIsExpandAdmin(!isExpandAdmin);
	};

	const handleViewMoreMyGroup = () => {
		const lengthMyGroup = listMyGroup.length;
		let maxLength;
		if (lengthMyGroup <= maxItems) {
			maxLength = lengthMyGroup;
		} else {
			maxLength = maxItems;
		}
		const newRows = isExpandMyGroup ? defaultItems : maxLength;
		setRows1(newRows);
		setIsExpandMyGroup(!isExpandMyGroup);
	};

	return (
		<div>
			{listAdminMyGroup.length > 0 && (
				<>
					<div className='list-group__container'>
						<h3>Nhóm do bạn quản lý</h3>
						{listAdminMyGroup.slice(0, rows).map((item, index) => {
							return (
								<Link key={index} to={`/group/${item.id}`}>
									<div className='item-list-group'>
										<img
											src={item.avatar}
											onError={e => e.target.setAttribute('src', defaultAvatar)}
											alt='image'
										/>
										<div className='item-infor'>
											<span className='item-infor__name'>{item.name}</span>
											<div className='item-update'>
												<span>{item.countPost} Bài viết mới</span>
												<span>1 ngày trước</span>
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
					{listAdminMyGroup.length > defaultItems && (
						<button className='dualColumn-btn' onClick={handleViewMoreAdmin}>
							<img
								className={classNames('view-caret', { 'view-more': isExpandAdmin })}
								src={caretIcon}
								alt='caret-icon'
							/>
							<span>{isExpandAdmin ? 'Rút gọn' : 'Xem thêm'}</span>
						</button>
					)}
				</>
			)}

			{listMyGroup.length > 0 && (
				<div className='list-group__container your-join-group'>
					<h3>Nhóm bạn đã tham gia</h3>
					{listMyGroup.slice(0, rows1).map((item, index) => {
						return (
							<Link key={index} to={`/group/${item.id}`}>
								<div className='item-list-group'>
									<img
										src={item.avatar}
										onError={e => e.target.setAttribute('src', defaultAvatar)}
										alt='image'
									/>
									<div className='item-infor'>
										<span className='item-infor__name'>{item.name}</span>
										<div className='item-update'>
											<span>{item.countPost} Bài viết mới</span>
											<span>1 ngày trước</span>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
					{listMyGroup.length > defaultItems && (
						<button className='dualColumn-btn' onClick={handleViewMoreMyGroup}>
							<img
								className={classNames('view-caret', { 'view-more': isExpandMyGroup })}
								src={caretIcon}
								alt='caret-icon'
							/>
							<span>{isExpandMyGroup ? 'Rút gọn' : 'Xem thêm'}</span>
						</button>
					)}
				</div>
			)}
		</div>
	);
};

SidebarLeft.propTypes = {
	listMyGroup: PropTypes.array,
	listAdminMyGroup: PropTypes.array,
};

export default SidebarLeft;
