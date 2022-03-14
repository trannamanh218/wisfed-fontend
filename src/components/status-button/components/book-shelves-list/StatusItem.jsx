import React from 'react';
import PropTypes from 'prop-types';

const StatusItem = ({ item, onChangeLibrary, libraryId }) => {
	const onChangeBookShelf = () => {
		if (libraryId !== item.id) {
			onChangeLibrary(item.id);
		}
	};

	return (
		<li className='status-item' data-testid='status-item-book-shelve' onClick={onChangeBookShelf}>
			<label className='status-item__title'>{item.name}</label>
			<span className='custom-checkbox'>
				<label className='custom-checkbox__container'>
					<input className='status-item__input' type='checkbox' defaultChecked={item.id === libraryId} />
					<span className='status-item__checkmark'></span>
				</label>
			</span>
		</li>
	);
};

StatusItem.propTypes = {
	item: PropTypes.object.isRequired,
	onChangeLibrary: PropTypes.func,
	libraryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default StatusItem;
