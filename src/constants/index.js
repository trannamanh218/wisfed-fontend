import { CoffeeCupIcon, CircleCheckIcon, TargetIcon } from 'components/svg';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	handleMentionCommentId,
	updateReviewIdFromNoti,
	handleCheckIfMentionFromGroup,
} from 'reducers/redux-utils/notification';

export const STATUS_BOOK = {
	reading: 'reading',
	read: 'read',
	wantToRead: 'wantToRead',
};

export const readingStatus = [
	{
		'name': 'Đang đọc',
		'value': STATUS_BOOK.reading,
		'icon': CoffeeCupIcon,
	},
	{
		'name': 'Đã đọc',
		'value': STATUS_BOOK.read,
		'icon': CircleCheckIcon,
	},
	{
		'name': 'Muốn đọc',
		'value': STATUS_BOOK.wantToRead,
		'icon': TargetIcon,
	},
];

export const colorVarients = ['primary', 'secondary', 'success', 'success-dark', 'warning', 'info', 'light', 'dark'];
export const DEFAULT_TOGGLE_ROWS = 3;
export const NUMBER_ROWS = 10;
export const MAX_PER_PAGE = 20;
export const NUMBER_OF_BOOKS = 16;

export const DEFAULT_TOGGLE_SINGLE_COLUMN_ROW = 6;
export const YEAR_LIMIT = 1904;

// status
export const STATUS_LOADING = 'LOADING';
export const STATUS_IDLE = 'IDLE';
export const STATUS_SUCCESS = 'SUCCESS';

//library
export const LIBRARY_LIMIT = 20;

//type
export const POST_TYPE = 'post';
export const QUOTE_TYPE = 'quote';
export const REVIEW_TYPE = 'review';
export const GROUP_TYPE = 'group';

// share verb
export const POST_VERB = 'miniPost';
export const POST_VERB_SHARE = 'sharePost';
export const QUOTE_VERB_SHARE = 'shareQuote';
export const GROUP_POST_VERB = 'groupPost';
export const GROUP_POST_VERB_SHARE = 'shareGroupPost';
export const READ_TARGET_VERB_SHARE = 'shareTargetRead';
export const TOP_BOOK_VERB_SHARE = 'shareTopBookRanking';
export const MY_BOOK_VERB_SHARE = 'shareMyBook';
export const TOP_QUOTE_VERB_SHARE = 'shareTopQuoteRanking';
export const TOP_USER_VERB_SHARE = 'shareTopUserRanking';
export const REVIEW_VERB_SHARE = 'shareReview';

// input type number
export const blockInvalidChar = e => {
	return ['e', 'E', '+', '-', '.', ','].includes(e.key) && e.preventDefault();
};

// Xử lí sự kiện bấm vào thông báo
export const handleClickNotificationItemHook = (paramUserInfo, paramItem) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleClickNotificationItem = () => {
		switch (paramItem.verb) {
			case 'likeMiniPost':
			case 'commentMiniPost':
			case 'likeGroupPost':
			case 'commentGroupPost':
			case 'likeCommentGroupPost':
			case 'shareGroupPost':
				navigate(
					`/detail-feed/${
						paramItem.verb === 'commentMiniPost' ||
						paramItem.verb === 'likeMiniPost' ||
						paramItem.verb === 'shareGroupPost'
							? 'mini-post'
							: 'group-post'
					}/${paramItem.originId?.minipostId || paramItem.originId?.groupPostId}`
				);
				break;
			case 'follow':
			case 'addFriend':
			case 'friendAccepted':
				navigate(`/profile/${paramItem.createdBy?.id || paramItem.originId.userId}`);
				break;
			case 'topUserRanking':
				navigate(`/top100`);
				break;
			case 'topBookRanking':
				navigate(`/top100`);
				break;
			case 'topQuoteRanking':
				navigate(`/top100`);
				break;
			case 'readingGoal':
				navigate(`/reading-target/${paramUserInfo.id}`);
				break;
			case 'inviteGroup':
				navigate(`/Group/${paramItem.originId.groupId}`);
				break;
			case 'replyComment':
				// case 'replyCommentMiniPost':
				dispatch(handleMentionCommentId(paramItem.originId.replyId));
				navigate(`/detail-feed/mini-post/${paramItem.originId.minipostId}`);
				break;
			case 'shareQuote':
				navigate(`/detail-feed/mini-post/${paramItem.originId.minipostId}`);
				break;
			case 'commentQuote':
			case 'likeQuote':
				navigate(`/quotes/detail/${paramItem.originId.quoteId}`);
				break;
			case 'likeCommentQuote':
				dispatch(handleMentionCommentId(paramItem.originId.commentQuoteId));
				navigate(`/quotes/detail/${paramItem.originId.quoteId}`);
				break;
			case 'replyCommentQuote':
				dispatch(handleMentionCommentId(paramItem.originId.replyId));
				navigate(`/quotes/detail/${paramItem.originId.quoteId}`);
				break;
			case 'mention':
				switch (paramItem.originId.type) {
					case 'commentQuote':
						dispatch(handleMentionCommentId(paramItem.originId.commentQuoteId));
						navigate(`/quotes/detail/${paramItem.originId.quoteId}`);
						break;
					case 'groupPost':
						navigate(`/detail-feed/group-post/${paramItem.originId.groupPostId}`);
						break;
					case 'mentionMiniPost':
					case 'commentMiniPost':
						dispatch(handleMentionCommentId(paramItem.originId.commentMiniPostId));
						navigate(`/detail-feed/mini-post/${paramItem.originId.minipostId}`);
						break;
					case 'commentReview':
						dispatch(updateReviewIdFromNoti(paramItem.originId.reviewId));
						navigate(`/review/${paramItem.originId.bookId}/${paramUserInfo.id}`);
						break;
					case 'commentGroupPost':
						dispatch(handleMentionCommentId(paramItem.originId.commentGroupPostId));
						dispatch(handleCheckIfMentionFromGroup('group'));
						navigate(`/detail-feed/group-post/${paramItem.originId.groupPostId}`);
						break;
					default:
						navigate(`/detail-feed/mini-post/${paramItem.originId.minipostId}`);
				}
				break;
			case 'likeCommentReview':
				dispatch(updateReviewIdFromNoti(paramItem.originId.reviewId));
				navigate(`/review/${paramItem.originId.bookId}/${paramUserInfo.id}`);
				break;
			case 'requestGroup':
				navigate(`/group/${paramItem.originId.groupId}`);
				break;
			case 'likeReview':
			case 'commentReview':
				dispatch(updateReviewIdFromNoti(paramItem.originId.reviewId));
				navigate(`/review/${paramItem.originId.bookId}/${paramUserInfo.id}`);
				break;
			// case 'replyCommentReview':
			// 	dispatch(handleMentionCommentId(paramItem.originId.replyId));
			// 	navigate(`/review/${paramItem.originId.bookId}/${paramUserInfo.id}`);
			// 	break;
			case 'likeCommentMiniPost':
			case 'sharePost':
				navigate(`/detail-feed/mini-post/${paramItem.originId.minipostId}`);
				break;
			case 'finishReadingGoal':
				navigate(`/reading-target/${paramItem.originId.userId}`);
				break;
			default:
				console.log('Xét thiếu verb: ', paramItem.verb);
		}
	};

	return { handleClickNotificationItem };
};
