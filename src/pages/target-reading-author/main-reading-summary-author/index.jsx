import SearchField from 'shared/search-field';
import { Table } from 'react-bootstrap';
import './main-reading-author.scss';
import BookThumbnail from 'shared/book-thumbnail';
import { StarAuthor, ShareAuthor } from 'components/svg';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useParams } from 'react-router-dom';

const MainReadingAuthor = () => {
	const { userId } = useParams();
	const { booksAuthor } = useFetchAuthorBooks(userId);

	return (
		<div className='MainReadingAuthor__container'>
			<div className='reading-target'>
				<div className='reading-target__header'>
					<h4>Sách tôi làm tác giả </h4>
					<SearchField placeholder='Tìm kiếm sách' />
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
						{booksAuthor.map((item, index) => (
							<tbody key={item.id}>
								<></>
								<tr className={`highlight highlight-${index} `}>
									<td colSpan={10}></td>
								</tr>
								<tr className='book-row'>
									<td className='hightlight-column'></td>
									<td>
										<BookThumbnail size='sm' />
									</td>
									<td>
										<span className='book-name'>Sách hay vịnh bắc bộ</span>
									</td>
									<td>
										<span className='custom-td'>
											4.5
											<StarAuthor />
										</span>
									</td>
									<td>
										<span className='book-name'>200k</span>
									</td>
									<td>
										<div className='book-name-title'>
											<span className='book-name custom-text'>100k</span>
											<span className='book-name-custom'>10 lượt review mới</span>
										</div>
									</td>
									<td>
										<span className='book-name'>400k</span>
									</td>
									<td>
										<div className='book-name-title'>
											<span className='book-name custom-text'>1000</span>
											<span className='book-name-custom'>10 lượt quote mới</span>
										</div>
									</td>
									<td>
										<div className='share-author'>
											<ShareAuthor />
										</div>
									</td>
									<td className='hightlight-column'></td>
								</tr>
								<tr className='highlight'>
									<td colSpan={10}></td>
								</tr>
							</tbody>
						))}
					</Table>
				</div>
			</div>
		</div>
	);
};
export default MainReadingAuthor;
