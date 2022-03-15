import PropTypes from 'prop-types';
import React from 'react';
import BadgeList from 'shared/badge-list';
import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './quote-card.scss';
import { getCheckLiked } from 'reducers/redux-utils/user';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { likeUnlikeQuote } from 'reducers/redux-utils/quote';

const QuoteCard = ({ data, isDetail }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [likeNumber, setLikeNumber] = useState(0);

	const dispatch = useDispatch();

	useEffect(() => {
		checkQuoteLiked();
		setLikeNumber(data.like);
	}, []);

	const checkQuoteLiked = async () => {
		const params = { filter: JSON.stringify([{ 'operator': 'eq', 'value': data.id, 'property': 'quoteId' }]) };
		try {
			const res = await dispatch(getCheckLiked(params)).unwrap();
			if (res.count > 0) {
				setIsLiked(true);
			}
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	const likeUnlikeQuoteFnc = async id => {
		try {
			const response = await dispatch(likeUnlikeQuote(id)).unwrap();
			setIsLiked(response.liked);
			setLikeNumber(response.quote?.like);
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	return (
		<div
			className='quote-card'
			style={data.background !== '' ? { backgroundImage: `linear-gradient(${data.background})` } : {}}
		>
			<div className='quote-card__quote-content'>
				<p>{`"${data.quote}"`}</p>
				<p style={{ textDecoration: 'underline' }}>{`${data.authorName} - ${data.book?.name}`}</p>
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
			<div className='quote-footer'>
				{isDetail ? (
					<div className='quote-footer__left'>
						<BadgeList list={data?.categories} className='quote-footer__badge' />
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
						isLiked={isLiked}
						likeNumber={likeNumber}
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
	isLiked: PropTypes.bool,
};

export default QuoteCard;
