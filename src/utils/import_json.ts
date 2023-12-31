import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function importJSONToDatabase(foodData: any[]) {
  try {
    for (const food of foodData) {
      const existingFood = await prisma.foodInfo.findUnique({
        where: { name: food.name },
      });

      if (existingFood) {
        for (const entry of food.mealEntries) {
          await prisma.mealDetails.create({
            data: {
              diningHall: entry.diningHall,
              diningFacility: entry.diningFacility,
              mealType: entry.mealType,
              dateServed: entry.dateServed,
              foodId: existingFood.id,
            },
          });
        }
        console.log(`Updated FoodInfo with ID: ${existingFood.id}`);
      } else {
        const newFood = await prisma.foodInfo.create({
          data: {
            id: uuidv4(),
            name: food.name,
            servingSize: food.servingSize,
            ingredients: food.ingredients,
            allergens: food.allergens,
            preferences: food.preferences,
            calories: food.calories,
            caloriesFat: food.caloriesFat,
            totalFat: food.totalFat,
            saturatedFat: food.saturatedFat,
            transFat: food.transFat,
            polyFat: food.polyFat,
            monoFat: food.monoFat,
            cholesterol: food.cholesterol,
            sodium: food.sodium,
            potassium: food.potassium,
            totalCarbohydrates: food.totalCarbohydrates,
            fiber: food.fiber,
            sugars: food.sugars,
            protein: food.protein,
            calciumDV: food.calciumDV,
            ironDV: food.ironDV,
          },
        });
        console.log(`Created FoodInfo with ID: ${newFood.id}`);

        for (const entry of food.mealEntries) {
          await prisma.mealDetails.create({
            data: {
              diningHall: entry.diningHall,
              diningFacility: entry.diningFacility,
              mealType: entry.mealType,
              dateServed: entry.dateServed,
              foodId: newFood.id,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error appending data to the database:", error);
    throw error;
  } finally {
    console.log("Upload successful. Closing database connection...");
    await prisma.$disconnect();
  }
}

export { importJSONToDatabase };