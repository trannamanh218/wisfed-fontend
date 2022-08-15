import AddAndSearchCategories from 'shared/add-and-search-categories';
import { useState, useRef, useCallback } from 'react';
// import ShareModeDropdown from 'shared/share-mode-dropdown';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';

function AddAndSearchPublisherUploadBook({ inputPublisherValue, setInputPublisherValue, publisher, setPublisher }) {
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [getDataFinish, setGetDataFinish] = useState(false);

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const dispatch = useDispatch();

	const addCategory = category => {
		if (publisher.filter(categoryAdded => categoryAdded.id === category.id).length > 0) {
			removeCategory(category.id);
		} else {
			const categoryArrayTemp = [...publisher];
			categoryArrayTemp.push(category);
			setPublisher(categoryArrayTemp);
			setInputPublisherValue('');
			setCategorySearchedList([]);
			if (categoryInputWrapper.current) {
				categoryInputWrapper.current.style.width = '0.5ch';
			}
		}
	};

	const removeCategory = categoryId => {
		const categoryArr = [...publisher];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setPublisher(categoryArr);
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
		setInputPublisherValue(e.target.value);
		debounceSearch(e.target.value, { value: 'addCategory' });
		if (categoryInputWrapper.current) {
			categoryInputWrapper.current.style.width = categoryInput.current.value?.length + 0.5 + 'ch';
		}
	};

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>
				Nhà xuất bản<span className='upload-text-danger'>*</span>
			</label>
			<AddAndSearchCategories
				categoryAddedList={publisher}
				categorySearchedList={categorySearchedList}
				addCategory={addCategory}
				removeCategory={removeCategory}
				getDataFinish={getDataFinish}
				searchCategory={searchCategory}
				inputCategoryValue={inputPublisherValue}
				categoryInputContainer={categoryInputContainer}
				categoryInputWrapper={categoryInputWrapper}
				categoryInput={categoryInput}
				hasSearchIcon={true}
				placeholder={'Tìm kiếm và chọn một nhà xuất bản'}
				disabledAddValue={true}
			/>
		</div>
	);
}

AddAndSearchPublisherUploadBook.propTypes = {
	publisher: PropTypes.array,
	setPublisher: PropTypes.func,
	inputPublisherValue: PropTypes.string,
	setInputPublisherValue: PropTypes.func,
};

export default AddAndSearchPublisherUploadBook;
