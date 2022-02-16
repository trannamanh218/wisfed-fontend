import { useFetchGroups } from 'api/group.hooks';
import bookIcon from 'assets/icons/book.svg';
import _ from 'lodash';
import { useState } from 'react';

function GroupShortcuts() {
	const [viewMoreGroupsStatus, setViewMoreGroupsStatus] = useState(false);
	const {
		groups: { rows = [] },
	} = useFetchGroups();

	return (
		<div className='sidebar__block'>
			<h4 className='sidebar__block__title'>Lối tắt nhóm</h4>
			<div className='sidebar__block__content'>
				<div className={'group-short-cut__items-box ' + `${viewMoreGroupsStatus ? 'view-more' : 'view-less'}`}>
					{!_.isEmpty(rows) ? (
						rows?.map((item, index) => (
							<div key={index} className='group-short-cut__item'>
								<div className='group-short-cut__item__logo'>
									<img
										src={item.avatar}
										alt='group'
										onError={e => e.target.setAttribute('src', `${bookIcon}`)}
									/>
								</div>
								<div className='group-short-cut__item__name'>{item.name}</div>
							</div>
						))
					) : (
						<p className='blank-content'>Không có dữ liệu</p>
					)}
				</div>
				{!_.isEmpty(rows) && (
					<button
						className='group-short-cut__view-more '
						onClick={() => setViewMoreGroupsStatus(!viewMoreGroupsStatus)}
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
			</div>
		</div>
	);
}

export default GroupShortcuts;
