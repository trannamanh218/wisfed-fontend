import './create-quotes-modal.scss';
import { CloseX, WeatherStars, BackChevron, Search } from 'components/svg';
import { useEffect, useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import bookDefault from 'assets/images/default-book.png';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { creatQuotes, handleToggleUpdateHashtagOfQuotes } from 'reducers/redux-utils/quote/index';
import { toast } from 'react-toastify';
import { handleAfterCreatQuote } from 'reducers/redux-utils/quote';
import { NotificationError } from 'helpers/Error';
import AddAndSearchCategories from 'shared/add-and-search-categories';
import InputHashtag from 'shared/input/inputHashtag/inputHashtag';
import LoadingIndicator from 'shared/loading-indicator';

function CreatQuotesModal({ hideCreatQuotesModal }) {
	const [showTextFieldEditPlaceholder, setShowTextFieldEditPlaceholder] = useState(true);
	const [showTextFieldBackgroundSelect, setShowTextFieldBackgroundSelect] = useState(false);
	const [backgroundColor, setBackgroundColor] = useState('');
	const [inputBookValue, setInputBookValue] = useState('');
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	const [colorActiveIndex, setColorActiveIndex] = useState(-1);
	const [bookSearchedList, setBookSearchedList] = useState([]);
	const [bookAdded, setBookAdded] = useState({});
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [categoryAddedList, setCategoryAddedList] = useState([]);
	const [getDataFinishBooks, setGetDataFinishBooks] = useState(false);
	const [getDataFinishCategories, setGetDataFinishCategories] = useState(false);
	const [categoryAddedIdList, setCategoryAddedIdList] = useState([]);
	const [listHashtags, setListHashtags] = useState([]);
	const [hasMoreEllipsis, setHasMoreEllipsis] = useState(false);
	const [lastTag, setLastTag] = useState('');
	const [showError, setShowError] = useState(false);
	const [checkActiveButton, setCheckActiveButton] = useState(false);

	const textFieldEdit = useRef(null);
	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);
	const limitedValue = useRef(5);

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
		if (textFieldEdit.current) {
			textFieldEdit.current.addEventListener('input', handleTextFieldEditEvents);
			textFieldEdit.current.addEventListener('keypress', handleTextFieldEditEvents);
			return () => {
				if (textFieldEdit.current) {
					textFieldEdit.current.removeEventListener('input', handleTextFieldEditEvents);
					textFieldEdit.current.removeEventListener('keypress', handleTextFieldEditEvents);
				}
			};
		}
	}, [showTextFieldEditPlaceholder]);

	useEffect(() => {
		if (!showTextFieldEditPlaceholder && !_.isEmpty(bookAdded) && !showError) {
			setCheckActiveButton(true);
		} else {
			setCheckActiveButton(false);
		}
	}, [showTextFieldEditPlaceholder, bookAdded, showError]);

	const changeBackground = (item, index) => {
		setBackgroundColor(item);
		setColorActiveIndex(index);
	};

	const getSuggestionBooks = async input => {
		const option = { value: 'addBook' };
		try {
			const data = await dispatch(getSuggestionForPost({ input, option })).unwrap();
			setBookSearchedList(data.rows.slice(0, 3));
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinishBooks(true);
		}
	};

	const getSuggestionCategories = async input => {
		const option = { value: 'addCategory' };
		try {
			const data = await dispatch(getSuggestionForPost({ input, option })).unwrap();
			setCategorySearchedList(data.rows);
			if (data.count > data.rows.length) {
				setHasMoreEllipsis(true);
			} else {
				setHasMoreEllipsis(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFinishCategories(true);
		}
	};

	const debounceSearchBooks = useCallback(
		_.debounce(inputValue => getSuggestionBooks(inputValue), 700),
		[]
	);

	const debounceSearchCategories = useCallback(
		_.debounce(inputValue => getSuggestionCategories(inputValue), 700),
		[]
	);

	const searchBook = e => {
		setGetDataFinishBooks(false);
		setBookSearchedList([]);
		setInputBookValue(e.target.value);
		if (e.target.value) {
			debounceSearchBooks(e.target.value);
		}
	};

	const addBook = book => {
		setBookAdded(book);
		setInputBookValue('');
		setBookSearchedList([]);
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

	const addCategory = category => {
		if (categoryAddedList.filter(categoryAdded => categoryAdded.id === category.id).length > 0) {
			removeCategory(category.id);
		} else {
			const categoryArrayTemp = [...categoryAddedList];
			if (categoryArrayTemp.length < limitedValue.current) {
				categoryArrayTemp.push(category);
			} else {
				const customId = 'custom-id-handleAddToQuotes-addAuthor';
				toast.warning(`Chỉ được chọn tối đa ${limitedValue.current} chủ đề trong 1 lần tạo quotes`, {
					toastId: customId,
				});
			}
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

	useEffect(() => {
		const categoryIdArr = [];
		for (let i = 0; i < categoryAddedList.length; i++) {
			categoryIdArr.push(categoryAddedList[i].id);
		}
		setCategoryAddedIdList(categoryIdArr);
	}, [categoryAddedList]);

	const creatQuotesFnc = async () => {
		const newListHastag = listHashtags.map(item => `${item}`);
		let newList;
		if (lastTag.includes('#') && lastTag !== '#') {
			newList = [...newListHastag, lastTag];
		} else {
			newList = newListHastag;
		}

		try {
			const data = {
				quote: textFieldEdit.current.innerText,
				bookId: bookAdded.id,
				categories: categoryAddedIdList,
				tags: newList,
				background: backgroundColor,
			};
			const response = await dispatch(creatQuotes(data)).unwrap();
			if (response) {
				const customId = 'custom-Id-CreatQuotesModal';
				toast.success('Tạo quotes thành công', { toastId: customId });
				dispatch(handleToggleUpdateHashtagOfQuotes());
			}
			hideCreatQuotesModal();
			dispatch(handleAfterCreatQuote());
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='create-quotes-modal-content'>
			<div className='create-quotes-modal__header'>
				<div style={{ visibility: 'hidden' }} className='create-quotes-modal__header__close'>
					<CloseX />
				</div>
				<h5>Tạo Quotes</h5>
				<button className='create-quotes-modal__header__close' onClick={hideCreatQuotesModal}>
					<CloseX />
				</button>
			</div>
			<div className='create-quotes-modal__body'>
				{backgroundColor ? (
					<div
						className='create-quotes-modal__body__text-field-edit-wrapper has-background'
						style={{ backgroundImage: `linear-gradient(${backgroundColor})` }}
					>
						<div
							className='create-quotes-modal__body__text-field-edit has-background'
							contentEditable={true}
							ref={textFieldEdit}
						></div>
						<div
							className={classNames('create-quotes-modal__body__text-field-placeholder has-background', {
								'hide': !showTextFieldEditPlaceholder,
							})}
						>
							Nội dung Quotes của bạn (Dưới 500 ký tự)
						</div>
					</div>
				) : (
					<div className='create-quotes-modal__body__text-field-edit-wrapper default'>
						<div
							className='create-quotes-modal__body__text-field-edit default'
							contentEditable={true}
							ref={textFieldEdit}
						></div>
						<div
							className={classNames('create-quotes-modal__body__text-field-placeholder default', {
								'hide': !showTextFieldEditPlaceholder,
							})}
						>
							Nội dung Quotes của bạn (Dưới 500 ký tự)
						</div>
					</div>
				)}

				<div className='create-quotes-modal__body__select-background-container'>
					<div className='create-quotes-modal__body__select-background-button-box'>
						<button
							className={classNames('create-quotes-modal__body__select-background', {
								'open-button': !showTextFieldBackgroundSelect,
								'close-button': showTextFieldBackgroundSelect,
							})}
							onClick={() => setShowTextFieldBackgroundSelect(!showTextFieldBackgroundSelect)}
						>
							{!showTextFieldBackgroundSelect ? <WeatherStars /> : <BackChevron />}
						</button>
					</div>

					<div
						className={classNames('create-quotes-modal__body__select-background-box', {
							'show': showTextFieldBackgroundSelect,
						})}
					>
						<button
							className='create-quotes-modal__body__select-background-box-item'
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
								className={classNames('create-quotes-modal__body__select-background-box-item', {
									'active': index === colorActiveIndex,
								})}
							></button>
						))}
					</div>
				</div>
				<div className='create-quotes-modal__body__add-options'>
					<div className='create-quotes-modal__body__option-item'>
						<div className='create-quotes-modal__body__option-item__title'>*Sách (Bắt buộc)</div>
						<div className='create-quotes-modal__body__option-item__search-container'>
							{!_.isEmpty(bookAdded) ? (
								<div className='create-quotes-modal__body__option-item-added'>
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

						{/* Loading gọi dữ liệu  */}
						<div className='add-and-search-categories__loading'>
							{!getDataFinishBooks && inputBookValue && <LoadingIndicator />}
						</div>

						{inputBookValue.trim() !== '' && getDataFinishBooks && (
							<>
								{bookSearchedList.length > 0 ? (
									<div className='create-quotes-modal__body__option-item__search-result book'>
										{bookSearchedList.map(item => (
											<div
												className='create-quotes-modal__searched-item book'
												key={item.id}
												onClick={() => addBook(item)}
											>
												<img
													className='create-quotes-modal__book__image'
													src={item?.frontBookCover || item?.images[0] || bookDefault}
													onError={e => e.target.setAttribute('src', bookDefault)}
													alt='book'
												/>
												<div className='create-quotes-modal__book__name'>{item?.name}</div>
												<div className='create-quotes-modal__book__author'>
													{item?.authors[0]?.authorName}
												</div>
											</div>
										))}
									</div>
								) : (
									<div className='create-quotes-modal__no-search-result'>
										Không có kết quả phù hợp
									</div>
								)}
							</>
						)}
					</div>
					<div className='create-quotes-modal__body__option-item'>
						<div className='create-quotes-modal__body__option-item__title'>Chủ đề</div>
						<AddAndSearchCategories
							categoryAddedList={categoryAddedList}
							categorySearchedList={categorySearchedList}
							addCategory={addCategory}
							removeCategory={removeCategory}
							getDataFinish={getDataFinishCategories}
							searchCategory={searchCategory}
							inputCategoryValue={inputCategoryValue}
							categoryInputContainer={categoryInputContainer}
							categoryInputWrapper={categoryInputWrapper}
							categoryInput={categoryInput}
							hasSearchIcon={true}
							hasMoreEllipsis={hasMoreEllipsis}
						/>
					</div>

					<InputHashtag
						listHashtags={listHashtags}
						setListHashtags={setListHashtags}
						setLastTag={setLastTag}
						showError={showError}
						setShowError={setShowError}
					/>
				</div>
			</div>
			<div className='create-quotes-modal__footer'>
				<button
					className={checkActiveButton ? 'active' : ''}
					disabled={checkActiveButton ? false : true}
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
