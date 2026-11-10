# Phượng Mệnh – Bí Sử Hậu Cung

Visual novel cung đấu tiếng Việt, chơi trực tiếp trên trình duyệt và cài đặt được như PWA. Không cần tài khoản, không cần máy chủ, không dùng API trả phí.

## Chạy dự án

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trên terminal. Muốn thử trên điện thoại cùng mạng, chạy `npm run dev -- --host 0.0.0.0`, sau đó mở địa chỉ IP của máy tính. PWA chỉ cài đặt được khi chạy qua HTTPS hoặc localhost.

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

## Nội dung

- 5 chương, hơn 30 cảnh, nhiều nhánh truyện, 6 kết thúc có thể mở khóa.
- Chỉ cần đặt tên để bắt đầu; ngoại hình và xuất thân mặc định, không cần tùy chỉnh trước khi chơi.
- 8 chỉ số, 8 NPC quan trọng; thiện cảm, tin tưởng, cờ sự kiện, điều kiện khóa đáp án và hiệu ứng quyết định.
- Thăng bậc theo diễn tiến cốt truyện; sắc phong Hoàng hậu chỉ xảy ra ở kết thúc đặc biệt đáp ứng điều kiện.
- Hồ sơ, quan hệ, nhật ký, 3 ô lưu tay, 1 ô lưu tự động, thư viện kết thúc, cài đặt.
- IndexedDB lưu dữ liệu chơi. LocalStorage chỉ lưu tùy chọn. Service worker hỗ trợ chơi offline sau khi tài nguyên đã được tải.

## Cấu trúc

- `src/engine.ts`: mô hình dữ liệu, Zod, điều kiện/hiệu ứng, kiểm tra liên kết và vòng lặp.
- `src/story.ts`: dữ liệu truyện và kết thúc, độc lập giao diện.
- `src/store.ts`: Zustand, quản lý tiến trình và IndexedDB.
- `src/App.tsx`, `src/index.css`: màn hình game và thiết kế responsive; hình minh họa CSS tự tạo.
- `src/sound.ts`: âm tương tác và âm nền tổng hợp bằng Web Audio.
- `src/engine.test.ts`, `e2e/journey.spec.ts`: unit test và kiểm thử luồng trình duyệt.
- `public/icon.svg`: biểu tượng PWA tự tạo, không có chữ Hán.

## Lưu ý và hướng phát triển

Hình nền và nhân vật hiện là minh họa CSS/SVG cách điệu, chưa phải tranh nhân vật hoàn chỉnh. Theo yêu cầu hiện tại, chưa chỉnh ảnh nhân vật. Âm nền là nốt tổng hợp chứ chưa phải nhạc cổ trang. Phông tiếng Việt được đóng gói cùng ứng dụng để chơi ngoại tuyến. Phiên bản này chưa có đồng bộ nhiều thiết bị, hội thoại thuyết minh, hệ thống nhiệm vụ phụ hoặc giao diện quản trị. Có thể mở rộng bằng cách thêm scene vào `src/story.ts`, thêm bộ tài nguyên riêng có giấy phép rồi triển khai API Node/PostgreSQL phía sau tầng lưu trữ.
