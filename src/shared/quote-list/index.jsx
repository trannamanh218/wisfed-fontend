import Storage from 'helpers/Storage';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import QuoteCard from 'shared/quote-card';
import './quote-list.scss';

const QuoteList = ({ list, userId }) => {
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const handleDirect = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			return navigate(`/quotes/${userId}`);
		}
	};

	if (list && list.length > 0) {
		return (
			<div className='quote-list'>
				{list?.slice(0, 3).map(item => (
					<QuoteCard key={item.id} data={item.data || item} isDetail={false} />
				))}
				{list?.length > 3 && (
					<button className='sidebar__view-more-btn--blue' onClick={handleDirect}>
						Xem thêm
					</button>
				)}
			</div>
		);
	}

	return <p className='blank-content'>Không có dữ liệu</p>;
};

QuoteList.propTypes = {
	list: PropTypes.array.isRequired,
	userId: PropTypes.string,
};

export default QuoteList;
