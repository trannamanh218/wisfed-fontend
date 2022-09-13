import AddAndSearchCategories from 'shared/add-and-search-categories';
import { useState, useRef, useCallback } from 'react';
// import ShareModeDropdown from 'shared/share-mode-dropdown';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { getPublishers } from 'reducers/redux-utils/publishers';
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

	const getSuggestionForCreatQuotes = async option => {
		try {
			const params = {
				filter: JSON.stringify([option]),
			};
			const data = await dispatch(getPublishers(params)).unwrap();
			setCategorySearchedList(data);
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinish(true);
		}
	};

	const debounceSearch = useCallback(
		_.debounce(option => getSuggestionForCreatQuotes(option), 700),
		[]
	);

	const searchCategory = e => {
		setGetDataFinish(false);
		setCategorySearchedList([]);
		setInputPublisherValue(e.target.value);
		debounceSearch({ operator: 'search', value: e.target.value, property: 'name' });
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
				maxAddedValue={1}
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
