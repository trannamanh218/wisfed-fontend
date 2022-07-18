/* eslint-disable max-lines */
import classNames from 'classnames';
import { CloseX, Image, IconRanks } from 'components/svg';
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
import { getPreviewUrl, getSharePostInternal, getSharePostRanks } from 'reducers/redux-utils/post';
import { useCallback } from 'react';
import Circle from 'shared/loading/circle';
import './style.scss';
import { ratingUser } from 'reducers/redux-utils/book';
import UserAvatar from 'shared/user-avatar';
import { updateCurrentBook, updateProgressReadingBook, createReviewBook } from 'reducers/redux-utils/book';
import { STATUS_BOOK } from 'constants';
import { usePrevious } from 'shared/hooks';
import { addBookToDefaultLibrary, updateMyAllLibraryRedux } from 'reducers/redux-utils/library';
import { setting } from './settings';
import { NotificationError } from 'helpers/Error';
import { uploadMultiFile } from 'reducers/redux-utils/common';
import { useLocation, useParams } from 'react-router-dom';
import { creatNewPost } from 'reducers/redux-utils/group';
import PostQuotes from 'shared/post-quotes';
import { saveDataShare, checkShare } from 'reducers/redux-utils/post';
import Post from 'shared/post';
import AuthorBook from 'shared/author-book';
import ShareUsers from '../modal-share-users';

