import { useRef, useState, useCallback, useEffect } from 'react';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import { BackArrow } from 'components/svg';
import './group-settings.scss';
import PropTypes from 'prop-types';
import AddAndSearchItems from 'shared/add-and-search-items';
import { toast } from 'react-toastify';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { editGroup } from 'reducers/redux-utils/group';
import InputHashtag from 'shared/input/inputHashtag/inputHashtag';
import { hashtagRegex } from 'constants';

function SettingsGroup({ handleChange, data, fetchData }) {
	const listIdBook = [
		{ value: 27, title: 'Yêu đọc sách' },
		{ value: 30, title: 'Thử thách đọc sách' },
	];

	const [defaultCategoryOption, setDefaultCategoryOption] = useState({ value: 'default', title: 'Chọn chủ đề' });
	const [inputNameGroup, setInputNameGroup] = useState(data.name);
	const [inputDescription, setInputDescription] = useState(data.description);
	const [listHashtags, setListHashtags] = useState([]);
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [lastTag, setLastTag] = useState('');
	const [newListTag, setNewListTag] = useState([]);
	const [intialState, setIntialState] = useState({});
	const [listAuthors, setListAuthors] = useState([]);
	const [inputAuthorValue, setInputAuthorValue] = useState('');
	const [authorAddedList, setAuthorAddedList] = useState([]);
	const [authorSearchedList, setAuthorSearchedList] = useState([]);
	const [hasMoreAuthorsEllipsis, setHasMoreAuthorsEllipsis] = useState(false);
	const [categoryIdBook, setCategoryIdBook] = useState([]);
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	const [categoryAddedList, setCategoryAddedList] = useState([]);
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [hasMoreCategoriesEllipsis, setHasMoreCategoriesEllipsis] = useState(false);
	const [listBookAdd, setListBookAdd] = useState([]);
	const [inputBookValue, setInputBookValue] = useState('');
	const [bookAddedList, setBookAddedList] = useState([]);
	const [bookSearchedList, setBookSearchedList] = useState([]);
	const [hasMoreBooksEllipsis, setHasMoreBooksEllipsis] = useState(false);
	const [getDataFinishCategories, setGetDataFinishCategories] = useState(false);
	const [getDataFinishAuthors, setGetDataFinishAuthors] = useState(false);
	const [getDataFinishBooks, setGetDataFinishBooks] = useState(false);
	const [showError, setShowError] = useState(false);

	const authorInputContainer = useRef(null);
	const authorInputWrapper = useRef(null);
	const authorInput = useRef(null);

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const bookInputContainer = useRef(null);
	const bookInputWrapper = useRef(null);
	const bookInput = useRef(null);

	const textArea = useRef(null);
	const groupNameInput = useRef('');
	const groupSettingContainer = useRef(null);
	const dispatch = useDispatch();

	useEffect(() => {
		// Điền dữ liệu ban đầu vào form
		const cloneArr1 = data.groupTags.map(item => item.tag.name);
		setListHashtags(cloneArr1);

		const cloneArr2 = [];
		data.groupCategories.forEach(item => cloneArr2.push(item.category));
		setCategoryAddedList(cloneArr2);

		const cloneArr3 = [];
		data.groupAuthors.forEach(item => cloneArr3.push(item.author));
		setAuthorAddedList(cloneArr3);

		const cloneArr4 = [];
		data.groupBooks.forEach(item => cloneArr4.push(item.book));
		setBookAddedList(cloneArr4);

		if (data.groupType === 'book') {
			const obj = listIdBook.find(item => item.value === data.groupCategories[0]?.category?.id);
			if (!_.isEmpty(obj)) {
				setDefaultCategoryOption(obj);
			}
		}

		// Lưu dữ liệu ban đầu, còn dùng để so sánh
		const categoryIdArray = [];
		data.groupCategories.forEach(item => categoryIdArray.push(item.category.id));
		setIntialState({
			name: data.name,
			description: data.description,
			authorIds: cloneArr3,
			tags: cloneArr1,
			categoryIds: categoryIdArray,
			bookIds: cloneArr4,
		});
	}, []);

	useEffect(() => {
		const newListHastag = listHashtags.map(item => `${item}`);
		if (lastTag.includes('#') && lastTag !== '#' && hashtagRegex.test(lastTag)) {
			setNewListTag([...newListHastag, lastTag]);
		} else {
			setNewListTag(newListHastag);
		}
	}, [listHashtags, lastTag]);

	useEffect(() => {
		let flag = false;
		switch (data.groupType) {
			case 'book':
				if (listBookAdd.length > 0 && categoryIdBook.length > 0) {
					flag = true;
				}
				break;
			case 'author':
				if (listAuthors.length > 0) {
					flag = true;
				}
				break;
			default: // case 'category'
				if (categoryIdBook.length > 0) {
					flag = true;
				}
		}
		if (flag === true && lastTag !== '#' && inputNameGroup !== '' && inputDescription !== '' && !showError) {
			const params = {
				name: inputNameGroup,
				description: inputDescription,
				authorIds: listAuthors,
				tags: newListTag,
				categoryIds: categoryIdBook,
				bookIds: listBookAdd,
			};
			!_.isEqual(intialState, params) ? setIsShowBtn(true) : setIsShowBtn(false);
		} else {
			setIsShowBtn(false);
		}
	}, [
		listAuthors,
		newListTag,
		inputDescription,
		inputNameGroup,
		listHashtags,
		listBookAdd,
		categoryIdBook,
		intialState,
		showError,
	]);

	useEffect(() => {
		const authorIdArr = [];
		for (let i = 0; i < authorAddedList.length; i++) {
			authorIdArr.push(authorAddedList[i].id);
		}
		setListAuthors(authorIdArr);
	}, [authorAddedList]);

	useEffect(() => {
		const bookIdArr = [];
		for (let i = 0; i < bookAddedList.length; i++) {
			bookIdArr.push(bookAddedList[i].id);
		}
		setListBookAdd(bookIdArr);
	}, [bookAddedList]);

	useEffect(() => {
		const categoryIdArr = [];
		for (let i = 0; i < categoryAddedList.length; i++) {
			categoryIdArr.push(categoryAddedList[i].id);
		}
		setCategoryIdBook(categoryIdArr);
	}, [categoryAddedList]);

	useEffect(() => {
		window.scroll({
			top: groupSettingContainer.current.offsetTop,
			behavior: 'smooth',
		});
	}, []);

	const onInputChange = f => e => {
		const value = e.target.value.trim();
		f(value);
	};

	const onchangeBookCategory = data => {
		setCategoryIdBook([data.value]);
	};

	const addCategory = category => {
		const foundAddItem = categoryAddedList.find(item => item.id === category.id);
		if (foundAddItem) {
			removeCategory(categoryAddedList.indexOf(foundAddItem));
		} else {
			const categoryArrayTemp = [...categoryAddedList];
			categoryArrayTemp.push(category);
			setCategoryAddedList(categoryArrayTemp);
			setInputCategoryValue('');
			setCategorySearchedList([]);
			if (categoryInputWrapper.current) {
				categoryInputWrapper.current.style.width = '0.5ch';
			}
		}
	};

	const removeCategory = paramIndex => {
		const categoryArr = [...categoryAddedList];
		categoryArr.splice(paramIndex, 1);
		setCategoryAddedList(categoryArr);
	};

	const searchCategory = e => {
		setGetDataFinishCategories(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		if (e.target.value) {
			debounceSearchCategories(e.target.value);
		}
		if (categoryInputWrapper.current) {
			categoryInputWrapper.current.style.width = categoryInput.current.value.length + 0.5 + 'ch';
		}
	};

	const addAuthor = author => {
		const foundAddItem = authorAddedList.find(item => item.id === author.id);
		if (foundAddItem) {
			removeAuthor(authorAddedList.indexOf(foundAddItem));
		} else {
			if (data.groupType === 'author' && authorAddedList.length >= 5) {
				toast.warning('Chỉ được chọn tối đa 5 tác giả');
			} else {
				const authorArrayTemp = [...authorAddedList];
				authorArrayTemp.push(author);
				setAuthorAddedList(authorArrayTemp);
				setInputAuthorValue('');
				setAuthorSearchedList([]);
				if (authorInputWrapper.current) {
					authorInputWrapper.current.style.width = '0.5ch';
				}
			}
		}
	};

	const removeAuthor = paramIndex => {
		const authorArr = [...authorAddedList];
		authorArr.splice(paramIndex, 1);
		setAuthorAddedList(authorArr);
	};

	const searchAuthor = e => {
		setGetDataFinishAuthors(false);
		setAuthorSearchedList([]);
		setInputAuthorValue(e.target.value);
		if (e.target.value) {
			debounceSearchAuthors(e.target.value);
		}
		if (authorInputWrapper.current) {
			authorInputWrapper.current.style.width = authorInput.current.value.length + 0.5 + 'ch';
		}
	};

	const addBook = book => {
		const foundAddItem = bookAddedList.find(item => item.id === book.id);
		if (foundAddItem) {
			removeBook(bookAddedList.indexOf(foundAddItem));
		} else {
			const bookArrayTemp = [...bookAddedList];
			bookArrayTemp.push(book);
			setBookAddedList(bookArrayTemp);
			setInputBookValue('');
			setBookSearchedList([]);
			if (bookInputWrapper.current) {
				bookInputWrapper.current.style.width = '0.5ch';
			}
		}
	};

	const removeBook = paramIndex => {
		const bookArr = [...bookAddedList];
		bookArr.splice(paramIndex, 1);
		setBookAddedList(bookArr);
	};

	const searchBook = e => {
		setGetDataFinishBooks(false);
		setBookSearchedList([]);
		setInputBookValue(e.target.value);
		if (e.target.value) {
			debounceSearchBooks(e.target.value);
		}
		if (bookInputWrapper.current) {
			bookInputWrapper.current.style.width = bookInput.current.value.length + 0.5 + 'ch';
		}
	};

	const debounceSearchAuthors = useCallback(
		_.debounce(inputValue => getSuggestionAuthors(inputValue), 700),
		[]
	);

	const debounceSearchCategories = useCallback(
		_.debounce(inputValue => getSuggestionCategories(inputValue), 700),
		[]
	);

	const debounceSearchBooks = useCallback(
		_.debounce(inputValue => getSuggestionBooks(inputValue), 700),
		[]
	);

	const updateGroup = async () => {
		if (isShowBtn) {
			const params = {
				id: data.id,
				param: {
					name: inputNameGroup,
					description: inputDescription,
					authorIds: listAuthors,
					tags: newListTag,
					categoryIds: categoryIdBook,
					bookIds: listBookAdd,
				},
			};

			try {
				await dispatch(editGroup(params)).unwrap();
				toast.success('Thay đổi thông tin nhóm thành công', { toastId: 'custom-id-PopupCreateGroup' });
				await fetchData();
				window.scroll(0, 0);
				handleChange('tabs');
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	const getSuggestionAuthors = async input => {
		try {
			const params = {
				q: input,
				type: 'authors',
				start: 0,
				limit: 10,
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			setAuthorSearchedList(result.rows);
			if (result.count > result.rows.length) {
				setHasMoreAuthorsEllipsis(true);
			} else {
				setHasMoreAuthorsEllipsis(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinishAuthors(true);
		}
	};

	const getSuggestionCategories = async input => {
		try {
			const params = {
				q: input,
				start: 0,
				limit: 10,
				type: 'categories',
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			setCategorySearchedList(result.rows);
			if (result.count > result.rows.length) {
				setHasMoreCategoriesEllipsis(true);
			} else {
				setHasMoreCategoriesEllipsis(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinishCategories(true);
		}
	};

	const getSuggestionBooks = async input => {
		try {
			const params = {
				q: input,
				type: 'books',
				start: 0,
				limit: 10,
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			setBookSearchedList(result.rows);
			if (result.count > result.rows.length) {
				setHasMoreBooksEllipsis(true);
			} else {
				setHasMoreBooksEllipsis(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinishBooks(true);
		}
	};

	return (
		<div className='group-settings__container' ref={groupSettingContainer}>
			<div className='group-settings__title'>
				<button onClick={() => handleChange('tabs')}>
					<BackArrow />
				</button>
				<h2>Cài đặt</h2>
			</div>
			<hr />
			<div className='group-settings__form'>
				<div className='group-settings__title-content'>
					<h3>Thiết lập nhóm</h3>
				</div>
				<div className='form-field-wrapper'>
					<div className='form-field-group'>
						<label>Tên nhóm</label>
						<Input
							inputRef={groupNameInput}
							isBorder={false}
							placeholder='Tên nhóm'
							defaultValue={data.name}
							handleChange={onInputChange(setInputNameGroup)}
							autoFocus
						/>
					</div>

					<div className='form-field-group'>
						<span style={{ fontWeight: '600' }}>
							Kiểu nội dung:{' '}
							{data.groupType === 'book' ? 'Sách' : data.groupType === 'author' ? 'Tác giả' : 'Chia sẻ'}
						</span>
					</div>

					{data.groupType === 'book' && (
						<div className='form-field-group'>
							<label>Chủ đề sách</label>
							<span className='form-field-authors__asterisk'>*</span>
							<SelectBox
								name='categoryBook'
								list={listIdBook}
								defaultOption={defaultCategoryOption}
								onChangeOption={onchangeBookCategory}
							/>
						</div>
					)}

					{data.groupType !== 'book' && (
						<div className='form-field-group'>
							<label>Chủ đề </label>
							{data.groupType === 'author' ? '' : <span className='form-field-authors__asterisk'>*</span>}
							<AddAndSearchItems
								itemAddedList={categoryAddedList}
								itemSearchedList={categorySearchedList}
								addItem={addCategory}
								removeItem={removeCategory}
								getDataFinish={getDataFinishCategories}
								searchItem={searchCategory}
								inputItemValue={inputCategoryValue}
								itemInputContainer={categoryInputContainer}
								itemInputWrapper={categoryInputWrapper}
								itemInput={categoryInput}
								hasSearchIcon={true}
								hasMoreEllipsis={hasMoreCategoriesEllipsis}
							/>
						</div>
					)}

					<div className='form-field-group'>
						<label>Tên tác giả</label>
						{data.groupType === 'category' ? '' : <span className='form-field-authors__asterisk'>*</span>}
						<AddAndSearchItems
							itemAddedList={authorAddedList}
							itemSearchedList={authorSearchedList}
							addItem={addAuthor}
							removeItem={removeAuthor}
							getDataFinish={getDataFinishAuthors}
							searchItem={searchAuthor}
							inputItemValue={inputAuthorValue}
							itemInputContainer={authorInputContainer}
							itemInputWrapper={authorInputWrapper}
							itemInput={authorInput}
							hasMoreEllipsis={hasMoreAuthorsEllipsis}
							placeholder={'Tìm kiếm và thêm tác giả'}
						/>
					</div>

					<div className='form-field-group'>
						<label>Tên sách</label>
						{data.groupType === 'category' || data.groupType === 'author' ? (
							''
						) : (
							<span className='form-field-authors__asterisk'>*</span>
						)}
						<AddAndSearchItems
							itemAddedList={bookAddedList}
							itemSearchedList={bookSearchedList}
							addItem={addBook}
							removeItem={removeBook}
							getDataFinish={getDataFinishBooks}
							searchItem={searchBook}
							inputItemValue={inputBookValue}
							itemInputContainer={bookInputContainer}
							itemInputWrapper={bookInputWrapper}
							itemInput={bookInput}
							hasMoreEllipsis={hasMoreBooksEllipsis}
							placeholder={'Tìm kiếm và thêm sách'}
						/>
					</div>

					<div className='form-field-group'>
						<label>Giới thiệu</label>
						<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
						<textarea
							ref={textArea}
							className='form-field-textarea'
							rows={10}
							onChange={onInputChange(setInputDescription)}
							defaultValue={data.description}
						/>
					</div>

					<InputHashtag
						listHashtags={listHashtags}
						setListHashtags={setListHashtags}
						setLastTag={setLastTag}
						showError={showError}
						setShowError={setShowError}
					/>

					<div className={`form-button ${!isShowBtn && 'disabled-btn'}`} onClick={updateGroup}>
						<button>Lưu thay đổi</button>
					</div>
				</div>
			</div>
		</div>
	);
}

SettingsGroup.propTypes = {
	handleChange: PropTypes.func,
	data: PropTypes.object,
	fetchData: PropTypes.func,
};

export default SettingsGroup;
