import React from "react";

export default function BankTransferQR({ amount, memo, bankCode, accountNo, accountName }) {
  const roundedAmount = Math.max(0, Math.round(Number(amount || 0)));
  const params = new URLSearchParams({
    amount: String(roundedAmount),
    addInfo: String(memo || ""),
    accountName: String(accountName || "")
  });
  const src = `https://img.vietqr.io/image/${bankCode}-${accountNo}-qr_only.png?${params.toString()}`;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {}
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <div className="text-sm text-gray-700 mb-3">Quét mã để chuyển khoản đúng số tiền và nội dung</div>
      <div className="flex flex-col items-center gap-3">
        <img src={src} alt="VietQR" className="w-56 h-56 object-contain" />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="p-2 border rounded">
            <div className="text-gray-500">Ngân hàng</div>
            <div className="font-semibold">{bankCode}</div>
          </div>
          <div className="p-2 border rounded">
            <div className="text-gray-500">Số tài khoản</div>
            <div className="font-semibold flex items-center gap-2">
              <span>{accountNo}</span>
              <button onClick={() => handleCopy(accountNo)} className="px-2 py-1 text-xs rounded bg-gray-100">Copy</button>
            </div>
          </div>
          <div className="p-2 border rounded">
            <div className="text-gray-500">Chủ tài khoản</div>
            <div className="font-semibold">{accountName}</div>
          </div>
          <div className="p-2 border rounded">
            <div className="text-gray-500">Số tiền</div>
            <div className="font-semibold text-pink-600">{roundedAmount.toLocaleString("vi-VN")} đ</div>
          </div>
          <div className="md:col-span-2 p-2 border rounded">
            <div className="text-gray-500">Nội dung chuyển khoản</div>
            <div className="font-semibold flex items-center gap-2">
              <span>{memo}</span>
              <button onClick={() => handleCopy(String(memo || ""))} className="px-2 py-1 text-xs rounded bg-gray-100">Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


