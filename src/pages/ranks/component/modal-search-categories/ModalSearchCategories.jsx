import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import SearchField from 'shared/search-field';
import StatusItem from 'components/status-button/components/book-shelves-list/StatusItem';
import { CircleCheckIcon, CoffeeCupIcon, TargetIcon } from 'components/svg';
import './ModalSearchCategories.scss';
import { getCategoryList } from 'reducers/redux-utils/category/index';
import { useEffect, useCallback } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

const ModalSearchCategories = ({ modalSearchCategoriesShow, setModalSearchCategoriesShow }) => {
	const dispatch = useDispatch();

	const [inputSearch, setInputSearch] = useState('');
	const [valueSearch, setValueSearch] = useState('');
	const [shearchedList, setSearchedList] = useState([]);

	const updateInputSearch = value => {
		if (value) {
			setValueSearch(value.toLowerCase().trim());
		} else {
			setValueSearch('');
		}
	};

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	useEffect(async () => {
		const query = {
			start: 0,
			limit: 10,
			sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			filter: JSON.stringify([{ operator: 'search', value: valueSearch, property: 'name' }]),
		};

		try {
			if (inputSearch.length > 0) {
				const result = await dispatch(getCategoryList({ option: true, params: query })).unwrap();
				setSearchedList(result.rows);
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [valueSearch]);

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
					{shearchedList.length ? (
						shearchedList.map((item, index) => (
							<div key={index} className='result-categories-item'>
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
