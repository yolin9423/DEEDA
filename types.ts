
export type ReactionType = 'like' | 'ok' | 'dislike';

export type PetId = 'kodee' | 'eda';

export const PETS: Record<PetId, { name: string; color: string; bg: string; ring: string }> = {
  kodee: { name: 'KODEE', color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
  eda: { name: 'EDA', color: 'text-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-100' }
};

export interface FoodRecord {
  id: string;
  name: string;
  brand: string;
  type: 'wet' | 'puree' | 'treat';
  reactions: Record<PetId, ReactionType>;
  date: string; // ISO string
  notes: string;
  imageUrl?: string;
}

export enum AppTab {
  ADD = 'ADD',
  HISTORY = 'HISTORY'
}

export const REACTION_LABELS: Record<ReactionType, string> = {
  like: '給面子',
  ok: '愛理不理',
  dislike: '不賞臉'
};

export const FOOD_TYPE_LABELS: Record<string, string> = {
  wet: '罐罐',
  puree: '肉泥',
  treat: '零食'
};
