export interface FoodItem {
  name: string;
  examples?: string[];
}

export interface FoodSubcategory {
  name: string;
  items: string[];
}

export interface FoodCategory {
  id: string;
  name: string;
  purpose: string;
  icon: string;
  color: string;
  subcategories?: FoodSubcategory[];
  items?: string[];
  bestFor?: string;
  timing?: string;
  note?: string;
}

export interface DietByGoal {
  goal: string;
  icon: string;
  color: string;
  principles: string[];
  sampleMeal: string;
  foods: {
    include: string[];
    avoid: string[];
  };
}

export interface FoodByHealthCondition {
  condition: string;
  conditionKey: string;
  icon: string;
  color: string;
  focus: string[];
  recommended: { category: string; items: string[] }[];
  avoid: string[];
  gymTips: { do: string[]; avoid: string[] };
}

// Main food categories
export const foodCategories: FoodCategory[] = [
  {
    id: 'protein',
    name: 'Protein-Rich Foods',
    purpose: 'Muscle repair, growth & recovery',
    icon: '🥩',
    color: 'from-red-900 to-red-800',
    subcategories: [
      {
        name: 'Animal Protein',
        items: ['Eggs', 'Chicken breast', 'Fish (tuna, salmon, rohu)', 'Lean mutton', 'Milk', 'Curd', 'Paneer', 'Whey protein'],
      },
      {
        name: 'Plant Protein',
        items: ['Lentils (dal)', 'Chickpeas (channa)', 'Rajma', 'Soy chunks / Tofu', 'Peanuts', 'Quinoa'],
      },
    ],
    bestFor: 'Muscle gain, Strength training',
  },
  {
    id: 'carbs',
    name: 'Carbohydrate-Rich Foods',
    purpose: 'Fuel workouts & improve performance',
    icon: '🌾',
    color: 'from-amber-900 to-amber-800',
    subcategories: [
      {
        name: 'Complex Carbs (Preferred)',
        items: ['Brown rice', 'Oats', 'Whole wheat chapati', 'Millets (ragi, jowar, bajra)', 'Sweet potato', 'Quinoa'],
      },
      {
        name: 'Simple Carbs (Use Carefully)',
        items: ['White rice', 'White bread', 'Sugar', 'Honey', 'Fruit juices'],
      },
    ],
    bestFor: 'Pre-workout energy, Endurance',
  },
  {
    id: 'fats',
    name: 'Healthy Fats',
    purpose: 'Hormonal balance, joint lubrication & nutrient absorption',
    icon: '🥑',
    color: 'from-emerald-900 to-emerald-800',
    items: ['Almonds', 'Walnuts', 'Cashews', 'Chia seeds', 'Flax seeds', 'Pumpkin seeds', 'Peanut butter (natural)', 'Olive oil', 'Ghee (in moderation)', 'Avocado', 'Fatty fish'],
    bestFor: 'Overall fitness, Recovery',
  },
  {
    id: 'fiber',
    name: 'Fiber-Rich Foods',
    purpose: 'Gut health, satiety & fat control',
    icon: '🥦',
    color: 'from-green-900 to-green-800',
    items: ['Spinach', 'Broccoli', 'Beans', 'Carrot', 'Apple', 'Papaya', 'Pear', 'Berries', 'Whole grains', 'Salads', 'Sprouts'],
    bestFor: 'Weight loss, Digestive health',
  },
  {
    id: 'pre-workout',
    name: 'Pre-Workout Foods',
    purpose: 'Energy boost before training',
    icon: '⚡',
    color: 'from-yellow-900 to-yellow-800',
    items: ['Banana + peanut butter', 'Oats with milk', 'Black coffee', 'Fruit + handful of nuts', 'Boiled potatoes'],
    timing: '30–90 mins before workout',
    note: 'Focus: Carbs + light protein, low fat',
    bestFor: 'Pre-workout performance',
  },
  {
    id: 'post-workout',
    name: 'Post-Workout Foods',
    purpose: 'Recovery & muscle repair',
    icon: '🔄',
    color: 'from-blue-900 to-blue-800',
    items: ['Whey protein with banana', 'Eggs + toast', 'Chicken + rice', 'Paneer / Tofu + roti', 'Curd with fruits'],
    timing: 'Within 30–60 mins after workout',
    note: 'Focus: Protein + carbs combo',
    bestFor: 'Recovery, Muscle repair',
  },
  {
    id: 'hydration',
    name: 'Hydration & Recovery',
    purpose: 'Prevent cramps & dehydration',
    icon: '💧',
    color: 'from-cyan-900 to-cyan-800',
    items: ['Water (3-4L daily)', 'Coconut water', 'Lemon water', 'Buttermilk', 'Electrolytes (when needed)'],
    bestFor: 'All fitness goals',
  },
  {
    id: 'avoid',
    name: 'Foods to Limit / Avoid',
    purpose: 'Especially important for fat loss goals',
    icon: '❌',
    color: 'from-zinc-800 to-zinc-900',
    items: ['Fried foods', 'Sugary drinks & soft drinks', 'Bakery items & pastries', 'Junk food & fast food', 'Excess alcohol', 'White bread & refined flour', 'Processed meats'],
    bestFor: '(Minimize these)',
  },
];

