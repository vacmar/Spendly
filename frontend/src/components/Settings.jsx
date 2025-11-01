import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Download, Upload, Trash2, ArrowLeft, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Settings = ({ onBack }) => {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    expenseReminders: false,
    weeklyReports: true
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false });
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
    toast.success('Notification preference updated');
  };

  const handleExportData = async () => {
    try {
      setIsLoadingExpenses(true);
      setShowExportModal(true);
      
      // Fetch user data
      const userResponse = await api.getCurrentUser();
      const user = userResponse.user || userResponse;
      setUserData(user);
      
      // Fetch expenses
      const response = await api.getExpenses({ limit: 1000 });
      setExpenses(response.data || []);
      toast.success('Expense data loaded!');
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const handleExportPDF = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add app name
      doc.setFontSize(24);
      doc.setTextColor(109, 40, 217); // Purple color
      doc.text('Spendly', 14, 20);
      
      // Add user name
      doc.setFontSize(14);
      doc.setTextColor(50);
      doc.text(`Account: ${userData?.name || 'User'}`, 14, 30);
      
      // Add report title
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('Expense Report', 14, 40);
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 48);
      
      // Calculate totals
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Add summary
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Total Expenses: ${expenses.length}`, 14, 58);
      doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, 65);
      
      // Prepare table data
      const tableData = expenses.map(expense => [
        new Date(expense.date).toLocaleDateString(),
        expense.title || 'N/A',
        expense.category || 'N/A',
        `$${(expense.amount || 0).toFixed(2)}`,
        expense.description || '-'
      ]);
      
      // Add table
      autoTable(doc, {
        startY: 75,
        head: [['Date', 'Title', 'Category', 'Amount', 'Description']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [109, 40, 217],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 40 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 55 }
        }
      });
      
      // Save the PDF
      doc.save(`Spendly_Expenses_${userData?.name || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF: ' + error.message);
    }
  };

  const handleImportData = () => {
    // TODO: Implement import functionality
    toast.info('Import feature coming soon!');
  };

  const handleDeleteAccount = () => {
    setDeleteConfirm({ isOpen: true });
  };

  const confirmDeleteAccount = async () => {
    try {
      // Call API to delete account
      await api.deleteAccount();
      
      // Show success message
      toast.success('Account deleted successfully');
      
      // Clear modal
      setDeleteConfirm({ isOpen: false });
      setDeleteConfirmText('');
      
      // Logout and redirect
      logout();
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(error.message || 'Failed to delete account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Back Button */}
          {onBack && (
            <motion.button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </motion.button>
          )}
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          </div>
          <p className="text-gray-600">Manage your app preferences and account settings</p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Budget Alerts</p>
                <p className="text-sm text-gray-600">Get notified when you exceed your budget</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.budgetAlerts}
                  onChange={() => handleNotificationChange('budgetAlerts')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Expense Reminders</p>
                <p className="text-sm text-gray-600">Daily reminders to log your expenses</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.expenseReminders}
                  onChange={() => handleNotificationChange('expenseReminders')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Weekly Reports</p>
                <p className="text-sm text-gray-600">Get weekly summary of your spending</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.weeklyReports}
                  onChange={() => handleNotificationChange('weeklyReports')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Data Management</h2>
          <div className="space-y-3">
            <motion.button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Export Data (PDF)</p>
                <p className="text-sm text-purple-600">View expenses in table format and export as PDF</p>
              </div>
            </motion.button>

            <motion.button
              onClick={handleImportData}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Import Data</p>
                <p className="text-sm text-gray-600">Upload expenses from a CSV file</p>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
          <motion.button
            onClick={handleDeleteAccount}
            className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Export Expenses
                  </h2>
                  <p className="text-purple-100 mt-1">Preview and export your expense data</p>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
              {isLoadingExpenses ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : expenses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No expenses found to export</p>
                </div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-600 font-medium">Total Expenses</p>
                      <p className="text-2xl font-bold text-purple-700">{expenses.length}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-600 font-medium">Total Amount</p>
                      <p className="text-2xl font-bold text-purple-700">
                        ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-600 font-medium">Date Range</p>
                      <p className="text-sm font-semibold text-purple-700 mt-1">
                        {expenses.length > 0 && (
                          <>
                            {new Date(Math.min(...expenses.map(e => new Date(e.date)))).toLocaleDateString()}
                            {' - '}
                            {new Date(Math.max(...expenses.map(e => new Date(e.date)))).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-purple-600">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {expenses.map((expense, index) => (
                          <tr key={expense._id || index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {expense.title}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                              {expense.category}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-purple-600 text-right">
                              ${expense.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {expense.description || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExportPDF}
                disabled={expenses.length === 0}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Delete Account?</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                This action <strong className="text-red-600">cannot be undone</strong>. This will permanently delete your account, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                <li>All expenses and transactions</li>
                <li>All budgets and categories</li>
                <li>Your profile and settings</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">confirm</span> to proceed:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="Type 'confirm'"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  setDeleteConfirm({ isOpen: false });
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={confirmDeleteAccount}
                disabled={deleteConfirmText !== 'confirm'}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  deleteConfirmText === 'confirm'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={deleteConfirmText === 'confirm' ? { scale: 1.02 } : {}}
                whileTap={deleteConfirmText === 'confirm' ? { scale: 0.98 } : {}}
              >
                Delete Account
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
