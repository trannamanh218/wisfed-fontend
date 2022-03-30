import PropTypes from 'prop-types';
import React from 'react';
import BadgeList from 'shared/badge-list';
import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './quote-card.scss';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { likeUnlikeQuote } from 'reducers/redux-utils/quote';
import { checkLikeQuote } from 'reducers/redux-utils/quote';

const QuoteCard = ({ data, isDetail, likedArray }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [likeNumber, setLikeNumber] = useState(0);
	const [hashTags, setHashTags] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		if (isDetail) {
			getLikedArray();
		} else {
			if (likedArray.length > 0 && likedArray.includes(data.id)) {
				setIsLiked(true);
			}
		}
		if (data.tags.length > 0) {
			const tagsArr = [];
			data.tags.forEach(item => {
				tagsArr.push('#' + item.tag.slug);
			});
			setHashTags(tagsArr);
		}
		setLikeNumber(data.like);
	}, []);

	const likeUnlikeQuoteFnc = async id => {
		try {
			const response = await dispatch(likeUnlikeQuote(id)).unwrap();
			setIsLiked(response.liked);
			setLikeNumber(response.quote?.like);
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	const getLikedArray = async () => {
		try {
			const res = await dispatch(checkLikeQuote()).unwrap();
			if (res.includes(data.id)) {
				setIsLiked(true);
			}
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
			{isDetail && (
				<div className='quote-card__categories-in-detail'>
					<BadgeList list={data?.categories} className='quote-card__categories-badge' />
				</div>
			)}
			<div className='quote-footer'>
				{isDetail ? (
					<div className='quote-footer__left'>
						{hashTags.length > 0 &&
							hashTags.map((tag, index) => (
								<span className='quote-card__hashtag' key={index}>
									{tag}
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
	likedArray: PropTypes.array,
};

export default QuoteCard;
