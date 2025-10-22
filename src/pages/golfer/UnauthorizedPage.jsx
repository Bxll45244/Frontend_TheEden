import { Link, useLocation } from "react-router-dom";

export default function ForbiddenPage() {
  const location = useLocation();
  const reason = location.state?.reason || "forbidden";

  const text =
    reason === "auth"
      ? { title: "ยังไม่ได้เข้าสู่ระบบ", detail: "กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้" }
      : { title: "คุณไม่มีสิทธิ์เข้าหน้านี้", detail: "บัญชีของคุณไม่มีบทบาทที่สามารถเข้าถึงได้" };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center space-y-3">
          <div className="text-5xl">🔒</div>
          <h1 className="text-2xl font-semibold">{text.title}</h1>
          <p className="opacity-70">{text.detail}</p>
          <div className="card-actions mt-2">
            <Link to="/" className="btn">กลับหน้าแรก</Link>
            <Link to="/login" className="btn btn-primary">ไปหน้าเข้าสู่ระบบ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
