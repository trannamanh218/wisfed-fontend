import AddAndSearchItems from 'shared/add-and-search-items';
import { useState, useRef, useCallback } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import { getFilterSearch } from 'reducers/redux-utils/search';

function AddAndSearchAuthorUploadBook({
	title,
	placeholder,
	require,
	inputAuthorValue,
	setInputAuthorValue,
	authors,
	setAuthors,
}) {
	const [authorSearchedList, setAuthorSearchedList] = useState([]);
	const [getDataFinish, setGetDataFinish] = useState(false);
	const [hasMoreEllipsis, setHasMoreEllipsis] = useState(false);

	const authorInputContainer = useRef(null);
	const authorInputWrapper = useRef(null);
	const authorInput = useRef(null);

	const dispatch = useDispatch();

	const addAuthor = author => {
		if (authors.filter(authorAdded => authorAdded.id === author.id).length > 0) {
			removeAuthor(author.id);
		} else {
			const authorArrayTemp = [...authors];
			authorArrayTemp.push(author);
			setAuthors(authorArrayTemp);
			setInputAuthorValue('');
			setAuthorSearchedList([]);
			if (authorInputWrapper.current) {
				authorInputWrapper.current.style.width = '0.5ch';
			}
		}
	};

	const removeAuthor = authorId => {
		const authorArr = [...authors];
		const index = authorArr.findIndex(item => item.id === authorId);
		authorArr.splice(index, 1);
		setAuthors(authorArr);
	};

	const fetchSuggestion = async input => {
		const params = { q: input, type: 'authors' };
		try {
			const data = await dispatch(getFilterSearch(params)).unwrap();
			setAuthorSearchedList(data.rows);
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

	const debounceSearch = useCallback(_.debounce(fetchSuggestion, 1000), []);

	const searchAuthor = e => {
		setGetDataFinish(false);
		setAuthorSearchedList([]);
		setInputAuthorValue(e.target.value);
		if (e.target.value) {
			debounceSearch(e.target.value, 'addAuthor');
		}
		if (authorInputWrapper.current) {
			authorInputWrapper.current.style.width = authorInput.current.value?.length + 0.5 + 'ch';
		}
	};

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>
				{title}
				{require && <span className='upload-text-danger'>*</span>}
			</label>
			<AddAndSearchItems
				itemAddedList={authors}
				itemSearchedList={authorSearchedList}
				addItem={addAuthor}
				removeItem={removeAuthor}
				getDataFinish={getDataFinish}
				searchItem={searchAuthor}
				inputItemValue={inputAuthorValue}
				itemInputContainer={authorInputContainer}
				itemInputWrapper={authorInputWrapper}
				itemInput={authorInput}
				hasSearchIcon={true}
				hasMoreEllipsis={hasMoreEllipsis}
				placeholder={placeholder}
				acceptValueText
			/>
		</div>
	);
}

AddAndSearchAuthorUploadBook.defaultProps = {
	title: '',
	placeholder: '',
	require: true,
	authors: [],
	setAuthors: () => {},
	inputAuthorValue: '',
	setInputAuthorValue: () => {},
};

AddAndSearchAuthorUploadBook.propTypes = {
	title: PropTypes.string,
	placeholder: PropTypes.string,
	require: PropTypes.bool,
	authors: PropTypes.array,
	setAuthors: PropTypes.func,
	inputAuthorValue: PropTypes.string,
	setInputAuthorValue: PropTypes.func,
};

export default AddAndSearchAuthorUploadBook;
