import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const showToast = useCallback((msg: string, t: ToastType = 'info') => {
    setMessage(msg);
    setType(t);
    setVisible(true);
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#E8F5E9';
      case 'error': return '#FFEBEE';
      case 'info': return '#E3F2FD';
      default: return '#fff';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success': return '#2E7D32';
      case 'error': return '#C62828';
      case 'info': return '#1565C0';
      default: return '#333';
    }
  };

  const getIcon = () => {
    const color = getTextColor();
    switch (type) {
      case 'success': return <CheckCircle2 size={20} color={color} />;
      case 'error': return <AlertCircle size={20} color={color} />;
      case 'info': return <Info size={20} color={color} />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={[styles.snackbar, { backgroundColor: getBackgroundColor() }]}
        wrapperStyle={styles.wrapper}
      >
        <View style={styles.content}>
          {getIcon()}
          <Text style={[styles.text, { color: getTextColor() }]}>{message}</Text>
        </View>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

const styles = StyleSheet.create({
  wrapper: {
    top: 50,
    bottom: undefined,
  },
  snackbar: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
