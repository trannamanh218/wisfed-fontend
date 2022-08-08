/* eslint-disable max-lines */
import classNames from 'classnames';
import { CloseX, Image, IconRanks } from 'components/svg';
import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
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
import RichTextEditor from 'shared/rich-text-editor';
import ShareTarget from 'shared/share-target';
import { POST_TYPE } from 'constants';
import { shareTargetReadings } from 'reducers/redux-utils/target';

const urlRegex =
	/https?:\/\/www(\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

function CreatPostModalContent({
	hideCreatePostModal,
	setShowModalCreatPost,
	showModalCreatPost,
	option,
	setOption,
	onChangeOption,
	onChangeNewPost,
	showSubModal,
}) {
	// const [shareMode, setShareMode] = useState({ value: 'public', title: 'Mọi người', icon: <WorldNet /> });
	const [showMainModal, setShowMainModal] = useState(showModalCreatPost);
	const [taggedData, setTaggedData] = useState({
		'addBook': {},
		'addAuthor': [],
		'addFriends': [],
		'addCategory': [],
	});
	const [fetchingUrlInfo, setFetchingUrlInfo] = useState(false);
	const [hasUrl, setHasUrl] = useState(false);
	const [urlPreviewData, setUrlPreviewData] = useState({});
	const [urlAdded, setUrlAdded] = useState('');
	const [oldUrlAdded, setOldUrlAdded] = useState('');
	const [status, setStatus] = useState(STATUS_IDLE);
	const [showUpload, setShowUpload] = useState(false);
	const [imagesUpload, setImagesUpload] = useState([]);
	const [validationInput, setValidationInput] = useState('');
	const taggedDataPrevious = usePrevious(taggedData);
	const [valueStar, setValueStar] = useState(0);
	const [checkProgress, setCheckProgress] = useState();
	const [showImagePopover, setShowImagePopover] = useState(false);
	const [buttonActive, setButtonActive] = useState(false);
	const [content, setContent] = useState('');

	const dispatch = useDispatch();

	const location = useLocation();
	const UpdateImg = useSelector(state => state.chart.updateImgPost);
	const { resetTaggedData, isShare, postsData, isSharePosts, isSharePostsAll, isShareTarget } = useSelector(
		state => state.post
	);
	const { id } = useParams();
	const {
		auth: { userInfo },
		book: { bookForCreatePost, bookInfo },
	} = useSelector(state => state);
	const { optionList } = setting;

	useEffect(() => {
		const textFieldEdit = document.querySelector('.creat-post-modal-content__main__body__text-field-edit-wrapper');
		const editor = textFieldEdit.querySelector('.public-DraftEditor-content');
		if (editor) {
			setTimeout(() => {
				editor.focus();
			}, 200);
		}

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
		if (resetTaggedData) {
			setTaggedData({ 'addBook': {}, 'addAuthor': [], 'addFriends': [], 'addCategory': [] });
			setImagesUpload([]);
			setShowUpload(false);
		}
	}, [resetTaggedData]);

	useEffect(() => {
		if (urlAdded) {
			if (urlAdded.match(urlRegex) && !_.isEqual(urlAdded, oldUrlAdded)) {
				setHasUrl(true);
				getPreviewUrlFnc(urlAdded);
			}
		} else {
			setHasUrl(false);
		}
		setOldUrlAdded(urlAdded);
	}, [urlAdded]);

	const getPreviewUrlFnc = async url => {
		if (url) {
			setFetchingUrlInfo(true);
			const data = { 'url': url };
			try {
				const res = await dispatch(getPreviewUrl(data)).unwrap();
				setUrlPreviewData(res);
			} catch (err) {
				const obj = { url: url, title: url, images: [] };
				setUrlPreviewData(obj);
			} finally {
				setFetchingUrlInfo(false);
			}
		}
	};

	const removeUrlPreview = () => {
		setHasUrl(false);
	};

	const backToMainModal = () => {
		setShowMainModal(true);
		setOption({});
	};

	const addOptionsToPost = param => {
		onChangeOption(param);
		setShowMainModal(false);
	};

	const handleOpenUploadImage = () => {
		if (!imagesUpload.length) {
			setShowUpload(true);
			addOptionsToPost({ value: 'addImages', title: 'chỉnh sửa ảnh', icon: <Image />, message: '' });
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

	const limitedOption = () => {
		switch (option.value) {
			case 'addAuthor':
				return 'tác giả';
			case 'addCategory':
				return 'chủ đề';
			default:
				return '';
		}
	};

	const limitedValue = 5;
	const handleAddToPost = data => {
		const newData = { ...taggedData };
		setCheckProgress(Number(data.progress));
		if (option.value === 'addAuthor' || option.value === 'addFriends' || option.value === 'addCategory') {
			const listData = [...taggedData[option.value]];
			const lastItem = listData[listData.length - 1];
			if (!listData.length || (!_.isEmpty(lastItem) && lastItem.id !== data.id)) {
				if (!listData.includes(data)) {
					if (option.value === 'addFriends' || listData.length < limitedValue) {
						listData.push(data);
					} else {
						const customId = 'custom-id-handleAddToPost-addAuthor';
						toast.warning(
							`Chỉ được chọn tối đa ${limitedValue} ${limitedOption()} trong 1 lần tạo bài viết`,
							{
								toastId: customId,
							}
						);
					}
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
			msg: content,
			mentionsUser: [],
			mentionsAuthor: [],
			mentionsCategory: [],
			image: [],
			preview: urlPreviewData,
			tags: [],
			progress: checkProgress ? checkProgress : 0,
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
				const customId = 'custom-id-CreatPostModalContent-generateData';
				toast.error('Đăng ảnh không thành công', { toastId: customId });
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
			if (isShare || isSharePosts || isSharePostsAll.length > 0 || postsData.booksReadCount > 0) {
				if (isShare) {
					if (postsData.categoryName !== undefined) {
						const query = {
							by: postsData.by,
							id: postsData.id,
							type: 'topQuote',
							categoryId: postsData.categoryId || null,
							msg: content,
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
							msg: content,
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
				} else if (postsData.booksReadCount > 0) {
					const data = {
						current: postsData.booksReadCount,
						...params,
					};
					await dispatch(shareTargetReadings(data)).unwrap();
				} else {
					const query = {
						by: postsData.by,
						id: postsData.type === 'topUser' ? postsData.id : postsData.bookId,
						type: postsData.type,
						categoryId: postsData.categoryId || null,
						msg: content,
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
							content: content,
							curProgress: taggedData.addBook.status === 'read' ? taggedData.addBook.page : checkProgress,
							rate:
								taggedData.addBook.status === 'read' || checkProgress === taggedData.addBook.page
									? valueStar
									: 0,
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
			const customId = 'custom-id-CreatPostModalContent-onCreatePost-success';
			toast.success('Tạo post thành công!', { toastId: customId });
			onChangeNewPost();
		} catch (err) {
			const statusCode = err?.statusCode || 500;
			if (err.errorCode === 702) {
				NotificationError(err);
			} else if (!location.pathname.includes('group')) {
				const customId = 'custom-id-CreatPostModalContent-onCreatePost-error';
				toast.error('Tạo post thất bại!', { toastId: customId });
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
	}, [showMainModal, content, taggedData, imagesUpload]);

	const checkActive = () => {
		let isActive = false;
		if (!_.isEmpty(taggedData.addBook)) {
			if (taggedData.addBook.status) {
				if (taggedData.addBook.status === 'read') {
					if (content) {
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
					if (content) {
						isActive = true;
					}
				}
			}
		} else if (isShare || isSharePosts || isSharePostsAll.length > 0) {
			if (content) {
				isActive = true;
			}
		} else {
			if (content && (taggedData.addAuthor.length || taggedData.addCategory.length || imagesUpload.length)) {
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
												<Fragment key={item.id}>
													{index !== 0 && <span>{' và '}</span>}
													<span>
														{item.fullName ||
															item.lastName ||
															item.firstName ||
															'Không xác định'}
													</span>
												</Fragment>
											))}
										</>
									)}
								</p>
							</div>
						</div>
						<div
							className={classNames('creat-post-modal-content__main__body__text-field-edit-wrapper', {
								'height-higher': showUpload || hasUrl,
							})}
						>
							<RichTextEditor
								placeholder='Hãy chia sẻ cảm nhận của bạn về cuốn sách'
								setUrlAdded={setUrlAdded}
								setContent={setContent}
								hasMentionsUser={false}
								hasUrl={hasUrl}
							/>
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
										<Post
											postInformations={postsData}
											showModalCreatPost={showModalCreatPost}
											type={POST_TYPE}
										/>
									)}
									{isSharePostsAll === 'shareTopBook' && <AuthorBook data={postsData} />}
								</div>
							)}
							{isSharePostsAll === 'shareTopUser' && <ShareUsers postsData={postsData} />}
							{postsData.booksReadCount > 0 && <ShareTarget postsData={postsData} />}

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
											maxFiles={100}
											maxSize={104857600}
										/>
									)}
								</>
							) : (
								<>
									{hasUrl && !showUpload && (
										<PreviewLink
											urlData={urlPreviewData}
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
	setOption: PropTypes.func,
	onChangeOption: PropTypes.func,
	onChangeNewPost: PropTypes.func,
	renderBookReading: PropTypes.object,
	setShowModalCreatPost: PropTypes.func,
	showSubModal: PropTypes.bool,
};

export default CreatPostModalContent;
