import AddAndSearchCategories from 'shared/add-and-search-categories';
import { useState, useRef, useCallback } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

function AddAndSearchCategoriesUploadBook({
	inputCategoryValue,
	setInputCategoryValue,
	categoryAddedList,
	setCategoryAddedList,
	maxAddedValue,
}) {
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [getDataFinish, setGetDataFinish] = useState(false);
	const [hasMoreEllipsis, setHasMoreEllipsis] = useState(false);

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const dispatch = useDispatch();

	const addCategory = category => {
		if (categoryAddedList.filter(categoryAdded => categoryAdded.id === category.id).length > 0) {
			removeCategory(category.id);
		} else {
			if (categoryAddedList.length < maxAddedValue) {
				const categoryArrayTemp = [...categoryAddedList];
				categoryArrayTemp.push(category);
				setCategoryAddedList(categoryArrayTemp);
				setInputCategoryValue('');
				setCategorySearchedList([]);
				if (categoryInputWrapper.current) {
					categoryInputWrapper.current.style.width = '0.5ch';
				}
			} else {
				toast.warning(`Chỉ được chọn tối đa ${maxAddedValue} chủ đề`);
			}
		}
	};

	const removeCategory = categoryId => {
		const categoryArr = [...categoryAddedList];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setCategoryAddedList(categoryArr);
	};

	const getSuggestionForCreatQuotes = async (input, option) => {
		try {
			const data = await dispatch(getSuggestionForPost({ input, option })).unwrap();
			setCategorySearchedList(data.rows);
			if (data.count > data.rows.length) {
				setHasMoreEllipsis(true);
			} else {
				setHasMoreEllipsis(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinish(true);
		}
	};

	const debounceSearch = useCallback(
		_.debounce((inputValue, option) => getSuggestionForCreatQuotes(inputValue, option), 700),
		[]
	);

	const searchCategory = e => {
		setGetDataFinish(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		if (e.target.value) {
			debounceSearch(e.target.value, { value: 'addCategory' });
		}
		if (categoryInputWrapper.current) {
			categoryInputWrapper.current.style.width = categoryInput.current.value?.length + 0.5 + 'ch';
		}
	};

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>
				Chủ đề<span className='upload-text-danger'>*</span>
			</label>
			<AddAndSearchCategories
				categoryAddedList={categoryAddedList}
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
				hasMoreEllipsis={hasMoreEllipsis}
			/>
		</div>
	);
}

AddAndSearchCategoriesUploadBook.propTypes = {
	categoryAddedList: PropTypes.array,
	setCategoryAddedList: PropTypes.func,
	inputCategoryValue: PropTypes.string,
	setInputCategoryValue: PropTypes.func,
	maxAddedValue: PropTypes.number,
};

export default AddAndSearchCategoriesUploadBook;
