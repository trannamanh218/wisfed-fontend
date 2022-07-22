import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './quote-links.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { memo } from 'react';

const QuotesLinks = ({ title, list, className }) => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const goToQuote = item => {
		navigate(`/quotes/detail/${item.id}`);
	};
	const goToBook = item => {
		navigate(`/book/detail/${item.bookId}`);
	};
	return (
		<>
			{!!list.length && (
				<div className={classNames('quote-links', { [`${className}`]: className })}>
					<h4>{title}</h4>
					<div className='quote-links__card'>
						{list.map(item => (
							<div className='quote-links__item' key={item.id}>
								<p
									className='quote-links__item__content'
									onClick={() => goToQuote(item)}
									title={'Xem chi tiết quote'}
								>{`\"${item?.quote}\"`}</p>
								<span
									className='quote-links__item__sub'
									onClick={() => goToBook(item)}
									title={'Xem chi tiết sách'}
								>{`${item.authorName ? `${item.authorName},` : ''} ${item?.book?.name || ''}`}</span>
							</div>
						))}
					</div>
					<Link className='view-all-link' to={`/quotes/${userId}`}>
						Xem tất cả
					</Link>
				</div>
			)}
		</>
	);
};

QuotesLinks.defaultProps = {
	title: '',
	list: [],
	className: '',
};
QuotesLinks.propTypes = {
	title: PropTypes.string,
	list: PropTypes.array,
	className: PropTypes.string,
	params: PropTypes.string,
};

export default memo(QuotesLinks);
