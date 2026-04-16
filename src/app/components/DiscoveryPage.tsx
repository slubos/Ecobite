import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, ShoppingCart, TrendingDown, Clock, Flame, Star, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "../data/products";

interface Recipe {
  id: string;
  name: string;
  image: string;
  cookTime: number;
  co2: number;
  tags: string[];
  ingredients: string[];
  pantrySync?: string;
  instructions?: string[];
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
    instructions: [
      "Heat olive oil in a large pan over medium heat",
      "Add spinach and sauté until wilted (3-4 minutes)",
      "Add chickpeas and cook for 5 minutes",
      "Season with lemon juice, salt, and pepper",
      "Serve warm in a bowl"
    ]
  },
  {
    id: "2",
    name: "Local Vegetable Stir-Fry",
    image: "https://images.unsplash.com/photo-1554223745-ad862492c213?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZhcm1lcnMlMjBtYXJrZXR8ZW58MXx8fHwxNzc2MjYzMDU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 15,
    co2: 0.5,
    tags: ["Quick & Easy", "Low-Carbon"],
    ingredients: ["Bell Peppers", "Broccoli", "Carrots", "Soy Sauce"],
    instructions: [
      "Chop all vegetables into bite-sized pieces",
      "Heat oil in a wok or large pan",
      "Stir-fry vegetables for 8-10 minutes",
      "Add soy sauce and toss to combine",
      "Serve immediately over rice"
    ]
  },
  {
    id: "3",
    name: "Seasonal Berry Smoothie Bowl",
    image: "https://images.unsplash.com/photo-1772480790826-91624eb300ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxvY2FsJTIwcHJvZHVjZSUyMHdvb2RlbiUyMHRhYmxlfGVufDF8fHx8MTc3NjMyNzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 10,
    co2: 0.3,
    tags: ["Breakfast", "Seasonal"],
    ingredients: ["Local Strawberries", "Banana", "Oats", "Almond Milk"],
    instructions: [
      "Blend strawberries, banana, and almond milk until smooth",
      "Pour into a bowl",
      "Top with oats and fresh berries",
      "Add optional toppings like chia seeds or nuts"
    ]
  },
  {
    id: "4",
    name: "Zero-Waste Vegetable Soup",
    image: "https://images.unsplash.com/photo-1643786661490-966f1877effa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBzb3VwJTIwYm93bCUyMGhlYWx0aHl8ZW58MXx8fHwxNzc2MjM4ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 30,
    co2: 0.6,
    tags: ["One-Pot Meal", "Waste Reduction"],
    ingredients: ["Mixed Vegetables", "Vegetable Stock", "Herbs"],
    pantrySync: "Perfect for using vegetable scraps",
    instructions: [
      "Chop all vegetables and scraps",
      "Bring vegetable stock to a boil",
      "Add vegetables and simmer for 20 minutes",
      "Season with herbs and spices",
      "Blend if desired or serve chunky"
    ]
  },
  {
    id: "5",
    name: "Pasta Primavera",
    image: "https://images.unsplash.com/photo-1571951286227-7a28b07822ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHByaW1hdmVyYSUyMGNvbG9yZnVsJTIwZGlzaHxlbnwxfHx8fDE3NzYzMjk4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 20,
    co2: 1.2,
    tags: ["Quick & Easy", "Seasonal"],
    ingredients: ["Whole Grain Pasta", "Mixed Vegetables", "Olive Oil", "Garlic"],
    instructions: [
      "Cook pasta according to package directions",
      "Sauté vegetables in olive oil with garlic",
      "Toss cooked pasta with vegetables",
      "Season with salt, pepper, and fresh herbs"
    ]
  },
  {
    id: "6",
    name: "Quinoa Power Bowl",
    image: "https://images.unsplash.com/photo-1561451055-0de615569a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWlub2ElMjBzYWxhZCUyMGJvd2wlMjBmcmVzaHxlbnwxfHx8fDE3NzYzMjk4MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 30,
    co2: 1.1,
    tags: ["High-Protein", "Meal Prep"],
    ingredients: ["Quinoa", "Kale", "Sweet Potato", "Chickpeas"],
    pantrySync: "Uses your Quinoa and Chickpeas",
    instructions: [
      "Cook quinoa according to package",
      "Roast sweet potato cubes at 400°F for 25 minutes",
      "Massage kale with olive oil",
      "Combine all ingredients in a bowl",
      "Top with tahini dressing"
    ]
  },
  {
    id: "7",
    name: "Buddha Bowl Delight",
    image: "https://images.unsplash.com/photo-1675092789086-4bd2b93ffc69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRkaGElMjBib3dsJTIwdmVnYW4lMjBoZWFsdGh5fGVufDF8fHx8MTc3NjMyOTgyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 35,
    co2: 0.9,
    tags: ["Vegan", "Nutrient-Dense"],
    ingredients: ["Brown Rice", "Tofu", "Avocado", "Mixed Vegetables"],
    instructions: [
      "Cook brown rice",
      "Press and cube tofu, then pan-fry until golden",
      "Steam or roast your choice of vegetables",
      "Slice avocado",
      "Arrange all components in a bowl and drizzle with dressing"
    ]
  },
  {
    id: "8",
    name: "Spiced Lentil Curry",
    image: "https://images.unsplash.com/photo-1767114915989-c6ab3c8fc42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW50aWwlMjBjdXJyeSUyMGluZGlhbiUyMHNwaWN5fGVufDF8fHx8MTc3NjMyOTgyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 40,
    co2: 0.7,
    tags: ["One-Pot Meal", "High-Protein"],
    ingredients: ["Red Lentils", "Coconut Milk", "Tomatoes", "Curry Spices"],
    instructions: [
      "Sauté onions and garlic in oil",
      "Add curry spices and cook for 1 minute",
      "Add lentils, tomatoes, and coconut milk",
      "Simmer for 25-30 minutes until lentils are tender",
      "Serve with rice or naan"
    ]
  },
  {
    id: "9",
    name: "Roasted Rainbow Vegetables",
    image: "https://images.unsplash.com/photo-1584615467008-2f396a45ef10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwdmVnZXRhYmxlcyUyMGNvbG9yZnVsJTIwdHJheXxlbnwxfHx8fDE3NzYzMjk4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 35,
    co2: 0.5,
    tags: ["Low-Carbon", "Meal Prep"],
    ingredients: ["Bell Peppers", "Zucchini", "Eggplant", "Olive Oil"],
    instructions: [
      "Preheat oven to 425°F",
      "Chop vegetables into uniform pieces",
      "Toss with olive oil, salt, and pepper",
      "Roast for 30 minutes, stirring halfway",
      "Serve as a side or over grains"
    ]
  },
  {
    id: "10",
    name: "Chickpea Coconut Curry",
    image: "https://images.unsplash.com/photo-1634234498505-51b316832b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja3BlYSUyMGN1cnJ5JTIwYm93bCUyMHZlZ2FufGVufDF8fHx8MTc3NjMyOTgyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 30,
    co2: 0.8,
    tags: ["Vegan", "One-Pot Meal"],
    ingredients: ["Chickpeas", "Coconut Milk", "Spinach", "Garam Masala"],
    pantrySync: "Perfect for your Chickpeas and Spinach",
    instructions: [
      "Sauté onions until soft",
      "Add garam masala and cook for 1 minute",
      "Add chickpeas and coconut milk",
      "Simmer for 15 minutes",
      "Stir in spinach until wilted"
    ]
  },
  {
    id: "11",
    name: "Tofu Veggie Stir-Fry",
    image: "https://images.unsplash.com/photo-1644527199880-fcf2bb61b2b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2Z1JTIwc3RpciUyMGZyeSUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzc2MjMyMTIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 20,
    co2: 1.0,
    tags: ["Vegan", "Quick & Easy"],
    ingredients: ["Tofu", "Broccoli", "Bell Peppers", "Soy Sauce"],
    instructions: [
      "Press and cube tofu",
      "Stir-fry tofu until golden, then set aside",
      "Stir-fry vegetables until tender-crisp",
      "Return tofu to pan, add soy sauce",
      "Toss and serve over rice"
    ]
  },
  {
    id: "12",
    name: "Overnight Oats",
    image: "https://images.unsplash.com/photo-1588346230942-413569272957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVybmlnaHQlMjBvYXRzJTIwYnJlYWtmYXN0JTIwamFyfGVufDF8fHx8MTc3NjMyOTgyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 5,
    co2: 0.2,
    tags: ["Breakfast", "Meal Prep"],
    ingredients: ["Oats", "Oat Milk", "Chia Seeds", "Berries"],
    instructions: [
      "Combine oats, oat milk, and chia seeds in a jar",
      "Stir well and refrigerate overnight",
      "In the morning, top with fresh berries",
      "Add honey or maple syrup if desired",
      "Enjoy cold or warm"
    ]
  },
  {
    id: "13",
    name: "Avocado Toast Deluxe",
    image: "https://images.unsplash.com/photo-1561517146-dfbd99b0c14d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3QlMjBoZWFsdGh5fGVufDF8fHx8MTc3NjIzMTYxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cookTime: 10,
    co2: 0.4,
    tags: ["Breakfast", "Quick & Easy"],
    ingredients: ["Sourdough Bread", "Avocado", "Eggs", "Cherry Tomatoes"],
    instructions: [
      "Toast sourdough bread",
      "Mash avocado with salt and pepper",
      "Spread avocado on toast",
      "Top with sliced tomatoes and optional egg",
      "Garnish with herbs or seeds"
    ]
  },
];

