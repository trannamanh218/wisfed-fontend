import { toast } from 'react-toastify';

const errVN = {
	301: {
		vi: 'Bạn đã đạt giới hạn bạn bè',
		en: 'You have reached your friend limit',
	},
	302: {
		vi: 'Người dùng đã đạt giới hạn bạn bè',
		en: 'The user has reached the friend limit',
	},
	303: {
		vi: 'Không tìm thấy tên người dùng',
		en: 'Username not found',
	},
	304: {
		vi: 'Đã kết bạn',
		en: 'You are connected',
	},
	305: {
		vi: 'Mail này đã được đăng kí',
		en: 'This email is already registered',
	},
	306: {
		vi: 'Người dùng không đúng',
		en: 'Incorrect user',
	},
	307: {
		vi: 'Mã thông báo không hợp lệ',
		en: 'Token is invalid',
	},
	308: {
		vi: 'Email hoặc password không đúng',
		en: 'Email or password is incorrect',
	},
	309: {
		vi: 'Mã thông báo đã được sử dụng',
		en: 'Token already used',
	},
	311: {
		vi: 'Không thể thay đổi mật khẩu',
		en: 'Cannot change password',
	},
	312: {
		vi: 'Mật khẩu cũ không đúng',
		en: 'Old password is not correct',
	},
	310: {
		vi: 'Otp hết hạn hoặc không đúng',
		en: 'Otp expired or incorrect',
	},
	404: {
		vi: 'Không tìm thấy dữ liệu',
		en: 'No data found',
	},
	401: {
		vi: 'Chưa xác thực',
		en: 'Unconfirmed',
	},
	405: {
		vi: 'Sai dữ liệu đầu vào',
		en: 'Wrong input data',
	},
	406: {
		vi: 'Không thể cập nhật dữ liệu',
		en: 'Unable to update data',
	},
	701: {
		vi: 'Tên của bạn không trùng với tên bất kì tác giả nào của sách',
		en: `Your name does not match any of the author's name`,
	},
	702: {
		vi: 'Sách đã tồn tại trong library',
		en: 'The book already exists in the library',
	},
	941: {
		vi: 'Không thể trả lời comment của bài đăng khác ',
		en: `Can't reply to another post's comment`,
	},
	961: {
		vi: 'Không thể trả lời comment của review khác',
		en: `Can't reply to other review's comments`,
	},
	921: {
		vi: 'Không thể trả lời comment của quote khác',
		en: `Can't reply to another quote's comment`,
	},
	703: {
		vi: 'Số trang của sách trống',
		en: `Page number of blank book`,
	},
	801: {
		vi: 'Không thể tìm thấy token getstream',
		en: `Can't find getstream token`,
	},
	901: {
		vi: 'Không tìm thấy mục này',
		en: `This item could not be found`,
	},
	601: {
		vi: 'Chỉ áp dụng cho các loại file sau:',
		en: `Only applies to the following file types:`,
	},
	602: {
		vi: 'Không tìm thấy file !',
		en: `File not found
		`,
	},
	731: {
		vi: 'Các thư viện không được trùng tên nhau',
		en: `Libraries cannot have the same name
		`,
	},
	732: {
		vi: 'Type trạng thái không đúng',
		en: `Type of status is incorrect`,
	},
	751: {
		vi: 'Bạn đã gửi request trước đó',
		en: `You have sent a request before`,
	},
	752: {
		vi: 'Bạn đã là tác giả',
		en: `You are already the author`,
	},
	761: {
		vi: 'Bạn đã review cuốn này',
		en: `Have you reviewed this book?`,
	},
	999: {
		vi: 'Có gì đó không đúng',
		en: `something is not right`,
	},
};

export const NotificationError = (err, language) => {
	const statusCodeError = err?.errorCode;
	if (language === 'en') {
		return toast.error(errVN[statusCodeError].en);
	} else {
		return toast.error(errVN[statusCodeError].vi);
	}
};
