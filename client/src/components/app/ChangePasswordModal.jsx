import { useEffect, useState } from 'react';

function ChangePasswordModal({ isOpen, isDark, onClose, onSave }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isCurrentValid = form.currentPassword.trim().length > 0;
  const isNewValid = form.newPassword.length >= 6;
  const isConfirmValid = form.confirmPassword.length > 0 && form.newPassword === form.confirmPassword;
  const isFormValid = isCurrentValid && isNewValid && isConfirmValid;

  useEffect(() => {
    if (!isOpen) return;
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrorMessage('');
    setIsSaving(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!isFormValid || isSaving) return;

    setIsSaving(true);
    setErrorMessage('');

    const updated = await onSave({ currentPassword: form.currentPassword, newPassword: form.newPassword });

    if (updated) {
      setIsSaving(false);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      onClose();
      return;
    }

    setErrorMessage('Unable to update password. Please check your current password and try again.');
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <form
        onSubmit={submit}
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
          isDark ? 'border-white/10 bg-[#111] text-white' : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        <h2 className="text-xl font-bold tracking-tight">Change Password</h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Update your password securely.</p>

        <div className="mt-5 grid grid-cols-1 gap-4">
          <label className="text-sm font-medium" htmlFor="profile-current-password">
            Current Password
            <input
              id="profile-current-password"
              type="password"
              value={form.currentPassword}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, currentPassword: event.target.value }));
                if (errorMessage) setErrorMessage('');
              }}
              className={`mt-2 w-full rounded-xl border px-3 py-2.5 outline-none transition ${
                isDark
                  ? 'border-white/20 bg-white/[0.04] text-white focus:border-[#f15a0f] focus:ring-2 focus:ring-[#f15a0f]/30'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-[#f15a0f] focus:ring-2 focus:ring-[#f15a0f]/30'
              }`}
            />
          </label>

          <label className="text-sm font-medium" htmlFor="profile-new-password">
            New Password
            <input
              id="profile-new-password"
              type="password"
              value={form.newPassword}
              onChange={(event) => {
                const value = event.target.value;
                setForm((prev) => ({ ...prev, newPassword: value }));
                if (errorMessage) setErrorMessage('');
              }}
              className={`mt-2 w-full rounded-xl border px-3 py-2.5 outline-none transition ${
                isDark
                  ? 'border-white/20 bg-white/[0.04] text-white focus:border-[#f15a0f] focus:ring-2 focus:ring-[#f15a0f]/30'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-[#f15a0f] focus:ring-2 focus:ring-[#f15a0f]/30'
              }`}
            />
            <p className={`mt-1 text-xs ${isNewValid || form.newPassword.length === 0 ? (isDark ? 'text-white/55' : 'text-slate-500') : 'text-rose-500'}`}>
              Minimum 6 characters required.
            </p>
          </label>

          <label className="text-sm font-medium" htmlFor="profile-confirm-password">
            Confirm New Password
            <input
              id="profile-confirm-password"
              type="password"
              value={form.confirmPassword}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, confirmPassword: event.target.value }));
                if (errorMessage) setErrorMessage('');
              }}
              className={`mt-2 w-full rounded-xl border px-3 py-2.5 outline-none transition ${
                isDark
                  ? 'border-white/20 bg-white/[0.04] text-white focus:border-[#f15a0f] focus:ring-2 focus:ring-[#f15a0f]/30'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-[#f15a0f] focus:ring-2 focus:ring-[#f15a0f]/30'
              }`}
            />
            {!isConfirmValid && form.confirmPassword.length > 0 && <p className="mt-1 text-xs text-rose-500">Passwords do not match.</p>}
          </label>
        </div>

        {errorMessage && <p className="mt-3 text-sm text-rose-500">{errorMessage}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              isDark ? 'bg-white/10 text-white hover:bg-white/15 disabled:opacity-50' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSaving}
            className="rounded-xl bg-[#f15a0f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#de5009] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePasswordModal;
