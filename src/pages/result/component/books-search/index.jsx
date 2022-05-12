import './books-search.scss';
import AuthorBook from 'shared/author-book';
import { CHECK_STAR, CHECK_SHARE } from 'constants';
import ResultNotFound from '../result-not-found';

const BookSearch = () => {
	const data = {
		avgRating: 5,
		book: {
			active: true,
			categoryId: 16,
			createdAt: '2022-02-13T09:07:46.067Z',
			createdBy: null,
			description:
				'Thẳng  tiến  đến  hang  ổ  của  Orochimaru!  Sau  khi thâm nhập, đội Naruto đã gặp lại Sai. Nhờ tấm lòng luôn muốn gắn kết với Sasuke, Naruto đã giúp Sai tìm lại được cảm xúc của bản thân. 2 năm rưỡi vụt qua, cuối cùng thời khắc tái ngộ giữa 2 người bạn cũng tới…!!,“Dạo  gần  đây,  xung  quanh  tôi  ai cũng bảo họ đang đọc sách. Vì rất hiếm khi đọc sách nên tôi cũng tính kiếm gì đó đọc thử. Có lẽ là tôi sẽ tìm đọc thể loại truyện giả tưởng hoặc  tiểu  thuyết  của  Jump  xem sao.” (MASASHI KISHIMOTO)',
			fahasaBookId: '290232',
			frontBookCover: null,
			id: 74983,
			images: ['https://cdn0.fahasa.com/media/catalog/product/n/a/naruto-tap-34.jpg'],
			isbn: null,
			language: null,
			like: 0,
			name: 'Naruto Tập 34',
			page: 294,
			specifications: [],
			tikiBookId: null,
			updatedAt: '2022-04-08T03:03:54.489Z',
			updatedBy: null,
			verify: false,
		},

		bookId: 74983,
		status: 'reading',
	};
	return (
		<div className='bookSearch__container'>
			<div className='bookSearch__title'>Trang 1 trong số khoảng 16844 kết quả (0,05 giây)</div>
			<div className='bookSearch__main'>
				<AuthorBook data={data} checkStar={CHECK_STAR} checkshare={CHECK_SHARE} />
			</div>
			{/* <ResultNotFound /> */}
		</div>
	);
};

export default BookSearch;
