import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './quote-links.scss';
import { useParams } from 'react-router-dom';
import { memo } from 'react';

const QuotesLinks = ({ title, list, className }) => {
	const { userId } = useParams();

	return (
		<>
			{!!list.length && (
				<div className={classNames('quote-links', { [`${className}`]: className })}>
					<h4>{title}</h4>
					<div className='quote-links__card'>
						{list.map(item => (
							<div className='quote-links__item' key={item.id}>
								<p className='quote-links__item__content'>{`\"${item?.quote}\"`}</p>
								<span className='quote-links__item__sub'>{`${
									item.authorName ? `${item.authorName},` : ''
								} ${item?.book?.name || ''}`}</span>
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
	userId: PropTypes.string,
};

export default memo(QuotesLinks);
