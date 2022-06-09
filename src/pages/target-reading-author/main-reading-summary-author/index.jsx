import SearchField from 'shared/search-field';
import { Table } from 'react-bootstrap';
import './main-reading-author.scss';
import BookThumbnail from 'shared/book-thumbnail';
import { StarAuthor, ShareAuthor } from 'components/svg';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useParams } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { getFilterSearch } from 'reducers/redux-utils/search';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { Link } from 'react-router-dom';

const MainReadingAuthor = () => {
	const { userId } = useParams();
	const [searchAuthorBook, setSearchAuthorBook] = useState('');
	const { booksAuthor } = useFetchAuthorBooks(userId);
	const [searchData, setSearchData] = useState([]);
	const [filter, setFilter] = useState('');
	const dispatch = useDispatch();

	const updateFilter = value => {
		if (value) {
			const filterValue = value.trim();
			setFilter(filterValue);
		} else {
			setFilter('[]');
		}
	};

	useEffect(() => {
		fetchDataSearch();
	}, [filter]);

	const fetchDataSearch = async () => {
		const params = {
			authorId: userId,
			type: 'books',
			q: filter,
		};
		try {
			if (filter) {
				const data = await dispatch(getFilterSearch(params)).unwrap();
				setSearchData(data.rows);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleChange = e => {
		setSearchAuthorBook(e.target.value);
		debounceSearch(e.target.value);
	};
	const debounceSearch = useCallback(_.debounce(updateFilter, 700), []);

	const renderItem = (item, index) => {
		return (
			<tbody key={item.id}>
				<tr className={`highlight highlight-${index} `}>
					<td colSpan={11}></td>
				</tr>
				<tr className='book-row'>
					<td className='hightlight-column'></td>
					<td>
						<BookThumbnail size='sm' source={item.images[0]} />
					</td>
					<td>
						<span className='book-name title'>{item.name}</span>
					</td>
					<td>
						<span className='custom-td'>
							{item.avgRating ? item.avgRating : 0}
							<StarAuthor />
						</span>
					</td>
					<td>
						<span className='book-name'>{item.countRating}</span>
					</td>
					<td>
						<div className='book-name-title'>
							<span className='book-name custom-text'>{item.countReview}</span>
							<span className='book-name-custom'>
								{item.newReview?.length ? item.newReview?.length : 0} lượt review mới
							</span>
						</div>
					</td>
					<td>
						<span>400k</span>
					</td>
					<td>
						<div className='book-name-title'>
							<span className='book-name custom-text'>{item.countQuote}</span>
							<div className='book-name-custom'>
								{item.newQuote?.length ? item.newQuote?.length : 0} lượt quote mới
							</div>
						</div>
					</td>
					<td>
						<div className='share-author'>
							<ShareAuthor />
						</div>
					</td>
					<td>
						<Link to={`/book-author-charts/${item.id}`}>
							<span className='book-name custom-text'>Chart</span>
						</Link>
					</td>
					<td className='hightlight-column'></td>
				</tr>
				<tr className='highlight'>
					<td colSpan={11}></td>
				</tr>
			</tbody>
		);
	};

	return (
		<div className='MainReadingAuthor__container'>
			<div className='reading-target'>
				<div className='reading-target__header'>
					<h4>Sách tôi làm tác giả </h4>
					<SearchField placeholder='Tìm kiếm sách' handleChange={handleChange} value={searchAuthorBook} />
				</div>

				<div className='reading-target__table'>
					<Table>
						<thead className='reading-target__table__header'>
							<tr>
								<th colSpan={3}>Tên sách</th>
								<th>Sao trung bình </th>
								<th> Lượt đánh giá</th>
								<th> Lượt review</th>
								<th>Lượt thêm sách</th>
								<th>Lượt Quote</th>
								<th colSpan={2}></th>
							</tr>
							<tr className='empty-row' />
						</thead>
						{searchData?.length > 0
							? searchData.map((item, index) => renderItem(item, index))
							: booksAuthor.map((item, index) => renderItem(item, index))}
					</Table>
				</div>
			</div>
		</div>
	);
};
export default MainReadingAuthor;
