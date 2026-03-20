import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên Hệ Với Chúng Tôi",
  description: "Thông tin liên hệ, hỗ trợ người dùng, bản quyền và hợp tác nội dung của TruyenM."
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Liên hệ với chúng tôi</h1>
      <p className="text-sm text-black/70">
        TruyenM duy trì kênh liên hệ công khai để hỗ trợ người dùng, xử lý khiếu nại bản quyền, hợp tác nội dung và các vấn đề kỹ thuật liên quan đến dịch vụ.
      </p>
      <div className="card p-5">
        <h2 className="text-xl font-semibold">Thông tin liên hệ</h2>
        <div className="mt-3 space-y-2 text-sm text-black/70">
          <p>Email hỗ trợ: <strong>ntmanh@ntmanh.io.vn</strong></p>
          <p>Địa chỉ làm việc: 123 Nguyễn Trãi, TP.HCM</p>
          <p>Thời gian phản hồi mục tiêu: trong vòng 48-72 giờ làm việc.</p>
        </div>
      </div>
      <div className="card p-5">
        <h2 className="text-xl font-semibold">Các trường hợp nên liên hệ</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
          <li>Yêu cầu hỗ trợ tài khoản, điểm thưởng hoặc sự cố truy cập.</li>
          <li>Thông báo nội dung vi phạm, yêu cầu gỡ bỏ hoặc tranh chấp bản quyền.</li>
          <li>Trao đổi hợp tác nội dung, quảng cáo hoặc tích hợp kỹ thuật.</li>
          <li>Phản hồi về chất lượng trải nghiệm, điều hướng, tốc độ tải trang và khả năng truy cập.</li>
        </ul>
      </div>
      <div className="card p-5">
        <h2 className="text-xl font-semibold">Lưu ý khi gửi yêu cầu</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
          <li>Nêu rõ đường dẫn trang, tên truyện hoặc ảnh chụp lỗi nếu có.</li>
          <li>Với khiếu nại bản quyền, vui lòng cung cấp thông tin chứng minh quyền sở hữu hoặc quyền đại diện hợp pháp.</li>
          <li>Không gửi nội dung trái pháp luật, nội dung người lớn, bạo lực cực đoan hoặc ngôn từ kích động thù hận qua biểu mẫu và email hỗ trợ.</li>
        </ul>
      </div>
    </div>
  );
}
