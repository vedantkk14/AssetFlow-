import { Printer, Download, QrCode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QRCodeComponentProps {
  assetTag: string;
  assetName: string;
  qrCodeUrl?: string;
}

export const QRCodeComponent = ({ assetTag, assetName, qrCodeUrl }: QRCodeComponentProps) => {
  const defaultQrUrl = qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${assetTag}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>AssetFlow QR Tag - ${assetTag}</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
            .card {
              border: 2px solid #000;
              padding: 24px;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            img {
              width: 150px;
              height: 150px;
              margin-bottom: 12px;
            }
            h2 {
              margin: 0 0 4px 0;
              font-size: 20px;
              letter-spacing: 1px;
            }
            p {
              margin: 0;
              font-size: 12px;
              color: #555;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="card">
            <h2>${assetTag}</h2>
            <img src="${defaultQrUrl}" alt="QR Code" />
            <p>${assetName}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = defaultQrUrl;
    link.target = '_blank';
    link.download = `qrcode-${assetTag}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border border-border shadow-xs bg-card flex flex-col items-center p-5 text-center">
      <div className="flex items-center gap-2 border-b border-border pb-2 w-full text-left mb-4">
        <QrCode className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Asset QR Label</h3>
      </div>
      
      <div className="border border-border p-3 bg-white dark:bg-white rounded-lg inline-block mb-4 shadow-inner">
        <img src={defaultQrUrl} alt={`QR Code for ${assetTag}`} className="w-40 h-40 object-contain" />
      </div>
      
      <div className="font-mono text-sm font-bold text-foreground mb-1">{assetTag}</div>
      <p className="text-[10px] text-muted-foreground truncate max-w-44 mb-4">{assetName}</p>

      <div className="flex gap-2 w-full">
        <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1 text-xs gap-1.5 h-8 font-medium">
          <Download className="h-3.5 w-3.5" />
          <span>Download</span>
        </Button>
        <Button variant="default" size="sm" onClick={handlePrint} className="flex-1 text-xs gap-1.5 h-8 font-medium">
          <Printer className="h-3.5 w-3.5" />
          <span>Print Label</span>
        </Button>
      </div>
    </Card>
  );
};

export default QRCodeComponent;
