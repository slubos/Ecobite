import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Leaf, ShoppingCart, TrendingDown, AlertCircle, Check, X, Star, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: string;
  name: string;
  price: number;
  co2: number;
  category: string;
  image: string;
  tags: string[];
}

interface CartItem extends Product {
  inCart: boolean;
  hasSwap?: boolean;
  swapSuggestion?: {
    name: string;
    price: number;
    co2: number;
    reason: string;
    distance: number;
    image: string;
  };
}

// All available products (same as in ShopPage)
const allProducts: Product[] = [
  {
    id: "1",
    name: "Imported Strawberries (Spain)",
    price: 4.99,
    co2: 2.4,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1685282332532-f44752c19b9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHN0cmF3YmVycmllcyUyMGNsb3NldXB8ZW58MXx8fHwxNzc2MjM0NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh"],
  },
  {
    id: "1b",
    name: "Local Strawberries (Seasonal)",
    price: 4.59,
    co2: 0.3,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1685282332532-f44752c19b9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHN0cmF3YmVycmllcyUyMGNsb3NldXB8ZW58MXx8fHwxNzc2MjM0NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local", "Seasonal"],
  },
  {
    id: "2",
    name: "Beef Mince (Standard)",
    price: 8.99,
    co2: 27.0,
    category: "Meat",
    image: "https://images.unsplash.com/photo-1700777279865-fbb065328a25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91bmQlMjBiZWVmJTIwbWVhdHxlbnwxfHx8fDE3NzYzMjc3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein"],
  },
  {
    id: "2b",
    name: "Plant-Based Mince",
    price: 7.49,
    co2: 2.1,
    category: "Meat Alternatives",
    image: "https://images.unsplash.com/photo-1700777279865-fbb065328a25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91bmQlMjBiZWVmJTIwbWVhdHxlbnwxfHx8fDE3NzYzMjc3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Vegan", "Low-Carbon"],
  },
  {
    id: "3",
    name: "Organic Spinach",
    price: 2.49,
    co2: 0.4,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1634731201932-9bd92839bea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwaW5hY2glMjBsZWF2ZXN8ZW58MXx8fHwxNzc2MzI3NzU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic", "Local"],
  },
  {
    id: "4",
    name: "Free-Range Eggs",
    price: 3.99,
    co2: 1.8,
    category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1585355611444-06154f329e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVlJTIwcmFuZ2UlMjBlZ2dzJTIwY2FydG9ufGVufDF8fHx8MTc3NjMyNzc1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Free-Range"],
  },
  {
    id: "5",
    name: "Plastic-Wrapped Cucumber",
    price: 1.29,
    co2: 0.8,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1725369865895-0dd4566c8864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGN1Y3VtYmVyJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3NjMxMzYyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh"],
  },
  {
    id: "5b",
    name: "Unwrapped Cucumber",
    price: 1.29,
    co2: 0.2,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1725369865895-0dd4566c8864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGN1Y3VtYmVyJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3NjMxMzYyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Plastic-Free", "Local"],
  },
  {
    id: "6",
    name: "Organic Tomatoes",
    price: 3.49,
    co2: 0.6,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG9lcyUyMGZyZXNoJTIwcHJvZHVjZXxlbnwxfHx8fDE3NzYzMTQ4NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic"],
  },
  {
    id: "7",
    name: "Organic Carrots",
    price: 2.29,
    co2: 0.3,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY2Fycm90cyUyMGJ1bmNofGVufDF8fHx8MTc3NjI0OTAzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic", "Local"],
  },
  {
    id: "8",
    name: "Artisan Sourdough Bread",
    price: 4.29,
    co2: 0.7,
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1663904460424-91895028aa9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyZWFkJTIwbG9hZnxlbnwxfHx8fDE3NzYzMTI2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
  },
  {
    id: "9",
    name: "Oat Milk",
    price: 3.19,
    co2: 0.4,
    category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1583507623011-5cc6ff99e11c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYXQlMjBtaWxrJTIwYm90dGxlfGVufDF8fHx8MTc3NjMyNzc2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Vegan", "Low-Carbon"],
  },
  {
    id: "10",
    name: "Organic Chickpeas",
    price: 1.99,
    co2: 0.5,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1760942852135-e98d57fe0ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja3BlYXMlMjBkcmllZCUyMGxlZ3VtZXN8ZW58MXx8fHwxNzc2MzI3NzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Vegan", "Protein"],
  },
  {
    id: "11",
    name: "Local Apples",
    price: 3.79,
    co2: 0.2,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1744801283301-5a58c498794d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwYXBwbGVzJTIwZnJ1aXR8ZW58MXx8fHwxNzc2MjI5MjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local", "Organic"],
  },
  {
    id: "12",
    name: "Fresh Broccoli",
    price: 2.89,
    co2: 0.4,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1757332334626-8dadb145540d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyb2Njb2xpJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3NjMyMjA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
  },
];

// Swap suggestions mapping
const swapSuggestions: { [key: string]: { swapId: string; reason: string; distance: number } } = {
  "1": { swapId: "1b", reason: "sourced within 50km and saves you €0.40", distance: 47 },
  "2": { swapId: "2b", reason: "92% less CO₂ emissions and €1.50 savings", distance: 0 },
  "5": { swapId: "5b", reason: "plastic-free packaging with no price difference", distance: 0 },
};

