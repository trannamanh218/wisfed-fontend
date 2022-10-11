import { useFetchGroups } from 'api/group.hooks';
import bookIcon from 'assets/icons/book.svg';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyGroup } from 'reducers/redux-utils/group';

function GroupShortcuts() {
	const [viewMoreGroupsStatus, setViewMoreGroupsStatus] = useState(false);
	const [myGroup, setMyGroup] = useState([]);

	const callApiPerPage = useRef(10);

	const {
		groups: { rows = [] },
	} = useFetchGroups();

	const dispatch = useDispatch();

	const userInfo = useSelector(state => state.auth.userInfo);

	const listMyGroup = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
			};
			const actionListMyGroup = await dispatch(getMyGroup(params)).unwrap();

			setMyGroup(actionListMyGroup.data);
		} catch (error) {
			NotificationError(error);
		}
	};

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			listMyGroup();
		}
	}, [userInfo]);

	return (
		<>
			<div className='sidebar__block'>
				<h4 className='sidebar__block__title'>Lối tắt nhóm</h4>
				<div className='sidebar__block__content'>
					<div
						className={
							'group-short-cut__items-box ' + `${viewMoreGroupsStatus ? 'view-more' : 'view-less'}`
						}
					>
						{!_.isEmpty(userInfo) ? (
							<>
								{!_.isEmpty(myGroup) ? (
									myGroup.map((item, index) => (
										<div key={index}>
											<Link to={`/group/${item.id}`}>
												<div className='group-short-cut__item'>
													<div className='group-short-cut__item__logo'>
														<img
															src={item.avatar}
															alt='group'
															onError={e => e.target.setAttribute('src', `${bookIcon}`)}
														/>
													</div>
													<div className='group-short-cut__item__name'>{item.name}</div>
												</div>
											</Link>
										</div>
									))
								) : (
									<p className='blank-content'>Không có dữ liệu</p>
								)}
							</>
						) : (
							<>
								{!_.isEmpty(rows) ? (
									rows.map((item, index) => (
										<div key={index}>
											<Link to={`/group/${item.id}`}>
												<div className='group-short-cut__item'>
													<div className='group-short-cut__item__logo'>
														<img
															src={item.avatar}
															alt='group'
															onError={e => e.target.setAttribute('src', `${bookIcon}`)}
														/>
													</div>
													<div className='group-short-cut__item__name'>{item.name}</div>
												</div>
											</Link>
										</div>
									))
								) : (
									<p className='blank-content'>Không có dữ liệu</p>
								)}
							</>
						)}
					</div>
					{!_.isEmpty(userInfo) ? (
						<>
							{myGroup.length > 6 && (
								<button
									className='group-short-cut__view-more'
									onClick={() => setViewMoreGroupsStatus(!viewMoreGroupsStatus)}
									style={{ marginTop: '20px' }}
								>
									<i
										data-testid='view-more-view-less-chevron'
										className={
											'fas fa-chevron-down group-short-cut__view-more__icon ' +
											`${viewMoreGroupsStatus ? 'view-more' : 'view-less'}`
										}
									></i>
									<span className='sidebar__view-more-btn--black'>
										{viewMoreGroupsStatus ? 'Thu nhỏ' : 'Xem thêm'}
									</span>
								</button>
							)}
						</>
					) : (
						<>
							{rows.length > 6 && (
								<button
									className='group-short-cut__view-more'
									onClick={() => setViewMoreGroupsStatus(!viewMoreGroupsStatus)}
									style={{ marginTop: '20px' }}
								>
									<i
										data-testid='view-more-view-less-chevron'
										className={
											'fas fa-chevron-down group-short-cut__view-more__icon ' +
											`${viewMoreGroupsStatus ? 'view-more' : 'view-less'}`
										}
									></i>
									<span className='sidebar__view-more-btn--black'>
										{viewMoreGroupsStatus ? 'Thu nhỏ' : 'Xem thêm'}
									</span>
								</button>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default memo(GroupShortcuts);
