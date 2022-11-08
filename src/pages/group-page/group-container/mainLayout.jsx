import { useEffect, useRef, useState } from 'react';
import './style.scss';
import { Link, useNavigate } from 'react-router-dom';
import ResultNotFound from 'pages/result/component/result-not-found';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { getGroupList, getRecommendGroup } from 'reducers/redux-utils/group';
import { NotificationError } from 'helpers/Error';
import defaultAvatar from 'assets/images/Rectangle 17435.png';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';

const MainLayout = ({ listMyGroup, listAdminMyGroup }) => {
	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);

	const callApiStart = useRef(9);
	const callApiPerPage = useRef(9);
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const resetGroupList = useSelector(state => state.group.resetGroupList);

	const userInfo = useSelector(state => state.auth.userInfo);

	const getGroupListFirstTime = async () => {
		setLoading(true);
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
		} finally {
			setLoading(false);
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

	const getGroupListFirstTimeNoUserInfo = async () => {
		setLoading(true);
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
		} finally {
			setLoading(false);
		}
	};

	const getGroupListNextTimesNoUserInfo = async () => {
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
		if (!_.isEmpty(userInfo)) {
			setHasMore(true);
			callApiStart.current = 9;
			getGroupListFirstTime();
		} else {
			setHasMore(true);
			callApiStart.current = 9;
			getGroupListFirstTimeNoUserInfo();
		}
	}, [resetGroupList, userInfo]);

	const handleUserLogin = item => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			navigate(`/group/${item.id}`);
		}
	};
	return (
		<>
			{loading ? (
				<LoadingIndicator />
			) : (
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
									next={
										!_.isEmpty(userInfo) ? getGroupListNextTimes : getGroupListNextTimesNoUserInfo
									}
									hasMore={hasMore}
									loader={<LoadingIndicator />}
								>
									<div
										className={
											listMyGroup.length > 0 || listAdminMyGroup.length > 0
												? 'list-group-container'
												: 'list-group-container--none'
										}
									>
										{list.map((item, index) => {
											return (
												<div
													key={index}
													className='item-group'
													onClick={() => handleUserLogin(item)}
												>
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
											);
										})}
									</div>
								</InfiniteScroll>
							}
						</>
					)}
				</>
			)}
		</>
	);
};

MainLayout.propTypes = {
	listMyGroup: PropTypes.array,
	listAdminMyGroup: PropTypes.array,
};

export default MainLayout;
