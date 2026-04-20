export function calculateAge(year: number): number {
  return new Date().getFullYear() - year;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getEquipmentConditionColor(condition: string): string {
  switch (condition) {
    case 'Excellent': return 'text-emerald-400 bg-emerald-400/10';
    case 'Good': return 'text-blue-400 bg-blue-400/10';
    case 'Fair': return 'text-yellow-400 bg-yellow-400/10';
    case 'Poor': return 'text-red-400 bg-red-400/10';
    default: return 'text-zinc-400 bg-zinc-400/10';
  }
}

export function getAgeGroupColor(ageGroup: string): string {
  if (ageGroup.includes('Teens')) return 'text-blue-400 bg-blue-400/10';
  if (ageGroup.includes('Adults')) return 'text-emerald-400 bg-emerald-400/10';
  if (ageGroup.includes('Seniors')) return 'text-orange-400 bg-orange-400/10';
  return 'text-zinc-400 bg-zinc-400/10';
}

export function getMembershipColor(plan: string): string {
  switch (plan) {
    case 'Annual': return 'text-purple-400 bg-purple-400/10';
    case 'Half-Yearly': return 'text-blue-400 bg-blue-400/10';
    case 'Quarterly': return 'text-emerald-400 bg-emerald-400/10';
    case 'Monthly': return 'text-yellow-400 bg-yellow-400/10';
    default: return 'text-zinc-400 bg-zinc-400/10';
  }
}

export function getGoalColor(goal: string): string {
  switch (goal) {
    case 'Muscle Building': return 'text-red-400 bg-red-400/10';
    case 'Weight Loss': return 'text-orange-400 bg-orange-400/10';
    case 'General Fitness': return 'text-emerald-400 bg-emerald-400/10';
    case 'Strength Training': return 'text-blue-400 bg-blue-400/10';
    case 'Flexibility & Mobility': return 'text-purple-400 bg-purple-400/10';
    default: return 'text-zinc-400 bg-zinc-400/10';
  }
}

export const GYM_SLUGS: Record<string, { name: string; color: string; logo: string }> = {
  'atom-fit': { name: 'Atom Fit', color: 'from-red-600 to-red-900', logo: '⚡' },
  'pulse-fit': { name: 'Pulse Fit', color: 'from-orange-600 to-red-800', logo: '💓' },
  'power-fit': { name: 'Power Fit', color: 'from-rose-600 to-red-900', logo: '💪' },
  'impact-fit': { name: 'Impact Fit', color: 'from-crimson-600 to-red-950', logo: '🔥' },
};

export const EXPENSE_CATEGORIES = [
  'Equipment', 'Salary', 'Utilities', 'Marketing', 'Maintenance', 'Other'
];

export const FITNESS_GOALS = [
  'Muscle Building',
  'Weight Loss',
  'General Fitness',
  'Strength Training',
  'Flexibility & Mobility',
];

export const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const MOTIVATION_LEVELS = ['Goal-Oriented', 'Casual/Recreational', 'Medical/Rehab'];
export const PERSONALITIES = ['Planner', 'Solo Trainer', 'Social Gym-Goer'];
export const MEMBERSHIP_PLANS = ['Monthly', 'Quarterly', 'Half-Yearly', 'Annual'];
export const AGE_GROUPS = ['Teens (16-19)', 'Adults (20-40)', 'Seniors (40+)'];
export const GENDERS = ['Male', 'Female', 'Other'];
export const HEALTH_CONDITIONS = ['Aged/Senior', 'Diabetic', 'Knee Pain/Joint Pain'];
export const EQUIPMENT_CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];
export const TARGET_AUDIENCES = ['ALL', 'TRAINERS', 'MEMBERS'];
