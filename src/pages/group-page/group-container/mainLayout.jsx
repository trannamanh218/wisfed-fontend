import { useEffect, useRef, useState } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import ResultNotFound from 'pages/result/component/result-not-found';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { getRecommendGroup } from 'reducers/redux-utils/group';
import { NotificationError } from 'helpers/Error';
import defaultAvatar from 'assets/images/Rectangle 17435.png';
import { useSelector } from 'react-redux';

const MainLayout = () => {
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
			const data = await dispatch(getRecommendGroup(params)).unwrap();
			if (!data.length || data.length < callApiPerPage.current) {
				setHasMore(false);
			}
			setList(data);
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
			const data = await dispatch(getRecommendGroup(params)).unwrap();
			if (data.length) {
				if (data.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setList(list.concat(data));
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
			{!list.length ? (
				<div style={{ marginTop: '54px', padding: '24px' }}>
					<ResultNotFound />
				</div>
			) : (
				<>
					<h2 className='main__title'>Gợi ý nhóm</h2>
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

export default MainLayout;
