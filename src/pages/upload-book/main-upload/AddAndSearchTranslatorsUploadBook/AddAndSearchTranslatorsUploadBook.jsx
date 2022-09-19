import AddAndSearchCategories from 'shared/add-and-search-categories';
import { useState, useRef, useCallback } from 'react';
// import ShareModeDropdown from 'shared/share-mode-dropdown';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';

function AddAndSearchTranslatorsUploadBook({
	inputTranslatorValue,
	setInputTranslatorValue,
	translators,
	setTranslators,
}) {
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [getDataFinish, setGetDataFinish] = useState(false);

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const dispatch = useDispatch();

	const addCategory = category => {
		if (translators.filter(categoryAdded => categoryAdded.id === category.id).length > 0) {
			removeCategory(category.id);
		} else {
			const categoryArrayTemp = [...translators];
			categoryArrayTemp.push(category);
			setTranslators(categoryArrayTemp);
			setInputTranslatorValue('');
			setCategorySearchedList([]);
			if (categoryInputWrapper.current) {
				categoryInputWrapper.current.style.width = '0.5ch';
			}
		}
	};

	const removeCategory = categoryId => {
		const categoryArr = [...translators];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setTranslators(categoryArr);
	};

	const getSuggestionForCreatQuotes = async (input, option) => {
		try {
			const data = await dispatch(getSuggestionForPost({ input, option })).unwrap();
			setCategorySearchedList(data.rows);
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
		setInputTranslatorValue(e.target.value);
		if (e.target.value) {
			debounceSearch(e.target.value, { value: 'addCategory' });
		}
		if (categoryInputWrapper.current) {
			categoryInputWrapper.current.style.width = categoryInput.current.value?.length + 0.5 + 'ch';
		}
	};

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>Dịch giả</label>
			<AddAndSearchCategories
				categoryAddedList={translators}
				categorySearchedList={categorySearchedList}
				addCategory={addCategory}
				removeCategory={removeCategory}
				getDataFinish={getDataFinish}
				searchCategory={searchCategory}
				inputCategoryValue={inputTranslatorValue}
				categoryInputContainer={categoryInputContainer}
				categoryInputWrapper={categoryInputWrapper}
				categoryInput={categoryInput}
				hasSearchIcon={true}
				placeholder={'Tìm kiếm và thêm dịch giả'}
			/>
		</div>
	);
}

AddAndSearchTranslatorsUploadBook.propTypes = {
	translators: PropTypes.array,
	setTranslators: PropTypes.func,
	inputTranslatorValue: PropTypes.string,
	setInputTranslatorValue: PropTypes.func,
};

export default AddAndSearchTranslatorsUploadBook;
