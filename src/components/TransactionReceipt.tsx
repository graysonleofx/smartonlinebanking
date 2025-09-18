import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Share, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface TransactionReceiptProps {
  type: 'transfer' | 'withdrawal';
  formData: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    amount: string;
    note?: string;
  };
  onClose: () => void;
}

const TransactionReceipt = ({ type, formData, onClose }: TransactionReceiptProps) => {
  const [copied, setCopied] = useState(false);
  
  const transactionId = `${type.toUpperCase()}${Date.now().toString().slice(-8)}`;
  const timestamp = new Date().toLocaleString();
  const fee = parseFloat(formData.amount) > 100000 ? 500 : 0;
  const totalAmount = parseFloat(formData.amount) + fee;

  const handleCopy = () => {
    const receiptText = `
Smart Bank - Transaction Receipt
Transaction ID: ${transactionId}
Type: ${type === 'transfer' ? 'Money Transfer' : 'Withdrawal'}
Date: ${timestamp}
Amount: ₦${parseFloat(formData.amount).toLocaleString()}
Recipient: ${formData.accountName}
Account: ${formData.accountNumber}
Bank: ${formData.bankName}
Status: Completed
    `.trim();
    
    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-lg text-green-600">
          {type === 'transfer' ? 'Transfer' : 'Withdrawal'} Successful
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your transaction has been completed successfully
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
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Completed
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Transaction Details</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Recipient</span>
              <span className="text-sm font-medium">{formData.accountName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Account Number</span>
              <span className="text-sm font-mono">{formData.accountNumber}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Bank</span>
              <span className="text-sm">{formData.bankName}</span>
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
            <span className="text-sm">₦{parseFloat(formData.amount).toLocaleString()}</span>
          </div>
          
          {fee > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transaction Fee</span>
              <span className="text-sm">₦{fee.toLocaleString()}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-medium">
            <span>Total Amount</span>
            <span className="text-lg">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            PDF
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share className="h-3 w-3" />
            Share
          </Button>
        </div>

        <Button onClick={onClose} className="w-full">
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransactionReceipt;