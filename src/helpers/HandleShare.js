import Button from 'shared/button';

export const renderMessage = item => {
	if (item.verb === 'addFriend') {
		return <> đã gửi lời mời kết bạn</>;
	} else if (item.verb === 'likeQuote') {
		return <> đã thích trích dẫn của bạn</>;
	} else if (item.verb === 'mention') {
		return <> đã nhắc đến bạn trong một bình luận</>;
	} else if (item.verb === 'replyComment') {
		return <> đã trả lời vào bài viết của bạn</>;
	} else if (item.verb === 'likeMiniPost') {
		return <> đã thích bài viết của bạn</>;
	} else if (item.verb === 'likeGroupPost') {
		return <> đã thích bài viết của bạn</>;
	} else if (item.verb === 'commentMiniPost') {
		return <> đã bình luận bài viết của bạn</>;
	} else if (item.verb === 'likeCommentQuote') {
		return <> đã thích bình luận trong quote của bạn</>;
	} else if (item.verb === 'likeCommentReview') {
		return <> đã thích bình luận trong bài đánh giá của bạn</>;
	} else if (item.verb === 'likeCommentMiniPost') {
		return <> đã thích bình luận trong bài viết của bạn</>;
	} else if (item.verb === 'likeReview') {
		return <> đã thích bài đánh giá sách của bạn.</>;
	}
};

export const buttonReqFriend = () => {
	return (
		<Button className='connect-button' isOutline={true} name='friend'>
			<span className='connect-button__content'>─&nbsp;&nbsp; Đã gửi lời mời</span>
		</Button>
	);
};
