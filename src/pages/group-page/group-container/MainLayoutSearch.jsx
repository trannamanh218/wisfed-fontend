import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Link, useLocation } from 'react-router-dom';
import ResultNotFound from 'pages/result/component/result-not-found';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import defaultAvatar from 'assets/images/Rectangle 17435.png';
import { getFilterSearch } from 'reducers/redux-utils/search';
import LoadingIndicator from 'shared/loading-indicator';
import { getMyGroup } from 'reducers/redux-utils/group';

const MainLayoutSearch = ({ valueGroupSearch, filterSearch }) => {
	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const callApiStart = useRef(8);
	const callApiPerPage = useRef(8);
	const dispatch = useDispatch();
	const [isFetching, setIsFetching] = useState(false);

	const location = useLocation();

	const getSearch = async () => {
		if (location.pathname.includes('my-group')) {
			setIsFetching(true);
			try {
				const params = {
					start: callApiStart.current,
					limit: callApiPerPage.current,
					filter: filterSearch,
				};
				const res = await dispatch(getMyGroup(params)).unwrap();
				if (res.data.length) {
					if (res.data.length < callApiPerPage.current) {
						setHasMore(false);
					} else {
						callApiStart.current += callApiPerPage.current;
					}
					setList(list.concat(res.data));
				}
			} catch (err) {
				NotificationError(err);
			} finally {
				setIsFetching(false);
			}
		} else {
			setIsFetching(true);
			try {
				const params = {
					q: valueGroupSearch,
					type: 'groups',
					start: callApiStart.current,
					limit: callApiPerPage.current,
				};
				const data = await dispatch(getFilterSearch({ ...params })).unwrap();
				if (data.rows.length) {
					if (data.rows.length < callApiPerPage.current) {
						setHasMore(false);
					} else {
						callApiStart.current += callApiPerPage.current;
					}
					setList(list.concat(data.rows));
				}
			} catch (err) {
				NotificationError(err);
			} finally {
				setIsFetching(false);
			}
		}
	};

	const getGroupsFirstTime = async () => {
		if (location.pathname.includes('/my-group')) {
			setIsFetching(true);
			try {
				const params = {
					start: 0,
					limit: callApiPerPage.current,
					filter: filterSearch,
				};
				const res = await dispatch(getMyGroup(params)).unwrap();
				setList(res.data);
				if (!res.data.length || res.data.length < callApiPerPage.current) {
					setHasMore(false);
				}
			} catch (err) {
				NotificationError(err);
			} finally {
				setIsFetching(false);
			}
		} else {
			setIsFetching(true);
			try {
				const params = {
					q: valueGroupSearch,
					type: 'groups',
					start: 0,
					limit: callApiPerPage.current,
				};
				const data = await dispatch(getFilterSearch(params)).unwrap();
				setList(data.rows);
				if (!data.rows.length || data.rows.length < callApiPerPage.current) {
					setHasMore(false);
				}
			} catch (err) {
				NotificationError(err);
			} finally {
				setIsFetching(false);
			}
		}
	};

	useEffect(() => {
		getGroupsFirstTime();
	}, [valueGroupSearch]);

	return (
		<>
			{isFetching ? (
				<LoadingIndicator />
			) : (
				<>
					{!list.length ? (
						<div style={{ marginTop: '54px', padding: '24px' }}>
							<ResultNotFound />
						</div>
					) : (
						<InfiniteScroll dataLength={list.length} next={getSearch} hasMore={hasMore}>
							<div className='list-group-container'>
								{list.map((item, index) => {
									return (
										<div className='item-group' key={index}>
											<Link key={index} to={`/group/${item.id}`}>
												<img
													src={item.avatar}
													onError={e => e.target.setAttribute('src', defaultAvatar)}
													alt=''
												/>
											</Link>
											<div className='item-group__text'>
												<div className='item-group__name' title={item.name}>
													{item.name}
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
													<Link key={index} to={`/group/${item.id}`}>
														<button>Truy cập vào nhóm </button>
													</Link>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</InfiniteScroll>
					)}
				</>
			)}
		</>
	);
};

MainLayoutSearch.propTypes = {
	valueGroupSearch: PropTypes.string,
	filterSearch: PropTypes.array,
};

export default MainLayoutSearch;
