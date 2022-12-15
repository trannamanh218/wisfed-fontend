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
import { getFilterSearch } from 'reducers/redux-utils/search';

const ModalSearchCategories = ({
	modalSearchCategoriesShow,
	setModalSearchCategoriesShow,
	onSelectCategory,
	setTopBooksId,
	tabSelected,
	setTopQuotesId,
	setTopUserFilter,
	hasBook = false,
}) => {
	const dispatch = useDispatch();

	const [inputSearch, setInputSearch] = useState('');
	const [searchedList, setSearchedList] = useState([]);
	const [loadingState, setLoadingState] = useState(false);

	const defaultCate = { value: 'Tất cả chủ đề', name: 'Chủ đề' };

	useEffect(() => {
		getSuggestionCategories('');
	}, []);

	const getSuggestionCategories = async paramInputSearch => {
		setLoadingState(true);
		try {
			let query = {};
			let result = {};

			if (paramInputSearch === '') {
				query = {
					start: 0,
					limit: 10,
					sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
					filter: JSON.stringify([
						hasBook && {
							operator: 'ne',
							property: 'numberBooks',
							value: 0,
						},
					]),
				};
				result = await dispatch(getCategoryList({ option: false, params: query })).unwrap();
			} else {
				query = {
					q: paramInputSearch,
					start: 0,
					limit: 10,
					type: 'categories',
					must_not: hasBook ? { 'numberBook': '0' } : '',
				};
				result = await dispatch(getFilterSearch(query)).unwrap();
			}
			setSearchedList(result.rows);
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoadingState(false);
		}
	};

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value.trim());
	};

	const debounceSearch = useCallback(_.debounce(getSuggestionCategories, 700), []);

	const handleDefault = () => {
		if (tabSelected === 'books') {
			setModalSearchCategoriesShow(false);
			setTopBooksId(null);
			onSelectCategory(defaultCate);
		} else if (tabSelected === 'quotes') {
			setModalSearchCategoriesShow(false);
			setTopQuotesId(null);
			onSelectCategory(defaultCate);
		} else {
			setModalSearchCategoriesShow(false);
			setTopUserFilter(null);
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
					{!inputSearch.length && (
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
