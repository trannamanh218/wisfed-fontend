import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const StatusItem = ({ item, onChangeShelves, customLibrariesContainCurrentBookId }) => {
	const [isChecked, setIschecked] = useState(false);

	useEffect(() => {
		if (!!customLibrariesContainCurrentBookId.length > 0 && customLibrariesContainCurrentBookId.includes(item.id)) {
			setIschecked(true);
		}
	}, []);

	const handleChange = e => {
		e.stopPropagation();
		setIschecked(!isChecked);
		if (e.target.checked) {
			onChangeShelves(item, 'add');
		} else {
			onChangeShelves(item, 'remove');
		}
	};

	return (
		<li className='status-item' data-testid='status-item-book-shelve'>
			<label className='status-item__title'>{item.name}</label>
			<span className='custom-checkbox'>
				<label className='custom-checkbox__container'>
					<input className='status-item__input' type='checkbox' onChange={handleChange} checked={isChecked} />
					<span className='status-item__checkmark'></span>
				</label>
			</span>
		</li>
	);
};

StatusItem.propTypes = {
	item: PropTypes.object.isRequired,
	onChangeShelves: PropTypes.func,
	customLibrariesContainCurrentBookId: PropTypes.array,
};

export default StatusItem;
