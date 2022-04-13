import './creat-quotes-modal.scss';
import { CloseX, WeatherStars, BackChevron, Search } from 'components/svg';
import { useEffect, useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import avatarTest from 'assets/images/avatar2.png';
import bookSample from 'assets/images/sample-book-img.jpg';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { creatQuotes } from 'reducers/redux-utils/quote/index';
import { toast } from 'react-toastify';
import { handleAfterCreatQuote } from 'reducers/redux-utils/quote';
import { NotificationError } from 'helpers/Error';
import AddAndSearchCategories from 'shared/add-and-search-categories';

function CreatQuotesModal({ hideCreatQuotesModal }) {
	const [showTextFieldEditPlaceholder, setShowTextFieldEditPlaceholder] = useState(true);
	const [showTextFieldBackgroundSelect, setShowTextFieldBackgroundSelect] = useState(false);
	const [backgroundColor, setBackgroundColor] = useState('');
	const [inputAuthorValue, setInputAuthorValue] = useState('');
	const [inputBookValue, setInputBookValue] = useState('');
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	const [inputHashtagValue, setInputHashtagValue] = useState('');
	const [colorActiveIndex, setColorActiveIndex] = useState(-1);
	const [authorSearchedList, setAuthorSearchedList] = useState([]);
	const [authorAdded, setAuthorAdded] = useState('');
	const [bookSearchedList, setBookSearchedList] = useState([]);
	const [bookAdded, setBookAdded] = useState({});
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [categoryAddedList, setCategoryAddedList] = useState([]);
	const [getDataFinish, setGetDataFinish] = useState(false);
	const [categoryAddedIdList, setCategoryAddedIdList] = useState([]);
	const [hashTagsAddedArray, setHashTagsAddedArray] = useState([]);
	const textFieldEdit = useRef(null);
	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);

	const userInfo = useSelector(state => state.auth.userInfo);
	const dispatch = useDispatch();

	const colorData = [
		'100deg, #E3F7FF, #FFD8C3',
		'100deg, #FACEB8, #E6AFCC, #C8BEE5, #ACD1F1',
		'100deg, #EDF7F8, #B5C7E1',
		'100deg, #77C2F1, #FFB4ED',
		'100deg, #F9AB34, #FFE68E',
		'100deg, #FFD42A, #FFFC49',
		'100deg, #C5FFAA, #00BAC6',
	];

	useEffect(() => {
		textFieldEdit.current.focus();
	}, [backgroundColor]);

	const handleTextFieldEditEvents = () => {
		if (textFieldEdit.current.innerText.length > 0) {
			setShowTextFieldEditPlaceholder(false);
			if (textFieldEdit.current.innerText.length > 500) {
				textFieldEdit.current.addEventListener('keypress', disableEventsListener, true);
				textFieldEdit.current.addEventListener('paste', disableEventsListener, true);
				textFieldEdit.current.innerText = textFieldEdit.current.innerText.slice(0, 500);
			} else {
				textFieldEdit.current.removeEventListener('keypress', disableEventsListener, true);
				textFieldEdit.current.removeEventListener('paste', disableEventsListener, true);
			}
		} else {
			setShowTextFieldEditPlaceholder(true);
		}
	};

	const disableEventsListener = e => {
		e.stopPropagation();
		e.preventDefault();
	};

	useEffect(() => {
		textFieldEdit.current.addEventListener('input', handleTextFieldEditEvents);
		textFieldEdit.current.addEventListener('keypress', handleTextFieldEditEvents);
		return () => {
			textFieldEdit.current.removeEventListener('input', handleTextFieldEditEvents);
			textFieldEdit.current.removeEventListener('keypress', handleTextFieldEditEvents);
		};
	}, [showTextFieldEditPlaceholder]);

	const changeBackground = (item, index) => {
		setBackgroundColor(item);
		setColorActiveIndex(index);
	};

	const getSuggestionForCreatQuotes = async (input, option) => {
		try {
			const data = await dispatch(getSuggestionForPost({ input, option })).unwrap();
			if (option.value === 'addAuthor') {
				setAuthorSearchedList(data.rows.slice(0, 5));
			} else if (option.value === 'addBook') {
				setBookSearchedList(data.rows.slice(0, 3));
			} else if (option.value === 'addCategory') {
				setCategorySearchedList(data.rows);
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

	const searchAuthor = e => {
		setGetDataFinish(false);
		setAuthorSearchedList([]);
		setInputAuthorValue(e.target.value);
		debounceSearch(e.target.value, { value: 'addAuthor' });
	};

	const addAuthor = authorName => {
		setAuthorAdded(authorName);
		setInputAuthorValue('');
		setAuthorSearchedList([]);
	};

	const searchBook = e => {
		setGetDataFinish(false);
		setBookSearchedList([]);
		setInputBookValue(e.target.value);
		debounceSearch(e.target.value, { value: 'addBook' });
	};

	const addBook = book => {
		setBookAdded(book);
		setInputBookValue('');
		setBookSearchedList([]);
	};

	const searchCategory = e => {
		setGetDataFinish(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		debounceSearch(e.target.value, { value: 'addCategory' });
		categoryInputWrapper.current.style.width = categoryInput.current.value.length + 0.5 + 'ch';
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
			categoryInputWrapper.current.style.width = '0.5ch';
		}
	};

	const removeCategory = categoryId => {
		const categoryArr = [...categoryAddedList];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setCategoryAddedList(categoryArr);
	};

	useEffect(() => {
		const categoryIdArr = [];
		for (let i = 0; i < categoryAddedList.length; i++) {
			categoryIdArr.push(categoryAddedList[i].id);
		}
		setCategoryAddedIdList(categoryIdArr);
	}, [categoryAddedList]);

	const renderNoSearchResult = () => {
		return <div className='creat-quotes-modal__no-search-result'>Không có kết quả phù hợp</div>;
	};

	const updateHashTagsInputValue = e => {
		const hashtagRegex = /\B(\#[a-zA-Z]+\b)(?!;)/g;
		const hashTags = e.target.value.match(hashtagRegex);
		setInputHashtagValue(e.target.value);
		setHashTagsAddedArray(hashTags);
	};

	const creatQuotesFnc = async () => {
		try {
			const data = {
				quote: textFieldEdit.current.innerText,
				bookId: bookAdded.id,
				authorName: authorAdded,
				categories: categoryAddedIdList,
				tag: hashTagsAddedArray,
				background: backgroundColor,
			};
			const response = await dispatch(creatQuotes(data)).unwrap();
			if (response) {
				toast.success('Tạo quotes thành công');
			}
			hideCreatQuotesModal();
			dispatch(handleAfterCreatQuote());
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='creat-quotes-modal-content'>
			<div className='creat-quotes-modal__header'>
				<div style={{ visibility: 'hidden' }} className='creat-quotes-modal__header__close'>
					<CloseX />
				</div>
				<h5>Tạo Quotes</h5>
				<button className='creat-quotes-modal__header__close' onClick={hideCreatQuotesModal}>
					<CloseX />
				</button>
			</div>
			<div className='creat-quotes-modal__body'>
				{backgroundColor ? (
					<div
						className='creat-quotes-modal__body__text-field-edit-wrapper has-background'
						style={{ backgroundImage: `linear-gradient(${backgroundColor})` }}
					>
						<div
							className='creat-quotes-modal__body__text-field-edit has-background'
							contentEditable={true}
							ref={textFieldEdit}
						></div>
						<div
							className={classNames('creat-quotes-modal__body__text-field-placeholder has-background', {
								'hide': !showTextFieldEditPlaceholder,
							})}
						>
							Nội dung Quotes của bạn (Dưới 500 ký tự)
						</div>
					</div>
				) : (
					<div className='creat-quotes-modal__body__text-field-edit-wrapper default'>
						<div
							className='creat-quotes-modal__body__text-field-edit default'
							contentEditable={true}
							ref={textFieldEdit}
						></div>
						<div
							className={classNames('creat-quotes-modal__body__text-field-placeholder default', {
								'hide': !showTextFieldEditPlaceholder,
							})}
						>
							Nội dung Quotes của bạn (Dưới 500 ký tự)
						</div>
					</div>
				)}

				<div className='creat-quotes-modal__body__select-background-container'>
					<div className='creat-quotes-modal__body__select-background-button-box'>
						<button
							className={classNames('creat-quotes-modal__body__select-background', {
								'open-button': !showTextFieldBackgroundSelect,
								'close-button': showTextFieldBackgroundSelect,
							})}
							onClick={() => setShowTextFieldBackgroundSelect(!showTextFieldBackgroundSelect)}
						>
							{!showTextFieldBackgroundSelect ? <WeatherStars /> : <BackChevron />}
						</button>
					</div>

					<div
						className={classNames('creat-quotes-modal__body__select-background-box', {
							'show': showTextFieldBackgroundSelect,
						})}
					>
						<button
							className='creat-quotes-modal__body__select-background-box-item'
							style={{
								border: '#d9dbe9 4px solid',
								background: 'white',
							}}
							onClick={() => changeBackground('', -1)}
						></button>

						{colorData.map((item, index) => (
							<button
								key={index}
								style={{ backgroundImage: `linear-gradient(${item})` }}
								onClick={() => changeBackground(item, index)}
								className={classNames('creat-quotes-modal__body__select-background-box-item', {
									'active': index === colorActiveIndex,
								})}
							></button>
						))}
					</div>
				</div>
				<div className='creat-quotes-modal__body__add-options'>
					<div className='creat-quotes-modal__body__option-item'>
						<div className='creat-quotes-modal__body__option-item__title'>Tác giả</div>
						<div className='creat-quotes-modal__body__option-item__search-container'>
							{authorAdded ? (
								<div className='creat-quotes-modal__body__option-item-added'>
									<span>{authorAdded}</span>
									<button onClick={() => setAuthorAdded('')}>
										<CloseX />
									</button>
								</div>
							) : (
								<>
									<Search />
									<input
										placeholder='Tìm kiếm và thêm tác giả'
										value={inputAuthorValue}
										onChange={searchAuthor}
									/>
								</>
							)}
						</div>
						{inputAuthorValue.trim() !== '' && getDataFinish && (
							<>
								{authorSearchedList.length > 0 ? (
									<div className='creat-quotes-modal__body__option-item__search-result author'>
										{authorSearchedList.map(item => (
											<div
												className='creat-quotes-modal__searched-item author'
												key={item.id}
												onClick={() => addAuthor(`${item.firstName} ${item.lastName}`)}
											>
												<img
													className='creat-quotes-modal__author__avatar'
													src={item.avatarImage || avatarTest}
													alt='author'
												/>
												<div className='creat-quotes-modal__author__name'>{`${item.firstName} ${item.lastName}`}</div>
											</div>
										))}
									</div>
								) : (
									<>{renderNoSearchResult()}</>
								)}
							</>
						)}
					</div>
					<div className='creat-quotes-modal__body__option-item'>
						<div className='creat-quotes-modal__body__option-item__title'>*Sách (Bắt buộc)</div>
						<div className='creat-quotes-modal__body__option-item__search-container'>
							{!_.isEmpty(bookAdded) ? (
								<div className='creat-quotes-modal__body__option-item-added'>
									<span>{bookAdded.name}</span>
									<button onClick={() => setBookAdded({})}>
										<CloseX />
									</button>
								</div>
							) : (
								<>
									<Search />
									<input
										placeholder='Tìm kiếm và thêm sách'
										value={inputBookValue}
										onChange={searchBook}
									/>
								</>
							)}
						</div>
						{inputBookValue.trim() !== '' && getDataFinish && (
							<>
								{bookSearchedList.length > 0 ? (
									<div className='creat-quotes-modal__body__option-item__search-result book'>
										{bookSearchedList.map(item => (
											<div
												className='creat-quotes-modal__searched-item book'
												key={item.id}
												onClick={() => addBook(item)}
											>
												<img
													className='creat-quotes-modal__book__image'
													src={item?.frontBookCover || item?.images[0] || bookSample}
													alt='book'
												/>
												<div className='creat-quotes-modal__book__name'>{item?.name}</div>
												<div className='creat-quotes-modal__book__author'>
													{item?.authors[0]?.authorName}
												</div>
											</div>
										))}
									</div>
								) : (
									<>{renderNoSearchResult()}</>
								)}
							</>
						)}
					</div>
					<div className='creat-quotes-modal__body__option-item'>
						<div className='creat-quotes-modal__body__option-item__title'>Chủ đề</div>
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
						/>
					</div>
					<div className='creat-quotes-modal__body__option-item'>
						<div className='creat-quotes-modal__body__option-item__title'>Từ khóa</div>
						<div className='creat-quotes-modal__body__option-item__search-container'>
							<input
								style={{ margin: '0' }}
								placeholder='Nhập từ khóa'
								value={inputHashtagValue}
								onChange={updateHashTagsInputValue}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='creat-quotes-modal__footer'>
				<button
					className={!showTextFieldEditPlaceholder && !_.isEmpty(bookAdded) ? 'active' : ''}
					onClick={creatQuotesFnc}
				>
					Tạo Quotes
				</button>
			</div>
		</div>
	);
}

CreatQuotesModal.propTypes = {
	hideCreatQuotesModal: PropTypes.func,
};

export default CreatQuotesModal;
