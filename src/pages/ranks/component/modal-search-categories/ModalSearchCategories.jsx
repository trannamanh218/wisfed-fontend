import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import SearchField from 'shared/search-field';
import './ModalSearchCategories.scss';
import { getCategoryList } from 'reducers/redux-utils/category/index';
import { useEffect, useCallback } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

const ModalSearchCategories = ({ modalSearchCategoriesShow, setModalSearchCategoriesShow, onSelectCategory }) => {
	const dispatch = useDispatch();

	const [inputSearch, setInputSearch] = useState('');
	const [searchedList, setSearchedList] = useState([]);
	const [filter, setFilter] = useState('[]');

	const updateFilter = value => {
		if (value) {
			setFilter(JSON.stringify([{ operator: 'search', value: value.toLowerCase().trim(), property: 'name' }]));
		} else {
			setFilter('[]');
		}
		console.log(1);
	};

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const debounceSearch = useCallback(_.debounce(updateFilter, 700), []);

	useEffect(async () => {
		const query = {
			start: 0,
			limit: 10,
			sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			filter: filter,
		};
		try {
			const result = await dispatch(getCategoryList({ option: false, params: query })).unwrap();
			setSearchedList(result.rows);
		} catch (err) {
			NotificationError(err);
		}
	}, [filter]);

	return (
		<Modal
			className='modal-search-categories'
			show={modalSearchCategoriesShow}
			onHide={() => setModalSearchCategoriesShow(false)}
			centered
		>
			<Modal.Body>
				<h4>Chủ đề</h4>
				<SearchField
					placeholder='Tìm kiếm chủ đề'
					className='main-shelves__search'
					handleChange={handleSearch}
					value={inputSearch}
				/>
				<ul className='result-categories-list'>
					{searchedList.length ? (
						searchedList.map((item, index) => (
							<div
								key={index}
								className='result-categories-item'
								onClick={() => {
									onSelectCategory(item);
									setModalSearchCategoriesShow(false);
								}}
							>
								{item.name}
							</div>
						))
					) : (
						<p>Không có kết quả nào phù hợp</p>
					)}
				</ul>
			</Modal.Body>
		</Modal>
	);
};

export default ModalSearchCategories;
