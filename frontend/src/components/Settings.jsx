import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Download, Upload, Trash2, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    expenseReminders: false,
    weeklyReports: true
  });
  const [theme, setTheme] = useState('light');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false });

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
    toast.success('Notification preference updated');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    toast.success('Exporting your data...');
    // Simulate export
    setTimeout(() => {
      toast.success('Data exported successfully!');
    }, 1500);
  };

  const handleImportData = () => {
    // TODO: Implement import functionality
    toast.info('Import feature coming soon!');
  };

  const handleDeleteAccount = () => {
    setDeleteConfirm({ isOpen: true });
  };

  const confirmDeleteAccount = () => {
    // TODO: Implement account deletion
    toast.error('Account deletion not yet implemented');
    setDeleteConfirm({ isOpen: false });
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

        {/* Theme */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            {theme === 'light' ? (
              <Sun className="w-6 h-6 text-purple-600" />
            ) : (
              <Moon className="w-6 h-6 text-purple-600" />
            )}
            <h2 className="text-xl font-bold text-gray-800">Appearance</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 bg-white hover:border-purple-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sun className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-center font-medium">Light Mode</p>
            </motion.button>
            <motion.button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 bg-white hover:border-purple-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Moon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-center font-medium">Dark Mode</p>
            </motion.button>
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
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-purple-600">Download all your expenses and budgets</p>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={confirmDeleteAccount}
        title="Delete Account?"
        message="Are you absolutely sure? This action cannot be undone. All your expenses, budgets, and data will be permanently deleted."
        confirmText="Delete Account"
        variant="danger"
      />
    </div>
  );
};

export default Settings;
