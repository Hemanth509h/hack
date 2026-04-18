import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useSubmitCheckInMutation } from "../../../services/eventApi";
import { CheckCircle2, XCircle, Search, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QRScanner = ({ eventId }) => {
  const [scanResult, setScanResult] = useState("idle");
  const [resultMessage, setResultMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualUserId, setManualUserId] = useState("");

  const [submitCheckIn] = useSubmitCheckInMutation();

  const handleScan = async (scannedData) => {
    if (!scannedData || isProcessing || scanResult !== "idle") return;

    setIsProcessing(true);
    try {
      const parsed = JSON.parse(scannedData);
      const payload = {
        eventId,
        data: parsed.data,
        signature: parsed.signature,
      };

      const res = await submitCheckIn(payload).unwrap();
      setScanResult("success");
      setResultMessage(res.message || "Check-in successful!");

      // Auto reset after 3 seconds
      setTimeout(() => {
        setScanResult("idle");
        setIsProcessing(false);
      }, 3000);
    } catch (err) {
      setScanResult("error");
      setResultMessage(err.data?.error || "Invalid QR code or signature");
      setTimeout(() => {
        setScanResult("idle");
        setIsProcessing(false);
      }, 4000);
    }
  };

  const handleManualCheckin = async (e) => {
    e.preventDefault();
    if (!manualUserId.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const res = await submitCheckIn({
        eventId,
        userId: manualUserId.trim(),
      }).unwrap();
      setScanResult("success");
      setResultMessage(res.message || "Manual check-in successful!");
      setManualUserId("");

      setTimeout(() => {
        setScanResult("idle");
        setIsProcessing(false);
      }, 3000);
    } catch (err) {
      setScanResult("error");
      setResultMessage(
        err.data?.error || "User not found or already checked in",
      );
      setTimeout(() => {
        setScanResult("idle");
        setIsProcessing(false);
      }, 4000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative max-w-md mx-auto">
      <div className="flex bg-gray-100 dark:bg-gray-950 p-1 border-b border-gray-200 dark:border-gray-800 relative z-10">
        <button
          onClick={() => setManualMode(false)}
          className={`flex-1 py-3 text-sm font-bold flex flex-center gap-2 transition ${!manualMode ? "text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-lg shadow" : "text-gray-500 hover:text-gray-700 dark:text-gray-300"}`}
        >
          <ScanLine size={16} /> Scanner
        </button>
        <button
          onClick={() => setManualMode(true)}
          className={`flex-1 py-3 text-sm font-bold flex flex-center gap-2 transition ${manualMode ? "text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-lg shadow" : "text-gray-500 hover:text-gray-700 dark:text-gray-300"}`}
        >
          <Search size={16} /> Manual
        </button>
      </div>

      <div className="relative aspect-square bg-black">
        {!manualMode ? (
          <Scanner
            // @ts-ignore
            onResult={(text, _result) => handleScan(text)}
            onError={(error) => console.log(error?.message)}
            // @ts-ignore
            options={{ delayBetweenScanAttempts: 1000 }}
          />
        ) : (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
            <Search size={48} className="text-gray-700 mb-4" />
            <h3 className="font-bold text-lg mb-2">Manual Override</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Enter User ID or Student Number to bypass scanner.
            </p>
            <form onSubmit={handleManualCheckin} className="w-full flex gap-2">
              <input
                type="text"
                value={manualUserId}
                onChange={(e) => setManualUserId(e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 outline-none focus:border-blue-500 transition"
                placeholder="Enter exact ID..."
              />

              <button
                type="submit"
                disabled={!manualUserId.trim() || isProcessing}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-gray-900 dark:text-white px-4 rounded-xl font-bold transition"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {/* Overlay Toasts */}
        <AnimatePresence>
          {scanResult !== "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md ${
                scanResult === "success"
                  ? "bg-green-500/80 text-gray-900 dark:text-white"
                  : "bg-red-500/80 text-gray-900 dark:text-white"
              }`}
            >
              {scanResult === "success" ? (
                <CheckCircle2 size={64} className="mb-4 drop-shadow-md" />
              ) : (
                <XCircle size={64} className="mb-4 drop-shadow-md" />
              )}
              <h3 className="text-2xl font-black drop-shadow-md">
                {scanResult === "success" ? "Approved!" : "Check-in Error"}
              </h3>
              <p className="font-semibold text-gray-900 dark:text-white/90 drop-shadow">
                {resultMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QRScanner;
