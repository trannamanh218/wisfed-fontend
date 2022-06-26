import './post-quotes.scss';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
		}
	};

	const generateBackgroundColorQuotes = () => {
		if (!postsData.background && !postsData.sharePost?.background) {
			return {};
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
			<div className='post__quotes__container'>
				<div className='quote-card' style={generateBackgroundColorQuotes()}>
					<div className='quote-card__quote-content'>
						<p>{`"${postsData.quote || postsData.sharePost?.quote}"`}</p>
						<p style={{ textDecoration: 'underline' }}>{renderAuthorAndbooksName()}</p>
					</div>

					<div className='quote-card__author'>
						<div className='quote-card__author__avatar'>
							<UserAvatar
								size='sm'
								avatarImage={postsData?.user?.avatarImage || postsData.createdBy?.avatarImage}
							/>
						</div>
						<div className='quote-card__author__detail'>
							<p className='quote-card__author__detail__text'>Quotes này tạo bởi</p>
							<p className='quote-card__author__detail__name'>
								{postsData?.user?.fullName || postsData.createdBy?.fullName}
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	);
};
PostQuotes.propTypes = {
	postsData: PropTypes.object,
};
export default PostQuotes;
