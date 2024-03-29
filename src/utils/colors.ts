export const buttons = {
  info: { basic: '#4f46e5', hover: '#6366f1' },
  danger: { basic: '#c81e1e', hover: '#971d1f' },
  neutral: { basic: '#6b7280', hover: '#4b5563' },
};

export function getNotificationIntent(level: number) {
  if (level > 40) {
    return 'danger';
  } else if (level === 40) {
    return 'primary';
  }
  return 'success';
}

export function getRowColor(level: number) {
  if (level > 40) {
    return 'pink';
  } else if (level === 40) {
    return 'lightyellow';
  }
  return 'lightgreen';
}
