import { useState } from 'react';
import { Helmet } from 'react-helmet';
import './ProfilePage.css';

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    address: 'ул. Примерная, д. 1, кв. 1',
    preferences: {
      allergies: ['Орехи', 'Молочные продукты'],
      diet: 'Вегетарианская',
      notifications: true
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(userData);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  return (
    <>
      <Helmet>
        <title>FOODAI - Профиль</title>
      </Helmet>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              <img src="https://images2.imgbox.com/31/70/qyh5fZ87_o.png" alt="Аватар" />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-email">{userData.email}</p>
            </div>
            {!isEditing && (
              <button className="edit-button" onClick={handleEdit}>
                Редактировать
              </button>
            )}
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h2 className="section-title">Личная информация</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Имя</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="info-input"
                    />
                  ) : (
                    <p className="info-value">{userData.name}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="info-input"
                    />
                  ) : (
                    <p className="info-value">{userData.email}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Телефон</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="info-input"
                    />
                  ) : (
                    <p className="info-value">{userData.phone}</p>
                  )}
                </div>
                <div className="info-item">
                  <label className="info-label">Адрес доставки</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="info-input"
                    />
                  ) : (
                    <p className="info-value">{userData.address}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2 className="section-title">Предпочтения</h2>
              <div className="preferences-grid">
                <div className="preference-item">
                  <label className="preference-label">Аллергии</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.preferences.allergies.join(', ')}
                      onChange={(e) => handlePreferenceChange('allergies', e.target.value.split(', '))}
                      className="preference-input"
                      placeholder="Введите аллергии через запятую"
                    />
                  ) : (
                    <p className="preference-value">
                      {userData.preferences.allergies.join(', ') || 'Не указаны'}
                    </p>
                  )}
                </div>
                <div className="preference-item">
                  <label className="preference-label">Тип питания</label>
                  {isEditing ? (
                    <select
                      value={editData.preferences.diet}
                      onChange={(e) => handlePreferenceChange('diet', e.target.value)}
                      className="preference-select"
                    >
                      <option value="Обычная">Обычная</option>
                      <option value="Вегетарианская">Вегетарианская</option>
                      <option value="Веганская">Веганская</option>
                      <option value="Кето">Кето</option>
                      <option value="Безглютеновая">Безглютеновая</option>
                    </select>
                  ) : (
                    <p className="preference-value">{userData.preferences.diet}</p>
                  )}
                </div>
                <div className="preference-item">
                  <label className="preference-label">Уведомления</label>
                  {isEditing ? (
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={editData.preferences.notifications}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  ) : (
                    <p className="preference-value">
                      {userData.preferences.notifications ? 'Включены' : 'Отключены'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="profile-actions">
                <button className="save-button" onClick={handleSave}>
                  Сохранить
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Отмена
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