function CreatPostModalContent({
	hideCreatePostModal,
	setShowModalCreatPost,
	showModalCreatPost,
	option,
	onChangeOption,
	onChangeNewPost,
	showSubModal,
}) {
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
	const [buttonActive, setButtonActive] = useState(false);
	const location = useLocation();
	const UpdateImg = useSelector(state => state.chart.updateImgPost);
	const { resetTaggedData, isShare, postsData, isSharePosts, isSharePostsAll } = useSelector(state => state.post);
	const { id } = useParams();
	const {
		auth: { userInfo },
		book: { bookForCreatePost, bookInfo },
	} = useSelector(state => state);
	const { optionList } = setting;

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
			document.removeEventListener('input', () => {
				handlePlaceholder();
				detectUrl();
				createSpanElements();
			});
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
		if (url) {
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
		if (isShare || isSharePosts || isSharePostsAll.length > 0) {
			return;
		} else {
			if (imagesUpload.length > 0 && param.value === 'addBook') {
				toast.warning('Không thể kết hợp đồng thời thêm ảnh và sách');
			} else {
				onChangeOption(param);
				setShowMainModal(false);
			}
		}
	};

	const handleOpenUploadImage = () => {
		if (isShare || isSharePosts || isSharePostsAll.length > 0) {
			return;
		} else {
			if (_.isEmpty(taggedData.addBook)) {
				setShowUpload(!showUpload);
				addOptionsToPost({ value: 'addImages', title: 'chỉnh sửa ảnh', icon: <Image />, message: '' });
			} else {
				toast.warning('Không thể kết hợp đồng thời thêm ảnh và sách');
			}
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
				if (!listData.includes(data)) {
					listData.push(data);
				}
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

	const handleUpdateProgress = async params => {
		const { status, progress } = taggedData.addBook;
		const convertProgress = parseInt(progress) || 0;
		const progressParams = { id: params.bookId, progress: convertProgress };
		// read
		try {
			if (status) {
				if (status === STATUS_BOOK.read || STATUS_BOOK.reading) {
					await dispatch(updateProgressReadingBook(progressParams)).unwrap();
				} else if (status === STATUS_BOOK.wantToRead) {
					await dispatch(updateProgressReadingBook(progressParams)).unwrap();
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
				await Promise.all([addToDefaultLibraryRequest, updateProgressRequest]);
			}
		} catch (error) {
			NotificationError(error);
		} finally {
			dispatch(updateMyAllLibraryRedux());
		}
	};

	const onCreatePost = async () => {
		const params = await generateData();
		// book, author , topic is required
		setStatus(STATUS_LOADING);
		try {
			if (location.pathname.includes('group') && (isShare || isSharePosts)) {
				const query = {
					id: postsData.id,
					type: 'groupPost',
					...params,
				};
				await dispatch(getSharePostInternal(query)).unwrap();
			}
		} catch (error) {
			NotificationError(error);
		}

		try {
			if (isShare || isSharePosts || isSharePostsAll.length > 0) {
				if (isShare) {
					if (postsData.categoryName !== undefined) {
						const query = {
							by: postsData.by,
							id: postsData.id,
							type: 'topQuote',
							categoryId: postsData.categoryId || null,
							msg: textFieldEdit?.current?.innerHTML,
						};

						await dispatch(getSharePostRanks(query)).unwrap();
					} else {
						const query = {
							id: postsData.sharePost ? postsData.sharePost.minipostId : postsData.id,
							type: 'quote',
							background: postsData.background,
							...params,
						};
						await dispatch(getSharePostInternal(query)).unwrap();
					}
				} else if (isSharePosts) {
					if (postsData.originId) {
						const query = {
							by: postsData.originId.by,
							id: postsData.info.id,
							type: postsData.originId.type,
							categoryId: postsData.originId.categoryId || null,
							msg: textFieldEdit?.current?.innerHTML,
							userType: postsData.originId.type === 'topUser' && postsData.originId.userType,
						};

						await dispatch(getSharePostRanks(query)).unwrap();
					} else {
						let newId;
						let newType;
						if (postsData.verb === 'miniPost') {
							newId = postsData.minipostId;
							newType = 'post';
						} else {
							if (postsData.sharePost.minipostId) {
								newId = postsData.sharePost.minipostId;
								newType = 'post';
							} else {
								newId = postsData.sharePost.id;
								newType = 'quote';
							}
						}
						const query = {
							id: newId,
							type: newType,
							...params,
						};
						await dispatch(getSharePostInternal(query)).unwrap();
					}
				} else {
					const query = {
						by: postsData.by,
						id: postsData.type === 'topUser' ? postsData.id : postsData.bookId,
						type: postsData.type,
						categoryId: postsData.categoryId || null,
						msg: textFieldEdit?.current?.innerHTML,
						userType: postsData.type === 'topUser' && postsData.userType,
					};

					await dispatch(getSharePostRanks(query)).unwrap();
				}
			} else {
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

				if (location.pathname.includes('group')) {
					const newParams = { data: params, id: id };
					await dispatch(creatNewPost(newParams));
				} else {
					await dispatch(createActivity(params));
				}
			}
			setStatus(STATUS_SUCCESS);
			toast.success('Tạo post thành công!');
			onChangeNewPost();
		} catch (err) {
			const statusCode = err?.statusCode || 500;
			if (err.errorCode === 702) {
				NotificationError(err);
			} else if (!location.pathname.includes('group')) {
				toast.error('Tạo post thất bại!');
			}
			setStatus(statusCode);
		} finally {
			dispatch(updateCurrentBook({}));
			dispatch(saveDataShare({}));
			dispatch(checkShare(false));
			setStatus(STATUS_IDLE);
			hideCreatePostModal();
			onChangeOption({});
			setShowModalCreatPost(false);
		}
	};

	useEffect(() => {
		checkActive();
	}, [showMainModal, textFieldEdit?.current?.innerText, taggedData, imagesUpload]);

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
		} else if (isShare || isSharePosts || isSharePostsAll.length > 0) {
			if (textFieldEdit.current?.innerText) {
				isActive = true;
			}
		} else {
			if (
				textFieldEdit.current?.innerText &&
				(taggedData.addAuthor.length || taggedData.addCategory.length || imagesUpload.length)
			) {
				isActive = true;
			}
		}
		setButtonActive(isActive);
	};

	const handleValidationInput = value => {
		setValidationInput(value);
	};

	const handleChangeStar = e => {
		setValueStar(e);
	};

	const userRating = async () => {
		const params = { star: valueStar, id: bookInfo.id || taggedData.addBook.id };
		if (valueStar) {
			try {
				await dispatch(ratingUser(params));
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	useEffect(() => {
		if (showSubModal) {
			setShowMainModal(false);
		}
	}, [showSubModal]);

	const handleTime = () => {
		switch (postsData.by) {
			case 'week':
				return 'tuần';
			case 'month':
				return 'tháng';
			case 'year':
				return 'năm';
			default:
				break;
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
					<h5>
						{isShare || isSharePosts || isSharePostsAll.length > 0 ? 'Chia sẻ bài viết' : 'Tạo bài viết'}
					</h5>
					<button className='creat-post-modal-content__main__close' onClick={hideCreatePostModal}>
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
									{userInfo?.fullName ||
										userInfo?.lastName ||
										userInfo?.firstName ||
										'Không xác định'}
									{taggedData.addFriends.length > 0 && (
										<>
											<span className='d-inline-block mx-1'>cùng với</span>
											{taggedData.addFriends.map((item, index) => (
												<>
													{index !== 0 && <span>{' và '}</span>}
													<span key={item.id}>
														{item.fullName ||
															item.lastName ||
															item.firstName ||
															'Không xác định'}
													</span>
												</>
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
							{postsData.type === 'topQuote' && (
								<div className='post__title__share__rank'>
									<span className='number__title__rank'># Top {postsData.rank} quotes </span>{' '}
									<span className='title__rank'>
										{postsData.categoryName?.length
											? `  được like nhiều nhất thuộc ${
													postsData.categoryName
											  } theo ${handleTime()} `
											: `  được like nhiều nhất theo ${handleTime()} `}
									</span>
									<IconRanks />
								</div>
							)}
							{postsData.type === 'topBook' && (
								<div className='post__title__share__rank'>
									<span className='number__title__rank'># Top {postsData.rank} </span>{' '}
									<span className='title__rank'>
										{postsData.categoryName
											? `  cuốn sách tốt nhất  ${postsData.categoryName} theo ${handleTime()} `
											: `  cuốn sách tốt nhất theo ${handleTime()} `}
									</span>
									<IconRanks />
								</div>
							)}
							{(isShare || isSharePosts || isSharePostsAll === 'shareTopBook') && (
								<div
									className={
										postsData.verb !== 'shareTopBookRanking' &&
										postsData.verb !== 'shareTopUserRanking' &&
										'creat-post-modal-content__main__share-container'
									}
								>
									{isShare && <PostQuotes postsData={postsData} isShare={isShare} />}
									{isSharePosts && (
										<Post postInformations={postsData} showModalCreatPost={showModalCreatPost} />
									)}
									{isSharePostsAll === 'shareTopBook' && <AuthorBook data={postsData} />}
								</div>
							)}
							{isSharePostsAll === 'shareTopUser' && <ShareUsers postsData={postsData} />}

							{!_.isEmpty(taggedData.addBook) || showUpload ? (
								<>
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
								</>
							) : (
								<>
									{hasUrl && !showUpload && (
										<PreviewLink
											urlData={urlAdded}
											isFetching={fetchingUrlInfo}
											removeUrlPreview={removeUrlPreview}
										/>
									)}
								</>
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
										'disabled':
											!_.isEmpty(taggedData.addBook) ||
											isShare ||
											isSharePosts ||
											isSharePostsAll.length > 0,
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
								'active': buttonActive,
							})}
							type='button'
							onClick={e => {
								e.preventDefault();
								if (buttonActive) {
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
	hideCreatePostModal: PropTypes.func,
	showModalCreatPost: PropTypes.bool,
	option: PropTypes.object,
	onChangeOption: PropTypes.func,
	onChangeNewPost: PropTypes.func,
	renderBookReading: PropTypes.object,
	setShowModalCreatPost: PropTypes.func,
	showSubModal: PropTypes.bool,
};

export default CreatPostModalContent;