// Diet by fitness goal
export const dietByGoal: DietByGoal[] = [
  {
    goal: 'Muscle Building',
    icon: '💪',
    color: 'from-red-800 to-red-950',
    principles: ['High protein (1.6–2.2g per kg body weight)', 'Moderate to high carbs', 'Healthy fats', 'Calorie surplus (300–500 kcal above maintenance)'],
    sampleMeal: '🍗 Chicken + 🍚 Brown rice + 🥦 Steamed vegetables',
    foods: {
      include: ['Chicken breast', 'Eggs', 'Whey protein', 'Brown rice', 'Sweet potato', 'Oats', 'Milk & paneer', 'Nuts & seeds', 'Fish (salmon, tuna)', 'Whole wheat chapati'],
      avoid: ['Sugary drinks', 'Junk food', 'Fried items', 'Excess processed food'],
    },
  },
  {
    goal: 'Weight Loss',
    icon: '🔥',
    color: 'from-orange-800 to-red-950',
    principles: ['High protein (preserves muscle)', 'High fiber (keeps full longer)', 'Low sugar & refined carbs', 'Calorie deficit (300–500 kcal below maintenance)'],
    sampleMeal: '🥗 Salad + 🧀 Paneer / Tofu + 🫒 Olive oil dressing',
    foods: {
      include: ['Eggs', 'Dal & legumes', 'Leafy vegetables', 'Low-fat curd', 'Sprouts', 'Fruits (apple, guava, pear)', 'Chicken (grilled)', 'Oats', 'Millets', 'Lemon water'],
      avoid: ['White rice (large portions)', 'Sugary drinks', 'Fried foods', 'Bakery items', 'Fruit juices', 'High-calorie snacks'],
    },
  },
  {
    goal: 'General Fitness',
    icon: '🏃',
    color: 'from-emerald-800 to-green-950',
    principles: ['Balanced protein, carbs & fats', 'Clean whole foods', 'Moderate portions', 'Consistent eating schedule'],
    sampleMeal: '🍱 Dal + 🫓 Chapati + 🥗 Sabzi + 🥛 Curd',
    foods: {
      include: ['Whole grains', 'Seasonal vegetables', 'Dal & lentils', 'Eggs or paneer', 'Fruits', 'Curd & milk', 'Nuts (small portion)', 'Coconut water'],
      avoid: ['Excess junk food', 'Sugary drinks', 'Late night heavy meals', 'Processed snacks'],
    },
  },
  {
    goal: 'Strength Training',
    icon: '🏋️',
    color: 'from-blue-800 to-indigo-950',
    principles: ['Very high protein', 'High carbs for energy', 'Strategic meal timing', 'Creatine supplementation (optional)'],
    sampleMeal: '🥩 Mutton/Chicken + 🍚 White/Brown rice + 🥛 Whey protein shake',
    foods: {
      include: ['Red meat (lean)', 'Chicken', 'Fish', 'Eggs (5-6/day)', 'Rice', 'Oats', 'Sweet potato', 'Milk', 'Whey protein', 'Casein protein'],
      avoid: ['Empty calorie foods', 'Alcohol (impairs recovery)', 'Excess fiber before workout', 'High fat pre-workout meals'],
    },
  },
  {
    goal: 'Flexibility & Mobility',
    icon: '🧘',
    color: 'from-purple-800 to-purple-950',
    principles: ['Anti-inflammatory diet', 'High hydration', 'Collagen-supporting nutrients', 'Moderate protein for tissue repair'],
    sampleMeal: '🐟 Grilled fish + 🥦 Steamed vegetables + 🌿 Turmeric milk at night',
    foods: {
      include: ['Turmeric (anti-inflammatory)', 'Ginger & garlic', 'Fatty fish (omega-3)', 'Leafy greens', 'Berries', 'Coconut water', 'Bone broth', 'Sesame seeds', 'Flax seeds'],
      avoid: ['Refined sugar (increases inflammation)', 'Processed foods', 'Excess caffeine', 'Alcohol'],
    },
  },
];

