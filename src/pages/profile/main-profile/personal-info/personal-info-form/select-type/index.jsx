import { Pencil } from 'components/svg';
import AddAndSearchItems from 'shared/add-and-search-items';
import PropTypes from 'prop-types';
import { useState, useRef, useCallback, useEffect } from 'react';
// import ShareModeDropdown from 'shared/share-mode-dropdown';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getFilterSearch } from 'reducers/redux-utils/search';

function SelectType({ dataAdded, setDataAdded, editStatus, cancelEdit, enableEdit }) {
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	const [getDataFinish, setGetDataFinish] = useState(false);
	const [hasMoreEllipsis, setHasMoreEllipsis] = useState(false);

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const dispatch = useDispatch();

	const searchCategory = e => {
		setGetDataFinish(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		if (e.target.value) {
			debounceSearch(e.target.value);
		}
		if (categoryInputWrapper.current) {
			categoryInputWrapper.current.style.width = categoryInput.current.value.length + 0.5 + 'ch';
		}
	};

	const addCategory = category => {
		if (dataAdded.filter(categoryAdded => categoryAdded.id === category.id).length > 0) {
			removeCategory(category.id);
		} else {
			const categoryArrayTemp = [...dataAdded];
			categoryArrayTemp.push(category);
			setDataAdded(categoryArrayTemp);
			setInputCategoryValue('');
			setCategorySearchedList([]);
			if (categoryInputWrapper.current) {
				categoryInputWrapper.current.style.width = '0.5ch';
			}
		}
	};

	const removeCategory = categoryId => {
		const categoryArr = [...dataAdded];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setDataAdded(categoryArr);
	};

	const getSuggestion = async input => {
		try {
			const params = {
				q: input,
				start: 0,
				limit: 10,
				type: 'categories',
			};
			const data = await dispatch(getFilterSearch(params)).unwrap();
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
		_.debounce(inputValue => getSuggestion(inputValue), 700),
		[]
	);

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>Chủ đề yêu thích</label>
			<div className='form-field-wrapper'>
				<div className={`form-field ${editStatus && 'editStatus'}`}>
					{editStatus ? (
						<AddAndSearchItems
							itemAddedList={dataAdded}
							itemSearchedList={categorySearchedList}
							addItem={addCategory}
							removeItem={removeCategory}
							getDataFinish={getDataFinish}
							searchItem={searchCategory}
							inputItemValue={inputCategoryValue}
							itemInputContainer={categoryInputContainer}
							itemInputWrapper={categoryInputWrapper}
							itemInput={categoryInput}
							hasSearchIcon={false}
							hasMoreEllipsis={hasMoreEllipsis}
							autoFocus
						/>
					) : (
						<>
							{dataAdded.length > 0 ? (
								<div className='form-field categories'>
									{dataAdded.map(item => (
										<div
											key={item.id}
											className='add-and-search-categories__categories-added__item'
										>
											<div>{item.name}</div>
										</div>
									))}
								</div>
							) : (
								<div className='form-field__no-data '>Chưa có dữ liệu</div>
							)}
						</>
					)}
				</div>

				{/* <ShareModeDropdown /> */}

				{editStatus ? (
					<div
						className='form-field__btn cancel'
						onClick={() => cancelEdit('cancel-edit-favorite-categories')}
					>
						Hủy
					</div>
				) : (
					<div className='btn-icon' onClick={() => enableEdit('categories-editting')}>
						<Pencil />
					</div>
				)}
			</div>
		</div>
	);
}

SelectType.propTypes = {
	dataAdded: PropTypes.array,
	setDataAdded: PropTypes.func,
	editStatus: PropTypes.bool,
	cancelEdit: PropTypes.func,
	enableEdit: PropTypes.func,
};

export default SelectType;
