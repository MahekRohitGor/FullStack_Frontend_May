"use client";
import { useQRCode } from 'next-qrcode';

export default function QRCodeGenerator({ text }) {
  const { Canvas } = useQRCode();

  if (!text) {
    return (
      <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
        <p className="text-gray-500 text-sm">No QR data</p>
      </div>
    );
  }

  return (
    <div className="p-2 bg-white rounded border">
      <Canvas
        text={text}
        options={{
          errorCorrectionLevel: 'M',
          margin: 2,
          scale: 4,
          width: 180,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        }}
      />
    </div>
  );
}