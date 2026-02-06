"use client";

import { getPaymentToken } from "@/actions/akunAct/actions";
import { useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";

export default function SubscriptionComponent() {
  useEffect(() => {
    // Load the snap.js script dynamically
    const snapSrcUrl = "https://app.sandbox.midtrans.com/snap/snap.js"; // Use the sandbox URL for testing
    const myMidtransClientKey = process.env.MIDTRANS_CLIENT_KEY as string; // Replace with your actual Client Key

    const script = document.createElement("script");
    script.src = snapSrcUrl;
    script.setAttribute("data-client-key", myMidtransClientKey);
    script.async = true;

    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async () => {
    const res = await getPaymentToken();

    if (!res || !res.success) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="border rounded p-3">
            <h3>Oops!</h3>
            <p>{res.msg}</p>
            <button className="btn btn-primary" onClick={onClose}>
              Oke
            </button>
          </div>
        ),
      });
    }

    (window as any).snap.pay(res.token, {
      onSuccess: function () {
        /* You can handle success here, e.g., redirect to success page */
      },
      onPending: function (result: any) {
        /* You can handle pending status here */
        // console.log("pending", result);
      },
      onError: function (error: any) {
        /* You can handle error here */
        console.error("error", error);
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Error!</h3>
              <p>Gagal melakukan pembayaran!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      },
      onClose: function () {
        /* You can handle close event here */
        confirmAlert({
          customUI: ({ onClose }) => (
            <div className="border rounded p-3">
              <h3>Info</h3>
              <p>Pembayaran dibatalkan!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Oke
              </button>
            </div>
          ),
        });
      },
    });
  };

  return (
    <div className="">
      <span>
        Setelah pembayaran berhasil, anda akan di <i>redirect</i> ke halaman
        terimakasih
      </span>
      <br />
      <button className="btn btn-primary" onClick={handleSubscribe}>
        Berlangganan
      </button>
    </div>
  );
}
