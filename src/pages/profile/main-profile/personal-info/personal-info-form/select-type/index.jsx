import { Pencil } from 'components/svg';
import AddAndSearchCategories from 'shared/add-and-search-categories';
import PropTypes from 'prop-types';
import { useState, useRef, useCallback } from 'react';
import ShareModeDropdown from 'shared/share-mode-dropdown';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';

function SelectType({ dataAdded, setDataAdded, editStatus, cancelEdit, enableEdit }) {
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	const [getDataFinish, setGetDataFinish] = useState(false);

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const dispatch = useDispatch();

	const searchCategory = e => {
		setGetDataFinish(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		debounceSearch(e.target.value, { value: 'addCategory' });
		categoryInputWrapper.current.style.width = categoryInput.current.value.length + 0.5 + 'ch';
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
			categoryInputWrapper.current.style.width = '0.5ch';
		}
	};

	const removeCategory = categoryId => {
		const categoryArr = [...dataAdded];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setDataAdded(categoryArr);
	};

	const getSuggestion = async (input, option) => {
		try {
			const data = await dispatch(getSuggestionForPost({ input, option })).unwrap();
			setCategorySearchedList(data.rows);
		} catch {
			toast.error('Lỗi hệ thống');
		} finally {
			setGetDataFinish(true);
		}
	};

	const debounceSearch = useCallback(
		_.debounce((inputValue, option) => getSuggestion(inputValue, option), 700),
		[]
	);

	return (
		<div className='form-field-group'>
			<label className='form-field-label'>Chủ đề yêu thích</label>
			<div className='form-field-wrapper'>
				<div className='form-field'>
					{editStatus ? (
						<AddAndSearchCategories
							categoryAddedList={dataAdded}
							categorySearchedList={categorySearchedList}
							addCategory={addCategory}
							removeCategory={removeCategory}
							getDataFinish={getDataFinish}
							searchCategory={searchCategory}
							inputCategoryValue={inputCategoryValue}
							categoryInputContainer={categoryInputContainer}
							categoryInputWrapper={categoryInputWrapper}
							categoryInput={categoryInput}
							hasSearchIcon={false}
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

				<ShareModeDropdown />

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
