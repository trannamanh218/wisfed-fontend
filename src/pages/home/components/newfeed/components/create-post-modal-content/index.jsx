import classNames from 'classnames';
import { CloseX, Image, IconRanks, WorldNet } from 'components/svg'; // k xóa WorldNet
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createActivity, handleClickCreateNewPostForBook, handleEditPost } from 'reducers/redux-utils/activity';
import PostEditBook from 'shared/post-edit-book';
import OptionsPost from './OptionsPost';
import CreatPostSubModal from './CreatePostSubModal';
import TaggedList from './TaggedList';
import UploadImage from './UploadImage';
import PreviewLink from 'shared/preview-link/PreviewLink';
import {
	getPreviewUrl,
	getSharePostInternal,
	getSharePostRanks,
	shareMyBook,
	saveDataShare,
} from 'reducers/redux-utils/post';
import Circle from 'shared/loading/circle';
import './style.scss';
import UserAvatar from 'shared/user-avatar';
import {
	updateProgressReadingBook,
	createReviewBook,
	updateBookForCreatePost,
	ratingUser,
	// handleEditReviewsBook,
	handleRefreshRatingData,
} from 'reducers/redux-utils/book';
import { addBookToDefaultLibrary, updateMyAllLibraryRedux } from 'reducers/redux-utils/library';
import { setting } from './settings';
import { NotificationError } from 'helpers/Error';
import { uploadMultiFile, setOptionAddToPost } from 'reducers/redux-utils/common';
import { useLocation, useParams } from 'react-router-dom';
import { creatNewPost, handleEditGroupPost } from 'reducers/redux-utils/group';
import QuoteCard from 'shared/quote-card';
import AuthorBook from 'shared/author-book';
import ShareUsers from '../modal-share-users';
import RichTextEditor from 'shared/rich-text-editor';
import ShareTarget from 'shared/share-target';
import PostShare from 'shared/posts-Share';
import { shareTargetReadings } from 'reducers/redux-utils/target';
import {
	CHART_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	GROWTH_CHART_VERB_SHARE,
	hashtagRegex,
	MY_BOOK_VERB_SHARE,
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	READ_TARGET_VERB_SHARE,
	READ_TARGET_VERB_SHARE_LV1,
	REVIEW_VERB_SHARE,
	STATUS_BOOK,
	STATUS_IDLE,
	STATUS_LOADING,
	STATUS_SUCCESS,
	TOP_BOOK_VERB_SHARE,
	TOP_BOOK_VERB_SHARE_LV1,
	TOP_QUOTE_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE_LV1,
	TOP_USER_VERB_SHARE,
	TOP_USER_VERB_SHARE_LV1,
	POST_VERB,
} from 'constants';
import './style.scss';
// import ShareModeComponent from './ShareModeComponent';
import { handleResetMyTargetReading, setMyTargetReading } from 'reducers/redux-utils/chart';
import { handleSetImageToShare } from 'reducers/redux-utils/chart';
import DirectLinkALertModal from 'shared/direct-link-alert-modal';

const verbShareArray = [
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	READ_TARGET_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	TOP_USER_VERB_SHARE,
	REVIEW_VERB_SHARE,
	READ_TARGET_VERB_SHARE_LV1,
	TOP_BOOK_VERB_SHARE_LV1,
	TOP_USER_VERB_SHARE_LV1,
	TOP_QUOTE_VERB_SHARE_LV1,
];

const message = 'Bạn đang có bài viết chưa hoàn thành. Bạn có chắc muốn rời khỏi khi chưa đăng không?';

