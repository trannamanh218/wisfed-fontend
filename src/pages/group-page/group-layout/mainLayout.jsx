import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Link } from 'react-router-dom';

const MainLayout = ({ listGroup }) => {
	return (
		<div className='list-group-container'>
			{listGroup.map(item => {
				return (
					<>
						<Link to={`/group/${item.id}`}>
							<div className='item-group'>
								<img src={item.avatar} alt='' />
								<div className='item-group__text'>
									<div className='item-group__name'>
										<span>{item.name}</span>
									</div>
									<div className='item-group__description'>
										<span>{item?.description?.length} thành viên</span>
									</div>
									<div className='item-group__count-post'>
										<span>{item.name.length} bài viết/ngày</span>
									</div>
									<div className='item-group-btn'>
										<button>Truy cập vào nhóm </button>
									</div>
								</div>
							</div>
						</Link>
					</>
				);
			})}
		</div>
	);
};

MainLayout.propTypes = {
	listGroup: PropTypes.func,
};

export default MainLayout;
