import React from 'react';
import QuoteList from 'shared/quote-list';

const QuoteTab = () => {
	const listQuote = Array.from(Array(5)).fill({
		data: {
			content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam velit nemo voluptate. Eaque tenetur
			dolore qui doloribus modi alias labore deleniti quisquam sunt. Accusantium, accusamus eius ipsum optio
			distinctio laborum.`,
			avatar: '',
			author: 'Mai Nguyễn',
			bookName: 'Đắc nhân tâm',
		},
		badges: [{ title: 'Marketing' }, { title: 'Phát triển bản thân' }],
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
