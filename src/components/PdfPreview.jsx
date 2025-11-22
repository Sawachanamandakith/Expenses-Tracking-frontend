import React, { useRef } from 'react';
import { Button, Modal, message } from 'antd';
import { MdDownload, MdClose } from 'react-icons/md';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfPreview = ({ 
  visible, 
  onClose, 
  transactions, 
  filters, 
  totals, 
  userName,
  onDownload 
}) => {
  const pdfRef = useRef();

  const handleDownloadPDF = async () => {
    try {
      message.loading('Generating PDF...', 0);
      
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Transaction_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      message.destroy();
      message.success('PDF downloaded successfully!');
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      message.destroy();
      message.error('Failed to generate PDF: ' + error.message);
      console.error('PDF generation error:', error);
    }
  };

  return (
    <Modal
      title="PDF Preview"
      open={visible}
      onCancel={onClose}
      width="90%"
      style={{ maxWidth: 1200 }}
      footer={[
        <Button key="close" onClick={onClose} icon={<MdClose />}>
          Close
        </Button>,
        <Button 
          key="download" 
          type="primary" 
          onClick={handleDownloadPDF}
          icon={<MdDownload />}
          style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
        >
          Download PDF
        </Button>
      ]}
    >
      {/* PDF Content */}
      <div ref={pdfRef} className="p-4 bg-white pdf-content">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Transaction Report</h1>
          <p className="text-gray-600">Generated for: {userName}</p>
          <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800">Total Income</h3>
            <p className="text-xl font-bold text-green-900">
              Rs. {formatCurrency(totals.income)}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800">Total Expense</h3>
            <p className="text-xl font-bold text-red-900">
              Rs. {formatCurrency(totals.expense)}
            </p>
          </div>
          <div className={`p-4 rounded-lg border ${
            totals.balance >= 0 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`font-semibold ${
              totals.balance >= 0 ? 'text-blue-800' : 'text-red-800'
            }`}>
              {totals.balance >= 0 ? 'Balance' : 'In Debt'}
            </h3>
            <p className={`text-xl font-bold ${
              totals.balance >= 0 ? 'text-blue-900' : 'text-red-900'
            }`}>
              Rs. {formatCurrency(Math.abs(totals.balance))}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">Date</th>
                <th className="border border-gray-300 p-2 text-left">Type</th>
                <th className="border border-gray-300 p-2 text-left">Category</th>
                <th className="border border-gray-300 p-2 text-left">Amount</th>
                <th className="border border-gray-300 p-2 text-left">Note</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{transaction.name}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type?.toLowerCase() === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2">{transaction.category}</td>
                  <td className="border border-gray-300 p-2 font-semibold">
                    Rs. {formatCurrency(transaction.amount)}
                  </td>
                  <td className="border border-gray-300 p-2 max-w-xs truncate">
                    {transaction.note || '-'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status?.toLowerCase() === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions to display
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
          Generated by Expense Tracker App
        </div>
      </div>
    </Modal>
  );
};

// Helper function for currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export default PdfPreview;