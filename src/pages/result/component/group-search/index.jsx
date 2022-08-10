import './group-search.scss';
import Button from 'shared/button';
import DefaultImageGroup from 'assets/images/DefaultImageGroup.png';
import PropTypes from 'prop-types';
import LoadingIndicator from 'shared/loading-indicator';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import Storage from 'helpers/Storage';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import ResultNotFound from '../result-not-found';
import { getEnjoyGroup } from 'reducers/redux-utils/group';
import { toast } from 'react-toastify';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { Link } from 'react-router-dom';

const GroupSearch = ({ value, setIsFetching, searchResultInput, activeKeyDefault, updateBooks, isFetching }) => {
	const [listArrayGroup, setListArrayGroup] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [hasMore, setHasMore] = useState(true);
	const dispatch = useDispatch();
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	useEffect(() => {
		if (activeKeyDefault === 'groups') {
			setListArrayGroup([]);
			callApiStart.current = 0;
			setHasMore(true);
		}
	}, [updateBooks, isShowModal, activeKeyDefault]);

	useEffect(() => {
		if (
			activeKeyDefault === 'groups' &&
			callApiStart.current === 0 &&
			listArrayGroup.length === 0 &&
			searchResultInput.length > 0
		) {
			handleGetGroupSearch();
		}
	}, [callApiStart.current, value, isShowModal, listArrayGroup]);

	const handleGetGroupSearch = async () => {
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			if (result.rows.length > 0) {
				callApiStart.current += callApiPerPage.current;
				setListArrayGroup(listArrayGroup.concat(result.rows));
				setIsFetching(true);
			}
			// Nếu kết quả tìm kiếm nhỏ hơn limit thì disable gọi api khi scroll
			if (!result.rows.length || result.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	const enjoyGroup = async id => {
		try {
			if (Storage.getAccessToken()) {
				await dispatch(getEnjoyGroup(id)).unwrap();
				const customId = 'custom-Id-GroupSearch';
				toast.success('Tham gia nhóm thành công', { toastId: customId });
				dispatch(checkUserLogin(false));
			} else {
				dispatch(checkUserLogin(true));
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='group__search__container'>
			{listArrayGroup.length && activeKeyDefault === 'groups' ? (
				<InfiniteScroll
					next={handleGetGroupSearch}
					dataLength={listArrayGroup.length}
					hasMore={hasMore}
					loader={<LoadingIndicator />}
				>
					{listArrayGroup.map(item => (
						<div key={item.id} className='group__search__main'>
							<div className='group__search__left'>
								<img src={item.avatar || DefaultImageGroup} className='group__search__img' />
								<div className='group__search__content'>
									<div className='group__search__title'>{item.name}</div>
									<div className='group__search__info'>
										Nhóm công khai. {item.countMember} thành viên <br />
										{item.countPost} bài viết/tháng
									</div>
								</div>
							</div>
							{item.isJoined ? (
								<Link to={`/group/${item.id}`}>
									<Button>
										<span className='group__search__button'>
											<div>Truy cập đến nhóm</div>
										</span>
									</Button>
								</Link>
							) : (
								<Button onClick={() => enjoyGroup(item.id)}>
									<span className='group__search__button'>Tham gia nhóm</span>
								</Button>
							)}
						</div>
					))}
				</InfiniteScroll>
			) : (
				isFetching === false && <ResultNotFound />
			)}
		</div>
	);
};

GroupSearch.propTypes = {
	setIsFetching: PropTypes.func,
	activeKeyDefault: PropTypes.string,
	searchResultInput: PropTypes.string,
	value: PropTypes.string,
	updateBooks: PropTypes.bool,
	isFetching: PropTypes.bool,
};
export default GroupSearch;
