import { useState, useEffect, useCallback, useRef } from 'react';
import classNames from 'classnames';
import { calculateDurationTime } from 'helpers/Common';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import './comment.scss';
import { likeQuoteComment } from 'reducers/redux-utils/quote';
import { NotificationError } from 'helpers/Error';
import { likeAndUnlikeCommentPost } from 'reducers/redux-utils/activity';
import { likeAndUnlikeCommentReview } from 'reducers/redux-utils/book';
import { POST_TYPE, QUOTE_TYPE, REVIEW_TYPE } from 'constants/index';
import { Link, useNavigate } from 'react-router-dom';
import { LikeComment } from 'components/svg';
import { likeAndUnlikeGroupComment } from 'reducers/redux-utils/group';
import { extractLinks } from '@draft-js-plugins/linkify';
import DirectLinkALertModal from 'shared/direct-link-alert-modal';
import _ from 'lodash';

const urlRegex =
	/(http(s)?:\/\/)?(www(\.))?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_\+.~#?&//=]*)([^"<\s]+)(?![^<>]*>|[^"]*?<\/a)/g;
// const hashtagRegex =
// 	/#(?![0-9_]+\b)[0-9a-z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/gi; không xóa

const Comment = ({ dataProp, handleReply, postData, commentLv1Id, type }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isAuthor, setIsAuthor] = useState(false);
	const [data, setData] = useState(dataProp);
	const [modalShow, setModalShow] = useState(false);

	const urlToDirect = useRef('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!_.isEmpty(dataProp)) {
			handleAddEventClickToUrlTags();
			handleAddEventClickMentionTags();
			// handleAddEventClickToHashtagTags(); // không xóa
		}
	});

	const handleAddEventClickToUrlTags = useCallback(() => {
		const arr = document.querySelectorAll('.url-class');
		for (let i = 0; i < arr.length; i++) {
			const dataUrl = arr[i].getAttribute('data-url');
			arr[i].onclick = () => directUrl(dataUrl);
		}
	}, [dataProp]);

	const handleAddEventClickMentionTags = useCallback(() => {
		const arr = document.querySelectorAll('.mention-class');
		for (let i = 0; i < arr.length; i++) {
			const mentionUserId = arr[i].getAttribute('data-user-id');
			arr[i].onclick = () => navigate(`/profile/${mentionUserId}`);
		}
	}, [dataProp]);

	// không xóa
	// 	const handleAddEventClickToHashtagTags = useCallback(() => {
	// 		const arr = document.querySelectorAll('.hashtag-class');
	// 		for (let i = 0; i < arr.length; i++) {
	// 			const dataHashtagNavigate = arr[i].getAttribute('data-hashtag-navigate');
	// 			arr[i].onclick = () => handleClickHashtag(dataHashtagNavigate);
	// 		}
	// 	}, [dataProp]);
	//
	// 	const handleClickHashtag = dataHashtagNavigate => {
	// 		navigate(dataHashtagNavigate);
	// 	};

	const directUrl = url => {
		setModalShow(true);
		let urlFormated = '';
		if (url.includes('https://')) {
			urlFormated = url;
		} else {
			urlFormated = `https://${url}`;
		}
		urlToDirect.current = urlFormated;
	};

	const handleAcept = () => {
		setModalShow(false);
		window.open(urlToDirect.current);
	};

	const handleCancel = () => {
		setModalShow(false);
		urlToDirect.current = '';
	};

	const handleLikeUnlikeCmt = async () => {
		const newCloneData = { ...data };
		if (isLiked) {
			newCloneData.like -= 1;
			setData(newCloneData);
		} else {
			newCloneData.like += 1;
			setData(newCloneData);
		}

		try {
			if (type === POST_TYPE) {
				await dispatch(likeAndUnlikeCommentPost(data.id)).unwrap();
			} else if (type === QUOTE_TYPE) {
				await dispatch(likeQuoteComment(data.id)).unwrap();
			} else if (type === REVIEW_TYPE) {
				await dispatch(likeAndUnlikeCommentReview(data.id)).unwrap();
			} else {
				await dispatch(likeAndUnlikeGroupComment(data.id)).unwrap();
			}
			setIsLiked(!isLiked);
		} catch (err) {
			NotificationError(err);
		}
	};

	const generateContent = content => {
		// if (content.match(urlRegex) || content.match(hashtagRegex)) { // k xóa
		if (content.match(urlRegex)) {
			const newContent = content.replace(urlRegex, data => {
				const urlMatched = extractLinks(data);
				if (urlMatched) {
					return `<a class="url-class" data-url=${data}>${
						data.length <= 50 ? data : data.slice(0, 50) + '...'
					}</a>`;
				} else {
					return data;
				}
			});

			// không xóa
			// .replace(hashtagRegex, data => {
			// 	const newData = data
			// 		.normalize('NFD')
			// 		.replace(/[\u0300-\u036f]/g, '')
			// 		.replace(/đ/g, 'd')
			// 		.replace(/Đ/g, 'D');
			// 	if (postData.groupId) {
			// 		return `<a class="hashtag-class" data-hashtag-navigate="/hashtag-group/${
			// 			postData.groupId
			// 		}/${newData.slice(1)}">${newData}</a>`;
			// 	} else {
			// 		return `<a class="hashtag-class" data-hashtag-navigate="/hashtag/${newData.slice(
			// 			1
			// 		)}">${newData}</a>`;
			// 	}
			// });
			return newContent;
		} else {
			return content;
		}
	};

	useEffect(() => {
		setData(dataProp);
	}, [dataProp]);

	useEffect(() => {
		if (type === QUOTE_TYPE) {
			if (data.createdBy === postData.createdBy) {
				setIsAuthor(true);
			}
		} else {
			if (data.createdBy === postData.actor) {
				setIsAuthor(true);
			}
		}
		setIsLiked(data.isLike);
	}, [data]);

	return (
		<div className='comment'>
			<UserAvatar
				className='comment__avatar'
				size='sm'
				source={data.user?.avatarImage}
				handleClick={() => navigate(`/profile/${data.createdBy}`)}
			/>
			<div className='comment__wrapper'>
				<div className='comment__container'>
					<div className='comment__header'>
						<Link to={`/profile/${data.user?.id}`}>
							<span className='comment__author'>
								{data.user?.fullName || data.user?.lastName || data.user?.firstName || 'Không xác định'}
							</span>
						</Link>

						{isAuthor && (
							<Badge className='comment__badge' bg='primary-light'>
								Tác giả
							</Badge>
						)}
					</div>
					{data?.content && (
						<p
							className='comment__content'
							dangerouslySetInnerHTML={{
								__html: generateContent(data.content),
							}}
						></p>
					)}
					{data.like !== 0 ? (
						<div className='cmt-like-number'>
							<LikeComment />

							{data.like}
						</div>
					) : null}
				</div>

				<ul className='comment__action'>
					<li
						className={classNames('comment__item', {
							'liked': isLiked,
						})}
						onClick={() => handleLikeUnlikeCmt()}
					>
						Thích
					</li>
					<li
						className='comment__item'
						onClick={() =>
							handleReply(commentLv1Id, {
								id: data.user.id,
								name: data.user.fullName || data.user.firstName + ' ' + data.user.lastName,
								avatar: data.user.avatarImage,
							})
						}
					>
						Phản hồi
					</li>
					<li className='comment__item comment__item--timeline'>
						{`${calculateDurationTime(data.createdAt)}`}
					</li>
				</ul>
			</div>
			<DirectLinkALertModal modalShow={modalShow} handleAcept={handleAcept} handleCancel={handleCancel} />
		</div>
	);
};

Comment.defaultProps = {
	dataProp: {},
	handleReply: () => {},
	postData: {},
	commentLv1Id: null,
	type: POST_TYPE,
};

Comment.propTypes = {
	dataProp: PropTypes.object,
	postData: PropTypes.object,
	handleReply: PropTypes.func,
	commentLv1Id: PropTypes.number,
	type: PropTypes.string,
};

export default Comment;
