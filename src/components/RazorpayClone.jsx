import { useState } from 'react';
import { CreditCard, Building2, Smartphone, X, Shield, ChevronRight } from 'lucide-react';

export default function RazorpayClone() {
  const [showModal, setShowModal] = useState(false);
  const [activeMethod, setActiveMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const amount = 1299.00;
  const merchant = "Demo Store";

  const styles = {
    container: {
      minHeight: '100%s',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
      padding: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex:'9999'
    },
    card: {
      maxWidth: '448px',
      width: '100%'
    },
    cardInner: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '32px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#4b5563',
      marginBottom: '24px'
    },
    amountBox: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    amountLabel: {
      color: '#4b5563'
    },
    amountValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    payButton: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: 'white',
      fontWeight: '600',
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background-color 0.2s'
    },
    modal: {
      position: 'fixed',
      inset: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: '50'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maxWidth: '512px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalHeader: {
      position: 'sticky',
      top: '0',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937'
    },
    modalAmount: {
      fontSize: '14px',
      color: '#4b5563'
    },
    closeButton: {
      color: '#9ca3af',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    modalBody: {
      padding: '24px'
    },
    tabContainer: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    tab: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      borderBottom: '2px solid',
      borderBottomColor: isActive ? '#2563eb' : 'transparent',
      color: isActive ? '#2563eb' : '#4b5563',
      background: 'none',
      border: 'none',
      borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontWeight: '500'
    }),
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    gridTwo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    infoBox: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '8px',
      padding: '16px'
    },
    infoText: {
      fontSize: '14px',
      color: '#1e40af'
    },
    bankButton: {
      width: '100%',
      textAlign: 'left',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    submitButton: (disabled) => ({
      width: '100%',
      backgroundColor: disabled ? '#9ca3af' : '#2563eb',
      color: 'white',
      fontWeight: '600',
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s',
      marginTop: '24px'
    }),
    securityBadge: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px',
      color: '#6b7280',
      fontSize: '14px'
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      alert('Payment Successful! ✓\nThis is a demo payment.');
      setShowModal(false);
      // Reset form
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCardName('');
      setUpiId('');
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardInner}>
          <h1 style={styles.title}>{merchant}</h1>
          <p style={styles.subtitle}>Complete your purchase</p>
          
          <div style={styles.amountBox}>
            <span style={styles.amountLabel}>Amount to pay</span>
            <span style={styles.amountValue}>₹{amount.toFixed(2)}</span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={styles.payButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Pay Now
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{merchant}</h2>
                <p style={styles.modalAmount}>₹{amount.toFixed(2)}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={styles.closeButton}
                onMouseEnter={(e) => e.target.style.color = '#4b5563'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                <X size={24} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.tabContainer}>
                <button
                  onClick={() => setActiveMethod('card')}
                  style={styles.tab(activeMethod === 'card')}
                  onMouseEnter={(e) => {
                    if (activeMethod !== 'card') e.target.style.color = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    if (activeMethod !== 'card') e.target.style.color = '#4b5563';
                  }}
                >
                  <CreditCard size={20} />
                  <span>Card</span>
                </button>
                <button
                  onClick={() => setActiveMethod('upi')}
                  style={styles.tab(activeMethod === 'upi')}
                  onMouseEnter={(e) => {
                    if (activeMethod !== 'upi') e.target.style.color = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    if (activeMethod !== 'upi') e.target.style.color = '#4b5563';
                  }}
                >
                  <Smartphone size={20} />
                  <span>UPI</span>
                </button>
                <button
                  onClick={() => setActiveMethod('netbanking')}
                  style={styles.tab(activeMethod === 'netbanking')}
                  onMouseEnter={(e) => {
                    if (activeMethod !== 'netbanking') e.target.style.color = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    if (activeMethod !== 'netbanking') e.target.style.color = '#4b5563';
                  }}
                >
                  <Building2 size={20} />
                  <span>Netbanking</span>
                </button>
              </div>

              {activeMethod === 'card' && (
                <div style={styles.formContainer}>
                  <div>
                    <label style={styles.label}>Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      style={styles.input}
                      onFocus={(e) => e.target.style.outline = '2px solid #3b82f6'}
                      onBlur={(e) => e.target.style.outline = 'none'}
                    />
                  </div>
                  <div style={styles.gridTwo}>
                    <div>
                      <label style={styles.label}>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="12/25"
                        maxLength="5"
                        style={styles.input}
                        onFocus={(e) => e.target.style.outline = '2px solid #3b82f6'}
                        onBlur={(e) => e.target.style.outline = 'none'}
                      />
                    </div>
                    <div>
                      <label style={styles.label}>CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                        placeholder="123"
                        maxLength="3"
                        style={styles.input}
                        onFocus={(e) => e.target.style.outline = '2px solid #3b82f6'}
                        onBlur={(e) => e.target.style.outline = 'none'}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={styles.label}>Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="JOHN DOE"
                      style={{...styles.input, textTransform: 'uppercase'}}
                      onFocus={(e) => e.target.style.outline = '2px solid #3b82f6'}
                      onBlur={(e) => e.target.style.outline = 'none'}
                    />
                  </div>
                </div>
              )}

              {activeMethod === 'upi' && (
                <div style={styles.formContainer}>
                  <div>
                    <label style={styles.label}>UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      style={styles.input}
                      onFocus={(e) => e.target.style.outline = '2px solid #3b82f6'}
                      onBlur={(e) => e.target.style.outline = 'none'}
                    />
                  </div>
                  <div style={styles.infoBox}>
                    <p style={styles.infoText}>
                      Enter your UPI ID and verify the payment on your UPI app
                    </p>
                  </div>
                </div>
              )}

              {activeMethod === 'netbanking' && (
                <div style={styles.formContainer}>
                  <p style={{fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px'}}>
                    Select your bank
                  </p>
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'].map((bank) => (
                    <button
                      key={bank}
                      style={styles.bankButton}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.backgroundColor = '#eff6ff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.backgroundColor = 'white';
                      }}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={processing}
                style={styles.submitButton(processing)}
                onMouseEnter={(e) => {
                  if (!processing) e.target.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  if (!processing) e.target.style.backgroundColor = '#2563eb';
                }}
              >
                {processing ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
              </button>

              <div style={styles.securityBadge}>
                <Shield size={16} />
                <span>Secured by Razorpay (Demo)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}