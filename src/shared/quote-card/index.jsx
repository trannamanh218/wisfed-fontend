import PropTypes from 'prop-types';
import BadgeList from 'shared/badge-list';
import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './quote-card.scss';
import { useState } from 'react';
import { likeUnlikeQuote } from 'reducers/redux-utils/quote';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';

const QuoteCard = ({ data, isDetail = false }) => {
	const [quoteData, setQuoteData] = useState(data);
	const dispatch = useDispatch();

	const likeUnlikeQuoteFnc = async id => {
		try {
			await dispatch(likeUnlikeQuote(id)).unwrap();
			const setLike = !quoteData.isLike;
			const numberOfLike = setLike ? quoteData.like + 1 : quoteData.like - 1;
			setQuoteData({ ...quoteData, isLike: setLike, like: numberOfLike });
		} catch (err) {
			NotificationError(err);
		}
	};

	const renderAuthorAndbooksName = () => {
		if (quoteData.book?.name) {
			return `${quoteData.book?.name}`;
		}
		return ` ${quoteData.bookName}`;
	};

	return (
		<div
			className='quote-card'
			style={quoteData.background !== '' ? { backgroundImage: `linear-gradient(${quoteData.background})` } : {}}
		>
			<div className='quote-card__quote-content'>
				<p>{`"${quoteData.quote}"`}</p>
				<p style={{ textDecoration: 'underline' }}>{renderAuthorAndbooksName()}</p>
			</div>

			<div className='quote-card__author'>
				<div className='quote-card__author__avatar'>
					<UserAvatar size='sm' avatarImage={quoteData?.user?.avatarImage} />
				</div>
				<div className='quote-card__author__detail'>
					<p className='quote-card__author__detail__text'>Quotes này tạo bởi</p>
					<p className='quote-card__author__detail__name'>{quoteData?.user?.fullName}</p>
				</div>
			</div>
			{isDetail && (
				<div className='quote-card__categories-in-detail'>
					<BadgeList list={quoteData?.categories} className='quote-card__categories-badge' />
				</div>
			)}
			<div className='quote-footer'>
				{isDetail ? (
					<div className='quote-footer__left'>
						{quoteData.tags.length > 0 &&
							quoteData.tags.map((tag, index) => (
								<span className='quote-card__hashtag' key={index}>
									{tag.name}
								</span>
							))}
					</div>
				) : (
					<div className='quote-footer__left'>
						<BadgeList list={quoteData?.categories?.slice(0, 2)} className='quote-footer__badge' />
					</div>
				)}
				<div className='quote-footer__right'>
					<QuoteActionBar
						data={quoteData}
						isDetail={isDetail}
						isLiked={quoteData.isLike}
						likeNumber={quoteData.like}
						likeUnlikeQuoteFnc={likeUnlikeQuoteFnc}
					/>
				</div>
			</div>
		</div>
	);
};

QuoteCard.defaultProps = {
	quoteData: {
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
	quoteData: PropTypes.object,
	isDetail: PropTypes.bool,
	likedArray: PropTypes.array,
};

export default QuoteCard;
