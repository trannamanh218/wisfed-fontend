import React from 'react';
// import PropTypes from 'prop-types';
import AuthorBook from 'shared/author-book';

const BookTab = () => {
	const bookList = [...Array(5)].fill({
		id: 21248,
		name: 'Lessons For IELTS - Reading',
		isbn: null,
		description:
			'<p style="text-align: justify;"><span style="font-size: medium;"><strong>Lessons For IELTS - Reading</strong></span></p>\r\n<p style="text-align: justify;">This book covers the following points:</p>\r\n<p style="text-align: justify;"><strong>Reading Topics and Styles</strong></p>\r\n<p style="text-align: justify;">Topics which are often seen in the IELTS Reading test</p>\r\n<p style="text-align: justify;">- Technology, the environment, psychology, human biology, science, history, sport, medicine, the media, advertising</p>\r\n<p style="text-align: justify;">Common styles of IELTS Reading passages</p>\r\n<p style="text-align: justify;">- Narrative, description, and argument styles. Articles are written in newspaper, journal, and/or magazine style and are mostly at a level for an educated, general audience.</p>\r\n<p style="text-align: justify;"><strong>Vocabulary</strong></p>\r\n<p style="text-align: justify;">Exercises to help you to recognize and learn useful vocabulary for reading texts; strategies for dealing with unknown vocabulary in reading texts.</p>\r\n<p style="text-align: justify;"><strong>Strategies and Practice for Answering the IELTS Reading Questions Types</strong></p>\r\n<p style="text-align: justify;">All of the IELTS reading question types are covered in this book. The book provides:</p>\r\n<p style="text-align: justify;">- Practice exercises for each question type.</p>\r\n<p style="text-align: justify;">- Helpful hints for approaching each question type</p>\r\n<p style="text-align: justify;"><strong>Practice Activities for Reading Quickly to Understand the Main Idea</strong></p>\r\n<p style="text-align: justify;">This is a KEY skill for success in the IELTS Reading test. Each unit provides activities to help you to understand the main ideas BEFORE you begin the IELTS – style reading questions.</p>\r\n<p style="text-align: justify;"><strong>Practice Units</strong></p>\r\n<p style="text-align: justify;">Units 5, 10, 15 and 20 in this book are practice units. In these units, you will practice reading and answering questions.</p>\r\n<p style="text-align: justify;">There are two reading passages in each Practice Unit and each passage has about 25 questions. In the real IELTS test, there are three reading passages and each one has about 15 questions. The total number of questions in a real IELTS test is 40.</p>\r\n<p style="text-align: justify;"><strong>Extensions Activities</strong></p>\r\n<p style="text-align: justify;">These activities are designed to provide further vocabulary practice or to help you to understand the organization of the passage more clearly.</p>\r\n<p style="text-align: justify;">We hope you will enjoy using this book and that you will learn useful language and skills to help you to pass the IETLS Reading test.</p><p>Giá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu đồng).....</p>',
		page: null,
		tikiBookId: '365811',
		fahasaBookId: null,
		frontBookCover: null,
		images: ['https://salt.tikicdn.com/media/catalog/product/l/e/lessons-for-ielts-reading.jpg'],
		categoryId: 6,
		verify: false,
		language: null,
		createdBy: null,
		updatedBy: null,
		createdAt: '2022-02-12T00:45:11.159Z',
		updatedAt: '2022-02-12T00:45:11.159Z',
		authors: [
			{
				isUser: false,
				authorId: '6164',
				authorName: 'New Oriental Education',
			},
		],
		category: {
			name: 'Học Ngoại Ngữ',
			slug: null,
		},
		tags: [],
	});
	if (bookList && bookList.length) {
		return bookList.map((book, index) => <AuthorBook key={index} data={book} />);
	}
	return <p className='blank-content'>Không có quyển sách nào</p>;
};

BookTab.propTypes = {};

export default BookTab;