// Food by health condition
export const foodByHealthCondition: FoodByHealthCondition[] = [
  {
    condition: 'Aged / Senior Citizens (40+)',
    conditionKey: 'aged',
    icon: '🧓',
    color: 'from-amber-800 to-amber-950',
    focus: ['Easy digestion', 'Bone strength (Calcium & Vitamin D)', 'Muscle maintenance', 'Heart health', 'Joint support'],
    recommended: [
      { category: 'Protein (Easy to digest)', items: ['Milk, curd, buttermilk', 'Paneer (limited)', 'Boiled/omelette eggs', 'Soft dal, moong dal', 'Steamed/grilled fish'] },
      { category: 'Carbohydrates', items: ['Red rice / Brown rice', 'Millets (ragi, jowar)', 'Soft chapati', 'Boiled sweet potato'] },
      { category: 'Healthy Fats', items: ['Nuts (small quantity)', 'Flax seeds, Chia seeds', 'Ghee (½–1 tsp/day)'] },
      { category: 'Fruits & Vegetables', items: ['Papaya, Apple, Banana (small)', 'Spinach, Bottle gourd, Carrot, Pumpkin'] },
    ],
    avoid: ['Very spicy food', 'Deep-fried food', 'Excess salt', 'Raw hard vegetables (hard to digest)', 'Carbonated drinks'],
    gymTips: {
      do: ['Light strength training', 'Walking & cycling', 'Swimming (best for joints)', 'Resistance bands', 'Yoga & stretching'],
      avoid: ['Heavy squats initially', 'High-impact jumping', 'Overtraining', 'Lifting too heavy without guidance'],
    },
  },
  {
    condition: 'Sugar Patients (Diabetes)',
    conditionKey: 'diabetic',
    icon: '🩸',
    color: 'from-blue-800 to-blue-950',
    focus: ['Low glycemic index (GI) foods', 'Stable blood sugar levels', 'High fiber & protein', 'Controlled portions'],
    recommended: [
      { category: 'Proteins', items: ['Eggs', 'Paneer (low fat)', 'Grilled fish / chicken', 'Sprouts', 'Tofu'] },
      { category: 'Low-GI Carbs (Controlled portions)', items: ['Brown/Red rice (small quantity)', 'Millets (ragi, jowar)', 'Whole wheat chapati', 'Oats'] },
      { category: 'Vegetables (Unlimited)', items: ['Beans', 'Bitter gourd (karela)', 'Bottle gourd', 'Cabbage', 'Spinach', 'Fenugreek leaves'] },
      { category: 'Healthy Fats', items: ['Nuts (handful)', 'Seeds', 'Olive oil / Groundnut oil'] },
      { category: 'Fruits (Low sugar only)', items: ['Apple', 'Guava', 'Pear', 'Berries', 'Jamun'] },
    ],
    avoid: ['Sugar & sweets', 'White bread & maida', 'Soft drinks & juices', 'Bakery items', 'White rice (large portions)', 'Honey & jaggery (in excess)', 'Fruit juices'],
    gymTips: {
      do: ['Morning walks (best for blood sugar)', 'Moderate cardio', 'Light strength training', 'Check sugar before/after workout', 'Keep glucose tablets handy'],
      avoid: ['Empty stomach intense workouts', 'Very high intensity without doctor approval', 'Long fasting before gym'],
    },
  },
  {
    condition: 'Knee Pain / Joint Pain / Arthritis',
    conditionKey: 'kneePain',
    icon: '🦵',
    color: 'from-teal-800 to-teal-950',
    focus: ['Reduce inflammation', 'Strengthen joints & cartilage', 'Improve joint lubrication', 'Maintain healthy body weight'],
    recommended: [
      { category: 'Anti-Inflammatory Foods', items: ['Turmeric (haldi) with milk', 'Ginger (adrak)', 'Garlic', 'Green tea'] },
      { category: 'Protein (Joint support)', items: ['Eggs', 'Fish (omega-3 rich - salmon, mackerel)', 'Dal', 'Paneer / Tofu'] },
      { category: 'Calcium & Vitamin D', items: ['Milk, Curd', 'Ragi (finger millet)', 'Sesame seeds (til)', 'Sunlight exposure 🌞'] },
      { category: 'Healthy Fats (Anti-inflammatory Omega-3)', items: ['Fish oil supplements', 'Flax seeds', 'Walnuts', 'Chia seeds'] },
      { category: 'Vegetables', items: ['Green leafy vegetables', 'Broccoli', 'Carrot', 'Ginger & garlic (liberally)'] },
    ],
    avoid: ['Junk food (increases inflammation)', 'Excess sugar', 'Alcohol', 'Refined oil & trans fats', 'Processed & packaged foods', 'Red meat (in excess)'],
    gymTips: {
      do: ['Swimming (best-zero impact)', 'Cycling (seated)', 'Upper body training', 'Stretching & yoga', 'Water aerobics'],
      avoid: ['Running on hard surfaces', 'Deep squats (without guidance)', 'Jumping & high-impact exercises', 'Leg press with heavy weights initially'],
    },
  },
];

