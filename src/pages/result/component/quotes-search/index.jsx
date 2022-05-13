import QuoteCard from 'shared/quote-card';
import { useState } from 'react';
import './quotes-search.scss';

const QuoteSearch = () => {
	const [likedArray, setLikedArray] = useState([]);

	const data = {
		authorName: '',
		background: '',
		book: {
			categoryId: 16,
			description:
				'Trạng Quỷnh là một bộ truyện tranh thiếu nhi nhiều tập của Việt Nam, tập truyện đầu tiên mang tên Sao sáng xứ Thanh được Nhà xuất bản Đồng Nai phát hành giữa tháng 6 năm 2003.,Ban đầu tác phẩm được đặt là Trạng Quỳnh (từ tập 1 đến tập 24), còn từ tập 25 trở đi thì đặt tên là Trạng Quỷnh.,Tác phẩm được thực hiện bởi tác giả Kim Khánh.,Truyện lấy bối cảnh vào thời chúa Nguyễn, dưới thời chúa Nguyễn Phúc Khoát, nhưng những sự kiện xảy ra trong truyện không trùng lặp với những sự kiện xảy ra trên thực tế. Tác phẩm này ban đầu kể lại về cuộc đời của Trạng Quỳnh - một người có tính cách trào phúng dân gian Việt Nam. Trong truyện này, Trạng Quỳnh vốn thông minh từ trong bụng mẹ.,Trước khi cậu sinh ra, một lần bà mẹ ra ao giặt đồ, bỗng nhìn thấy một chú vịt, bà mẹ liền ngâm câu thơ, và lập tức có tiếng đối đáp lại trong bụng vịt.,Bà cho rằng đó là điềm lạ, nghĩ rằng bà sẽ sinh ra một quý tử, hiểu biết hơn người, sẽ là người có tiếng tăm. Thời gian trôi qua, bà hạ sinh một bé trai, tư dung thông minh lạ thường, đặt tên là Quỳnh.',
			frontBookCover: null,
			name: 'Truyện Tranh Trạng Quỷnh - Tập 315: Làm Đẹp',
			verify: false,
		},

		bookId: 77998,
		categories: [
			{
				category: {
					name: 'Văn Hoá - Địa Lý - Du Lịch',
					slug: null,
				},
				quoteId: 10,
			},
			{
				category: {
					name: 'Thể Dục Thể Thao',
					slug: null,
				},
				quoteId: 10,
			},
		],

		commentQuotes: [],
		comments: 0,
		createdAt: '2022-03-01T04:05:19.159Z',
		createdBy: 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		id: 29,
		like: 2,
		quote: 'oksad',
		share: 0,
		tags: [],
		updatedAt: '2022-04-18T02:51:59.442Z',
		updatedBy: 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		user: {
			avatarImage: 'http://192.168.3.10:31989/api/v1/files/streaming/images/file-1652078788219.png',
			email: 'admin@gmail.com',
			fullName: 'Admin Đi Mượn',
		},
	};
	return (
		<div className='quoteSearch__container'>
			<QuoteCard data={data} likedArray={likedArray} />
		</div>
	);
};

export default QuoteSearch;
