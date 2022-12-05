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

const GroupSearch = ({ value, searchResultInput, activeKeyDefault, updateBooks }) => {
	const [listArrayGroup, setListArrayGroup] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
	const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(false);

	const { isShowModal } = useSelector(state => state.search);
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
		if (listArrayGroup.length === 0) {
			setIsLoadingFirstTime(true);
		}
		setIsFetching(true);
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
			setIsLoadingFirstTime(false);
		}
	};

	const enjoyGroup = async id => {
		try {
			if (Storage.getAccessToken()) {
				await dispatch(getEnjoyGroup(id)).unwrap();

				// Đổi nút từ "Tham gia" thành "Truy cập nhóm"
				const cloneArr = [...listArrayGroup];
				const clickedGroup = cloneArr.find(item => item.id === id);
				clickedGroup.isJoined = true;
				setListArrayGroup(cloneArr);

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
			{isLoadingFirstTime ? (
				<LoadingIndicator />
			) : (
				<>
					{listArrayGroup.length > 0 && activeKeyDefault === 'groups' ? (
						<InfiniteScroll
							next={handleGetGroupSearch}
							dataLength={listArrayGroup.length}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							{listArrayGroup.map(item => (
								<div key={item.id} className='group__search__main'>
									<div className='group__search__left'>
										<Link to={`/group/${item.id}`}>
											<button>
												<img
													src={item.avatar || DefaultImageGroup}
													className='group__search__img'
												/>
											</button>
										</Link>

										<div className='group__search__content'>
											<Link to={`/group/${item.id}`}>
												<button>
													<div className='group__search__title'>{item.name}</div>
												</button>
											</Link>

											<div className='group__search__info'>
												Nhóm công khai ({item.countMember} thành viên) <br />
												{item.countPostPerMonth} bài viết/tháng
											</div>
										</div>
									</div>
									{item.isJoined ? (
										<Link to={`/group/${item.id}`}>
											<Button className='group__search__button'>Truy cập nhóm</Button>
										</Link>
									) : (
										<Button onClick={() => enjoyGroup(item.id)} className='group__search__button'>
											Tham gia
										</Button>
									)}
								</div>
							))}
						</InfiniteScroll>
					) : (
						isFetching === false && <ResultNotFound />
					)}
				</>
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
	setIsLoadingFirstTime: PropTypes.func,
};
export default GroupSearch;
