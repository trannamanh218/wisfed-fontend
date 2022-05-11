import PropTypes from 'prop-types';

const StatusItem = ({ item, onChangeShelves }) => {
	const handleChange = e => {
		e.stopPropagation();
		onChangeShelves(item);
	};

	return (
		<li className='status-item' data-testid='status-item-book-shelve'>
			<label className='status-item__title'>{item.name}</label>
			<span className='custom-checkbox'>
				<label className='custom-checkbox__container'>
					<input
						className='status-item__input'
						type='checkbox'
						onChange={handleChange}
						checked={item.isSelect}
					/>
					<span className='status-item__checkmark'></span>
				</label>
			</span>
		</li>
	);
};

StatusItem.propTypes = {
	item: PropTypes.object.isRequired,
	onChangeShelves: PropTypes.func,
	libraryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default StatusItem;
