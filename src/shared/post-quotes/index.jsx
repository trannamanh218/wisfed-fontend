import './post-quotes.scss';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

const PostQuotes = ({ postsData }) => {
	const renderAuthorAndbooksName = () => {
		if (postsData.book?.name) {
			return `${postsData.book?.name}`;
		} else if (postsData.bookName) {
			return ` ${postsData.bookName}`;
		} else if (postsData.sharePost?.quote) {
			return (
				` ${
					!_.isEmpty(postsData.sharePost?.authors[0]?.name)
						? postsData.sharePost?.authors[0]?.name + ' - '
						: ''
				} ` + ` ${postsData.sharePost?.book?.name}`
			);
		} else {
			return `${postsData.info.book?.name}`;
		}
	};

	const generateBackgroundColorQuotes = () => {
		if (!postsData.background && !postsData.sharePost?.background) {
			return { backgroundImage: `linear-gradient(${postsData.info?.background})` };
		} else {
			if (postsData.background) {
				return { backgroundImage: `linear-gradient(${postsData.background})` };
			} else {
				return { backgroundImage: `linear-gradient(${postsData.sharePost?.background})` };
			}
		}
	};

	return (
		!_.isEmpty(postsData) && (
			<div className='creat-post-modal-content__main__share-container'>
				<div className='post__quotes__container'>
					<div className='quote-card' style={generateBackgroundColorQuotes()}>
						<div className='quote-card__quote-content'>
							<p>{`"${postsData.quote || postsData.sharePost?.quote || postsData.info?.quote}"`}</p>
							<Link
								to={`/book/detail/${
									postsData.sharePost?.bookId || postsData.bookId || postsData.info?.bookId
								}`}
							>
								<p style={{ textDecoration: 'underline' }}>{renderAuthorAndbooksName()}</p>
							</Link>
						</div>

						<div className='quote-card__author'>
							<div className='quote-card__author__avatar'>
								<UserAvatar
									size='sm'
									avatarImage={
										postsData.info
											? postsData.info.createdBy.avatarImage
											: postsData?.user?.avatarImage ||
											  postsData?.sharePost.createdBy?.avatarImage
									}
								/>
							</div>
							<div className='quote-card__author__detail'>
								<p className='quote-card__author__detail__text'>Quotes này tạo bởi</p>
								<Link to={`/profile/${postsData?.sharePost.createdBy?.id}`}>
									<p className='quote-card__author__detail__name'>
										{postsData.info
											? postsData.info.createdBy.fullName
											: postsData?.user?.fullName || postsData?.sharePost.createdBy?.fullName}
									</p>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	);
};

PostQuotes.propTypes = {
	postsData: PropTypes.object,
	isShare: PropTypes.bool,
};
export default PostQuotes;
