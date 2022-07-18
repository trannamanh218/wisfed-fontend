import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Link } from 'react-router-dom';
import ResultNotFound from 'pages/result/component/result-not-found';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import defaultAvatar from 'assets/images/Rectangle 17435.png';
import { getFilterSearch } from 'reducers/redux-utils/search';
import LoadingIndicator from 'shared/loading-indicator';

const MainLayoutSearch = ({ valueGroupSearch }) => {
	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [value, setValue] = useState('');

	const getSearch = async () => {
		try {
			const params = {
				q: value,
				type: 'groups',
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};
			const data = await dispatch(getFilterSearch({ ...params })).unwrap();
			if (data.rows.length) {
				if (data.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setList(list.concat(data.rows));
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getSearchFirst = async () => {
		try {
			const params = {
				q: value,
				type: 'groups',
			};
			const data = await dispatch(getFilterSearch({ ...params })).unwrap();
			setList(data.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		setValue(valueGroupSearch);
	}, [valueGroupSearch]);

	console.log(list);

	useEffect(() => {
		getSearchFirst();
	}, [value]);
	useEffect(() => {
		if (list.length > 0) {
			setShow(false);
		} else {
			setTimeout(() => {
				setShow(true);
			}, 1000);
		}
	}, [list]);

	return (
		<>
			{list?.length < 1 ? (
				<>
					{show ? (
						<div style={{ marginTop: '54px', padding: '24px', transitionDelay: '1s' }}>
							<ResultNotFound />
						</div>
					) : (
						<LoadingIndicator />
					)}
				</>
			) : (
				<>
					{
						<InfiniteScroll dataLength={list.length} next={getSearch} hasMore={hasMore}>
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
			)}
		</>
	);
};

MainLayoutSearch.propTypes = {
	listGroup: PropTypes.array,
	valueGroupSearch: PropTypes.string,
};

export default MainLayoutSearch;
