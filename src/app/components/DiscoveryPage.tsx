import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, ShoppingCart, TrendingDown, Clock, Flame, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Recipe {
  id: string;
  name: string;
  image: string;
  cookTime: number;
  co2: number;
  tags: string[];
  ingredients: string[];
  pantrySync?: string;
}

const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Mediterranean Spinach Bowl",
    image: "https://images.unsplash.com/photo-1767105267943-0d34ab68d2a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBib3dsc3xlbnwxfHx8fDE3NzYzMjU5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 25,
    co2: 0.8,
    tags: ["One-Pot Meal", "Seasonal"],
    ingredients: ["Spinach", "Chickpeas", "Lemon", "Olive Oil"],
    pantrySync: "Uses up your leftover Spinach",
  },
  {
    id: "2",
    name: "Local Vegetable Stir-Fry",
    image: "https://images.unsplash.com/photo-1554223745-ad862492c213?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZhcm1lcnMlMjBtYXJrZXR8ZW58MXx8fHwxNzc2MjYzMDU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 15,
    co2: 0.5,
    tags: ["Quick & Easy", "Low-Carbon"],
    ingredients: ["Bell Peppers", "Broccoli", "Carrots", "Soy Sauce"],
  },
  {
    id: "3",
    name: "Seasonal Berry Smoothie Bowl",
    image: "https://images.unsplash.com/photo-1772480790826-91624eb300ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxvY2FsJTIwcHJvZHVjZSUyMHdvb2RlbiUyMHRhYmxlfGVufDF8fHx8MTc3NjMyNzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 10,
    co2: 0.3,
    tags: ["Breakfast", "Seasonal"],
    ingredients: ["Local Strawberries", "Banana", "Oats", "Almond Milk"],
  },
  {
    id: "4",
    name: "Zero-Waste Vegetable Soup",
    image: "https://images.unsplash.com/photo-1652262968340-b735524f9ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHBhY2thZ2luZyUyMGdyb2Nlcmllc3xlbnwxfHx8fDE3NzYzMjcxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 30,
    co2: 0.6,
    tags: ["One-Pot Meal", "Waste Reduction"],
    ingredients: ["Mixed Vegetables", "Vegetable Stock", "Herbs"],
    pantrySync: "Perfect for using vegetable scraps",
  },
];

export function DiscoveryPage() {
  const navigate = useNavigate();
  const [weeklyImpact] = useState(12.4); // Current weekly CO2
  const weeklyGoal = 15.0; // Target weekly CO2
  const progressPercentage = Math.min((weeklyImpact / weeklyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-xl font-semibold">Eco-Bite</span>
          </div>
          <nav className="flex gap-6 text-sm items-center">
            <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-900">
              Home
            </button>
            <button onClick={() => navigate("/shop")} className="text-gray-600 hover:text-gray-900">
              Shop
            </button>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
              <ShoppingCart className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">5</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Weekly Impact Score */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl mb-1">Weekly Impact Score</h2>
                <p className="text-sm text-gray-600">
                  You're on track to stay within your carbon budget this week!
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold text-green-600">{weeklyImpact} kg</div>
                <div className="text-sm text-gray-600">of {weeklyGoal} kg CO₂</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-xs text-gray-600">
              {(weeklyGoal - weeklyImpact).toFixed(1)} kg remaining for the week
            </p>
          </CardContent>
        </Card>

        {/* Discovery Feed Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">Recipes for Your Carbon Budget</h1>
            <p className="text-gray-600">
              Personalized meal ideas that work with what you have and what the planet needs
            </p>
          </div>
        </div>

        {/* Recipe Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {mockRecipes.map((recipe) => (
            <Card key={recipe.id} className="bg-white hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-48">
                <ImageWithFallback
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                {recipe.pantrySync && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-purple-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Pantry Sync
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl mb-3">{recipe.name}</h3>

                {recipe.pantrySync && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-purple-900">{recipe.pantrySync}</p>
                  </div>
                )}

                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-green-600" />
                    <span>{recipe.co2} kg CO₂</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag === "One-Pot Meal" && <Flame className="w-3 h-3 mr-1" />}
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Key Ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Recipe
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    Add Ingredients to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Carbon Savings Insight */}
        <Card className="mt-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg mb-2">This Week's Achievement</h3>
                <p className="text-gray-600">
                  By choosing these recipes, you've saved{" "}
                  <span className="font-semibold text-green-600">4.2 kg of CO₂</span> compared to your
                  previous shopping habits. That's equivalent to driving 16 km less!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}