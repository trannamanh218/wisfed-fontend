import React, { useEffect, useRef, useState } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { getGroupList } from 'reducers/redux-utils/group';
import { NotificationError } from 'helpers/Error';
import defaultAvatar from 'assets/images/Rectangle 17435.png';

const MainLayout = () => {
	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const callApiStart = useRef(9);
	const callApiPerPage = useRef(9);
	const dispatch = useDispatch();
	const groupList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};
			const data = await dispatch(getGroupList(params)).unwrap();
			if (data.rows.length) {
				if (data.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setList(list.concat(data.rows));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const listGroup = async () => {
		const actionGetList = await dispatch(getGroupList());
		setList(actionGetList.payload.rows);
	};

	useEffect(() => {
		listGroup();
	}, []);

	return (
		<>
			<>
				<h2 className='main__title'>Gợi ý nhóm</h2>
				{
					<InfiniteScroll
						dataLength={list.length}
						next={groupList}
						hasMore={hasMore}
						loader={<LoadingIndicator />}
					>
						<div className='list-group-container'>
							{list.map(item => {
								return (
									<>
										<Link to={`/group/${item.id}`}>
											<div className='item-group'>
												<img
													src={item.avatar}
													onError={e => e.target.setAttribute('src', defaultAvatar)}
													alt=''
												/>
												<div className='item-group__text'>
													<div className='item-group__name'>
														<span>{item.name}</span>
													</div>
													<div className='item-group__description'>
														<span>
															{item?.countMember < 10
																? `0${item.countMember}`
																: item.countMember}{' '}
															thành viên
														</span>
													</div>
													<div className='item-group__count-post'>
														<span>{item.countPost} bài viết/ngày</span>
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
					</InfiniteScroll>
				}
			</>
		</>
	);
};

MainLayout.propTypes = {};

export default MainLayout;
