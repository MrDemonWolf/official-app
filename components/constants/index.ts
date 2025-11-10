export const NAV_TABS = [
  { icon: '📝', label: 'Blog' },
  { icon: '💼', label: 'Portfolio' },
  { icon: '✉️', label: 'Contact' },
  { icon: '🐛', label: 'Debug' },
];

export const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: 'E-Commerce App',
    description:
      'A full-featured mobile commerce platform with real-time inventory management and secure payment processing.',
    technologies: ['React Native', 'Firebase', 'Stripe'],
    icon: '🛍️',
  },
  {
    id: 2,
    title: 'Social Media Platform',
    description:
      'Connect with others through a feature-rich social platform with real-time messaging and content sharing.',
    technologies: ['React Native', 'Node.js', 'PostgreSQL'],
    icon: '📱',
  },
  {
    id: 3,
    title: 'Fitness Tracker',
    description:
      'Track your fitness journey with detailed analytics, workout history, and personalized recommendations.',
    technologies: ['React Native', 'Expo', 'Cloud Storage'],
    icon: '💪',
  },
];

export const CONTACT_FORM_MESSAGES = {
  EMPTY_NAME: { title: 'Error', message: 'Please enter your name' },
  INVALID_EMAIL: { title: 'Error', message: 'Please enter a valid email address' },
  EMPTY_MESSAGE: { title: 'Error', message: 'Please enter a message' },
  SUCCESS: {
    title: 'Success',
    message: '✨ Message sent! Thank you for reaching out. I will get back to you soon.',
  },
  ERROR: { title: 'Error', message: 'Failed to send message. Please try again.' },
};

export const DEBUG_INFO = [
  {
    icon: '🎨',
    label: 'Current Theme',
    getValue: (colorScheme: string | null) =>
      colorScheme === 'dark'
        ? 'Dark Mode'
        : colorScheme === 'light'
          ? 'Light Mode'
          : 'System Default',
    color: 'blue',
  },
  {
    icon: '💾',
    label: 'Color Scheme Value',
    getValue: (colorScheme: string | null) => (colorScheme === null ? 'null' : `"${colorScheme}"`),
    color: 'purple',
  },
  {
    icon: '✓',
    label: 'Theme Detection',
    getValue: () => 'Active',
    color: 'green',
  },
];
