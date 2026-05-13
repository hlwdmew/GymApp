'use server';
/**
 * @fileOverview A Genkit flow for generating personalized workout recommendations in Russian.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WorkoutRecommendationInputSchema = z.object({
  fitnessGoal: z
    .enum([
      'muscle_gain',
      'weight_loss',
      'endurance',
      'flexibility',
      'overall_health',
    ])
    .describe('The primary fitness goal of the user.'),
  fitnessLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The current fitness level of the user.'),
  availableEquipment: z
    .array(z.string())
    .describe(
      'A list of available gym equipment, e.g., "dumbbells", "barbell".'
    ),
});
export type WorkoutRecommendationInput = z.infer<
  typeof WorkoutRecommendationInputSchema
>;

const WorkoutRecommendationOutputSchema = z.object({
  planName: z.string().describe('Название плана тренировок на русском языке.'),
  description: z
    .string()
    .describe('Краткое описание преимуществ плана на русском языке.'),
  warmUp: z.array(z.string()).describe('Список упражнений для разминки на русском языке.'),
  mainWorkout: z
    .array(
      z.object({
        exercise: z.string().describe('Название упражнения на русском.'),
        sets: z.number().int().positive().describe('Количество подходов.'),
        reps: z.string().describe('Количество повторений или длительность (например, "8-12 раз", "30 секунд").'),
        notes: z.string().optional().describe('Дополнительные инструкции на русском.'),
      })
    )
    .describe('Детальный список основных упражнений.'),
  coolDown: z.array(z.string()).describe('Список упражнений для заминки на русском.'),
  frequency: z
    .string()
    .describe('Рекомендуемая частота (например, "3 раза в неделю").'),
  durationMinutes: z.number().int().positive().describe('Приблизительная длительность в минутах.'),
});
export type WorkoutRecommendationOutput = z.infer<
  typeof WorkoutRecommendationOutputSchema
>;

export async function aiWorkoutRecommendations(
  input: WorkoutRecommendationInput
): Promise<WorkoutRecommendationOutput> {
  return aiWorkoutRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'workoutRecommendationPrompt',
  input: { schema: WorkoutRecommendationInputSchema },
  output: { schema: WorkoutRecommendationOutputSchema },
  prompt: `Ты — экспертный фитнес-тренер. Твоя задача — составить персонализированный план тренировок НА РУССКОМ ЯЗЫКЕ.

Цель: {{{fitnessGoal}}}
Уровень подготовки: {{{fitnessLevel}}}
Доступное оборудование: {{{availableEquipment}}}

Составь комплексный план, включающий разминку, основную часть и заминку. Все текстовые поля в ответе должны быть строго на русском языке. Используй терминологию, понятную российским пользователям.`, 
});

const aiWorkoutRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiWorkoutRecommendationsFlow',
    inputSchema: WorkoutRecommendationInputSchema,
    outputSchema: WorkoutRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
