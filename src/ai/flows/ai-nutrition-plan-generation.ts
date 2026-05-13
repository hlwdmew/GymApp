'use server';
/**
 * @fileOverview A Genkit flow for generating personalized nutrition plans.
 *
 * - generateNutritionPlan - A function that handles the nutrition plan generation process.
 * - AINutritionPlanGenerationInput - The input type for the generateNutritionPlan function.
 * - AINutritionPlanGenerationOutput - The return type for the generateNutritionPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoodItemSchema = z.object({
  name: z.string().describe('Name of the food item.'),
  quantity: z
    .string()
    .describe('Quantity of the food item (e.g., "1 cup", "150g", "2 slices").'),
});

const MealSchema = z.object({
  mealType: z
    .string()
    .describe('Type of meal (e.g., "Breakfast", "Lunch", "Dinner", "Snack").'),
  description: z.string().describe('A description of the meal.'),
  foodItems: z.array(FoodItemSchema).describe('List of food items in the meal.'),
  totalCalories: z.number().optional().describe('Estimated total calories for this meal.'),
  macronutrients: z
    .object({protein: z.number(), carbs: z.number(), fat: z.number()})
    .optional()
    .describe('Estimated macronutrients (in grams) for this meal.'),
});

const DailyPlanSchema = z.object({
  day: z
    .string()
    .describe('Day of the week (e.g., "Monday", "Tuesday") or a general descriptor like "Day 1".'),
  meals: z.array(MealSchema).describe('An array of meals for the day.'),
});

const AINutritionPlanGenerationInputSchema = z.object({
  dietaryPreferences: z
    .array(z.string())
    .describe('List of dietary preferences (e.g., "vegetarian", "gluten-free", "vegan").'),
  calorieGoal: z.number().describe('Daily calorie intake goal.'),
  fitnessObjective: z
    .string()
    .describe('Primary fitness objective (e.g., "muscle gain", "weight loss", "endurance", "maintenance").'),
  allergies: z
    .array(z.string())
    .optional()
    .describe('List of food allergies or intolerances.'),
  dislikedFoods: z.array(z.string()).optional().describe('List of foods to avoid.'),
  weight: z.number().optional().describe('Current weight in kg.'),
  height: z.number().optional().describe('Height in cm.'),
  age: z.number().optional().describe('Age in years.'),
  gender: z.enum(['male', 'female', 'other']).optional().describe('Gender for more accurate calorie calculations.'),
  activityLevel: z.enum(['sedentary', 'lightly active', 'moderately active', 'very active', 'super active']).optional().describe('Daily activity level.'),
});
export type AINutritionPlanGenerationInput = z.infer<
  typeof AINutritionPlanGenerationInputSchema
>;

const AINutritionPlanGenerationOutputSchema = z.object({
  planTitle: z.string().describe('A title for the nutrition plan.'),
  planDescription: z.string().describe('A brief description or overview of the nutrition plan.'),
  dailyPlans: z.array(DailyPlanSchema).describe('An array of daily nutrition plans.'),
});
export type AINutritionPlanGenerationOutput = z.infer<
  typeof AINutritionPlanGenerationOutputSchema
>;

export async function generateNutritionPlan(
  input: AINutritionPlanGenerationInput
): Promise<AINutritionPlanGenerationOutput> {
  return nutritionPlanGenerationFlow(input);
}

const nutritionPlanGenerationPrompt = ai.definePrompt({
  name: 'nutritionPlanGenerationPrompt',
  input: {schema: AINutritionPlanGenerationInputSchema},
  output: {schema: AINutritionPlanGenerationOutputSchema},
  prompt: `You are an expert nutritionist and fitness coach. Your task is to create a personalized nutrition plan based on the user's input.
The plan should be healthy, balanced, and specifically tailored to their dietary preferences, calorie goals, and fitness objectives.

User Profile:
- Dietary Preferences: {{#each dietaryPreferences}}- {{{this}}}\n{{/each}}
- Calorie Goal: {{{calorieGoal}}} calories per day
- Fitness Objective: {{{fitnessObjective}}}
{{#if allergies}}
- Allergies: {{#each allergies}}- {{{this}}}\n{{/each}}
{{/if}}
{{#if dislikedFoods}}
- Disliked Foods: {{#each dislikedFoods}}- {{{this}}}\n{{/each}}
{{/if}}
{{#if weight}}
- Weight: {{{weight}}} kg
{{/if}}
{{#if height}}
- Height: {{{height}}} cm
{{/if}}
{{#if age}}
- Age: {{{age}}} years
{{/if}}
{{#if gender}}
- Gender: {{{gender}}}
{{/if}}
{{#if activityLevel}}
- Activity Level: {{{activityLevel}}}
{{/if}}

Please create a 7-day nutrition plan. Each day should have at least 3 main meals (Breakfast, Lunch, Dinner) and optionally 1-2 snacks.
Ensure the total daily calories align with the calorie goal and the macronutrient distribution supports the fitness objective.
For example, for muscle gain, ensure adequate protein. For weight loss, focus on nutrient-dense, lower-calorie options.
Avoid including any foods listed in 'Disliked Foods' or triggering any 'Allergies'.

Provide the output in the specified JSON format.`,
});

const nutritionPlanGenerationFlow = ai.defineFlow(
  {
    name: 'nutritionPlanGenerationFlow',
    inputSchema: AINutritionPlanGenerationInputSchema,
    outputSchema: AINutritionPlanGenerationOutputSchema,
  },
  async input => {
    const {output} = await nutritionPlanGenerationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate nutrition plan.');
    }
    return output;
  }
);
