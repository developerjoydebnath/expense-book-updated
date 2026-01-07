import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'default' | 'danger';
  loading?: boolean;
}

const ConfirmDialog = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'default',
  loading = false,
}: ConfirmDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={{ borderRadius: 12 }}>
        <Dialog.Title style={{ fontWeight: 'bold' }}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel} textColor="#BDBDBD" disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            loading={loading}
            disabled={loading}
            style={{ marginLeft: 8 }}
            buttonColor={type === 'danger' ? '#B00020' : '#7C4DFF'}
            textColor="#fff"
          >
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmDialog;
