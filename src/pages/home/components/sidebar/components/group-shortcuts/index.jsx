import { useFetchGroups } from 'api/group.hooks';
import bookIcon from 'assets/icons/book.svg';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyGroup, getRecommendGroup } from 'reducers/redux-utils/group';

function GroupShortcuts() {
	const [myGroup, setMyGroup] = useState([]);

	const callApiPerPage = useRef(10);

	const navigate = useNavigate();

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
			if (actionListMyGroup.data.length > 0) {
				setMyGroup(actionListMyGroup.data);
			} else {
				try {
					const params = {
						start: 0,
						limit: callApiPerPage.current,
					};
					const data = await dispatch(getRecommendGroup(params)).unwrap();
					setMyGroup(data);
				} catch (err) {
					NotificationError(err);
				}
			}
		} catch (err) {
			NotificationError(err);
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
					<div className={'group-short-cut__items-box'}>
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

					<>
						{(myGroup.length > 3 || rows.length > 3) && (
							<button className='sidebar__view-more-btn--blue' onClick={() => navigate('/group')}>
								Xem thêm
							</button>
						)}
					</>
				</div>
			</div>
		</>
	);
}

export default memo(GroupShortcuts);
