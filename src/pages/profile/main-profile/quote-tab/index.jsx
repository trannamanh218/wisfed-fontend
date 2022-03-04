import React from 'react';
import QuoteList from 'shared/quote-list';

const QuoteTab = () => {
	const listQuote = Array.from(Array(5)).fill({
		id: 3,
		bookId: 1,
		authorName: 'smoke',
		quote: 'em dep nhat trong anh',
		background: null,
		tagId: 10,
		createdBy: 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		updatedBy: 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		createdAt: '2022-02-25T02:32:44.902Z',
		updatedAt: '2022-02-25T02:32:44.902Z',
		book: {
			name: 'Nhà Giả Kim (Tái Bản 2020)',
			description:
				'Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, hòa hợp với vũ trụ và con người.,Tiểu thuyết Nhà giả kim của Paulo Coelho như một câu chuyện cổ tích giản dị, nhân ái, giàu chất thơ, thấm đẫm những minh triết huyền bí của phương Đông. Trong lần xuất bản đầu tiên tại Brazil vào năm 1988, sách chỉ bán được 900 bản. Nhưng, với số phận đặc biệt của cuốn sách dành cho toàn nhân loại, vượt ra ngoài biên giới quốc gia, Nhà giả kim đã làm rung động hàng triệu tâm hồn, trở thành một trong những cuốn sách bán chạy nhất mọi thời đại, và có thể làm thay đổi cuộc đời người đọc.,“Nhưng nhà luyện kim đan không quan tâm mấy đến những điều ấy. Ông đã từng thấy nhiều người đến rồi đi, trong khi ốc đảo và sa mạc vẫn là ốc đảo và sa mạc. Ông đã thấy vua chúa và kẻ ăn xin đi qua biển cát này, cái biển cát thường xuyên thay hình đổi dạng vì gió thổi nhưng vẫn mãi mãi là biển cát mà ông đã biết từ thuở nhỏ. Tuy vậy, tự đáy lòng mình, ông không thể không cảm thấy vui trước hạnh phúc của mỗi người lữ khách, sau bao ngày chỉ có cát vàng với trời xanh nay được thấy chà là xanh tươi hiện ra trước mắt. ‘Có thể Thượng đế tạo ra sa mạc chỉ để cho con người biết quý trọng cây chà là,’ ông nghĩ.”,- Trích Nhà giả kim,Nhận định,“Sau Garcia Márquez, đây là nhà văn Mỹ Latinh được đọc nhiều nhất thế giới.” - The Economist, London, Anh,,“Santiago có khả năng cảm nhận bằng trái tim như Hoàng tử bé của Saint-Exupéry.” - Frankfurter Allgemeine Zeitung, Đức',
			frontBookCover: null,
			categoryId: 1,
			verify: false,
		},
		user: {
			fullName: 'admin user1',
			email: 'admin@gmail.com',
			avatarImage:
				'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80',
		},
		categories: [
			{
				quoteId: 3,
				category: {
					name: 'Thể Dục Thể Thao',
					slug: null,
				},
			},
			{
				quoteId: 3,
				category: {
					name: 'Văn Hoá - Địa Lý - Du Lịch',
					slug: null,
				},
			},
		],
		tag: {
			name: 'hot',
			slug: 'hot',
		},
	});
	return (
		<>
			<div className='my-quotes'>
				<h4>Quote của tôi</h4>
				<QuoteList list={listQuote} />
			</div>
			<div className='favorite-quotes'>
				<h4>Quote yêu thích</h4>
				<QuoteList list={listQuote} />
			</div>
		</>
	);
};

QuoteTab.propTypes = {};

export default QuoteTab;