export function SmartCartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showComparison, setShowComparison] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      const cartIds: string[] = JSON.parse(storedCart);
      const items: CartItem[] = cartIds.map(id => {
        const product = allProducts.find(p => p.id === id);
        if (!product) return null;

        const swap = swapSuggestions[id];
        let swapSuggestion = undefined;

        if (swap) {
          const swapProduct = allProducts.find(p => p.id === swap.swapId);
          if (swapProduct) {
            swapSuggestion = {
              name: swapProduct.name,
              price: swapProduct.price,
              co2: swapProduct.co2,
              reason: swap.reason,
              distance: swap.distance,
              image: swapProduct.image,
            };
          }
        }

        return {
          ...product,
          inCart: true,
          hasSwap: !!swap,
          swapSuggestion,
        };
      }).filter((item): item is CartItem => item !== null);

      setCartItems(items);
    }
  }, []);

  const totalCO2 = cartItems
    .filter((item) => item.inCart)
    .reduce((sum, item) => sum + item.co2, 0);

  const totalPrice = cartItems
    .filter((item) => item.inCart)
    .reduce((sum, item) => sum + item.price, 0);

  const handleSwapAccept = (itemId: string) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === itemId && item.swapSuggestion) {
          // Find the swap product ID
          const swapId = swapSuggestions[itemId]?.swapId;
          const swapProduct = allProducts.find(p => p.id === swapId);
          
          if (swapProduct) {
            return {
              ...swapProduct,
              inCart: true,
              hasSwap: false,
              swapSuggestion: undefined,
            };
          }
        }
        return item;
      })
    );
    setShowComparison(null);
  };

  const handleSwapReject = (itemId: string, reason: string) => {
    setRejectionReasons({ ...rejectionReasons, [itemId]: reason });
    setTimeout(() => {
      setRejectionReasons({ ...rejectionReasons, [itemId]: null });
    }, 3000);
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      const cartIds: string[] = JSON.parse(storedCart);
      const updatedCart = cartIds.filter(id => id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
  };

  const getComparisonData = (item: CartItem) => {
    if (!item.swapSuggestion) return [];
    return [
      {
        name: "CO₂ (kg)",
        Current: item.co2,
        Suggested: item.swapSuggestion.co2,
      },
      {
        name: "Price (€)",
        Current: item.price,
        Suggested: item.swapSuggestion.price,
      },
    ];
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-xl font-semibold">Eco-Bite</span>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your personalized eco-swaps!</p>
          <Button onClick={() => navigate("/shop")} className="bg-green-600 hover:bg-green-700 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

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
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Continue Shopping
            </button>
            <button onClick={() => navigate("/discover")} className="text-gray-600 hover:text-gray-900">
              Discover
            </button>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
              <ShoppingCart className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">{cartItems.filter((i) => i.inCart).length}</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl">Your Smart Cart</h1>
              <Badge variant="outline" className="text-sm px-3 py-1">
                <TrendingDown className="w-4 h-4 mr-1" />
                {totalCO2.toFixed(1)} kg CO₂
              </Badge>
            </div>

            {cartItems
              .filter((item) => item.inCart)
              .map((item) => (
                <Card key={item.id} className="bg-white">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg mb-1">{item.name}</h3>
                            <div className="flex gap-3 text-sm text-gray-600">
                              <span>€{item.price.toFixed(2)}</span>
                              <span>•</span>
                              <span>{item.co2.toFixed(1)} kg CO₂</span>
                              <span>•</span>
                              <span>{item.category}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Eco-Nudge */}
                      {item.hasSwap && item.swapSuggestion && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-yellow-900">A greener choice is available</p>
                              <p className="text-sm text-yellow-800 mt-1">
                                <span className="font-medium">{item.swapSuggestion.name}</span> - Recommended because it's{" "}
                                {item.swapSuggestion.reason}
                              </p>
                            </div>
                          </div>

                          {rejectionReasons[item.id] ? (
                            <div className="bg-white rounded p-3 text-sm text-gray-700">
                              Thanks for the feedback! We'll adjust future recommendations based on: {rejectionReasons[item.id]}
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setShowComparison(showComparison === item.id ? null : item.id)}
                                variant="outline"
                                className="flex-1"
                              >
                                Compare
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSwapAccept(item.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept Swap
                              </Button>
                            </div>
                          )}

                          {/* Impact Comparison Widget */}
                          {showComparison === item.id && (
                            <div className="bg-white rounded-lg p-4 border">
                              <h4 className="text-sm font-medium mb-3">Impact Comparison</h4>
                              <ResponsiveContainer width="100%" height={150}>
                                <BarChart data={getComparisonData(item)}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" fontSize={12} />
                                  <YAxis fontSize={12} />
                                  <Tooltip />
                                  <Bar dataKey="Current" fill="#9ca3af" name="Current" />
                                  <Bar dataKey="Suggested" fill="#16a34a" name="Suggested" />
                                </BarChart>
                              </ResponsiveContainer>
                              
                              {/* Rejection Reasons */}
                              <div className="mt-4 pt-4 border-t">
                                <p className="text-xs text-gray-600 mb-2">Why not?</p>
                                <div className="flex gap-2 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSwapReject(item.id, "Too Expensive")}
                                    className="text-xs"
                                  >
                                    Too Expensive
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSwapReject(item.id, "Don't Like Taste")}
                                    className="text-xs"
                                  >
                                    Don't Like Taste
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSwapReject(item.id, "Need Specific Brand")}
                                    className="text-xs"
                                  >
                                    Need Specific Brand
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white sticky top-8">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl">Cart Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{cartItems.filter((i) => i.inCart).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Price</span>
                    <span className="font-medium">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total CO₂</span>
                    <span className="font-medium">{totalCO2.toFixed(1)} kg</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Great job!</span> Your cart is{" "}
                      <span className="font-semibold">32% more sustainable</span> than the average shopper.
                    </p>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Proceed to Checkout
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Sustainable Brands</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Local Harvest Co.</span>
                      <Button variant="ghost" size="sm" className="text-yellow-600">
                        <Star className="w-4 h-4 fill-yellow-600" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Green Fields Organic</span>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Follow brands to prioritize them in future recommendations
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}