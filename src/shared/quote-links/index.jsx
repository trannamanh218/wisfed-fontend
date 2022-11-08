import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './quote-links.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { memo } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const QuotesLinks = ({ title, list, className, linkClickSeeAll }) => {
	const { userId } = useParams();
	const { userInfo } = useSelector(state => state.auth);
	const navigate = useNavigate();

	const [IdUser, setIdUser] = useState('');

	useEffect(() => {
		if (userId === undefined) {
			setIdUser(userInfo.id);
		} else {
			setIdUser(userId);
		}
	}, []);

	return (
		<>
			{!!list.length > 0 && (
				<div className={classNames('quote-links', { [`${className}`]: className })}>
					<h4>{title}</h4>
					<div className='quote-links__card'>
						{list.map(item => (
							<div
								className='quote-links__item'
								key={item.id}
								title={'Xem chi tiết quote'}
								onClick={() => navigate(`/quotes/detail/${item.id}`)}
							>
								<p className='quote-links__item__content'>{`\"${item?.quote}\"`}</p>
								<span className='quote-links__item__sub'>{`${
									item.authorName ? `${item.authorName},` : ''
								} ${item?.book?.name || ''}`}</span>
							</div>
						))}
					</div>
					<Link className='view-all-link' to={linkClickSeeAll ? linkClickSeeAll : `/quotes/${IdUser}`}>
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
	linkClickSeeAll: '',
};
QuotesLinks.propTypes = {
	title: PropTypes.string,
	list: PropTypes.array,
	className: PropTypes.string,
	params: PropTypes.string,
	linkClickSeeAll: PropTypes.string,
};

export default memo(QuotesLinks);
