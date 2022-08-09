import AddAndSearchCategories from 'shared/add-and-search-categories';
import { useState, useRef, useCallback } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import { getFilterSearch } from 'reducers/redux-utils/search';

function AddAndSearchAuthorUploadBook({ authors, setAuthors }) {
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [getDataFinish, setGetDataFinish] = useState(false);
	const [inputCategoryValue, setInputCategoryValue] = useState('');

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const dispatch = useDispatch();

	const addCategory = category => {
		if (authors.filter(categoryAdded => categoryAdded.id === category.id).length > 0) {
			removeCategory(category.id);
		} else {
			const categoryArrayTemp = [...authors];
			categoryArrayTemp.push(category);
			setAuthors(categoryArrayTemp);
			setInputCategoryValue('');
			setCategorySearchedList([]);
			if (categoryInputWrapper.current) {
				categoryInputWrapper.current.style.width = '0.5ch';
			}
		}
	};

	const removeCategory = categoryId => {
		const categoryArr = [...authors];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setAuthors(categoryArr);
	};

	const fetchSuggestion = async input => {
		const params = { q: input, type: 'authors' };
		try {
			const data = await dispatch(getFilterSearch(params)).unwrap();
			setCategorySearchedList(data.rows);
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinish(true);
		}
	};

	const debounceSearch = useCallback(_.debounce(fetchSuggestion, 1000), []);

	const searchCategory = e => {
		setGetDataFinish(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		debounceSearch(e.target.value, 'addAuthor');
		if (categoryInputWrapper.current) {
			categoryInputWrapper.current.style.width = categoryInput.current.value?.length + 0.5 + 'ch';
		}
	};

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>
				Tác giả<span className='upload-text-danger'>*</span>
			</label>
			<AddAndSearchCategories
				categoryAddedList={authors}
				categorySearchedList={categorySearchedList}
				addCategory={addCategory}
				removeCategory={removeCategory}
				getDataFinish={getDataFinish}
				searchCategory={searchCategory}
				inputCategoryValue={inputCategoryValue}
				categoryInputContainer={categoryInputContainer}
				categoryInputWrapper={categoryInputWrapper}
				categoryInput={categoryInput}
				hasSearchIcon={true}
				placeholder={'Tìm kiếm và thêm tác giả'}
			/>
		</div>
	);
}

AddAndSearchAuthorUploadBook.propTypes = {
	authors: PropTypes.array,
	setAuthors: PropTypes.func,
};

export default AddAndSearchAuthorUploadBook;
