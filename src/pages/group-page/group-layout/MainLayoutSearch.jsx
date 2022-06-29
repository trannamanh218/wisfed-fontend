import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Link } from 'react-router-dom';
import ResultNotFound from 'pages/result/component/result-not-found';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { getFillterGroup, getGroupList } from 'reducers/redux-utils/group';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import defaultAvatar from 'assets/images/Rectangle 17435.png';
import { getFilterSearch } from 'reducers/redux-utils/search';

const MainLayoutSearch = ({ valueGroupSearch }) => {
	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(8);
	const dispatch = useDispatch();

	const getSearch = async () => {
		try {
			const params = {
				q: valueGroupSearch,
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
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};
	useEffect(() => {
		getSearch();
	}, [valueGroupSearch]);
	return (
		<>
			{list?.length < 1 && !_.isEmpty(valueGroupSearch) ? (
				<div style={{ marginTop: '54px', padding: '24px' }}>
					<ResultNotFound />
				</div>
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
