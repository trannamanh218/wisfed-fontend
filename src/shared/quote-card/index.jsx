import PropTypes from 'prop-types';
import BadgeList from 'shared/badge-list';
import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './quote-card.scss';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useCallback, useEffect } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { likeUnlikeQuote } from 'reducers/redux-utils/quote';
import _ from 'lodash';

const QuoteCard = ({ data, isDetail = false, isShare = false }) => {
	const [quoteData, setQuoteData] = useState(data);

	const isLikeTemp = useRef(data.isLike);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!_.isEmpty(data)) {
			setQuoteData(data);
		}
	}, [data]);

	const renderAuthorAndbooksName = () => {
		const authorsName = data.book?.authors.map(item => item.authorName).join(', ');
		return `${authorsName && authorsName + ' - '}${data.book?.name}`;
	};

	const navigate = useNavigate();
	const onClickRedirectToAuthor = data => {
		const id = data.createdBy.id || data.user.id || data.createdBy;
		navigate(`/profile/${id}`);
	};
	const onClickRedirectToBook = data => {
		navigate(`/book/detail/${data.bookId}`);
	};

	const likeUnlikeQuoteFnc = id => {
		const setLike = !quoteData.isLike;
		const numberOfLike = setLike ? quoteData.like + 1 : quoteData.like - 1;
		setQuoteData({ ...quoteData, isLike: setLike, like: numberOfLike });
		handleCallLikeUnlikeQuoteApi(id, setLike);
	};

	const handleCallLikeUnlikeQuoteApi = useCallback(
		_.debounce(async (quoteId, isLike) => {
			if (isLike !== isLikeTemp.current) {
				isLikeTemp.current = isLike;
				try {
					await dispatch(likeUnlikeQuote(quoteId)).unwrap();
				} catch (err) {
					NotificationError(err);
				}
			}
		}, 500),
		[]
	);

	return (
		<div
			className='quote-card'
			style={quoteData.background !== '' ? { backgroundImage: `linear-gradient(${quoteData.background})` } : {}}
		>
			<div className='quote-card__quote-content'>
				<p className='quote-card__quote-content__quote'>{`"${quoteData.quote}"`}</p>
				<p
					className='quote-card__quote-content__author-and-book'
					onMouseEnter={e => (e.target.style.cursor = 'pointer')}
					onClick={() => onClickRedirectToBook(quoteData)}
					style={{ textDecoration: 'underline' }}
				>
					{renderAuthorAndbooksName()}
				</p>
			</div>

			<div className='quote-card__author'>
				<div className='quote-card__author__avatar' onClick={() => onClickRedirectToAuthor(quoteData)}>
					<UserAvatar
						size='sm'
						avatarImage={quoteData?.createdBy?.avatarImage || quoteData?.user?.avatarImage}
					/>
				</div>
				<div className='quote-card__author__detail'>
					<p className='quote-card__author__detail__text'>Quotes này tạo bởi</p>
					<p className='quote-card__author__detail__name' onClick={() => onClickRedirectToAuthor(quoteData)}>
						{quoteData.user
							? quoteData.user.fullName || quoteData.user.firstName + ' ' + quoteData.user.lastName
							: quoteData.createdBy.fullName ||
							  quoteData.createdBy.firstName + ' ' + quoteData.createdBy.lastName}
					</p>
				</div>
			</div>

			{!isShare && (
				<>
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
											{tag.tag.name}
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
								likeUnlikeQuoteFnc={likeUnlikeQuoteFnc}
							/>
						</div>
					</div>
				</>
			)}
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
};

QuoteCard.propTypes = {
	data: PropTypes.object,
	isDetail: PropTypes.bool,
	isShare: PropTypes.bool,
};

export default QuoteCard;
