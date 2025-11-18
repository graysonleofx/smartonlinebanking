import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Clock, Download, Share, Copy, X, Check } from 'lucide-react';
import { useState } from 'react';

const PendingTransactionReceipt = ({ type = 'transfer', formData = {}, onClose, onCancel, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const transactionId = `${type.toUpperCase()}${Date.now().toString().slice(-8)}`;
  const timestamp = new Date().toLocaleString();

  // Ensure amount always parses correctly
  const amount = Number(formData.amount) || 0;

  // Example fee rule (same as original)
  const fee = amount > 100000 ? 500 : 0;
  const totalAmount = amount + fee;

  const handleCopy = async () => {
    const receiptText = `
Federal Edge Finance - Transaction Receipt (Pending)
Transaction ID: ${transactionId}
Type: ${type === 'transfer' ? 'Money Transfer' : 'Withdrawal'}
Date: ${timestamp}
Amount: $${amount.toLocaleString()}
Recipient: ${formData.accountName || '-'}
Account: ${formData.accountNumber || '-'}
Bank: ${formData.bankName || '-'}
Status: Pending
Note: ${formData.note || '-'}
`.trim();

    try {
      await navigator.clipboard.writeText(receiptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore clipboard errors for now
    }
  };

  const handleCancel = async () => {
    if (!onCancel) return;
    setCancelling(true);
    try {
      await onCancel({ transactionId, formData });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="h-6 w-6 text-yellow-700" />
          </div>
        </div>
        <CardTitle className="text-lg text-yellow-700">
          {type === 'transfer' ? 'Transfer' : 'Withdrawal'} Pending
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your transaction is being processed. It may take a few minutes to complete.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-muted/30 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Transaction ID</span>
            <span className="text-sm font-mono font-medium">{transactionId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date & Time</span>
            <span className="text-sm">{timestamp}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              Pending
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Transaction Details</h4>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Recipient</span>
              <span className="text-sm font-medium">{formData.accountName || '-'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Account Number</span>
              <span className="text-sm font-mono">{formData.accountNumber || '-'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Bank</span>
              <span className="text-sm">{formData.bankName || '-'}</span>
            </div>

            {formData.note && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Note</span>
                <span className="text-sm">{formData.note}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-sm">${amount.toLocaleString()}</span>
          </div>

          {fee > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transaction Fee</span>
              <span className="text-sm">${fee.toLocaleString()}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total Amount</span>
            <span className="text-lg">${totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => {
            const blob = new Blob([`Transaction Receipt\n\nTransaction ID: ${transactionId}\nType: ${type === 'transfer' ? 'Money Transfer' : 'Withdrawal'}\nDate: ${timestamp}\nAmount: $${amount.toLocaleString()}\nRecipient: ${formData.accountName || '-'}\nAccount: ${formData.accountNumber || '-'}\nBank: ${formData.bankName || '-'}\nStatus: Pending\nNote: ${formData.note || '-'}`], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Transaction_Receipt_${transactionId}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}>
            <Share className="h-3 w-3" />
            Share
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => window.open('mailto:support@federaledgefinance.com')} className="flex-1" variant="ghost">
            Report issue
          </Button>

          <Button
            onClick={handleCancel}
            disabled={!onCancel || cancelling}
            className="flex-1"
            variant="destructive"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Transaction'}
          </Button>
        </div>

        {onRetry && (
          <Button onClick={() => onRetry({ transactionId, formData })} className="w-full">
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTransactionReceipt;
