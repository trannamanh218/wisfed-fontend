import StatusItem from './StatusItem';
import PropTypes from 'prop-types';
import './style.scss';
import SearchField from 'shared/search-field';
import { useState } from 'react';

const BookShelvesList = ({ list, onChangeShelves, customLibrariesContainCurrentBookId }) => {
	const [inputSearch, setInputSearch] = useState('');
	const [shearchedList, setSearchedList] = useState([]);

	const renderList = () => {
		return (
			<ul className='status-book__list status-book__list--shelves'>
				{inputSearch ? (
					<>
						{shearchedList.length ? (
							shearchedList.map(item => (
								<StatusItem
									key={item.id}
									item={item}
									onChangeShelves={onChangeShelves}
									customLibrariesContainCurrentBookId={customLibrariesContainCurrentBookId}
								/>
							))
						) : (
							<p>Không có kết quả nào phù hợp</p>
						)}
					</>
				) : (
					<>
						{list.map(item => (
							<StatusItem
								key={item.id}
								item={item}
								onChangeShelves={onChangeShelves}
								customLibrariesContainCurrentBookId={customLibrariesContainCurrentBookId}
							/>
						))}
					</>
				)}
			</ul>
		);
	};

	const handleSearch = e => {
		setInputSearch(e.target.value);
		const newArr = list.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
		setSearchedList(newArr);
	};

	return (
		<div className='status-book-wrapper'>
			<h4 className='status-book__title'>Giá sách của tôi</h4>
			{!!list.length && (
				<>
					<SearchField
						placeholder='Tìm kiếm giá sách'
						className='main-shelves__search'
						handleChange={handleSearch}
						value={inputSearch}
					/>
					{renderList()}
				</>
			)}
		</div>
	);
};

BookShelvesList.defaultProps = {
	list: [],
	onChangeShelves: () => {},
};

BookShelvesList.propTypes = {
	list: PropTypes.array.isRequired,
	onChangeShelves: PropTypes.func,
	customLibrariesContainCurrentBookId: PropTypes.array,
};

export default BookShelvesList;
