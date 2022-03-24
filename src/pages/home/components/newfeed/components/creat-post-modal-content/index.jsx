import classNames from 'classnames';
import { CloseX, Image, WorldNet } from 'components/svg';
import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createActivity, getSuggestionForPost } from 'reducers/redux-utils/activity';
import PostEditBook from 'shared/post-edit-book';
import OptionsPost from './OptionsPost';
import ShareModeComponent from './ShareModeComponent';
import CreatPostSubModal from './CreatePostSubModal';
import TaggedList from './TaggedList';
import UploadImage from './UploadImage';
import PreviewLink from 'shared/preview-link/PreviewLink';
import { getPreviewUrl } from 'reducers/redux-utils/post';
import { useCallback } from 'react';
import { Circle as CircleLoading } from 'shared/loading';
import './style.scss';
import UserAvatar from 'shared/user-avatar';
import { updateCurrentBook, updateProgressReadingBook } from 'reducers/redux-utils/book';
import { STATUS_BOOK } from 'constants';
import { usePrevious } from 'shared/hooks';
import { addBookToDefaultLibrary } from 'reducers/redux-utils/library';
import { setting } from './settings';

function CreatPostModalContent({ hideCreatPostModal, showModalCreatPost, option, onChangeOption, onChangeNewPost }) {
	const [shareMode, setShareMode] = useState({ value: 'public', title: 'Mọi người', icon: <WorldNet /> });
	const [showTextFieldEditPlaceholder, setShowTextFieldEditPlaceholder] = useState(true);
	const [showMainModal, setShowMainModal] = useState(showModalCreatPost);
	const [suggestionData, setSuggestionData] = useState([]);
	const mentionData = useRef({});
	const [taggedData, setTaggedData] = useState({
		'addBook': {},
		'addAuthor': [],
		'addFriends': [],
		'addCategory': [],
		'addImages': [],
	});
	const [fetchingUrlInfo, setFetchingUrlInfo] = useState(false);
	const [hasUrl, setHasUrl] = useState(false);
	const [urlAdded, setUrlAdded] = useState({});
	const [urlAddedArray, setUrlAddedArray] = useState([]);
	const [status, setStatus] = useState(STATUS_IDLE);
	const [showUpload, setShowUpload] = useState(false);
	const [validationInput, setValidationInput] = useState();
	const dispatch = useDispatch();
	const textFieldEdit = useRef(null);
	const taggedDataPrevious = usePrevious(taggedData);

	const {
		auth: { userInfo },
		book: { bookForCreatePost },
	} = useSelector(state => state);

	const { optionList, shareModeList } = setting;

	useEffect(() => {
		textFieldEdit.current.focus();
	}, []);

	useEffect(() => {
		if (!_.isEmpty(bookForCreatePost)) {
			const newData = { ...taggedData };
			const pages = { read: bookForCreatePost.page, reading: '', wantToRead: '' };
			newData.addBook = { ...bookForCreatePost, progress: pages[bookForCreatePost.status] };
			setTaggedData(newData);
		}
	}, [bookForCreatePost]);

	useEffect(() => {
		textFieldEdit.current.addEventListener('input', () => {
			handlePlaceholder();
			detectUrl();
			createSpanElements();
		});

		return () => {
			document.removeEventListener('input', handlePlaceholder);
		};
	}, [showTextFieldEditPlaceholder]);

	useEffect(() => {
		if (!_.isEmpty(option)) {
			setShowMainModal(false);
		}
	}, [option]);

	const detectUrl = useCallback(
		_.debounce(() => {
			const urlRegex =
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
			const url = textFieldEdit.current.innerText.match(urlRegex);
			if (url !== null) {
				setUrlAddedArray(url);
				setHasUrl(true);
			}
		}, 1000),
		[]
	);

	useEffect(() => {
		if (urlAddedArray.length > 0) {
			getPreviewUrlFnc(urlAddedArray[urlAddedArray.length - 1]);
		}
	}, [urlAddedArray.length]);

	const createSpanElements = () => {
		const subStringArray = textFieldEdit.current.innerText.split(' ');
		textFieldEdit.current.innerText = '';
		const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
		for (let i = 0; i < subStringArray.length; i++) {
			if (subStringArray[i].match(urlRegex)) {
				subStringArray[i] = `<span class="url-color">${subStringArray[i]}</span>`;
			} else {
				subStringArray[i] = `<span>${subStringArray[i]}</span>`;
			}
		}
		textFieldEdit.current.innerHTML = subStringArray.join(' ');
		placeCaretAtEnd(textFieldEdit.current);
	};

	const placeCaretAtEnd = el => {
		el.focus();
		if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
			const range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (typeof document.body.createTextRange != 'undefined') {
			const textRange = document.body.createTextRange();
			textRange.moveToElementText(el);
			textRange.collapse(false);
			textRange.select();
		}
	};

	const getPreviewUrlFnc = async url => {
		setFetchingUrlInfo(true);
		const data = { 'url': url };
		try {
			const res = await dispatch(getPreviewUrl(data)).unwrap();
			setUrlAdded(res);
		} catch (err) {
			const obj = { url: url, title: url, images: [] };
			setUrlAdded(obj);
		} finally {
			setFetchingUrlInfo(false);
		}
	};

	const removeUrlPreview = () => {
		setHasUrl(false);
	};

	const handlePlaceholder = () => {
		if (textFieldEdit.current.innerText.length > 0) {
			setShowTextFieldEditPlaceholder(false);
		} else {
			setShowTextFieldEditPlaceholder(true);
		}
	};

	const fetchSuggestion = async (input, option) => {
		try {
			const data = await dispatch(getSuggestionForPost({ input, option, userInfo })).unwrap();
			setSuggestionData(data.rows);
		} catch (err) {
			return err;
		}
	};

	const backToMainModal = () => {
		setShowMainModal(true);
	};

	const addOptionsToPost = param => {
		onChangeOption(param);
		setShowMainModal(false);
		if (param.value === 'modifyImages') {
			setShowMainModal(true);
		}
	};

	const handleOpenUploadImage = () => {
		setShowUpload(true);
		addOptionsToPost({ value: 'addImages', title: 'chỉnh sửa ảnh', icon: <Image />, message: '' });
	};

	const deleteImage = imageIndex => {
		const newImagesArray = [...taggedData.addImages];
		newImagesArray.splice(imageIndex, 1);
		setTaggedData(prev => ({ ...prev, 'addImages': newImagesArray }));
		if (!newImagesArray.length) {
			backToMainModal();
			addOptionsToPost({ value: 'addImages', title: 'chỉnh sửa ảnh', icon: <Image />, message: '' });
		}
	};

	const handleAddToPost = data => {
		const newData = { ...taggedData };

		if (option.value === 'addAuthor' || option.value === 'addFriends' || option.value === 'addCategory') {
			const listData = [...taggedData[option.value]];
			const lastItem = listData[listData.length - 1];
			if (!listData.length || (!_.isEmpty(lastItem) && lastItem.id !== data.id)) {
				listData.push(data);
			}

			newData[option.value] = listData;
		} else if (option.value === 'addBook') {
			newData[option.value] = data;
		} else if (option.value === 'addImages') {
			newData[option.value] = data;
			setShowMainModal(false);
		}

		setTaggedData(newData);
	};

	const removeTaggedItem = (data, type) => {
		if (type !== 'addBook') {
			const currentTaggedList = taggedData[type];
			const newList = currentTaggedList.filter(item => item.id !== data.id);
			setTaggedData(prev => ({ ...prev, [type]: newList }));
		} else {
			setTaggedData(prev => ({ ...prev, [type]: {} }));
		}
	};

	const generateData = () => {
		const params = {
			msg: textFieldEdit?.current?.innerHTML,
			mentionsUser: [],
			mentionsAuthor: [],
			mentionsCategory: [],
			image: [],
			preview: urlAdded,
		};

		params.mentionsUser = taggedData.addFriends.length ? taggedData.addFriends.map(item => item.id) : [];
		params.mentionsAuthor = taggedData.addAuthor.length ? taggedData.addAuthor.map(item => item.id) : [];
		params.image = taggedData.addImages.length ? taggedData.addImages : [];
		params.mentionsCategory = taggedData.addCategory.length ? taggedData.addCategory.map(item => item.id) : [];
		if (!_.isEmpty(taggedData.addBook)) {
			params.bookId = taggedData.addBook.id;
		}

		return params;
	};

	const createNewActivity = params => {
		return dispatch(createActivity(params)).unwrap();
	};

	const handleUpdateProgress = params => {
		const { status, progress } = taggedData.addBook;
		const convertProgress = parseInt(progress) || 0;
		const progressParams = { id: params.bookId, progress: convertProgress };

		// read
		if (status) {
			if (status === STATUS_BOOK.read || STATUS_BOOK.reading) {
				return dispatch(updateProgressReadingBook(progressParams)).unwrap();
			} else if (status === STATUS_BOOK.wantToRead) {
				return dispatch(updateProgressReadingBook(progressParams)).unwrap();
			}
		} else {
			let type = STATUS_BOOK.wantToRead;
			if (convertProgress > 0 && convertProgress < taggedData.addBook.page) {
				type = STATUS_BOOK.reading;
			} else if (convertProgress === taggedData.addBook.page) {
				type = STATUS_BOOK.read;
			}

			const addBookParams = { bookId: params.bookId, type };
			const addToDefaultLibraryRequest = dispatch(addBookToDefaultLibrary(addBookParams)).unwrap();
			const updateProgressRequest = dispatch(updateProgressReadingBook(progressParams)).unwrap();
			return Promise.all([addToDefaultLibraryRequest, updateProgressRequest]);
		}
	};

	const onCreatePost = async () => {
		const params = generateData();
		// book, author , topic is required
		if ((params.bookId || params.mentionsAuthor.length || params.mentionsCategory.length) && params.msg) {
			setStatus(STATUS_LOADING);

			try {
				if (params.bookId) {
					await handleUpdateProgress(params);
					await createNewActivity(params);
				} else {
					await createNewActivity(params);
				}
				setStatus(STATUS_SUCCESS);
				toast.success('Tạo post thành công!');
				onChangeNewPost();
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
				toast.error('Tạo post thất bại!');
			} finally {
				dispatch(updateCurrentBook({}));
				setStatus(STATUS_IDLE);
				hideCreatPostModal();
				onChangeOption({});
			}
		}
	};

	const checkActive = () => {
		let isActive = false;

		if (
			(!_.isEmpty(taggedData.addBook) || taggedData.addAuthor.length || taggedData.addCategory.length) &&
			textFieldEdit.current?.innerText
		) {
			isActive = true;
		}

		return isActive && !validationInput;
	};

	const handleValidationInput = value => {
		setValidationInput(value);
	};

	return (
		<div className='creat-post-modal-content'>
			<CircleLoading loading={status === STATUS_LOADING} />
			{/*main */}
			<div
				className={classNames('creat-post-modal-content__main', {
					'hide': option.value !== 'addImages' && !showMainModal,
				})}
			>
				<div className='creat-post-modal-content__main__header'>
					<div style={{ visibility: 'hidden' }} className='creat-post-modal-content__main__close'>
						<CloseX />
					</div>
					<h5>Tạo bài viết</h5>
					<button className='creat-post-modal-content__main__close' onClick={hideCreatPostModal}>
						<CloseX />
					</button>
				</div>
				<Form
					onSubmit={e => {
						e.preventDefault();
					}}
					id='createPostForm'
				>
					<div className='creat-post-modal-content__main__body'>
						<div className='creat-post-modal-content__main__body__user-info'>
							<div className='creat-post-modal-content__main__body__user-info__block-left'>
								<UserAvatar className='newfeed__creat-post__avatar' source={userInfo?.avatarImage} />
							</div>
							<div className='creat-post-modal-content__main__body__user-info__block-right'>
								<p>
									{userInfo.fullName || userInfo.lastName || userInfo.firstName || 'Không xác định'}

									{taggedData.addFriends.length ? (
										<>
											<span className='d-inline-block mx-1'>cùng với</span>
											{taggedData.addFriends.map(item => (
												<span key={item.id}>
													{item.fullName ||
														item.lastName ||
														item.firstName ||
														'Không xác định'}
												</span>
											))}
										</>
									) : (
										''
									)}
								</p>
								<ShareModeComponent
									list={shareModeList}
									shareMode={shareMode}
									setShareMode={setShareMode}
								/>
							</div>
						</div>
						<div
							className={classNames('creat-post-modal-content__main__body__text-field-edit-wrapper', {
								'height-higher': showUpload || hasUrl,
							})}
						>
							<div
								className='creat-post-modal-content__main__body__text-field-edit'
								contentEditable={true}
								ref={textFieldEdit}
							></div>
							<div
								className={classNames('creat-post-modal-content__main__body__text-field-placeholder', {
									'hide': !showTextFieldEditPlaceholder,
								})}
							>
								Hãy chia sẻ cảm nhận của bạn về cuốn sách
							</div>

							{!_.isEmpty(taggedData.addBook) && (
								<a href='#' className='tagged-book'>
									{taggedData.addBook.name}
								</a>
							)}

							<TaggedList taggedData={taggedData} removeTaggedItem={removeTaggedItem} type='addAuthor' />
							<TaggedList
								taggedData={taggedData}
								removeTaggedItem={removeTaggedItem}
								type='addCategory'
							/>

							{!_.isEmpty(taggedData.addBook) && (
								<PostEditBook
									data={taggedData.addBook}
									handleValidationInput={handleValidationInput}
									validationInput={validationInput}
									handleAddToPost={handleAddToPost}
								/>
							)}
							{showUpload && (
								<UploadImage
									addOptionsToPost={addOptionsToPost}
									optionList={optionList}
									handleAddToPost={handleAddToPost}
									taggedData={taggedData}
								/>
							)}
							{hasUrl && !showUpload && (
								<PreviewLink
									urlData={urlAdded}
									isFetching={fetchingUrlInfo}
									removeUrlPreview={removeUrlPreview}
								/>
							)}
						</div>
					</div>

					<div className='creat-post-modal-content__main__options-and-submit'>
						<div className='creat-post-modal-content__main__options'>
							<span>Thêm vào bài viết</span>
							<div className='creat-post-modal-content__main__options__items'>
								<OptionsPost
									list={optionList}
									addOptionsToPost={addOptionsToPost}
									taggedData={taggedData}
								/>
								<label
									htmlFor='image-upload'
									className='creat-post-modal-content__main__options__item-add-to-post'
									onClick={handleOpenUploadImage}
								>
									<Image />
								</label>
							</div>
						</div>
						<button
							className={classNames('creat-post-modal-content__main__submit', {
								'active': checkActive(),
							})}
							type='submit'
							form='createPostForm'
							onClick={e => {
								if (checkActive()) {
									e.preventDefault();
									onCreatePost();
								}
							}}
						>
							Đăng
						</button>
					</div>
				</Form>
			</div>
			{/* sub modal */}
			<div
				className={classNames('creat-post-modal-content__substitute', {
					'show': option.value !== 'addImages' && !showMainModal,
				})}
			>
				<CreatPostSubModal
					option={option}
					backToMainModal={backToMainModal}
					deleteImage={deleteImage}
					optionList={optionList}
					fetchSuggestion={fetchSuggestion}
					suggestionData={suggestionData}
					handleAddToPost={handleAddToPost}
					mentionData={mentionData.current}
					taggedData={taggedData}
					removeTaggedItem={removeTaggedItem}
					addOptionsToPost={addOptionsToPost}
					showMainModal={showMainModal}
					taggedDataPrevious={taggedDataPrevious}
					handleValidationInput={handleValidationInput}
				/>
			</div>
		</div>
	);
}

CreatPostModalContent.propTypes = {
	hideCreatPostModal: PropTypes.func,
	showModalCreatPost: PropTypes.bool,
	option: PropTypes.object,
	onChangeOption: PropTypes.func,
	onChangeNewPost: PropTypes.func,
};

export default CreatPostModalContent;
