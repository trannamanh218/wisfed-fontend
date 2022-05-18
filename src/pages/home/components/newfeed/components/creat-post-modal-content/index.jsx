/* eslint-disable max-lines */
import classNames from 'classnames';
import { CloseX, Image, WorldNet } from 'components/svg';
import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createActivity } from 'reducers/redux-utils/activity';
import PostEditBook from 'shared/post-edit-book';
import OptionsPost from './OptionsPost';
// import ShareModeComponent from './ShareModeComponent';
import CreatPostSubModal from './CreatePostSubModal';
import TaggedList from './TaggedList';
import UploadImage from './UploadImage';
import PreviewLink from 'shared/preview-link/PreviewLink';
import { getPreviewUrl } from 'reducers/redux-utils/post';
import { useCallback } from 'react';
import Circle from 'shared/loading/circle';
import './style.scss';
import { ratingUser } from 'reducers/redux-utils/book';
import UserAvatar from 'shared/user-avatar';
import { updateCurrentBook, updateProgressReadingBook, createReviewBook } from 'reducers/redux-utils/book';
import { STATUS_BOOK } from 'constants';
import { usePrevious } from 'shared/hooks';
import { addBookToDefaultLibrary } from 'reducers/redux-utils/library';
import { setting } from './settings';
import { NotificationError } from 'helpers/Error';
import { uploadMultiFile } from 'reducers/redux-utils/common';

