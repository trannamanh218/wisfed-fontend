import PropTypes from 'prop-types';
import AuthorBook from 'shared/author-book';
import { CHECK_STAR } from 'constants';

const BookTab = ({ currentTab }) => {
	const bookList = [...Array(5)].fill({
		avgRating: 5,
		bookId: 74983,
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
	});
	if (bookList && bookList.length) {
		return bookList.map((book, index) => <AuthorBook key={index} data={book} checkStar={CHECK_STAR} />);
	}
	return <p className='blank-content'>Không có quyển sách nào</p>;
};

BookTab.propTypes = {
	currentTab: PropTypes.string,
};

export default BookTab;
