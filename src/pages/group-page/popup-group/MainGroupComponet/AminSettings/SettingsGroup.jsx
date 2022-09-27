import React, { useRef, useState, useCallback, useEffect } from 'react';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import { BackArrow } from 'components/svg';
import './group-settings.scss';
import PropTypes from 'prop-types';
import AddAndSearchCategories from 'shared/add-and-search-categories';
import { CloseIconX } from 'components/svg';
import { toast } from 'react-toastify';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';
import { getFilterSearch } from 'reducers/redux-utils/search';
function SettingsGroup({ handleChange, data }) {
	const listIdBook = [
		{ value: 27, title: 'Yêu đọc sách' },
		{ value: 30, title: 'Thử thách đọc sách' },
	];
	const listKindOfGroup = [
		{ value: 'book', title: 'Sách' },
		{ value: 'author', title: 'Tác giả' },
		{ value: 'category', title: ' Chia sẻ' },
	];
	const kindOfGroupRef = useRef({
		value: data.groupType,
		title: data.groupType === 'book' ? 'Sách' : data.groupType === 'author' ? 'Tác giả' : 'Chia sẻ',
	});
	const textArea = useRef(null);
	const groupNameInput = useRef('');
	const categoryBookRef = useRef({ value: 'default', title: 'Chọn chủ đề' });
	const dispatch = useDispatch();

	const [inputNameGroup, setInputNameGroup] = useState('');
	const [inputDiscription, setInputDiscription] = useState('');
	const [inputHashtag, setInputHashtag] = useState('');
	const [listHashtags, setListHashtags] = useState([]);
	const [isShowBtn, setIsShowBtn] = useState(false);
	const [kindOfGroup, setKindOfGroup] = useState({});
	const [lastTag, setLastTag] = useState('');

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

	const [getDataFinish, setGetDataFinish] = useState(false);

	const [show, setShow] = useState(false);

	const dataRef = useRef('');
	const inputRefHashtag = useRef(null);

	const authorInputContainer = useRef(null);
	const authorInputWrapper = useRef(null);
	const authorInput = useRef(null);

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const bookInputContainer = useRef(null);
	const bookInputWrapper = useRef(null);
	const bookInput = useRef(null);

	const hastagRegex = /(#[a-z0-9][a-z0-9\-_]*)/gi;

	const onchangeKindOfGroup = data => {
		kindOfGroupRef.current = data;
		setKindOfGroup(data);
	};

	const onInputChange = f => e => {
		const value = e.target.value.trim();
		f(value);
		if (!hastagRegex.test(value)) {
			setShow(true);
		} else {
			setShow(false);
		}
	};

	const onchangeBookCategory = data => {
		setCategoryIdBook([data.value]);
	};

	const addCategory = category => {
		if (categoryAddedList.filter(categoryAdded => categoryAdded.id === category.id).length > 0) {
			removeCategory(category.id);
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

	const removeCategory = categoryId => {
		const categoryArr = [...categoryAddedList];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setCategoryAddedList(categoryArr);
	};

	const searchCategory = e => {
		setGetDataFinish(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		if (e.target.value) {
			debounceSearch(e.target.value, { value: 'addCategory' });
		}
		if (categoryInputWrapper.current) {
			categoryInputWrapper.current.style.width = categoryInput.current.value.length + 0.5 + 'ch';
		}
	};

	const addAuthor = author => {
		if (authorAddedList.filter(authorAdded => authorAdded.id === author.id).length > 0) {
			removeAuthor(author.id);
		} else {
			if (kindOfGroup.value === 'author' && authorAddedList.length >= 5) {
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

	const removeAuthor = authorId => {
		const authorArr = [...authorAddedList];
		const index = authorArr.findIndex(item => item.id === authorId);
		authorArr.splice(index, 1);
		setAuthorAddedList(authorArr);
	};

	const searchAuthor = e => {
		setGetDataFinish(false);
		setAuthorSearchedList([]);
		setInputAuthorValue(e.target.value);
		if (e.target.value) {
			debounceSearch(e.target.value, { value: 'addAuthor' });
		}
		if (authorInputWrapper.current) {
			authorInputWrapper.current.style.width = authorInput.current.value.length + 0.5 + 'ch';
		}
	};

	const addBook = book => {
		if (bookAddedList.filter(bookAdded => bookAdded.id === book.id).length > 0) {
			removeBook(book.id);
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

	const removeBook = bookId => {
		const bookArr = [...bookAddedList];
		const index = bookArr.findIndex(item => item.id === bookId);
		bookArr.splice(index, 1);
		setBookAddedList(bookArr);
	};

	const searchBook = e => {
		setGetDataFinish(false);
		setBookSearchedList([]);
		setInputBookValue(e.target.value);
		if (e.target.value) {
			debounceSearch(e.target.value, { value: 'addBook' });
		}
		if (bookInputWrapper.current) {
			bookInputWrapper.current.style.width = bookInput.current.value.length + 0.5 + 'ch';
		}
	};

	const handleRemoveTag = e => {
		const newList = listHashtags.filter(item => item !== e);
		setListHashtags(newList);
	};

	const debounceSearch = useCallback(
		_.debounce((inputValue, option) => getSuggestionForCreatQuotes(inputValue, option), 700),
		[]
	);

	const updateGroup = async () => {
		if (isShowBtn) {
			const newListHastag = listHashtags.map(item => `${item}`);
			let newList;
			if (lastTag.includes('#') && lastTag !== '#') {
				newList = [...newListHastag, lastTag];
			} else {
				newList = newListHastag;
			}

			const data = {
				name: inputNameGroup,
				description: inputDiscription,
				groupType: kindOfGroup.value,
				authorIds: listAuthors,
				tags: newList,
				categoryIds: categoryIdBook,
				bookIds: listBookAdd,
			};

			try {
				// await dispatch(getCreatGroup(data)).unwrap();
				const customId = 'custom-id-PopupCreateGroup';
				toast.success('Thay đổi thông tin nhóm thành công', { toastId: customId });
				// dispatch(handleResetGroupList());
			} catch (err) {
				NotificationError(err);
			} finally {
				// handleClose();
			}
		}
	};

	const getSuggestionForCreatQuotes = async (input, option) => {
		try {
			if (option.value !== 'addAuthor') {
				const data = await dispatch(getSuggestionForPost({ input, option })).unwrap();
				if (option.value === 'addCategory') {
					setCategorySearchedList(data.rows);
					if (data.count > data.rows.length) {
						setHasMoreCategoriesEllipsis(true);
					} else {
						setHasMoreCategoriesEllipsis(false);
					}
				}
				if (option.value === 'addBook') {
					setBookSearchedList(data.rows);
					if (data.count > data.rows.length) {
						setHasMoreBooksEllipsis(true);
					} else {
						setHasMoreBooksEllipsis(false);
					}
				}
			}
			if (option.value === 'addAuthor') {
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
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			// setGetDataFinish(true);
		}
	};

	useEffect(() => {
		const cloneArr = [];
		data.groupTags.forEach(item => cloneArr.push(item.tag.name));
		setListHashtags(cloneArr);
	}, []);

	useEffect(() => {
		const dataCheck = listHashtags.filter(item => dataRef.current === item);

		if (dataRef.current !== '' && dataCheck.length < 1) {
			const check = dataRef.current
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/đ/g, 'd')
				.replace(/Đ/g, 'D');
			const newList = [...listHashtags, check];
			setListHashtags(newList);
		}
	}, [dataRef.current]);

	useEffect(() => {
		setLastTag(
			inputHashtag
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/đ/g, 'd')
				.replace(/Đ/g, 'D')
		);
	}, [inputHashtag]);

	useEffect(() => {
		if (
			(lastTag.includes('#') || !_.isEmpty(listHashtags)) &&
			lastTag !== '#' &&
			inputDiscription !== '' &&
			inputNameGroup !== ''
		) {
			switch (kindOfGroup.value) {
				case 'book':
					if (listBookAdd.length > 0 && categoryIdBook.length > 0) {
						setIsShowBtn(true);
					} else {
						setIsShowBtn(false);
					}
					break;
				case 'author':
					if (listAuthors.length > 0) {
						setIsShowBtn(true);
					} else {
						setIsShowBtn(false);
					}
					break;
				default: // case 'category'
					if (categoryIdBook.length > 0) {
						setIsShowBtn(true);
					} else {
						setIsShowBtn(false);
					}
			}
		} else {
			setIsShowBtn(false);
		}
	}, [
		listAuthors,
		lastTag,
		kindOfGroup,
		inputDiscription,
		inputNameGroup,
		listHashtags,
		listBookAdd,
		categoryIdBook,
	]);

	useEffect(() => {
		const hashtagElement = document.getElementById('hashtag');
		const handleHashtag = e => {
			if (e.keyCode === 32 && hastagRegex.test(inputHashtag)) {
				dataRef.current = inputHashtag.trim();
				inputRefHashtag.current.value = '';
			}
		};
		hashtagElement.addEventListener('keydown', handleHashtag);

		return () => hashtagElement.removeEventListener('keydown', handleHashtag);
	}, [inputHashtag]);

	return (
		<>
			<div className='group-settings__container'>
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
						<div className='form-field-name'>
							<label>Tên nhóm</label>
							<Input
								inputRef={groupNameInput}
								isBorder={false}
								placeholder='Tên nhóm'
								defaultValue={data.name}
								handleChange={onInputChange(setInputNameGroup)}
							/>
						</div>
						<div className='form-field-select__kind-of-group'>
							<label>Kiểu nội dung</label>
							<SelectBox
								name='kindofgroup'
								list={listKindOfGroup}
								defaultOption={kindOfGroupRef.current}
								onChangeOption={onchangeKindOfGroup}
							/>
						</div>

						{kindOfGroup.value !== 'default' && (
							<>
								{kindOfGroup.value === 'book' && (
									<div className='form-field-select__kind-of-group'>
										<label>Chủ đề sách</label>
										<span className='form-field-authors__asterisk'>*</span>
										<SelectBox
											name='categoryBook'
											list={listIdBook}
											defaultOption={categoryBookRef.current}
											onChangeOption={onchangeBookCategory}
										/>
									</div>
								)}

								{kindOfGroup.value !== 'book' && (
									<div className='form-field-select__kind-of-group'>
										<label>Chủ đề </label>
										{kindOfGroup.value === 'author' ? (
											''
										) : (
											<span className='form-field-authors__asterisk'>*</span>
										)}
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
											hasMoreEllipsis={hasMoreCategoriesEllipsis}
										/>
									</div>
								)}

								<div className='form-field-authors'>
									<label>Tên tác giả</label>
									{kindOfGroup.value === 'category' ? (
										''
									) : (
										<span className='form-field-authors__asterisk'>*</span>
									)}
									<AddAndSearchCategories
										categoryAddedList={authorAddedList}
										categorySearchedList={authorSearchedList}
										addCategory={addAuthor}
										removeCategory={removeAuthor}
										getDataFinish={getDataFinish}
										searchCategory={searchAuthor}
										inputCategoryValue={inputAuthorValue}
										categoryInputContainer={authorInputContainer}
										categoryInputWrapper={authorInputWrapper}
										categoryInput={authorInput}
										hasMoreEllipsis={hasMoreAuthorsEllipsis}
									/>
								</div>

								<div className='form-field-authors'>
									<label>Tên sách</label>
									{kindOfGroup.value === 'category' || kindOfGroup.value === 'author' ? (
										''
									) : (
										<span className='form-field-authors__asterisk'>*</span>
									)}
									<AddAndSearchCategories
										categoryAddedList={bookAddedList}
										categorySearchedList={bookSearchedList}
										addCategory={addBook}
										removeCategory={removeBook}
										getDataFinish={getDataFinish}
										searchCategory={searchBook}
										inputCategoryValue={inputBookValue}
										categoryInputContainer={bookInputContainer}
										categoryInputWrapper={bookInputWrapper}
										categoryInput={bookInput}
										hasMoreEllipsis={hasMoreBooksEllipsis}
									/>
								</div>
							</>
						)}

						<div className='form-field-discription'>
							<label style={{ marginTop: '0px' }}>Giới thiệu</label>
							<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
							<textarea
								ref={textArea}
								className='form-field-textarea'
								rows={10}
								onChange={onInputChange(setInputDiscription)}
								defaultValue={data.description}
							/>
						</div>

						<div className='form-field-hashtag'>
							<label>Hashtags</label>
							<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
							<div className='list__author-tags' onClick={() => inputRefHashtag.current.focus()}>
								{listHashtags.length > 0 && (
									<div className='input__authors'>
										{listHashtags.map(item => (
											<>
												<span key={item}>
													{item}
													<button
														className='close__author'
														onClick={() => {
															handleRemoveTag(item);
														}}
													>
														<CloseIconX />
													</button>
												</span>
											</>
										))}
									</div>
								)}
								<Input
									id='hashtag'
									isBorder={false}
									placeholder='Nhập hashtag'
									handleChange={onInputChange(setInputHashtag)}
									inputRef={inputRefHashtag}
								/>
							</div>
							{show && !!inputHashtag ? (
								<span style={{ color: '#e61b00' }}>Vui lòng nhập đúng định dạng</span>
							) : (
								''
							)}
						</div>

						<div className='group-manage__title__content'>
							<h3>Quản lý thành viên và nội dung</h3>
						</div>
						<div className='form-field-select__kind-of-group'>
							<label>Kiểu nội dung</label>
							<SelectBox
								name='kindofgroup'
								list={listKindOfGroup}
								defaultOption={kindOfGroupRef.current}
								onChangeOption={onchangeKindOfGroup}
							/>
						</div>
						<div className='form-field-select__kind-of-group'>
							<label>Kiểu nội dung</label>
							<SelectBox
								name='kindofgroup'
								list={listKindOfGroup}
								defaultOption={kindOfGroupRef.current}
								onChangeOption={onchangeKindOfGroup}
							/>
						</div>
						<div>
							<span>Phê duyệt bài viết</span> <button></button>
						</div>
						<div className='form-button'>
							<button onClick={updateGroup}>Lưu thay đổi</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

SettingsGroup.propTypes = {
	handleChange: PropTypes.func,
	data: PropTypes.object,
};

export default SettingsGroup;
