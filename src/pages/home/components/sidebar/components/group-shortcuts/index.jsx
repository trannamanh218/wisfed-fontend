import { BookIcon } from 'components/svg';
import { useState } from 'react';
// import PropTypes from 'prop-types';

function GroupShortcuts() {
	const [viewMoreGroupsStatus, setViewMoreGroupsStatus] = useState(false);

	return (
		<div className='sidebar__block'>
			<h4 className='sidebar__block__title'>Lối tắt nhóm</h4>
			<div className='sidebar__block__content'>
				<div className={'group-short-cut__items-box ' + `${viewMoreGroupsStatus ? 'view-more' : 'view-less'}`}>
					{[...Array(10)].map((item, index) => (
						<div key={index} className='group-short-cut__item'>
							<div className='group-short-cut__item__logo'>
								<BookIcon />
							</div>
							<div className='group-short-cut__item__name'>
								Hội những người thích truyện trinh thám Sherlock Homes
							</div>
						</div>
					))}
				</div>
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
			</div>
		</div>
	);
}

// GroupShortcuts.propTypes = {
// 	groups: PropTypes.array,
// };

export default GroupShortcuts;
