import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmployeeForm() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded shadow-md w-52 h-fit">
          <img src="/Images/Profile.jpg" className="rounded-full w-40 h-40 mx-auto object-cover" />
          <Button className="w-full mt-4">อัปโหลดรูปภาพ</Button>
        </div>
      </div>
      <form className="flex-1 bg-white p-6 rounded shadow-md space-y-4">
        <div>
          <Label>ชื่อ - นามสกุล</Label>
          <Input placeholder="กรุณากรอกชื่อ - นามสกุล" required />
        </div>
        <div>
          <Label>เบอร์โทรศัพท์</Label>
          <Input placeholder="กรุณากรอกเบอร์โทรศัพท์" required />
        </div>
        <div>
          <Label>อีเมล</Label>
          <Input type="email" placeholder="กรุณากรอกอีเมล" required />
        </div>
        <div>
          <Label>รหัสผ่าน</Label>
          <Input type="password" placeholder="กรุณากรอกรหัสผ่าน" required />
        </div>
        <div>
          <Label>ยืนยันรหัสผ่าน</Label>
          <Input type="password" placeholder="กรุณายืนยันรหัสผ่าน" required />
        </div>
        <div>
          <Label>ตำแหน่งงาน</Label>
          <Input placeholder="กรุณาเลือกตำแหน่งงาน" required />
        </div>
        <div>
          <Label>รหัสพนักงาน</Label>
          <Input placeholder="กรุณากรอกรหัสพนักงาน" required />
        </div>
        <Button type="submit" className="w-full">บันทึกข้อมูล</Button>
      </form>
    </div>
  );
}
