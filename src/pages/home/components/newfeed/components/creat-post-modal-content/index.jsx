/* eslint-disable max-lines */
import classNames from 'classnames';
import { CloseX, Image, IconRanks, WorldNet } from 'components/svg'; // k xóa WorldNet
import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants/index';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createActivity } from 'reducers/redux-utils/activity';
import PostEditBook from 'shared/post-edit-book';
import OptionsPost from './OptionsPost';
import CreatPostSubModal from './CreatePostSubModal';
import TaggedList from './TaggedList';
import UploadImage from './UploadImage';
import PreviewLink from 'shared/preview-link/PreviewLink';
import { getPreviewUrl, getSharePostInternal, getSharePostRanks, shareMyBook } from 'reducers/redux-utils/post';
import Circle from 'shared/loading/circle';
import './style.scss';
import { ratingUser } from 'reducers/redux-utils/book';
import UserAvatar from 'shared/user-avatar';
import { updateCurrentBook, updateProgressReadingBook, createReviewBook } from 'reducers/redux-utils/book';
import { STATUS_BOOK } from 'constants/index';
import { addBookToDefaultLibrary, updateMyAllLibraryRedux } from 'reducers/redux-utils/library';
import { setting } from './settings';
import { NotificationError } from 'helpers/Error';
import { uploadMultiFile } from 'reducers/redux-utils/common';
import { useLocation, useParams } from 'react-router-dom';
import { creatNewPost } from 'reducers/redux-utils/group';
import QuoteCard from 'shared/quote-card';
import { saveDataShare } from 'reducers/redux-utils/post';
import AuthorBook from 'shared/author-book';
import ShareUsers from '../modal-share-users';
import RichTextEditor from 'shared/rich-text-editor';
import ShareTarget from 'shared/share-target';
import PostShare from 'shared/posts-Share';
import { shareTargetReadings } from 'reducers/redux-utils/target';
import {
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	READ_TARGET_VERB_SHARE,
	TOP_USER_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	MY_BOOK_VERB_SHARE,
	REVIEW_VERB_SHARE,
} from 'constants';
import { handleClickCreateNewPostForBook } from 'reducers/redux-utils/activity';
// import ShareModeComponent from './ShareModeComponent';

const verbShareArray = [
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	READ_TARGET_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	TOP_USER_VERB_SHARE,
	REVIEW_VERB_SHARE,
];

const hashtagRegex =
	/#(?![0-9_]+\b)[0-9a-z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/gi;