function CreatePostModalContent({
	setShowModalCreatePost,
	dataEditMiniPost,
	showSubModal,
	setShowSubModal,
	onChangeNewPost,
	isReview,
	isEditPost,
	setIsEdit,
	handleUpdateMiniPost,
}) {
	// const [shareMode, setShareMode] = useState({ value: 'public', title: 'Mọi người', icon: <WorldNet /> }); // k xóa
	const [showMainModal, setShowMainModal] = useState(true);
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
	const [valueStar, setValueStar] = useState(0);
	const [progressInputValue, setProgressInputValue] = useState(0);
	const [showImagePopover, setShowImagePopover] = useState(false);
	const [buttonActive, setButtonActive] = useState(false);
	const [content, setContent] = useState('');
	const [hashtagsAdded, setHashtagsAdded] = useState([]);
	const [optionListState, setOptionListState] = useState([]);
	const [modalShow, setModalShow] = useState(false);

	const createPostModalContainer = useRef(null);
	// const initialProgress = useRef(null);

	const dispatch = useDispatch();
	const location = useLocation();

	const chartImgShare = useSelector(state => state.chart.imageToShareData);
	const { postDataShare } = useSelector(state => state.post);
	const option = useSelector(state => state.common.optionAddToPost);
	const { bookForCreatePost } = useSelector(state => state.book);

	const {
		auth: { userInfo },
		book: { bookInfo },
	} = useSelector(state => state);

	const myAllLibraryReduxDefault = useSelector(state => state.library.myAllLibrary).default;

	const { id } = useParams();

	const { optionList, shareModeList } = setting; // k xóa shareModeList

	useEffect(() => {
		const textFieldEdit = document.querySelector('.create-post-modal-content__main__body__text-field-edit-wrapper');
		const editor = textFieldEdit.querySelector('.public-DraftEditor-content');
		if (editor) {
			setTimeout(() => {
				editor.focus();
			}, 200);
		}

		if (chartImgShare.length > 0) {
			setShowUpload(true);
			setImagesUpload(chartImgShare);
		}

		if (!_.isEmpty(bookForCreatePost)) {
			const cloneArr = [...optionList];
			cloneArr.splice(0, 1);
			setOptionListState(cloneArr);
		} else {
			setOptionListState(optionList);
		}

		// generate data for edit post
		if (isEditPost) {
			const editAuthors = dataEditMiniPost?.mentionsAuthors?.map(item => item.authors);
			const editCategorys = dataEditMiniPost?.mentionsCategories?.map(item => ({
				id: item.categoryId,
				name: item.category?.name,
			}));
			const editUsers = dataEditMiniPost?.mentionsUsers?.map(item => item.users);
			const editBook = dataEditMiniPost?.book;

			if (dataEditMiniPost) {
				const objTemp = { ...taggedData };
				if (editBook) {
					objTemp['addBook'] = {
						...editBook,
						status: dataEditMiniPost?.status,
					};
				}
				if (editAuthors) {
					objTemp['addAuthor'] = editAuthors;
				}
				if (editCategorys) {
					objTemp['addCategory'] = editCategorys;
				}
				if (editAuthors) {
					objTemp['addFriends'] = editUsers;
				}
				setTaggedData(objTemp);
				if (dataEditMiniPost?.image) {
					setImagesUpload([...dataEditMiniPost.image]);
					if (dataEditMiniPost?.image.length > 0) {
						setShowUpload(true);
					}
				}
				setProgressInputValue(dataEditMiniPost?.book?.progress);
				if (dataEditMiniPost.msg) {
					setContent(dataEditMiniPost.msg);
				}

				if (!_.isEmpty(dataEditMiniPost.sharePost) && dataEditMiniPost.verb === POST_VERB_SHARE) {
					dispatch(saveDataShare(dataEditMiniPost));
				} else if (dataEditMiniPost.verb === TOP_USER_VERB_SHARE) {
					const data = {
						avatarImage: dataEditMiniPost.info?.avatarImage,
						by: dataEditMiniPost.originId?.by,
						email: dataEditMiniPost.info?.email,
						firstName: dataEditMiniPost.info?.firstName,
						fullName: dataEditMiniPost.info?.fullName,
						id: dataEditMiniPost.info?.id,
						lastName: dataEditMiniPost.info.lastName,
						trueRank: dataEditMiniPost.originId?.rank,
						type: dataEditMiniPost.originId?.type,
						userType: dataEditMiniPost.originId?.userType,
						verb: TOP_USER_VERB_SHARE_LV1,
					};
					dispatch(saveDataShare(data));
				} else if (dataEditMiniPost.verb === TOP_QUOTE_VERB_SHARE) {
					const data = {
						background: dataEditMiniPost.info?.background,
						book: dataEditMiniPost.info.book,
						by: dataEditMiniPost.originId?.by,
						id: dataEditMiniPost.info?.id,
						quote: dataEditMiniPost.info?.quote,
						trueRank: dataEditMiniPost.originId.rank,
						type: dataEditMiniPost.originId?.type,
						user: {
							avatarImage: dataEditMiniPost.info?.createdBy?.avatarImage,
							firstName: dataEditMiniPost.info?.createdBy?.firstName,
							fullName: dataEditMiniPost.info?.createdBy?.fullName,
							lastName: dataEditMiniPost.info?.createdBy?.lastName,
						},
						verb: TOP_QUOTE_VERB_SHARE_LV1,
					};
					dispatch(saveDataShare(data));
				} else if (dataEditMiniPost.verb === TOP_BOOK_VERB_SHARE) {
					const data = {
						by: dataEditMiniPost.originId?.by,
						trueRank: dataEditMiniPost.originId.rank,
						verb: TOP_BOOK_VERB_SHARE_LV1,
						type: dataEditMiniPost.originId.type,
						...dataEditMiniPost.info,
					};
					dispatch(saveDataShare(data));
				} else if (
					dataEditMiniPost.verb === POST_VERB &&
					!_.isEmpty(dataEditMiniPost.metaData) &&
					dataEditMiniPost?.metaData?.chartType
				) {
					const data = {
						by: dataEditMiniPost.metaData.chartType,
						isReadedChart: dataEditMiniPost.metaData.isReadedChart,
						type: dataEditMiniPost.metaData.type,
						userId: dataEditMiniPost.metaData.chartBy.id,
						verb: CHART_VERB_SHARE,
					};
					dispatch(saveDataShare(data));
				} else if (dataEditMiniPost.verb === READ_TARGET_VERB_SHARE) {
					const percentTemp = (
						(dataEditMiniPost.sharePost.current / dataEditMiniPost.sharePost.target) *
						100
					).toFixed();
					const data = {
						avatarImage: dataEditMiniPost.readingGoalBy?.avatarImage,
						booksReadCount: dataEditMiniPost.sharePost.current,
						numberBook: dataEditMiniPost.totalTarget,
						percent: percentTemp > 100 ? 100 : percentTemp,
						userId: dataEditMiniPost?.readingGoalBy?.id,
						verb: READ_TARGET_VERB_SHARE_LV1,
					};
					dispatch(saveDataShare(data));
				} else if (dataEditMiniPost.verb === REVIEW_VERB_SHARE) {
					const data = {
						reviewId: dataEditMiniPost.sharePost.id,
						sharePost: {
							book: dataEditMiniPost.sharePost.book,
							createdBy: dataEditMiniPost.sharePost.createdBy,
						},
						verb: REVIEW_VERB_SHARE,
					};
					dispatch(saveDataShare(data));
				} else if (dataEditMiniPost.verb === QUOTE_VERB_SHARE) {
					const data = {
						background: dataEditMiniPost.sharePost.background,
						book: dataEditMiniPost.sharePost.book,
						bookId: dataEditMiniPost.sharePost.bookId,
						quote: dataEditMiniPost.sharePost.quote,
						user: dataEditMiniPost.sharePost.createdBy,
						verb: QUOTE_VERB_SHARE,
					};
					dispatch(saveDataShare(data));
				} else if (dataEditMiniPost.verb === GROUP_POST_VERB_SHARE) {
					const data = {
						group: dataEditMiniPost.sharePost.groupInfo,
						sharePost: {
							id: dataEditMiniPost.sharePost.progress,
							message: dataEditMiniPost.sharePost.message,
							bookId: dataEditMiniPost.sharePost.id,
							isDeleted: false,
						},
						verb: GROUP_POST_VERB_SHARE,
						...dataEditMiniPost,
					};
					dispatch(saveDataShare(data));
				}
			}
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
		if (urlAdded) {
			if (!_.isEqual(urlAdded, oldUrlAdded)) {
				setHasUrl(true);
				getPreviewUrlFnc(urlAdded);
			}
		} else {
			setHasUrl(false);
		}
		setOldUrlAdded(urlAdded);
	}, [urlAdded]);

	useEffect(() => {
		// generate hashtags added
		const hashtagsTemp = content?.match(hashtagRegex);
		if (hashtagsTemp) {
			const hashtagsFormated = hashtagsTemp.map(item =>
				item
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/đ/g, 'd')
					.replace(/Đ/g, 'D')
			);
			setHashtagsAdded(hashtagsFormated);
		} else {
			setHashtagsAdded([]);
		}

		// add event click when turn off modal
		createPostModalContainer.current.addEventListener('mousedown', handleHideCreatePost);
		return () => {
			if (createPostModalContainer.current) {
				createPostModalContainer.current.removeEventListener('mousedown', handleHideCreatePost);
			}
		};
	}, [content]);

	useEffect(() => {
		if (modalShow) {
			const modalBackground = document.querySelector('.modal-backdrop');
			modalBackground.style.backgroundColor = 'transparent';
		}
	}, [modalShow]);

	// handle turn off modal
	const hideCreatePostModal = () => {
		dispatch(saveDataShare({}));
		dispatch(updateBookForCreatePost({}));
		dispatch(handleSetImageToShare([]));
		dispatch(setOptionAddToPost({}));
		dispatch(handleClickCreateNewPostForBook(false));
		setIsEdit(false);
		// 2 dòng lệnh phía dưới luôn luôn ở dưới cùng
		setShowSubModal(false);
		setShowModalCreatePost(false);
	};

	const handleClose = () => {
		if (content) {
			setModalShow(true);
		} else {
			hideCreatePostModal();
		}
	};

	const handleHideCreatePost = e => {
		if (e.target === createPostModalContainer.current) {
			handleClose();
		}
	};
	//-----------------------------------------------------------------------

	const getPreviewUrlFnc = async url => {
		if (url) {
			setFetchingUrlInfo(true);
			const data = { 'url': url.includes('http') ? url : `http://${url}` };
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
		setUrlPreviewData({});
	};

	const backToMainModal = () => {
		setShowMainModal(true);
		dispatch(setOptionAddToPost({}));
	};

	const addOptionsToPost = param => {
		if (param.value === 'addBook') {
			dispatch(handleClickCreateNewPostForBook(true));
		}
		dispatch(setOptionAddToPost(param));
		setShowMainModal(false);
	};

	const handleOpenUploadImage = () => {
		if (!imagesUpload.length) {
			setShowUpload(!showUpload);
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
		if (option.value === 'addAuthor' || option.value === 'addFriends' || option.value === 'addCategory') {
			const listData = [...taggedData[option.value]];
			const lastItem = listData[listData.length - 1];
			if (!listData.length || (!_.isEmpty(lastItem) && lastItem.id !== data.id)) {
				if (!listData.find(item => item.id === data.id)) {
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
			tags: hashtagsAdded,
			progress: progressInputValue ? progressInputValue : null,
		};

		if (imagesUpload.length) {
			if (isEditPost) {
				const imgStringArr = imagesUpload.filter(item => typeof item === 'string');
				const fileImageArr = imagesUpload.filter(item => typeof item !== 'string');
				const imagesUploaded = await dispatch(uploadMultiFile(fileImageArr)).unwrap();
				const imgSrc = imagesUploaded.map(item => item.streamPath.medium);
				const imgArr = imgStringArr.concat(imgSrc);
				params.image = imgArr;
			} else {
				try {
					const imagesUploaded = await dispatch(uploadMultiFile(imagesUpload)).unwrap();
					params.image = imagesUploaded.map(item => item.streamPath.medium);
				} catch {
					const customId = 'custom-id-CreatePostModalContent-generateData';
					toast.error('Đăng ảnh không thành công', { toastId: customId });
					params.image = {};
				}
			}
		}
		params.mentionsUser = taggedData.addFriends.length ? taggedData.addFriends.map(item => item.id) : [];
		params.mentionsAuthor = taggedData.addAuthor.length ? taggedData.addAuthor.map(item => item.id) : [];
		params.mentionsCategory = taggedData.addCategory.length ? taggedData.addCategory.map(item => item.id) : [];
		if (!_.isEmpty(taggedData.addBook)) {
			params.bookId = taggedData.addBook.id;
		}
		params['feedId'] = dataEditMiniPost.getstreamId ? dataEditMiniPost.getstreamId : dataEditMiniPost.id;
		return params;
	};

	const handleUpdateProgress = async () => {
		const { progress, id, page } = taggedData.addBook;
		const convertProgress = parseInt(progress) || 0;
		const progressParams = { id: id, progress: convertProgress };
		dispatch(updateProgressReadingBook(progressParams)).unwrap();
		try {
			// Check cuốn sách hiện tại đang ở trong thư viện nào của ng dùng hay k
			let libraryContainCurrentBook = null;
			if (myAllLibraryReduxDefault.length) {
				const found = myAllLibraryReduxDefault.find(item1 => item1.books.find(item2 => item2.bookId === id));
				libraryContainCurrentBook = found?.defaultType;
			}

			let type = STATUS_BOOK.wantToRead;
			if (convertProgress > 0 && convertProgress < page) {
				type = STATUS_BOOK.reading;
			} else if (convertProgress === page) {
				type = STATUS_BOOK.read;
			}

			if (type !== libraryContainCurrentBook) {
				const addBookParams = { bookId: id, type };
				dispatch(addBookToDefaultLibrary(addBookParams)).unwrap();
			}
			setTimeout(() => {
				dispatch(updateMyAllLibraryRedux());
			}, 500);
		} catch (error) {
			NotificationError(error);
		}
	};

	const handleCreateReview = async params => {
		try {
			const reviewData = {
				bookId: params.bookId,
				mediaUrl: [],
				content: content,
				curProgress: taggedData.addBook.status === 'read' ? taggedData.addBook.page : progressInputValue || 0,
				rate:
					taggedData.addBook.status === 'read' || progressInputValue === taggedData.addBook.page
						? valueStar
						: 0,
				tags: params.tags,
				image: params.image,
				preview: params.preview,
			};
			await dispatch(createReviewBook(reviewData)).unwrap();
		} catch (error) {
			NotificationError(error);
		}
	};

	// const handleEditReview = async params => {
	// 	try {
	// 		const reviewData = {
	// 			bookId: params.bookId,
	// 			mediaUrl: [],
	// 			content: content,
	// 			curProgress: taggedData.addBook.status === 'read' ? taggedData.addBook.page : progressInputValue || 0,
	// 			rate:
	// 				taggedData.addBook.status === 'read' || progressInputValue === taggedData.addBook.page
	// 					? valueStar
	// 					: 0,
	// 			tags: params.tags,
	// 			image: params.image,
	// 			preview: params.preview,
	// 		};
	// 		const data = { id: 1225, data: reviewData };
	// 		await dispatch(handleEditReviewsBook(data)).unwrap();
	// 	} catch (error) {
	// 		NotificationError(error);
	// 	}
	// };

	const onCreatePost = async () => {
		const params = await generateData();
		// book, author , topic is required
		setStatus(STATUS_LOADING);
		try {
			if (postDataShare && !_.isEmpty(postDataShare) && !postDataShare.sharePost.isDeleted) {
				if (isEditPost) {
					await dispatch(handleEditPost(params)).unwrap();
				} else {
					if (postDataShare.verb === POST_VERB_SHARE) {
						const query = {
							id:
								postDataShare.type === 'post'
									? postDataShare.minipostId
									: Number(postDataShare.shareId),
							type: 'post',
							...params,
						};
						await dispatch(getSharePostInternal(query)).unwrap();
					} else if (
						postDataShare.verb === TOP_USER_VERB_SHARE ||
						postDataShare.verb === TOP_BOOK_VERB_SHARE ||
						postDataShare.verb === TOP_QUOTE_VERB_SHARE ||
						postDataShare.verb === READ_TARGET_VERB_SHARE
					) {
						const query = {
							id:
								postDataShare.minipostId ||
								postDataShare.sharePost.minipostId ||
								postDataShare.sharePost.id,
							type: 'post',
							...params,
						};
						await dispatch(getSharePostInternal(query)).unwrap();
					} else if (postDataShare.verb === QUOTE_VERB_SHARE) {
						const query = {
							id: postDataShare.sharePost ? Number(postDataShare.shareId) : postDataShare.id,
							type: 'quote',
							background: postDataShare.background,
							...params,
						};
						await dispatch(getSharePostInternal(query)).unwrap();
					} else if (postDataShare.verb === GROUP_POST_VERB_SHARE) {
						const query = {
							id: postDataShare.shareId
								? Number(postDataShare.shareId)
								: postDataShare.sharePost.groupPostId
								? postDataShare.sharePost.groupPostId
								: postDataShare.sharePost.id,
							type: 'groupPost',
							...params,
						};
						await dispatch(getSharePostInternal(query)).unwrap();
					} else if (postDataShare.verb === READ_TARGET_VERB_SHARE_LV1) {
						const data = {
							msg: content,
							current: postDataShare.booksReadCount,
							mentionsUser: params.mentionsUser,
							tags: params.tags,
						};
						await dispatch(
							shareTargetReadings({
								userId: postDataShare.userId,
								data,
							})
						).unwrap();
					} else if (postDataShare.verb === TOP_USER_VERB_SHARE_LV1) {
						const query = {
							msg: content,
							by: postDataShare.by,
							type: postDataShare.type,
							categoryId: postDataShare.categoryId || null,
							userType: postDataShare.userType,
							id: postDataShare.id,
							mentionsUser: params.mentionsUser,
							tags: params.tags,
						};
						await dispatch(getSharePostRanks(query)).unwrap();
					} else if (postDataShare.verb === TOP_BOOK_VERB_SHARE_LV1) {
						const query = {
							msg: content,
							by: postDataShare.by,
							type: postDataShare.type,
							categoryId: postDataShare.categoryId || null,
							id: postDataShare.id,
							mentionsUser: params.mentionsUser,
							tags: params.tags,
						};
						await dispatch(getSharePostRanks(query)).unwrap();
					} else if (postDataShare.verb === MY_BOOK_VERB_SHARE) {
						const query = {
							id: postDataShare.id,
							msg: content,
							type: postDataShare.type,
							mentionsUser: params.mentionsUser,
							tags: params.tags,
						};
						await dispatch(shareMyBook(query)).unwrap();
					} else if (postDataShare.verb === TOP_QUOTE_VERB_SHARE_LV1) {
						const query = {
							msg: content,
							by: postDataShare.by,
							type: postDataShare.type,
							categoryId: postDataShare.categoryId || null,
							id: postDataShare.id,
							mentionsUser: params.mentionsUser,
							tags: params.tags,
						};
						await dispatch(getSharePostRanks(query)).unwrap();
					} else if (postDataShare.verb === REVIEW_VERB_SHARE) {
						const query = {
							id: postDataShare.reviewId,
							type: 'review',
							book: postDataShare.sharePost?.book,
							...params,
						};
						await dispatch(getSharePostInternal(query)).unwrap();
					} else if (postDataShare.verb === CHART_VERB_SHARE) {
						const query = {
							metaData: {
								type: postDataShare.type,
								chartBy: postDataShare.userId,
								chartType: postDataShare.by,
								isReadedChart: postDataShare.isReadedChart,
							},
							...params,
						};
						await dispatch(createActivity(query)).unwrap();
					} else if (postDataShare.verb === GROWTH_CHART_VERB_SHARE) {
						const query = {
							metaData: {
								type: postDataShare.type,
								chartType: postDataShare.by,
								reportType: 'addToLibrary',
								bookId: postDataShare.bookId,
							},
							...params,
						};
						await dispatch(createActivity(query)).unwrap();
					}
				}
			} else {
				if (params.bookId) {
					// initialProgress.current = params.progress;
					if (params.msg && params.progress > 0 && !location.pathname.includes('group')) {
						// if (isEditPost) {
						// 	if (initialProgress.current === 0) {
						// 		handleCreateReview(params);
						// 	} else {
						// 		handleEditReview(params);
						// 	}
						// } else {
						handleCreateReview(params);
					}
					if (valueStar > 0) {
						userRating();
					}
					handleUpdateProgress();
				}
				if (location.pathname.includes('group')) {
					if (isEditPost) {
						await dispatch(handleEditGroupPost(params)).unwrap();
					} else {
						const newParams = { data: params, id: id };
						await dispatch(creatNewPost(newParams)).unwrap();
					}
				} else {
					if (isEditPost) {
						if (dataEditMiniPost.groupPostId) {
							await dispatch(handleEditGroupPost(params)).unwrap();
						} else {
							await dispatch(handleEditPost(params)).unwrap();
						}
					} else {
						await dispatch(createActivity(params)).unwrap();
					}
				}
			}
			setStatus(STATUS_SUCCESS);
			const customId = 'custom-id-CreatePostModalContent-onCreatePost-success';
			if (isEditPost) {
				toast.success('Chỉnh sửa bài viết thành công!', { toastId: customId });
			} else {
				toast.success('Tạo bài viết thành công!', { toastId: customId });
			}
			if (isEditPost) {
				const newCategoryArr = taggedData.addCategory.map(item => ({
					category: { name: item.name },
					categoryId: item.id,
				}));
				const newUsersArr = taggedData.addFriends.map(item => ({ users: item }));
				const newAuthorsArr = taggedData.addAuthor.map(item => ({
					activityId: null,
					authorId: item.id,
					authors: item,
				}));

				const data = {
					book: !_.isEmpty(taggedData.addBook) ? taggedData.addBook : null,
					image: params.image,
					mentionsAuthors: newAuthorsArr,
					mentionsCategories: newCategoryArr,
					mentionsUsers: newUsersArr,
					message: params.msg,
					minipostId: dataEditMiniPost.minipostId,
					preview: urlPreviewData,
					progress: params.progress,
				};
				handleUpdateMiniPost(data);
			} else {
				onChangeNewPost();
			}
		} catch (err) {
			if (err.errorCode === 321) {
				const customIdNotInGroup = 'custom-id-CreatePostModalContent-onCreatePost-not-in-group';
				toast.error('Bạn chưa tham gia nhóm', { toastId: customIdNotInGroup });
			} else {
				const customIdCreatePostFail = 'custom-id-CreatePostModalContent-onCreatePost-error';
				toast.error('Tạo bài viết thất bại!', { toastId: customIdCreatePostFail });
			}
		} finally {
			setStatus(STATUS_IDLE);
			hideCreatePostModal();
			dispatch(setMyTargetReading([]));
			dispatch(handleResetMyTargetReading());
		}
	};

	useEffect(() => {
		if (!_.isEmpty(taggedData.addBook)) {
			if (!_.isEmpty(bookForCreatePost) && taggedData.addBook.status === 'read') {
				setProgressInputValue(taggedData.addBook.page);
			} else {
				setProgressInputValue(parseInt(taggedData.addBook.progress));
			}
		}
	}, [taggedData]);

	useEffect(() => {
		checkActive();
	}, [showMainModal, content, progressInputValue, imagesUpload, taggedData.addAuthor, taggedData.addCategory]);

	const checkActive = () => {
		let isActive = false;
		if (!_.isEmpty(taggedData.addBook)) {
			if (isReview) {
				if (content && progressInputValue > 0) {
					isActive = true;
				}
			} else {
				if (taggedData.addBook.status === 'read' || taggedData.addBook.page === progressInputValue) {
					if (content) {
						isActive = true;
					}
				}
				if (taggedData.addBook.status === 'reading') {
					if (progressInputValue > 0) {
						isActive = true;
					}
				} else {
					isActive = true;
				}
			}
		} else if (
			(content && (taggedData.addAuthor.length || taggedData.addCategory.length || !_.isEmpty(postDataShare))) ||
			chartImgShare.length
		) {
			isActive = true;
		}
		setButtonActive(isActive);
	};

	const handleChangeStar = e => {
		setValueStar(e);
	};

	const userRating = async () => {
		const params = { star: valueStar, id: bookInfo.id || taggedData.addBook.id };
		if (valueStar) {
			try {
				await dispatch(ratingUser(params)).unwrap();
				if (window.location.pathname.includes('/book/detail/')) {
					dispatch(handleRefreshRatingData());
				}
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
		switch (postDataShare.by) {
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

	const withFriends = paramInfo => {
		if (paramInfo.length === 1) {
			return (
				<span>
					<span style={{ fontWeight: '500', color: '#6E7191' }}> cùng với </span>
					{paramInfo[0].fullName || paramInfo[0].firstName + ' ' + paramInfo[0].lastName}
				</span>
			);
		} else if (paramInfo.length === 2) {
			return (
				<span>
					<span style={{ fontWeight: '500', color: '#6E7191' }}> cùng với </span>
					{paramInfo[0].fullName || paramInfo[0].firstName + ' ' + paramInfo[0].lastName}
					<span style={{ fontWeight: '500', color: '#6E7191' }}> và </span>
					{paramInfo[1].fullName || paramInfo[1].firstName + ' ' + paramInfo[1].lastName}
				</span>
			);
		} else {
			return (
				<span>
					<span style={{ fontWeight: '500', color: '#6E7191' }}> cùng với </span>
					{paramInfo[0].fullName || paramInfo[0].firstName + ' ' + paramInfo[0].lastName}
					<span style={{ fontWeight: '500', color: '#6E7191' }}> và </span>
					{paramInfo.length - 1}
					{' người khác '}
				</span>
			);
		}
	};

	//----------------------------------------------------------------------
	const handleAccept = () => {
		setModalShow(false);
		hideCreatePostModal();
	};

	const handleCancel = () => {
		setModalShow(false);
	};

	const renderChartTitle = () => {
		if (postDataShare?.verb === CHART_VERB_SHARE) {
			return `# Biểu đồ số ${
				postDataShare?.isReadedChart ? 'sách' : 'trang sách'
			} đã đọc nhiều nhất theo ${handleTime()}`;
		} else if (postDataShare?.type === 'growthChart') {
			return `# Biểu đồ tăng trưởng của cuốn sách "${postDataShare?.nameBook}" của ${postDataShare?.authorName}`;
		}
	};

	return (
		<div className='create-post-modal-content__container' ref={createPostModalContainer}>
			<div className='create-post-modal-content'>
				<Circle loading={status === STATUS_LOADING} />
				<div
					className={classNames('create-post-modal-content__main', {
						'hide': option.value !== 'addImages' && !showMainModal,
					})}
				>
					<div className='create-post-modal-content__main__header'>
						<div style={{ visibility: 'hidden' }} className='create-post-modal-content__main__close'>
							<CloseX />
						</div>
						<h5>
							{isEditPost
								? 'Chỉnh sửa bài viết'
								: postDataShare && !_.isEmpty(postDataShare)
								? 'Chia sẻ bài viết'
								: 'Tạo bài viết'}
						</h5>
						<button className='create-post-modal-content__main__close' onClick={handleClose}>
							<CloseX />
						</button>
					</div>
					<div className='create-post-modal-content__main__body'>
						<div className='create-post-modal-content__main__body__user-info'>
							<div className='create-post-modal-content__main__body__user-info__block-left'>
								<UserAvatar className='newfeed__create-post__avatar' source={userInfo?.avatarImage} />
							</div>
							<div className='create-post-modal-content__main__body__user-info__block-right'>
								<p>
									{userInfo?.fullName ||
										userInfo?.lastName ||
										userInfo?.firstName ||
										'Không xác định'}

									{/* tagged people */}
									{taggedData.addFriends &&
										!!taggedData.addFriends.length &&
										withFriends(taggedData.addFriends)}
								</p>
								{/* k xóa ShareModeComponent */}
								{/* <ShareModeComponent
									list={shareModeList}
									shareMode={shareMode}
									setShareMode={setShareMode}
								/> */}
							</div>
						</div>
						<div className='create-post-modal-content__main__body__text-field-edit-wrapper'>
							<RichTextEditor
								placeholder='Hãy chia sẻ cảm nhận của bạn ...'
								setUrlAdded={setUrlAdded}
								setContent={setContent}
								hasMentionsUser={false}
								hasUrl={hasUrl}
								initialContent={dataEditMiniPost?.message}
							/>
							<TaggedList taggedData={taggedData} removeTaggedItem={removeTaggedItem} type='addAuthor' />
							<TaggedList
								taggedData={taggedData}
								removeTaggedItem={removeTaggedItem}
								type='addCategory'
							/>
							{postDataShare.type === 'topQuote' && postDataShare.verb === TOP_QUOTE_VERB_SHARE_LV1 && (
								<div className='post__title__share__rank'>
									<span className='number__title__rank'># Top {postDataShare.trueRank} quotes </span>{' '}
									<span className='title__rank'>
										{postDataShare.categoryName?.length
											? `  được like nhiều nhất thuộc ${
													postDataShare.categoryName
											  } theo ${handleTime()} `
											: `  được like nhiều nhất theo ${handleTime()}`}
									</span>
									<IconRanks />
								</div>
							)}
							{(postDataShare?.verb === CHART_VERB_SHARE ||
								postDataShare?.verb === GROWTH_CHART_VERB_SHARE) && (
								<div className='post__title__share__rank'>
									<span className='number__title__rank'>{renderChartTitle()}</span>
								</div>
							)}
							{postDataShare.type === 'topBook' && postDataShare.verb === TOP_BOOK_VERB_SHARE_LV1 && (
								<div className='post__title__share__rank'>
									<span className='number__title__rank'># Top {postDataShare.trueRank}</span>
									<span className='title__rank'>
										{postDataShare.categoryName
											? `  cuốn sách tốt nhất thuộc  ${
													postDataShare.categoryName
											  } theo ${handleTime()} `
											: `  cuốn sách tốt nhất theo ${handleTime()} `}
									</span>
									<IconRanks />
								</div>
							)}
							{postDataShare.type === 'topBookAuthor' && (
								<div className='post__title__share__rank'>
									<span className='number__title__rank'># Sách của tôi làm tác giả</span>
								</div>
							)}
							{!_.isEmpty(postDataShare) && !postDataShare.sharePost.isDeleted && (
								<div
									className={
										postDataShare.verb !== GROWTH_CHART_VERB_SHARE &&
										postDataShare.verb !== CHART_VERB_SHARE &&
										postDataShare.verb !== TOP_USER_VERB_SHARE_LV1 &&
										postDataShare.verb !== READ_TARGET_VERB_SHARE_LV1
											? 'create-post-modal-content__main__share-container'
											: ''
									}
								>
									{postDataShare.verb === POST_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
									{(postDataShare.verb === QUOTE_VERB_SHARE ||
										postDataShare.verb === TOP_QUOTE_VERB_SHARE_LV1) && (
										<QuoteCard data={postDataShare} isShare={true} />
									)}
									{postDataShare.verb === GROUP_POST_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
									{(postDataShare.verb === TOP_BOOK_VERB_SHARE_LV1 ||
										postDataShare.verb === MY_BOOK_VERB_SHARE) && (
										<AuthorBook data={postDataShare} checkStar={true} inCreatePost={true} />
									)}
									{postDataShare.verb === REVIEW_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
									{postDataShare.verb === TOP_USER_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
									{postDataShare.verb === TOP_BOOK_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
									{postDataShare.verb === TOP_QUOTE_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
									{postDataShare.verb === READ_TARGET_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
								</div>
							)}
							{postDataShare.verb === READ_TARGET_VERB_SHARE_LV1 && (
								<ShareTarget postData={postDataShare} />
							)}
							{postDataShare.verb === TOP_USER_VERB_SHARE_LV1 && <ShareUsers postData={postDataShare} />}
							{showUpload && (
								<UploadImage
									addOptionsToPost={addOptionsToPost}
									images={imagesUpload}
									setImages={setImagesUpload}
									removeAllImages={removeAllImages}
									maxFiles={100}
									maxSize={104857600}
									isEditPost={isEditPost}
									dataEditMiniPost={dataEditMiniPost}
								/>
							)}
							{hasUrl && !showUpload && (
								<PreviewLink
									urlData={urlPreviewData}
									isFetching={fetchingUrlInfo}
									removeUrlPreview={removeUrlPreview}
									inCreatePost={true}
								/>
							)}
							{!_.isEmpty(taggedData.addBook) && (
								<PostEditBook
									data={taggedData.addBook}
									handleAddToPost={handleAddToPost}
									handleChangeStar={handleChangeStar}
									valueStar={valueStar}
								/>
							)}
						</div>
					</div>
					<div className='create-post-modal-content__main__options-and-submit'>
						<div className='create-post-modal-content__main__options'>
							<span className='create-post-modal-content__title'>Thêm vào bài viết</span>
							<div className='create-post-modal-content__main__options__items'>
								<OptionsPost
									list={optionListState}
									addOptionsToPost={addOptionsToPost}
									taggedData={taggedData}
									postDataShare={postDataShare}
									isEditPost={isEditPost}
									dataEditMiniPost={dataEditMiniPost}
								/>
								<span
									className={classNames(
										'create-post-modal-content__main__options__item-add-to-post',
										{
											'active': imagesUpload.length > 0,
											'disabled':
												(!_.isEmpty(postDataShare) &&
													verbShareArray.indexOf(postDataShare.verb) !== -1) ||
												chartImgShare.length ||
												dataEditMiniPost?.metaData?.chartType,
										}
									)}
									onMouseOver={() => setShowImagePopover(true)}
									onMouseLeave={() => setShowImagePopover(false)}
									onClick={handleOpenUploadImage}
								>
									<div
										className={classNames(
											'create-post-modal-content__main__options__item-add-to-post__popover',
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
							className={classNames('create-post-modal-content__main__submit', {
								'active': buttonActive,
							})}
							onClick={onCreatePost}
							disabled={buttonActive ? false : true}
						>
							Đăng
						</button>
					</div>
				</div>
				{/* sub modal */}
				<div
					className={classNames('create-post-modal-content__substitute', {
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
						userInfo={userInfo}
					/>
				</div>
				<DirectLinkALertModal
					className={'creat-post-modal-content__modal-confirm'}
					modalShow={modalShow}
					handleAccept={handleAccept}
					handleCancel={handleCancel}
					message={message}
					yesBtnMsg={'Có'}
					noBtnMsg={'Không'}
					centered={false}
				/>
			</div>
		</div>
	);
}

CreatePostModalContent.defaultProps = {
	onChangeNewPost: () => {},
	setShowModalCreatePost: () => {},
	showSubModal: false,
	setShowSubModal: () => {},
	isReview: false,
	dataEditMiniPost: {},
	isEditPost: false,
	setIsEdit: () => {},
	handleUpdateMiniPost: () => {},
};

CreatePostModalContent.propTypes = {
	onChangeNewPost: PropTypes.func,
	setShowModalCreatePost: PropTypes.func,
	showSubModal: PropTypes.bool,
	setShowSubModal: PropTypes.func,
	dataEditMiniPost: PropTypes.object,
	isReview: PropTypes.bool,
	isEditPost: PropTypes.bool,
	setIsEdit: PropTypes.func,
	handleUpdateMiniPost: PropTypes.func,
};

export default CreatePostModalContent;
