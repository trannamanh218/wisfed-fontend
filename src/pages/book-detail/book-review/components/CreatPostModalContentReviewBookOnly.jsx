/* eslint-disable max-lines */
import classNames from 'classnames';
import { CloseX, Image, IconRanks, CategoryIcon, Feather, GroupIcon, Lock, PodCast, WorldNet } from 'components/svg';
import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants/index';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createActivity } from 'reducers/redux-utils/activity';
import PostEditBook from 'shared/post-edit-book';
import OptionsPost from 'pages/home/components/newfeed/components/creat-post-modal-content/OptionsPost';
import CreatPostSubModal from 'pages/home/components/newfeed/components/creat-post-modal-content/CreatePostSubModal';
import TaggedList from 'pages/home/components/newfeed/components/creat-post-modal-content/TaggedList';
import UploadImage from 'pages/home/components/newfeed/components/creat-post-modal-content/UploadImage';
import PreviewLink from 'shared/preview-link/PreviewLink';
import { getPreviewUrl, getSharePostInternal, getSharePostRanks, shareMyBook } from 'reducers/redux-utils/post';
import Circle from 'shared/loading/circle';
import 'pages/home/components/newfeed/components/creat-post-modal-content/style.scss';
import { ratingUser } from 'reducers/redux-utils/book';
import UserAvatar from 'shared/user-avatar';
import { updateCurrentBook, updateProgressReadingBook, createReviewBook } from 'reducers/redux-utils/book';
import { STATUS_BOOK } from 'constants/index';
import { addBookToDefaultLibrary, updateMyAllLibraryRedux } from 'reducers/redux-utils/library';
import { NotificationError } from 'helpers/Error';
import { uploadMultiFile } from 'reducers/redux-utils/common';
import { useLocation, useParams } from 'react-router-dom';
import { creatNewPost } from 'reducers/redux-utils/group';
import QuoteCard from 'shared/quote-card';
import { saveDataShare } from 'reducers/redux-utils/post';
import AuthorBook from 'shared/author-book';
import ShareUsers from 'pages/home/components/newfeed/components/modal-share-users';
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
} from 'constants';

const verbShareArray = [
	POST_VERB_SHARE,
	QUOTE_VERB_SHARE,
	GROUP_POST_VERB_SHARE,
	READ_TARGET_VERB_SHARE,
	TOP_BOOK_VERB_SHARE,
	TOP_QUOTE_VERB_SHARE,
	TOP_USER_VERB_SHARE,
];

const urlRegex =
	/(https?:\/\/)?(www(\.))?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
const hashtagRegex = /(#[a-z0-9][a-z0-9\-_]*)/g;

function CreatPostModalContentReviewBookOnly({
	hideCreatePostModal,
	setShowModalCreatPost,
	showModalCreatPost,
	option,
	setOption,
	onChangeOption,
	onChangeNewPost,
	showSubModal,
	bookInfoProp,
}) {
	const [showMainModal, setShowMainModal] = useState(showModalCreatPost);
	const [taggedData, setTaggedData] = useState({
		'addBook': bookInfoProp,
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
	const [valueStar, setValueStar] = useState(0);
	const [checkProgress, setCheckProgress] = useState();
	const [showImagePopover, setShowImagePopover] = useState(false);
	const [buttonActive, setButtonActive] = useState(false);
	const [content, setContent] = useState('');
	const [hashtagsAdded, setHashtagsAdded] = useState([]);

	const dispatch = useDispatch();
	const location = useLocation();

	const UpdateImg = useSelector(state => state.chart.updateImgPost);
	const chartImgShare = useSelector(state => state.chart.updateImgPost);
	const { resetTaggedData, postDataShare } = useSelector(state => state.post);
	const {
		auth: { userInfo },
		book: { bookForCreatePost, bookInfo },
	} = useSelector(state => state);

	const { id } = useParams();

	const setting = {
		optionList: [
			{
				value: 'addAuthor',
				title: 'tác giả',
				icon: <Feather className='item-add-to-post-svg' />,
				message: 'Không tìm thấy tác giả',
			},
			{
				value: 'addCategory',
				title: 'chủ đề',
				icon: <CategoryIcon className='item-add-to-post-svg' />,
				message: 'Không tìm thấy chủ đề',
			},
			{
				value: 'addFriends',
				title: 'bạn bè',
				icon: <GroupIcon className='item-add-to-post-svg' />,
				message: 'Không tìm thấy bạn bè',
			},
		],
		shareModeList: [
			{ value: 'public', title: 'Mọi người', icon: <WorldNet /> },
			{ value: 'friends', title: 'Bạn bè', icon: <GroupIcon className='group-icon-svg' /> },
			{ value: 'followers', title: 'Người Follow', icon: <PodCast /> },
			{ value: 'private', title: 'Chỉ mình tôi', icon: <Lock /> },
		],
	};

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

	useEffect(() => {
		const hashtagsTemp = content.match(hashtagRegex);
		if (hashtagsTemp) {
			setHashtagsAdded(hashtagsTemp);
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
				const customId = 'custom-id-CreatPostModalContentReviewBookOnly-generateData';
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
				const addToDefaultLibraryRequest = await dispatch(addBookToDefaultLibrary(addBookParams)).unwrap();
				const updateProgressRequest = await dispatch(updateProgressReadingBook(progressParams)).unwrap();
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

			await dispatch(createActivity(params)).unwrap();

			setStatus(STATUS_SUCCESS);
			const customId = 'custom-id-CreatPostModalContentReviewBookOnly-onCreatePost-success';
			toast.success('Tạo post thành công!', { toastId: customId });
			// onChangeNewPost();
		} catch (err) {
			const statusCode = err?.statusCode || 500;
			if (err.errorCode === 702) {
				NotificationError(err);
			} else if (!location.pathname.includes('group')) {
				const customId = 'custom-id-CreatPostModalContentReviewBookOnly-onCreatePost-error';
				toast.error('Tạo post thất bại!', { toastId: customId });
			}
			setStatus(statusCode);
		} finally {
			dispatch(updateCurrentBook({}));
			// dispatch(saveDataShare({}));
			setStatus(STATUS_IDLE);
			hideCreatePostModal();
			onChangeOption({});
			setShowModalCreatPost(false);
		}
	};

	useEffect(() => {
		if (!_.isEmpty(taggedData.addBook)) {
			if (taggedData.addBook.status === 'read') {
				setCheckProgress(taggedData.addBook.page);
			} else {
				setCheckProgress(parseInt(taggedData.addBook.progress));
			}
		}
	}, [taggedData]);

	useEffect(() => {
		checkActive();
	}, [showMainModal, content, checkProgress, imagesUpload]);

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
											allowToEdit={true}
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
							// disabled={buttonActive ? false : true}
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

CreatPostModalContentReviewBookOnly.propTypes = {
	hideCreatePostModal: PropTypes.func,
	showModalCreatPost: PropTypes.bool,
	option: PropTypes.object,
	setOption: PropTypes.func,
	onChangeOption: PropTypes.func,
	onChangeNewPost: PropTypes.func,
	renderBookReading: PropTypes.object,
	setShowModalCreatPost: PropTypes.func,
	showSubModal: PropTypes.bool,
	bookInfoProp: PropTypes.bool,
};

export default CreatPostModalContentReviewBookOnly;
