import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều Khoản Dịch Vụ",
  description: "Điều khoản sử dụng dịch vụ TruyenM, quyền và nghĩa vụ của người dùng khi đọc truyện và sử dụng tài khoản."
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Điều khoản dịch vụ</h1>
      <p className="text-sm text-black/70">
        Khi sử dụng TruyenM, bạn đồng ý với các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
      </p>
      <h2 className="text-xl font-semibold">Tài khoản người dùng</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
        <li>Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu.</li>
        <li>Không chia sẻ tài khoản hoặc sử dụng trái phép tài khoản của người khác.</li>
        <li>TruyenM có quyền tạm khóa tài khoản vi phạm chính sách.</li>
      </ul>
      <h2 className="text-xl font-semibold">Nội dung và bản quyền</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
        <li>Không đăng tải nội dung vi phạm bản quyền hoặc nội dung bị cấm theo pháp luật.</li>
        <li>Chúng tôi sẽ xử lý yêu cầu gỡ bỏ nội dung vi phạm khi có thông báo hợp lệ.</li>
        <li>Người dùng chịu trách nhiệm về nội dung do mình đăng tải.</li>
      </ul>
      <h2 className="text-xl font-semibold">Quy tắc sử dụng</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-black/70">
        <li>Không khai thác hệ thống để gian lận điểm thưởng.</li>
        <li>Không sử dụng công cụ tự động gây quá tải hoặc ảnh hưởng tới dịch vụ.</li>
        <li>Tuân thủ quy định cộng đồng và tôn trọng người dùng khác.</li>
      </ul>
      <h2 className="text-xl font-semibold">Giới hạn trách nhiệm</h2>
      <p className="text-sm text-black/70">
        TruyenM cung cấp dịch vụ theo hiện trạng. Chúng tôi không chịu trách nhiệm cho thiệt hại gián tiếp do việc sử dụng
        hoặc không thể sử dụng dịch vụ.
      </p>
      <h2 className="text-xl font-semibold">Thay đổi điều khoản</h2>
      <p className="text-sm text-black/70">
        Chúng tôi có thể cập nhật điều khoản theo thời gian. Thông báo sẽ được đăng trên trang này và có hiệu lực ngay khi
        công bố.
      </p>
      <h2 className="text-xl font-semibold">Liên hệ</h2>
      <p className="text-sm text-black/70">
        Mọi thắc mắc về điều khoản dịch vụ, vui lòng liên hệ: <strong>ntmanh@ntmanh.io.vn</strong>.
      </p>
    </div>
  );
}
