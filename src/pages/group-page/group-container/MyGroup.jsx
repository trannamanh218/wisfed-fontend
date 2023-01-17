import Layout from 'components/layout';
import GroupPageLayout from 'components/layout/group-layout';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getMyAdminGroup, getMyGroup } from 'reducers/redux-utils/group';
import { useVisible } from 'shared/hooks';
import { SearchGroup } from '.';
import PopupCreateGroup from '../PopupCreateGroup';
import './style.scss';
import defaultAvatar from 'assets/images/Rectangle 17435.png';
import { Link } from 'react-router-dom';
import MainLayoutSearch from './MainLayoutSearch';
import { useRef } from 'react';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';

function MyGroup() {
	const [adminGroup, setAdminGroup] = useState([]);
	const [myGroup, setMyGroup] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [inputSearchValue, setInputSearchValue] = useState('');
	const [valueGroupSearch, setValueGroupSearch] = useState('');
	const [show, setShow] = useState(false);
	const [filterSearch, setFilterSearch] = useState();

	const userInfo = useSelector(state => state.auth.userInfo);
	const resetGroupList = useSelector(state => state.group.resetGroupList);

	const dispatch = useDispatch();
	const callApiStart = useRef(8);
	const callApiPerPage = useRef(8);
	const { ref: showRef } = useVisible(false);

	useEffect(() => {
		setHasMore(true);
		listAdminMyGroup();
		listMyGroup();
	}, [resetGroupList]);

	const listAdminMyGroup = async () => {
		try {
			const actionlistAdminMyGroup = await dispatch(getMyAdminGroup()).unwrap();
			setAdminGroup(actionlistAdminMyGroup.data);
		} catch (error) {
			NotificationError(error);
		}
	};

	const listMyGroup = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
			};
			const actionListMyGroup = await dispatch(getMyGroup(params)).unwrap();
			if (!actionListMyGroup.data.length || actionListMyGroup.data.length < callApiPerPage.current) {
				setHasMore(false);
			}
			setMyGroup(actionListMyGroup.data);
		} catch (error) {
			NotificationError(error);
		}
	};

	const getGroupListNextTimes = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};
			const actionListMyGroup = await dispatch(getMyGroup(params)).unwrap();
			if (actionListMyGroup.data.length) {
				if (actionListMyGroup.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setMyGroup(myGroup.concat(actionListMyGroup.data));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleChange = e => {
		setInputSearchValue(e.target.value);
		debounceSearch(e.target.value);
		updateFilter(e.target.value);
	};

	const updateInputSearch = value => {
		const filterValue = value.toLowerCase().trim();
		setValueGroupSearch(filterValue);
	};

	const updateFilter = value => {
		if (value) {
			const filterValue = [[{ 'operator': 'search', 'value': value.trim(), 'property': 'name' }]];
			setFilterSearch(filterValue);
		} else {
			setFilterSearch([]);
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	const handleCloseModal = () => setShow(false);

	return (
		<Layout>
			<div className='groups-container'>
				{!valueGroupSearch.trim().length ? (
					<GroupPageLayout
						sub={
							<SearchGroup
								title='Nhóm của tôi'
								handleChange={handleChange}
								valueInput={inputSearchValue}
								handleShowModal={() => setShow(true)}
							/>
						}
						main={
							<>
								{!_.isEmpty(userInfo) && (
									<>
										{adminGroup.length > 0 && (
											<div>
												<h2
													className='main__title'
													style={{ marginBottom: '20px', fontSize: '20px' }}
												>
													Nhóm do bạn quản lý
												</h2>
												<div className='list-group-container--none'>
													{adminGroup.map((item, index) => {
														return (
															<div className='item-group' key={index}>
																<Link key={index} to={`/group/${item.id}`}>
																	<img
																		src={item.avatar}
																		onError={e =>
																			e.target.setAttribute('src', defaultAvatar)
																		}
																		alt='image'
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
																	<Link
																		key={index}
																		className='item-group-btn'
																		to={`/group/${item.id}`}
																	>
																		Truy cập vào nhóm
																	</Link>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										)}

										{myGroup.length > 0 && (
											<div>
												<h2
													className='main__title'
													style={{ marginBottom: '20px', fontSize: '20px' }}
												>
													Nhóm bạn đã tham gia
												</h2>
												<InfiniteScroll
													dataLength={myGroup.length}
													next={getGroupListNextTimes}
													hasMore={hasMore}
													loader={<LoadingIndicator />}
												>
													<div className='list-group-container--none'>
														{myGroup.map((item, index) => {
															return (
																<div className='item-group' key={index}>
																	<Link key={index} to={`/group/${item.id}`}>
																		<img
																			src={item.avatar}
																			onError={e =>
																				e.target.setAttribute(
																					'src',
																					defaultAvatar
																				)
																			}
																			alt='image'
																		/>
																	</Link>
																	<div className='item-group__text'>
																		<div
																			className='item-group__name'
																			title={item.name}
																		>
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
																		<Link
																			key={index}
																			className='item-group-btn'
																			to={`/group/${item.id}`}
																		>
																			Truy cập vào nhóm
																		</Link>
																	</div>
																</div>
															);
														})}
													</div>
												</InfiniteScroll>
											</div>
										)}
									</>
								)}
							</>
						}
					/>
				) : (
					<div className='result-search'>
						<GroupPageLayout
							sub={
								<SearchGroup
									title='Nhóm của tôi'
									handleChange={handleChange}
									valueInput={inputSearchValue}
									handleShowModal={() => setShow(true)}
								/>
							}
							main={<MainLayoutSearch valueGroupSearch={valueGroupSearch} filterSearch={filterSearch} />}
						/>
					</div>
				)}
				<Modal className='create-group-modal' show={show} onHide={handleCloseModal}>
					<Modal.Body>
						<PopupCreateGroup
							handleClose={handleCloseModal}
							showRef={showRef}
							handleRefreshData={() => {
								listAdminMyGroup();
								listMyGroup();
							}}
						/>
					</Modal.Body>
				</Modal>
			</div>
		</Layout>
	);
}

export default MyGroup;
