-- ============================================================
-- 0003_seed_data.sql — ข้อมูลตัวอย่างสำหรับทดสอบ (ลบทิ้งได้ก่อนขึ้น production)
-- ============================================================

insert into amenities (name, icon_key) values
    ('Wi-Fi ฟรี', 'wifi'),
    ('เครื่องปรับอากาศ', 'ac'),
    ('ทีวี', 'tv'),
    ('ตู้เย็น', 'fridge'),
    ('น้ำอุ่น', 'hot-water'),
    ('ระเบียงวิวแม่น้ำโขง', 'balcony-river'),
    ('ที่จอดรถ', 'parking'),
    ('อาหารเช้า', 'breakfast');

insert into rooms (room_code, name, type, description, capacity, bed_type, room_size_sqm, price_normal, price_weekend, price_festival, status, sort_order) values
    ('DLX-01', 'ดีลักซ์ริมโขง', 'Deluxe River View', 'ห้องพักวิวแม่น้ำโขงเต็มตา ตกแต่งโทนขาว-ฟ้าสไตล์รีสอร์ทโมเดิร์น', 2, 'เตียงคิงไซส์', 28, 1200, 1500, 2200, 'available', 1),
    ('FAM-01', 'แฟมิลี่สวีท', 'Family Suite', 'ห้องกว้างขวางเหมาะสำหรับครอบครัว มีมุมนั่งเล่นแยกจากห้องนอน', 4, 'เตียงคู่ + โซฟาเบด', 40, 1800, 2200, 3000, 'available', 2),
    ('STD-01', 'สแตนดาร์ด', 'Standard', 'ห้องพักมาตรฐาน สะอาด สะดวกสบาย ราคาคุ้มค่า', 2, 'เตียงควีนไซส์', 20, 800, 1000, 1500, 'available', 3);

insert into attractions (name, description, distance_km, sort_order) values
    ('พระธาตุพนม', 'พระธาตุคู่บ้านคู่เมือง สิ่งศักดิ์สิทธิ์ประจำจังหวัดนครพนม', 1.2, 1),
    ('ถนนคนเดินริมโขงธาตุพนม', 'ตลาดโต้รุ่งริมแม่น้ำโขง เปิดทุกวันศุกร์-เสาร์', 0.8, 2),
    ('หอสมุดแห่งชาติเฉลิมพระเกียรติ นครพนม', 'จุดชมวิวแม่น้ำโขงและสถาปัตยกรรมสวยงาม', 15, 3);

insert into coupons (code, discount_type, discount_value, expiry_date, is_active, usage_limit) values
    ('WELCOME2026', 'percent', 10, '2026-12-31', true, 100),
    ('SONGKRAN500', 'amount', 500, '2026-04-20', true, 50);