function CreatePostModalContent({
	hideCreatePostModal,
	setShowModalCreatPost,
	showModalCreatPost,
	option,
	onChangeOption,
	onChangeNewPost,
	showSubModal,
	bookForCreatePost,
}) {
	// const [shareMode, setShareMode] = useState({ value: 'public', title: 'Mọi người', icon: <WorldNet /> }); // k xóa
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
	const [valueStar, setValueStar] = useState(0);
	const [progressInputValue, setProgressInputValue] = useState(0);
	const [showImagePopover, setShowImagePopover] = useState(false);
	const [buttonActive, setButtonActive] = useState(false);
	const [content, setContent] = useState('');
	const [hashtagsAdded, setHashtagsAdded] = useState([]);
	const [optionListState, setOptionListState] = useState([]);

	const dispatch = useDispatch();
	const location = useLocation();

	const UpdateImg = useSelector(state => state.chart.updateImgPost);
	const chartImgShare = useSelector(state => state.chart.updateImgPost);
	const { postDataShare } = useSelector(state => state.post);
	const {
		auth: { userInfo },
		book: { bookInfo },
	} = useSelector(state => state);

	const myAllLibraryReduxDefault = useSelector(state => state.library.myAllLibrary).default;

	const { id } = useParams();

	const { optionList, shareModeList } = setting; // k xóa shareModeList

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

		if (!_.isEmpty(bookForCreatePost)) {
			const cloneArr = [...optionList];
			cloneArr.splice(0, 1);
			setOptionListState(cloneArr);
		} else {
			setOptionListState(optionList);
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
		const hashtagsTemp = content.match(hashtagRegex);
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
	}, [content]);

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
		onChangeOption({});
	};

	const addOptionsToPost = param => {
		if (param.value === 'addBook') {
			dispatch(handleClickCreateNewPostForBook(true));
		}
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
			progress: progressInputValue ? progressInputValue : 0,
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
				const customId = 'custom-id-CreatePostModalContent-generateData';
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

	const handleUpdateProgress = async () => {
		const { status, progress, id, page } = taggedData.addBook;
		const convertProgress = parseInt(progress) || 0;
		const progressParams = { id: id, progress: convertProgress };
		dispatch(updateProgressReadingBook(progressParams)).unwrap();
		try {
			if (status) {
				if (convertProgress === page) {
					const addBookParams = { bookId: id, type: STATUS_BOOK.read };
					dispatch(addBookToDefaultLibrary(addBookParams)).unwrap();
				}
			} else {
				// Check cuốn sách hiện tại đang ở trong thư viện nào của ng dùng hay k
				let libraryContainCurrentBook = null;
				if (myAllLibraryReduxDefault.length) {
					const found = myAllLibraryReduxDefault.find(item1 =>
						item1.books.find(item2 => item2.bookId === id)
					);
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
			}
			setTimeout(() => {
				dispatch(updateMyAllLibraryRedux());
			}, 150);
		} catch (error) {
			NotificationError(error);
		}
	};

	const onCreatePost = async () => {
		const params = await generateData();
		// book, author , topic is required
		setStatus(STATUS_LOADING);
		try {
			if (postDataShare && !_.isEmpty(postDataShare)) {
				if (postDataShare.verb === POST_VERB_SHARE) {
					const query = {
						id: postDataShare.type === 'post' ? postDataShare.minipostId : Number(postDataShare.shareId),
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
				} else if (postDataShare.verb === READ_TARGET_VERB_SHARE) {
					const data = {
						msg: content,
						current: postDataShare.booksReadCount,
						mentionsUser: params.mentionsUser,
					};
					await dispatch(
						shareTargetReadings({
							userId: postDataShare.userId,
							data,
						})
					).unwrap();
				} else if (postDataShare.verb === TOP_USER_VERB_SHARE) {
					const query = {
						msg: content,
						by: postDataShare.by,
						type: postDataShare.type,
						categoryId: postDataShare.categoryId || null,
						userType: postDataShare.userType,
						id: postDataShare.id,
						mentionsUser: params.mentionsUser,
					};
					await dispatch(getSharePostRanks(query)).unwrap();
				} else if (postDataShare.verb === TOP_BOOK_VERB_SHARE) {
					const query = {
						msg: content,
						by: postDataShare.by,
						type: postDataShare.type,
						categoryId: postDataShare.categoryId || null,
						id: postDataShare.id,
						mentionsUser: params.mentionsUser,
					};
					await dispatch(getSharePostRanks(query)).unwrap();
				} else if (postDataShare.verb === MY_BOOK_VERB_SHARE) {
					const query = {
						id: postDataShare.id,
						msg: content,
						type: postDataShare.type,
						mentionsUser: params.mentionsUser,
					};
					await dispatch(shareMyBook(query)).unwrap();
				} else if (postDataShare.verb === TOP_QUOTE_VERB_SHARE) {
					const query = {
						msg: content,
						by: postDataShare.by,
						type: postDataShare.type,
						categoryId: postDataShare.categoryId || null,
						id: postDataShare.id,
						mentionsUser: params.mentionsUser,
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
				}
			} else {
				if (params.bookId) {
					if (params.msg && params.progress > 0) {
						const reviewData = {
							bookId: params.bookId,
							mediaUrl: [],
							content: content,
							curProgress:
								taggedData.addBook.status === 'read'
									? taggedData.addBook.page
									: progressInputValue || 0,
							rate:
								taggedData.addBook.status === 'read' || progressInputValue === taggedData.addBook.page
									? valueStar
									: 0,
							tags: params.tags,
						};
						dispatch(createReviewBook(reviewData));
					}
					if (valueStar > 0) {
						userRating();
					}
					handleUpdateProgress();
				}

				if (location.pathname.includes('group')) {
					const newParams = { data: params, id: id };
					await dispatch(creatNewPost(newParams)).unwrap();
				} else {
					await dispatch(createActivity(params)).unwrap();
				}
			}
			setStatus(STATUS_SUCCESS);
			const customId = 'custom-id-CreatePostModalContent-onCreatePost-success';
			toast.success('Tạo bài viết thành công!', { toastId: customId });
			onChangeNewPost();
		} catch (err) {
			const customId = 'custom-id-CreatePostModalContent-onCreatePost-error';
			toast.error('Tạo bài viết thất bại!', { toastId: customId });
		} finally {
			dispatch(updateCurrentBook({}));
			dispatch(saveDataShare({}));
			setStatus(STATUS_IDLE);
			hideCreatePostModal();
			onChangeOption({});
			setShowModalCreatPost(false);
		}
	};

	useEffect(() => {
		if (!_.isEmpty(taggedData.addBook)) {
			if (taggedData.addBook.status === 'read') {
				setProgressInputValue(taggedData.addBook.page);
			} else {
				setProgressInputValue(parseInt(taggedData.addBook.progress));
			}
		}
	}, [taggedData]);

	useEffect(() => {
		checkActive();
	}, [showMainModal, content, progressInputValue, imagesUpload]);

	const checkActive = () => {
		let isActive = false;
		if (!_.isEmpty(taggedData.addBook)) {
			if (window.location.pathname.includes('book/detail')) {
				if (content && progressInputValue > 0) {
					isActive = true;
				}
			} else {
				if (taggedData.addBook.status === 'read' || taggedData.addBook.page === progressInputValue) {
					if (content) {
						isActive = true;
					}
				} else {
					isActive = true;
				}
			}
		} else if (
			content &&
			(taggedData.addAuthor.length ||
				taggedData.addCategory.length ||
				imagesUpload.length ||
				!_.isEmpty(postDataShare))
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
					{' cùng với '}
					{paramInfo[0].fullName || paramInfo[0].firstName + ' ' + paramInfo[0].lastName}
					<span style={{ fontWeight: '500' }}>.</span>
				</span>
			);
		} else if (paramInfo.length === 2) {
			return (
				<span>
					{' cùng với '}
					{paramInfo[0].fullName || paramInfo[0].firstName + ' ' + paramInfo[0].lastName}
					{' và '}
					{paramInfo[1].fullName || paramInfo[1].firstName + ' ' + paramInfo[1].lastName}
					<span style={{ fontWeight: '500' }}>.</span>
				</span>
			);
		} else {
			return (
				<span>
					{' cùng với '}
					{paramInfo[0].fullName || paramInfo[0].firstName + ' ' + paramInfo[0].lastName}
					{' và '}
					{paramInfo.length - 1}
					{' người khác.'}
				</span>
			);
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
					<h5>{postDataShare && !_.isEmpty(postDataShare) ? 'Chia sẻ bài viết' : 'Tạo bài viết'}</h5>
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
							{postDataShare.type === 'topQuote' && (
								<div className='post__title__share__rank'>
									<span className='number__title__rank'># Top {postDataShare.trueRank} quotes </span>{' '}
									<span className='title__rank'>
										{postDataShare.categoryName?.length
											? `  được like nhiều nhất thuộc ${
													postDataShare.categoryName
											  } theo ${handleTime()} `
											: `  được like nhiều nhất theo ${handleTime()} `}
									</span>
									<IconRanks />
								</div>
							)}
							{postDataShare.type === 'topBook' && (
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

							{!_.isEmpty(postDataShare) && (
								<div
									className={
										postDataShare.verb !== TOP_USER_VERB_SHARE &&
										postDataShare.verb !== READ_TARGET_VERB_SHARE
											? 'creat-post-modal-content__main__share-container'
											: ''
									}
								>
									{postDataShare.verb === POST_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
									{(postDataShare.verb === QUOTE_VERB_SHARE ||
										postDataShare.verb === TOP_QUOTE_VERB_SHARE) && (
										<QuoteCard data={postDataShare} isShare={true} />
									)}
									{postDataShare.verb === GROUP_POST_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
									{(postDataShare.verb === TOP_BOOK_VERB_SHARE ||
										postDataShare.verb === MY_BOOK_VERB_SHARE) && (
										<AuthorBook data={postDataShare} checkStar={true} inCreatePost={true} />
									)}
									{postDataShare.verb === REVIEW_VERB_SHARE && (
										<PostShare postData={postDataShare} inCreatePost={true} />
									)}
								</div>
							)}
							{postDataShare.verb === READ_TARGET_VERB_SHARE && <ShareTarget postData={postDataShare} />}
							{postDataShare.verb === TOP_USER_VERB_SHARE && <ShareUsers postData={postDataShare} />}

							{!_.isEmpty(taggedData.addBook) || showUpload ? (
								<>
									{!_.isEmpty(taggedData.addBook) && (
										<PostEditBook
											data={taggedData.addBook}
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
											inCreatePost={true}
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
									list={optionListState}
									addOptionsToPost={addOptionsToPost}
									taggedData={taggedData}
									postDataShare={postDataShare}
								/>
								<span
									className={classNames('creat-post-modal-content__main__options__item-add-to-post', {
										'active': imagesUpload.length > 0 && _.isEmpty(taggedData.addBook),
										'disabled':
											(!_.isEmpty(postDataShare) &&
												verbShareArray.indexOf(postDataShare.verb) !== -1) ||
											chartImgShare.length,
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
							onClick={onCreatePost}
							disabled={buttonActive ? false : true}
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
					userInfo={userInfo}
				/>
			</div>
		</div>
	);
}

CreatePostModalContent.propTypes = {
	hideCreatePostModal: PropTypes.func,
	showModalCreatPost: PropTypes.bool,
	option: PropTypes.object,
	setOption: PropTypes.func,
	onChangeOption: PropTypes.func,
	onChangeNewPost: PropTypes.func,
	renderBookReading: PropTypes.object,
	setShowModalCreatPost: PropTypes.func,
	showSubModal: PropTypes.bool,
	bookInfoProp: PropTypes.object,
};

export default CreatePostModalContent;
