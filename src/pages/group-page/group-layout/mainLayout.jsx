import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Link } from 'react-router-dom';
import ResultNotFound from 'pages/result/component/result-not-found';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { getGroupList } from 'reducers/redux-utils/group';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import defaultAvatar from 'assets/images/Rectangle 17435.png';
import { useSelector } from 'react-redux';

const MainLayout = ({ filter }) => {
	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(9);
	const callApiPerPage = useRef(9);
	const dispatch = useDispatch();

	const resetGroupList = useSelector(state => state.group.resetGroupList);

	const getGroupListFirstTime = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
			};
			const data = await dispatch(getGroupList(params)).unwrap();
			if (!data.rows.length || data.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
			setList(data.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getGroupListNextTimes = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};
			const data = await dispatch(getGroupList(params)).unwrap();
			if (data.rows.length) {
				if (data.rows.length < callApiPerPage.current) {
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

	useEffect(() => {
		setHasMore(true);
		callApiStart.current = 9;
		getGroupListFirstTime();
	}, [resetGroupList]);

	return (
		<>
			{!list?.length && !_.isEmpty(filter) ? (
				<div style={{ marginTop: '54px', padding: '24px' }}>
					<ResultNotFound />
				</div>
			) : (
				<>
					{filter && <h2 className='main__title'>Gợi ý nhóm</h2>}
					{
						<InfiniteScroll
							dataLength={list.length}
							next={getGroupListNextTimes}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							<div className='list-group-container'>
								{list.map((item, index) => {
									return (
										<Link key={index} to={`/group/${item.id}`}>
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
									);
								})}
							</div>
						</InfiniteScroll>
					}
				</>
			)}
		</>
	);
};

MainLayout.propTypes = {
	listGroup: PropTypes.array,
	filter: PropTypes.bool,
};

export default MainLayout;