// Combined condition guide
export const combinedConditionGuide = {
  title: 'Aged + Diabetic + Knee Pain (Combined)',
  icon: '❤️',
  color: 'from-rose-800 to-red-950',
  idealPattern: ['High protein', 'High fiber', 'Low sugar', 'Anti-inflammatory', 'Soft & easy to digest'],
  sampleDay: [
    { meal: 'Breakfast', items: 'Oats + nuts  OR  Vegetable omelette (no oil)' },
    { meal: 'Mid-Morning', items: 'Sprouts salad / Guava / Apple' },
    { meal: 'Lunch', items: 'Brown rice + Moong dal + Vegetables + Low-fat curd' },
    { meal: 'Evening Snack', items: 'Sprouts / Boiled peanuts / Handful of nuts' },
    { meal: 'Dinner', items: 'Chapati + Paneer/Tofu + Veggies (light sabzi)' },
    { meal: 'Before Bed', items: 'Haldi milk (low fat) with a pinch of turmeric' },
  ],
};

// Food recommendations mapper based on fitness goal and health conditions
export function getFoodRecommendations(
  fitnessGoal: string,
  healthConditions: string[],
  experienceLevel: string
) {
  const goalDiet = dietByGoal.find((d) => d.goal === fitnessGoal);
  const conditionFoods = healthConditions
    .map((c) => {
      const key = c === 'Aged/Senior' ? 'aged' : c === 'Diabetic' ? 'diabetic' : 'kneePain';
      return foodByHealthCondition.find((f) => f.conditionKey === key);
    })
    .filter(Boolean) as FoodByHealthCondition[];

  return { goalDiet, conditionFoods };
}

// Protein requirements by goal
export const proteinRequirements: Record<string, string> = {
  'Muscle Building': '1.8–2.2g per kg of body weight',
  'Weight Loss': '1.5–2.0g per kg of body weight',
  'General Fitness': '1.2–1.6g per kg of body weight',
  'Strength Training': '1.8–2.5g per kg of body weight',
  'Flexibility & Mobility': '1.0–1.4g per kg of body weight',
};
