import AddAndSearchItems from 'shared/add-and-search-items';
import { useState, useRef, useCallback } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { getPublishers } from 'reducers/redux-utils/publishers';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

function AddAndSearchPublisherUploadBook({
	inputPublisherValue,
	setInputPublisherValue,
	publisherAddedList,
	setPublisher,
	maxAddedValue,
}) {
	const [publisherSearchedList, setPublisherSearchedList] = useState([]);
	const [getDataFinish, setGetDataFinish] = useState(false);
	const [hasMoreEllipsis, setHasMoreEllipsis] = useState(false);

	const publisherInputContainer = useRef(null);
	const publisherInputWrapper = useRef(null);
	const publisherInput = useRef(null);

	const dispatch = useDispatch();

	const addPublisher = publisher => {
		if (publisherAddedList.filter(publisherAdded => publisherAdded.id === publisher.id).length > 0) {
			removePublisher(publisher.id);
		} else {
			if (publisherAddedList.length < maxAddedValue) {
				const publisherArrayTemp = [...publisherAddedList];
				publisherArrayTemp.push(publisher);
				setPublisher(publisherArrayTemp);
				setInputPublisherValue('');
				setPublisherSearchedList([]);
				if (publisherInputWrapper.current) {
					publisherInputWrapper.current.style.width = '0.5ch';
				}
			} else {
				toast.warning(`Chỉ được chọn tối đa ${maxAddedValue} nhà xuất bản`);
			}
		}
	};

	const removePublisher = publisherId => {
		const publisherArr = [...publisherAddedList];
		const index = publisherArr.findIndex(item => item.id === publisherId);
		publisherArr.splice(index, 1);
		setPublisher(publisherArr);
	};

	const getSuggestionForCreatQuotes = async input => {
		try {
			const params = {
				filter: JSON.stringify([{ operator: 'search', value: input, property: 'name' }]),
			};
			const data = await dispatch(getPublishers(params)).unwrap();
			setPublisherSearchedList(data.rows);
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

	const debounceSearch = useCallback(_.debounce(getSuggestionForCreatQuotes, 700), []);

	const searchPublisher = e => {
		setGetDataFinish(false);
		setPublisherSearchedList([]);
		setInputPublisherValue(e.target.value);
		if (e.target.value) {
			debounceSearch(e.target.value);
		}
		if (publisherInputWrapper.current) {
			publisherInputWrapper.current.style.width = publisherInput.current.value?.length + 0.5 + 'ch';
		}
	};

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>
				Nhà xuất bản<span className='upload-text-danger'>*</span>
			</label>
			<AddAndSearchItems
				itemAddedList={publisherAddedList}
				itemSearchedList={publisherSearchedList}
				addItem={addPublisher}
				removeItem={removePublisher}
				getDataFinish={getDataFinish}
				searchItem={searchPublisher}
				inputItemValue={inputPublisherValue}
				itemInputContainer={publisherInputContainer}
				itemInputWrapper={publisherInputWrapper}
				itemInput={publisherInput}
				hasSearchIcon={true}
				hasMoreEllipsis={hasMoreEllipsis}
				placeholder={'Tìm kiếm và chọn một nhà xuất bản'}
			/>
		</div>
	);
}

AddAndSearchPublisherUploadBook.propTypes = {
	publisherAddedList: PropTypes.array,
	setPublisher: PropTypes.func,
	inputPublisherValue: PropTypes.string,
	setInputPublisherValue: PropTypes.func,
	maxAddedValue: PropTypes.number,
};

export default AddAndSearchPublisherUploadBook;
