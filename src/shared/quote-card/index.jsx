import PropTypes from 'prop-types';
import BadgeList from 'shared/badge-list';
import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './quote-card.scss';

const QuoteCard = ({ data, likeUnlikeQuoteFnc, isDetail = false }) => {
	const renderAuthorAndbooksName = () => {
		if (data.book?.name) {
			return `${data.book?.name}`;
		}
		return ` ${data.bookName}`;
	};

	return (
		<div
			className='quote-card'
			style={data.background !== '' ? { backgroundImage: `linear-gradient(${data.background})` } : {}}
		>
			<div className='quote-card__quote-content'>
				<p>{`"${data.quote}"`}</p>
				<p style={{ textDecoration: 'underline' }}>{renderAuthorAndbooksName()}</p>
			</div>

			<div className='quote-card__author'>
				<div className='quote-card__author__avatar'>
					<UserAvatar size='sm' avatarImage={data?.user?.avatarImage} />
				</div>
				<div className='quote-card__author__detail'>
					<p className='quote-card__author__detail__text'>Quotes này tạo bởi</p>
					<p className='quote-card__author__detail__name'>{data?.user?.fullName}</p>
				</div>
			</div>
			{isDetail && (
				<div className='quote-card__categories-in-detail'>
					<BadgeList list={data?.categories} className='quote-card__categories-badge' />
				</div>
			)}
			<div className='quote-footer'>
				{isDetail ? (
					<div className='quote-footer__left'>
						{data.tags.length > 0 &&
							data.tags.map((tag, index) => (
								<span className='quote-card__hashtag' key={index}>
									{tag.tag.name}
								</span>
							))}
					</div>
				) : (
					<div className='quote-footer__left'>
						<BadgeList list={data?.categories?.slice(0, 2)} className='quote-footer__badge' />
					</div>
				)}
				<div className='quote-footer__right'>
					<QuoteActionBar
						data={data}
						isDetail={isDetail}
						isLiked={data.isLike}
						likeNumber={data.like}
						likeUnlikeQuoteFnc={likeUnlikeQuoteFnc}
					/>
				</div>
			</div>
		</div>
	);
};

QuoteCard.defaultProps = {
	data: {
		content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam velit nemo voluptate. Eaque tenetur
		dolore qui doloribus modi alias labore deleniti quisquam sunt. Accusantium, accusamus eius ipsum optio
		distinctio laborum.`,
		avatar: '',
		author: 'Mai Nguyễn',
		bookName: 'Đắc nhân tâm',
	},
	isDetail: false,
	badges: [{ title: 'lorem 1' }, { title: 'lorem2' }],
};

QuoteCard.propTypes = {
	data: PropTypes.object,
	isDetail: PropTypes.bool,
	likedArray: PropTypes.array,
	likeUnlikeQuoteFnc: PropTypes.func,
};

export default QuoteCard;
