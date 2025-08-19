import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

function TokenDisplay() {
  const { user } = useContext(AuthContext);
  const remaining = user?.discountCodesRemaining ?? 0;
  const codes = Array.isArray(user?.discountCodes) ? user.discountCodes : [];
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      <span className="text-sm text-gray-600">Mã giảm giá:</span>
      <button
        type="button"
        className="bg-pink-100 text-pink-600 px-2 py-1 rounded font-bold min-w-[28px] text-center"
        onClick={() => setOpen((v) => !v)}
        title="Xem danh sách mã"
      >
        {remaining}
      </button>
      {open && codes.length > 0 && (
        <div className="absolute right-0 top-7 bg-white border rounded shadow p-2 text-sm z-20 min-w-[160px]">
          <div className="font-medium mb-1">Các mức giảm còn lại</div>
          <div className="flex flex-wrap gap-2">
            {codes.map((p) => (
              <span key={p} className="px-2 py-0.5 bg-pink-50 text-pink-700 rounded border border-pink-200">{p}%</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TokenDisplay; 