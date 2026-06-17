import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { uploadAvatar } from '../services/authApi.js';

const Profile = () => {
  const { user, update, updatePassword, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [avatarMsg, setAvatarMsg] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, email: user.email });
  }, [user]);

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileLoading(true);
    try {
      await update(profileForm);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'danger', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordMsg({ type: 'danger', text: 'New passwords do not match' });
    }
    setPasswordLoading(true);
    try {
      await updatePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'danger', text: err.response?.data?.message || 'Password change failed' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setAvatarMsg({ type: 'danger', text: 'Image must be under 2MB' });
      return;
    }
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    const file = fileRef.current?.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setAvatarLoading(true);
    setAvatarMsg(null);
    try {
      await uploadAvatar(formData);
      await refreshUser();
      setAvatarMsg({ type: 'success', text: 'Avatar updated!' });
      setAvatarPreview(null);
    } catch (err) {
      setAvatarMsg({ type: 'danger', text: err.response?.data?.message || 'Upload failed' });
    } finally {
      setAvatarLoading(false);
    }
  };

  const avatarSrc = avatarPreview ||
    (user?.avatar ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${user.avatar}` : null);

  return (
    <div className="profile-page">
      <div className="container py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="profile-sidebar">
              <div className="text-center mb-4">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user?.name} className="avatar-xl mb-3" />
                ) : (
                  <div className="avatar-placeholder-xl mb-3">{getInitials(user?.name)}</div>
                )}
                <h5 className="fw-semibold mb-0">{user?.name}</h5>
                <p className="small text-muted">{user?.email}</p>
                <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                  {user?.role}
                </span>
              </div>
              <nav className="profile-nav">
                {[
                  { id: 'profile', icon: 'bi-person', label: 'Profile Info' },
                  { id: 'password', icon: 'bi-key', label: 'Change Password' },
                  { id: 'avatar', icon: 'bi-image', label: 'Update Avatar' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <i className={`bi ${tab.icon} me-2`}></i>{tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-9">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="profile-card">
                <h5 className="profile-card-title">
                  <i className="bi bi-person-circle me-2"></i>Profile Information
                </h5>
                {profileMsg && (
                  <div className={`alert alert-${profileMsg.type} d-flex align-items-center gap-2`}>
                    <i className={`bi ${profileMsg.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}-fill`}></i>
                    {profileMsg.text}
                  </div>
                )}
                <form onSubmit={handleProfileSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                        required
                        minLength={2}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <input type="text" className="form-control" value={user?.role} disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Member Since</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                      {profileLoading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check2 me-2"></i>Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="profile-card">
                <h5 className="profile-card-title">
                  <i className="bi bi-key me-2"></i>Change Password
                </h5>
                {passwordMsg && (
                  <div className={`alert alert-${passwordMsg.type} d-flex align-items-center gap-2`}>
                    <i className={`bi ${passwordMsg.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}-fill`}></i>
                    {passwordMsg.text}
                  </div>
                )}
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      className="form-control"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      className="form-control"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      className="form-control"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-check mb-4">
                    <input type="checkbox" id="showPwd" className="form-check-input" checked={showPasswords} onChange={() => setShowPasswords((p) => !p)} />
                    <label htmlFor="showPwd" className="form-check-label">Show passwords</label>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                    {passwordLoading ? <><span className="spinner-border spinner-border-sm me-2" />Updating...</> : <><i className="bi bi-lock me-2"></i>Update Password</>}
                  </button>
                </form>
              </div>
            )}

            {/* Avatar Tab */}
            {activeTab === 'avatar' && (
              <div className="profile-card">
                <h5 className="profile-card-title">
                  <i className="bi bi-image me-2"></i>Update Avatar
                </h5>
                {avatarMsg && (
                  <div className={`alert alert-${avatarMsg.type} d-flex align-items-center gap-2`}>
                    <i className={`bi ${avatarMsg.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}-fill`}></i>
                    {avatarMsg.text}
                  </div>
                )}
                <div className="text-center mb-4">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Avatar preview" className="avatar-xxl mb-3" />
                  ) : (
                    <div className="avatar-placeholder-xxl mb-3">{getInitials(user?.name)}</div>
                  )}
                  <p className="text-muted small">JPEG, PNG or WebP · Max 2MB</p>
                </div>
                <div className="mb-3">
                  <input
                    type="file"
                    ref={fileRef}
                    className="form-control"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAvatarUpload}
                  disabled={avatarLoading || !avatarPreview}
                >
                  {avatarLoading ? <><span className="spinner-border spinner-border-sm me-2" />Uploading...</> : <><i className="bi bi-cloud-upload me-2"></i>Upload Avatar</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
