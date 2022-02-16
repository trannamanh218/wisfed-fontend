import { Forward } from 'components/svg';
import React from 'react';
import BackButton from 'shared/back-button';
import Comment from 'shared/comment';
import QuoteCard from 'shared/quote-card';
import ReplyBox from 'shared/reply-box';
import './main-quote-detail.scss';

const MainQuoteDetail = () => {
	return (
		<div className='main-quote-detail'>
			<div className='main-quote-detail__header'>
				<BackButton />
				<h4>Quotes của Adam Khort</h4>
				<a className='main-quote-detail__link' href='#'>
					<span>Xem tất cả của Adam Khort</span>
					<Forward />
				</a>
			</div>

			<div className='main-quote-detail__pane'>
				<QuoteCard className='mx-auto' isDetail={true} />
				<Comment />
				<Comment />
				<Comment />
				<Comment />

				<ReplyBox />
			</div>
		</div>
	);
};

MainQuoteDetail.propTypes = {};

export default MainQuoteDetail;
