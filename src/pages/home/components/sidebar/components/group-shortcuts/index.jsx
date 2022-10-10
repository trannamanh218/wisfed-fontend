import { useFetchGroups } from 'api/group.hooks';
import bookIcon from 'assets/icons/book.svg';
import _ from 'lodash';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function GroupShortcuts() {
	// const [viewMoreGroupsStatus, setViewMoreGroupsStatus] = useState(false);
	const {
		groups: { rows = [] },
	} = useFetchGroups();
	const userInfo = useSelector(state => state.auth.userInfo);

	return (
		<>
			{!_.isEmpty(userInfo) && (
				<div className='sidebar__block'>
					<h4 className='sidebar__block__title'>Lối tắt nhóm</h4>
					<div className='sidebar__block__content'>
						<div
							className={
								'group-short-cut__items-box ' //+ `${viewMoreGroupsStatus ? 'view-more' : 'view-less'}`
							}
						>
							{!_.isEmpty(rows) ? (
								rows?.slice(0, 6)?.map((item, index) => (
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
						</div>
						{rows.length > 6 && (
							// <button
							// 	className='group-short-cut__view-more '
							// 	onClick={() => setViewMoreGroupsStatus(!viewMoreGroupsStatus)}
							// >
							// 	<i
							// 		data-testid='view-more-view-less-chevron'
							// 		className={
							// 			'fas fa-chevron-down group-short-cut__view-more__icon ' +
							// 			`${viewMoreGroupsStatus ? 'view-more' : 'view-less'}`
							// 		}
							// 	></i>
							// 	<span className='sidebar__view-more-btn--black'>
							// 		{viewMoreGroupsStatus ? 'Thu nhỏ' : 'Xem thêm'}
							// 	</span>
							// </button>
							<Link className='sidebar__view-more-btn--blue' to='/my-group'>
								Xem thêm
							</Link>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default memo(GroupShortcuts);
