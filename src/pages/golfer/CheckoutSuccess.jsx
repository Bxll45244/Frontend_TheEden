// CheckoutSuccess.jsx
import { useEffect, useState } from "react";
import stripeService from "../../service/golfer/stripeService";


export default function CheckoutSuccess() {
  const [state, setState] = useState({ loading: true, data: null, error: "" });

  useEffect(() => {
    (async () => {
      try {
        const res = await stripeService.finalizeFromSuccessPage();
        // คาดหวัง { success: true, booking }
        setState({ loading: false, data: res?.booking || res, error: "" });
      } catch (e) {
        setState({ loading: false, data: null, error: e.message || "ดึงผลการชำระเงินไม่สำเร็จ" });
      }
    })();
  }, []);

  if (state.loading) return <p>กำลังตรวจผลการชำระเงิน…</p>;
  if (state.error)   return <p style={{ color: "red" }}>{state.error}</p>;

  return (
    <div>
      <h2>ชำระเงินสำเร็จ 🎉</h2>
      <pre>{JSON.stringify(state.data, null, 2)}</pre>
    </div>
  );
}