export function DiscoveryPage() {
  const navigate = useNavigate();
  const [weeklyImpact] = useState(12.4); // Current weekly CO2
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const weeklyGoal = 15.0; // Target weekly CO2
  const progressPercentage = Math.min((weeklyImpact / weeklyGoal) * 100, 100);

  const handleAddIngredientsToCart = (recipe: Recipe) => {
    // Map recipe ingredients to actual product IDs
    const ingredientMapping: { [key: string]: string } = {
      "Spinach": "3",
      "Chickpeas": "10",
      "Lemon": "23",
      "Olive Oil": "30",
      "Bell Peppers": "21",
      "Broccoli": "12",
      "Carrots": "7",
      "Soy Sauce": "47", // Using soy milk as closest match
      "Local Strawberries": "1b",
      "Banana": "13",
      "Oats": "31",
      "Almond Milk": "26", // Using almond butter as closest match
      "Mixed Vegetables": "21", // Default to bell peppers
      "Vegetable Stock": "3", // Default to spinach
      "Herbs": "3", // Default to spinach
      "Whole Grain Pasta": "19",
      "Garlic": "29", // Using onions as closest match
      "Quinoa": "50",
      "Kale": "33",
      "Sweet Potato": "34",
      "Brown Rice": "20",
      "Tofu": "25",
      "Avocado": "24",
      "Red Lentils": "52",
      "Coconut Milk": "48",
      "Tomatoes": "6",
      "Curry Spices": "55", // Using dark chocolate as closest match (pantry item)
      "Zucchini": "35",
      "Eggplant": "36",
      "Garam Masala": "55", // Using dark chocolate as closest match (pantry item)
      "Chia Seeds": "60",
      "Berries": "32",
      "Sourdough Bread": "8",
      "Eggs": "4",
      "Cherry Tomatoes": "6"
    };

    // Load existing cart
    const storedCart = localStorage.getItem('cartItems');
    let cartData: { [key: string]: number } = {};
    
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Handle both old array format and new object format
        if (Array.isArray(parsedCart)) {
          parsedCart.forEach(id => {
            cartData[id] = 1;
          });
        } else {
          cartData = parsedCart;
        }
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    // Add recipe ingredients to cart (with quantity 1 each or increment if already exists)
    recipe.ingredients.forEach(ingredient => {
      const productId = ingredientMapping[ingredient];
      if (productId) {
        cartData[productId] = (cartData[productId] || 0) + 1;
      }
    });

    // Save updated cart
    localStorage.setItem('cartItems', JSON.stringify(cartData));
    navigate("/cart");
  };

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
            <button 
              onClick={() => navigate("/cart")} 
              className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full"
            >
              <ShoppingCart className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">Cart</span>
            </button>
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
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    View Recipe
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAddIngredientsToCart(recipe)}
                  >
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

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-2xl">{selectedRecipe.name}</h2>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ImageWithFallback
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <div className="flex gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-gray-500">Cook Time</p>
                    <p className="font-medium">{selectedRecipe.cookTime} minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-gray-500">CO₂ Impact</p>
                    <p className="font-medium text-green-600">{selectedRecipe.co2} kg</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedRecipe.instructions && (
                <div className="mb-6">
                  <h3 className="text-lg mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="font-semibold text-green-600 min-w-[24px]">{index + 1}.</span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedRecipe(null)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    handleAddIngredientsToCart(selectedRecipe);
                    setSelectedRecipe(null);
                  }}
                >
                  Add Ingredients to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}