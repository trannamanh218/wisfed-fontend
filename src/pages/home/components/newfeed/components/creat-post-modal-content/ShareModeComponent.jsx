import classNames from 'classnames';
import React from 'react';

const ShareModeComponent = ({ list, shareMode, setShareMode }) => {
	return list.map(item => {
		if (item.value !== shareMode.value) {
			return (
				<div
					key={item.value}
					className={classNames('creat-post-modal-content__main__body__user-info__share-mode__select-item', {
						'show': shareMode.value !== item.value,
						'hide': shareMode === item.value,
					})}
					onClick={() => setShareMode(item)}
				>
					{item.icon}
					<span>{item.title}</span>
				</div>
			);
		}
		return '';
	});
};

ShareModeComponent.propTypes = {};

export default ShareModeComponent;