function CreatPostModalContent({ hideCreatPostModal, showModalCreatPost, option, onChangeOption, onChangeNewPost }) {
	// const [shareMode, setShareMode] = useState({ value: 'public', title: 'Mọi người', icon: <WorldNet /> });
	const [showTextFieldEditPlaceholder, setShowTextFieldEditPlaceholder] = useState(true);
	const [showMainModal, setShowMainModal] = useState(showModalCreatPost);
	const [taggedData, setTaggedData] = useState({
		'addBook': {},
		'addAuthor': [],
		'addFriends': [],
		'addCategory': [],
	});
	const [fetchingUrlInfo, setFetchingUrlInfo] = useState(false);
	const [hasUrl, setHasUrl] = useState(false);
	const [urlAdded, setUrlAdded] = useState({});
	const [urlAddedArray, setUrlAddedArray] = useState([]);
	const [oldUrlAddedArray, setOldUrlAddedArray] = useState([]);
	const [status, setStatus] = useState(STATUS_IDLE);
	const [showUpload, setShowUpload] = useState(false);
	const [imagesUpload, setImagesUpload] = useState([]);
	const [validationInput, setValidationInput] = useState('');
	const dispatch = useDispatch();
	const textFieldEdit = useRef(null);
	const taggedDataPrevious = usePrevious(taggedData);
	const [valueStar, setValueStar] = useState(0);
	const [checkProgress, setCheckProgress] = useState();
	const [showImagePopover, setShowImagePopover] = useState(false);

	const UpdateImg = useSelector(state => state.chart.updateImgPost);
	const resetTaggedData = useSelector(state => state.post.resetTaggedData);
	const {
		auth: { userInfo },
		book: { bookForCreatePost, bookInfo },
	} = useSelector(state => state);
	const { optionList, shareModeList } = setting;

	useEffect(() => {
		textFieldEdit.current.focus();
		if (UpdateImg.length > 0) {
			setShowUpload(true);
			setImagesUpload(UpdateImg);
		}
	}, []);

	useEffect(() => {
		if (!_.isEmpty(bookForCreatePost)) {
			const newData = { ...taggedData };
			const pages = { read: bookForCreatePost.page, reading: '', wantToRead: '' };
			newData.addBook = { ...bookForCreatePost, progress: pages[bookForCreatePost.status] };
			setTaggedData(newData);
			setShowUpload(false);
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
		if (resetTaggedData) {
			setTaggedData({ 'addBook': {}, 'addAuthor': [], 'addFriends': [], 'addCategory': [] });
			setImagesUpload([]);
			setShowUpload(false);
		}
	}, [resetTaggedData]);

	const detectUrl = useCallback(
		_.debounce(() => {
			const urlRegex =
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
			const url = textFieldEdit.current.innerText.match(urlRegex);
			if (url !== null) {
				setUrlAddedArray(url);
				setHasUrl(true);
			} else {
				setUrlAddedArray([]);
			}
		}, 1000),
		[]
	);

	useEffect(() => {
		if (!_.isEqual(urlAddedArray, oldUrlAddedArray)) {
			getPreviewUrlFnc(urlAddedArray[urlAddedArray.length - 1]);
			setOldUrlAddedArray(urlAddedArray);
		}
	}, [urlAddedArray]);

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

	const placeCaretAtEnd = element => {
		element.focus();
		if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
			const range = document.createRange();
			range.selectNodeContents(element);
			range.collapse(false);
			const selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
		} else if (typeof document.body.createTextRange != 'undefined') {
			const textRange = document.body.createTextRange();
			textRange.moveToElementText(element);
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
			NotificationError(err);
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

	const backToMainModal = () => {
		setShowMainModal(true);
	};

	const addOptionsToPost = param => {
		if (imagesUpload.length > 0 && param.value === 'addBook') {
			toast.warning('Không thể kết hợp đồng thời thêm ảnh và sách');
		} else {
			onChangeOption(param);
			setShowMainModal(false);
		}
	};

	const handleOpenUploadImage = () => {
		if (_.isEmpty(taggedData.addBook)) {
			setShowUpload(!showUpload);
			addOptionsToPost({ value: 'addImages', title: 'chỉnh sửa ảnh', icon: <Image />, message: '' });
		} else {
			toast.warning('Không thể kết hợp đồng thời thêm ảnh và sách');
		}
	};

	const deleteImage = imageIndex => {
		const newImagesArray = [...imagesUpload];
		newImagesArray.splice(imageIndex, 1);
		if (!newImagesArray.length) {
			backToMainModal();
			addOptionsToPost({ value: 'addImages', title: 'chỉnh sửa ảnh', icon: <Image />, message: '' });
		}
		setImagesUpload(newImagesArray);
	};

	const removeAllImages = () => {
		setImagesUpload([]);
		setShowUpload(false);
	};

	const handleAddToPost = data => {
		const newData = { ...taggedData };
		setCheckProgress(Number(data.progress));
		if (option.value === 'addAuthor' || option.value === 'addFriends' || option.value === 'addCategory') {
			const listData = [...taggedData[option.value]];
			const lastItem = listData[listData.length - 1];
			if (!listData.length || (!_.isEmpty(lastItem) && lastItem.id !== data.id)) {
				listData.push(data);
			}
			newData[option.value] = listData;
		} else if (option.value === 'addBook' || data.hasOwnProperty('page')) {
			newData['addBook'] = data;
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

	const generateData = async () => {
		const params = {
			msg: textFieldEdit?.current?.innerHTML,
			mentionsUser: [],
			mentionsAuthor: [],
			mentionsCategory: [],
			image: [],
			preview: urlAdded,
			tags: [],
		};

		params.mentionsUser = taggedData.addFriends.length ? taggedData.addFriends.map(item => item.id) : [];
		params.mentionsAuthor = taggedData.addAuthor.length ? taggedData.addAuthor.map(item => item.id) : [];
		if (imagesUpload.length) {
			try {
				const imagesUploaded = await dispatch(uploadMultiFile(imagesUpload)).unwrap();
				const imagesArray = [];
				imagesUploaded.forEach(item => {
					imagesArray.push(item.streamPath);
				});
				params.image = imagesArray;
			} catch {
				toast.error('Đăng ảnh không thành công');
				params.image = {};
			}
		}
		params.mentionsCategory = taggedData.addCategory.length ? taggedData.addCategory.map(item => item.id) : [];
		if (!_.isEmpty(taggedData.addBook)) {
			params.bookId = taggedData.addBook.id;
		}
		return params;
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
		const params = await generateData();
		// book, author , topic is required
		setStatus(STATUS_LOADING);
		try {
			if (params.bookId) {
				if (params.msg) {
					const reviewData = {
						bookId: params.bookId,
						mediaUrl: [],
						content: textFieldEdit.current.innerText,
						curProgress: taggedData.addBook.status === 'read' ? taggedData.addBook.page : checkProgress,
					};
					dispatch(createReviewBook(reviewData));
				}
				if (valueStar > 0) {
					userRating();
				}
				handleUpdateProgress(params);
			}
			await dispatch(createActivity(params));
			setStatus(STATUS_SUCCESS);
			toast.success('Tạo post thành công!');
			onChangeNewPost();
		} catch (err) {
			const statusCode = err?.statusCode || 500;
			if (err.errorCode === 702) {
				NotificationError(err);
			} else {
				toast.error('Tạo post thất bại!');
			}
			setStatus(statusCode);
		} finally {
			dispatch(updateCurrentBook({}));
			setStatus(STATUS_IDLE);
			hideCreatPostModal();
			onChangeOption({});
		}
	};

	const checkActive = () => {
		let isActive = false;
		if (!_.isEmpty(taggedData.addBook)) {
			if (taggedData.addBook.status) {
				if (taggedData.addBook.status === 'read') {
					if (textFieldEdit?.current?.innerText) {
						isActive = true;
					}
				} else if (taggedData.addBook.status === 'reading') {
					if (checkProgress === taggedData.addBook.page) {
						const newTaggedData = { ...taggedData };
						newTaggedData.addBook.status = 'read';
						setTaggedData(newTaggedData);
					} else {
						if (!validationInput) {
							isActive = true;
						}
					}
				} else {
					isActive = true;
				}
			} else {
				if (taggedData.addBook.page !== checkProgress && !validationInput) {
					isActive = true;
				} else {
					if (textFieldEdit.current?.innerText) {
						isActive = true;
					}
				}
			}
		} else {
			if (
				textFieldEdit.current?.innerText &&
				(taggedData.addAuthor.length || taggedData.addCategory.length || imagesUpload.length)
			) {
				isActive = true;
			}
		}
		return isActive;
	};

	const handleValidationInput = value => {
		setValidationInput(value);
	};

	const handleChangeStar = e => {
		setValueStar(e);
	};

	const userRating = async () => {
		const params = { star: valueStar, id: bookInfo.id };
		if (bookInfo.id && valueStar) {
			try {
				await dispatch(ratingUser(params));
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	return (
		<div className='creat-post-modal-content'>
			<Circle loading={status === STATUS_LOADING} />
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
				<form
					onSubmit={e => {
						e.preventDefault();
						return false;
					}}
					id='formCreatePost'
				>
					<div className='creat-post-modal-content__main__body'>
						<div className='creat-post-modal-content__main__body__user-info'>
							<div className='creat-post-modal-content__main__body__user-info__block-left'>
								<UserAvatar className='newfeed__creat-post__avatar' source={userInfo?.avatarImage} />
							</div>
							<div className='creat-post-modal-content__main__body__user-info__block-right'>
								<p>
									{userInfo.fullName || userInfo.lastName || userInfo.firstName || 'Không xác định'}
									{taggedData.addFriends.length > 0 && (
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
									)}
								</p>
								{/* <ShareModeComponent
									list={shareModeList}
									shareMode={shareMode}
									setShareMode={setShareMode}
								/> */}
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
									handleChangeStar={handleChangeStar}
									valueStar={valueStar}
								/>
							)}
							{showUpload && (
								<UploadImage
									addOptionsToPost={addOptionsToPost}
									images={imagesUpload}
									setImages={setImagesUpload}
									removeAllImages={removeAllImages}
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
									images={imagesUpload}
								/>
								<span
									className={classNames('creat-post-modal-content__main__options__item-add-to-post', {
										'active': imagesUpload.length > 0 && _.isEmpty(taggedData.addBook),
										'disabled': !_.isEmpty(taggedData.addBook),
									})}
									onMouseOver={() => setShowImagePopover(true)}
									onMouseLeave={() => setShowImagePopover(false)}
									onClick={handleOpenUploadImage}
								>
									<div
										className={classNames(
											'creat-post-modal-content__main__options__item-add-to-post__popover',
											{
												'show': showImagePopover,
											}
										)}
									>
										Ảnh
									</div>
									<Image />
								</span>
							</div>
						</div>
						<button
							className={classNames('creat-post-modal-content__main__submit', {
								'active': checkActive(),
							})}
							type='button'
							onClick={e => {
								e.preventDefault();
								if (checkActive()) {
									onCreatePost();
								}
							}}
						>
							Đăng
						</button>
					</div>
				</form>
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
					handleAddToPost={handleAddToPost}
					taggedData={taggedData}
					removeTaggedItem={removeTaggedItem}
					images={imagesUpload}
					taggedDataPrevious={taggedDataPrevious}
					handleValidationInput={handleValidationInput}
					userInfo={userInfo}
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
	renderBookReading: PropTypes.object,
};

export default CreatPostModalContent;
