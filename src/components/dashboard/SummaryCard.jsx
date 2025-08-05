import React from 'react'

export const SummaryCard = ({ icon, text, number, bgColor = "rgba(34, 197, 94, 0.3)" }) => {
  const styles = {
    card: {
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 15px rgba(44,62,80,0.08)',
      padding: '1.5rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
      minWidth: '220px',
      minHeight: '110px',
      fontFamily: 'Inter, sans-serif',
    },
    iconBox: {
      width: '48px',
      height: '48px',
      borderRadius: '10px',
      background: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: '#4c1d95',
      fontWeight: 700,
      flexShrink: 0,
      boxShadow: '0 0 10px rgba(44,62,80,0.08)',
    },
    textBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    label: {
      color: '#23272F',
      fontWeight: 500,
      fontSize: '1.05rem',
      marginBottom: '0.3rem',
    },
    number: {
      color: '#23272F',
      fontWeight: 700,
      fontSize: '1.5rem',
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.iconBox}>
        {icon}
      </div>
      <div style={styles.textBox}>
        <p style={styles.label}>{text}</p>
        <p style={styles.number}>{number}</p>
      </div>
    </div>
  )
}