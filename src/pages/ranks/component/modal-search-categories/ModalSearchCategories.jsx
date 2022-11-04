import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import SearchField from 'shared/search-field';
import './ModalSearchCategories.scss';
import { getCategoryList } from 'reducers/redux-utils/category/index';
import { useEffect, useCallback } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import LoadingIndicator from 'shared/loading-indicator';

const ModalSearchCategories = ({
	modalSearchCategoriesShow,
	setModalSearchCategoriesShow,
	onSelectCategory,
	setTopBooksId,
	tabSelected,
	setTopQuotesId,
}) => {
	const dispatch = useDispatch();

	const [inputSearch, setInputSearch] = useState('');
	const [searchedList, setSearchedList] = useState([]);
	const [filter, setFilter] = useState('[]');
	const [loadingState, setLoadingState] = useState(false);

	const defaultCate = { value: 'Tất cả chủ đề', name: 'Chủ đề' };

	const updateFilter = value => {
		if (value) {
			setFilter(JSON.stringify([{ operator: 'search', value: value.toLowerCase().trim(), property: 'name' }]));
		} else {
			setFilter('[]');
		}
	};

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const debounceSearch = useCallback(_.debounce(updateFilter, 700), []);

	useEffect(async () => {
		setLoadingState(true);
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
		} finally {
			setLoadingState(false);
		}
	}, [filter]);

	const handleDefault = () => {
		if (tabSelected === 'books') {
			setModalSearchCategoriesShow(false);
			setTopBooksId(null);
			onSelectCategory(defaultCate);
		} else if (tabSelected === 'quotes') {
			setModalSearchCategoriesShow(false);
			setTopQuotesId(null);
			onSelectCategory(defaultCate);
		}
	};
	return (
		<Modal
			className='modal-search-categories'
			show={modalSearchCategoriesShow}
			onHide={() => setModalSearchCategoriesShow(false)}
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
					{(tabSelected === 'books' || tabSelected === 'quotes') && !inputSearch.length > 0 && (
						<div className='result-categories-item' onClick={handleDefault}>
							{defaultCate.value}
						</div>
					)}

					{loadingState ? (
						<LoadingIndicator />
					) : (
						<>
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
						</>
					)}
				</ul>
			</Modal.Body>
		</Modal>
	);
};

ModalSearchCategories.propTypes = {
	modalSearchCategoriesShow: PropTypes.bool,
	setModalSearchCategoriesShow: PropTypes.func,
	onSelectCategory: PropTypes.func,
	tabSelected: PropTypes.string,
	setTopBooksId: PropTypes.func,
	setTopQuotesId: PropTypes.func,
};
export default ModalSearchCategories;
