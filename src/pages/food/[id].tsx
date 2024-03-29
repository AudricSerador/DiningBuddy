import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NutritionFacts from "@/components/nutrition_facts";
import { EntriesDisplay } from "@/components/entries_display";
import LoadingSpinner from "@/components/loading_spinner";
import { useAuth } from "@/auth/auth.service";
import FavoriteBtn from "@/components/favorites/favorite_btn";

export interface FoodItem {
  id: string;
  calories: number;
  servingSize: string;
  caloriesFat: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrates: number;
  fiber: number;
  sugars: number;
  protein: number;
  calciumDV: number;
  ironDV: number;
  name: string;
  ingredients: string;
  allergens: string;
  preferences: string;
  mealEntries: string[];
}

export default function FoodItemPage() {
  const router = useRouter();
  const { id: foodId } = router.query;
  const [userId, setUserId] = useState("");
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFoodItem = async () => {
      if (foodId) {
        const res = await fetch(`/api/food/${foodId}`);

        if (!res.ok) {
          router.push("/404");
          return;
        }

        const data = await res.json();

        if (data.mealEntries) {
          data.mealEntries
            .sort(
              (a: any, b: any) =>
                (new Date(a.dateServed) as any) -
                (new Date(b.dateServed) as any)
            )
            .reverse();
        }

        setFoodItem(data);
        setIsLoading(false);
      }
    };

    if (user) {
      setUserId(user.id);
    }

    fetchFoodItem();
  }, [foodId, router, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingSpinner />
        <p className="mt-4 font-custom text-xl">Loading food data...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 font-custom md:px-16 lg:px-64 mt-4">
      <div className="flex items-center space-x-4 mb-4">
        <h1 className="text-4xl font-custombold">{foodItem?.name}</h1>
        <FavoriteBtn
          userId={userId}
          foodId={foodId as string}
          foodName={foodItem?.name as string}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 items-start justify-items-center sm:justify-items-start">
        {foodItem && <NutritionFacts foodItem={foodItem} />}
        <div>
          <p className="mb-4 font-custombold">
            Ingredients:{" "}
            <span className="font-custom">{foodItem?.ingredients}</span>
            <br />
            Allergens:{" "}
            <span className="font-custom">{foodItem?.allergens}</span>
          </p>
          <h2 className="text-2xl font-custombold mb-2">Dates Served</h2>
          {foodItem?.mealEntries && foodItem.mealEntries.length > 0 ? (
            <EntriesDisplay mealEntries={foodItem.mealEntries} />
          ) : (
            <div className="max-w-2xl my-8 font-custom text-lg text-center">
              <p>This food item has not been served yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
