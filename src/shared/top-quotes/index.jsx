import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './top-quotes.scss';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useCallback, useEffect } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { likeUnlikeQuote } from 'reducers/redux-utils/quote';
import _ from 'lodash';

const TopQuotesComponent = ({ item, valueDate, categoryItem }) => {
	const [quoteData, setQuoteData] = useState({});
	const navigate = useNavigate();

	const isLikeTemp = useRef(item.isLike);

	const dispatch = useDispatch();

	useEffect(() => {
		const data = {
			by: valueDate,
			categoryName: categoryItem.name || '',
			categoryId: categoryItem.id || '',
			type: 'topQuote',
			...item,
		};
		setQuoteData(data);
	}, []);

	const onClickRedirectToAuthor = data => {
		const id = data.createdBy || data.user.id;
		navigate(`/profile/${id}`);
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
		<div className='top__quotes__container'>
			<div className='top__quotes__description'>{item.quote}</div>
			<div className='top__quotes__author'>{item.authorName}</div>
			<div className='top__quotes__footer'>
				<div className='top__quotes__info'>
					<div className='quote-card__author__avatar' onClick={() => onClickRedirectToAuthor(item)}>
						<UserAvatar size='sm' source={item.user.avatarImage} />
					</div>
					<div className='quote-card__author__detail'>
						<p className='quote-card__author__detail__text'>Quotes tạo bởi</p>
						<p className='quote-card__author__detail__name' onClick={() => onClickRedirectToAuthor(item)}>
							{item?.user?.fullName || item?.user?.firstName + ' ' + item?.user?.lastName}
						</p>
					</div>
				</div>
				<QuoteActionBar data={quoteData} likeUnlikeQuoteFnc={likeUnlikeQuoteFnc} />
			</div>
		</div>
	);
};

TopQuotesComponent.propTypes = {
	item: PropTypes.any,
	valueDate: PropTypes.string,
	categoryItem: PropTypes.object,
};
export default TopQuotesComponent;
