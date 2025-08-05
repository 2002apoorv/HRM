import React, { useState } from 'react';
// 1:15:00 part 7 of the video shows how to create the settings tab have to veiw the code and write

const Setting = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New and Confirm Passwords do not match!");
      return;
    }

    // TODO: Add logic to actually update the password
    alert("Password changed successfully!");
    // Reset fields
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '100px auto',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: '22px',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    label: {
      fontSize: '14px',
      marginBottom: '6px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '16px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: 'rgb(76, 29, 149)',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleChangePassword}>
        <div style={styles.title}>Change Password</div>

        <label htmlFor="oldPassword" style={styles.label}>Old Password</label>
        <input
          type="password"
          id="oldPassword"
          placeholder="Change Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={styles.input}
          required
        />

        <label htmlFor="newPassword" style={styles.label}>New Password</label>
        <input
          type="password"
          id="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
          required
        />

        <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>Change Password</button>
      </form>
    </div>
  );
};

export default Setting;
