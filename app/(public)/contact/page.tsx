import { Phone, MapPin, Clock } from "lucide-react";
import { LineBookingButton } from "@/components/public/LineBookingButton";

export const metadata = { title: "ติดต่อเรา | บ้านสีขาวริมโขง ธาตุพนม" };

export default function ContactPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-river-900 dark:text-river-100">ติดต่อเรา</h1>
        <p className="text-river-600 dark:text-river-400 mt-2">สอบถามและจองห้องพักผ่าน LINE ได้ตลอด 24 ชั่วโมง</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="resort-card p-6 text-center space-y-2">
          <Phone className="mx-auto text-river-500" />
          <p className="font-semibold">โทรศัพท์</p>
          <p className="text-sm text-river-600 dark:text-river-400">
            {process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "042-xxxxxx"}
          </p>
        </div>
        <div className="resort-card p-6 text-center space-y-2">
          <MapPin className="mx-auto text-river-500" />
          <p className="font-semibold">ที่ตั้ง</p>
          <p className="text-sm text-river-600 dark:text-river-400">อ.ธาตุพนม จ.นครพนม (ริมแม่น้ำโขง ใกล้พระธาตุพนม)</p>
        </div>
        <div className="resort-card p-6 text-center space-y-2">
          <Clock className="mx-auto text-river-500" />
          <p className="font-semibold">เวลาทำการ</p>
          <p className="text-sm text-river-600 dark:text-river-400">ตอบไลน์ทุกวัน 08:00 - 21:00 น.</p>
        </div>
      </div>

      <div className="resort-card p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-river-900 dark:text-river-100">จองห้องพักผ่าน LINE เท่านั้น</h2>
        <p className="text-river-600 dark:text-river-400 text-sm max-w-md mx-auto">
          กดปุ่มด้านล่างเพื่อแอดไลน์ แจ้งวันที่และห้องที่สนใจ ทีมงานจะตรวจสอบห้องว่างและออกใบจองให้ทันที
        </p>
        <LineBookingButton />
      </div>
    </section>
  );
}
