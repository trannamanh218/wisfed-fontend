import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';

const ShareModeComponent = ({ list, shareMode, setShareMode }) => {
	const [show, setShow] = useState(false);

	return (
		<div className='create-post-modal-content__main__body__user-info__share-mode-container'>
			<div
				className={classNames('create-post-modal-content__main__body__user-info__share-mode', {
					'show': show,
					'hide': !show,
				})}
				onClick={() => setShow(!show)}
			>
				<div className='create-post-modal-content__main__body__user-info__share-mode__selected'>
					{shareMode.icon}
					<span>{shareMode.title}</span>
					<div>
						<i className='fas fa-caret-down'></i>
					</div>
				</div>
				<div
					className={classNames('create-post-modal-content__main__body__user-info__share-mode__list', {
						'show': show,
						'hide': !show,
					})}
				>
					{list.map(item => {
						if (item.value !== shareMode.value) {
							return (
								<div
									key={item.value}
									className={classNames(
										'create-post-modal-content__main__body__user-info__share-mode__select-item',
										{
											'show': shareMode.value !== item.value,
											'hide': shareMode === item.value,
										}
									)}
									onClick={() => setShareMode(item)}
								>
									{item.icon}
									<span>{item.title}</span>
								</div>
							);
						}
					})}
				</div>
			</div>
		</div>
	);
};

ShareModeComponent.propTypes = {
	shareMode: PropTypes.object,
	list: PropTypes.array,
	setShareMode: PropTypes.func,
};

export default ShareModeComponent;