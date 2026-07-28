import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 bg-river-900 text-river-50 dark:bg-[#050c14]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-gold-300 mb-2">บ้านสีขาวริมโขง ธาตุพนม</h3>
          <p className="text-sm text-river-200">
            ที่พักสไตล์รีสอร์ทโมเดิร์น วิวแม่น้ำโขง ใกล้พระธาตุพนม อ.ธาตุพนม จ.นครพนม
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">เมนู</h4>
          <ul className="space-y-1 text-sm text-river-200">
            <li><Link href="/rooms">ห้องพัก</Link></li>
            <li><Link href="/promotions">โปรโมชั่น</Link></li>
            <li><Link href="/attractions">สถานที่ท่องเที่ยว</Link></li>
            <li><Link href="/contact">ติดต่อเรา</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">ติดต่อ</h4>
          <p className="text-sm text-river-200">โทร: {process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "042-xxxxxx"}</p>
          <p className="text-sm text-river-200">จองผ่าน LINE เท่านั้น</p>
        </div>
      </div>
      <div className="text-center text-xs text-river-400 py-4 border-t border-river-800">
        © {new Date().getFullYear()} บ้านสีขาวริมโขง ธาตุพนม
      </div>
    </footer>
  );
}
