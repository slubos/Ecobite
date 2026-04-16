import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Leaf, ShoppingCart, TrendingDown, AlertCircle, Check, X, Star, ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts, type Product } from "../data/products";

interface CartItem extends Product {
  quantity: number;
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

// Cart data type: { productId: quantity }
type CartData = { [productId: string]: number };

// Swap suggestions mapping
const swapSuggestions: { [key: string]: { swapId: string; reason: string; distance: number } } = {
  // FRUITS - Imported to Local/Seasonal
  "1": { swapId: "1b", reason: "sourced within 50km and saves you €0.40", distance: 47 },
  "13": { swapId: "11", reason: "locally grown and 50% less CO₂", distance: 35 },
  "23": { swapId: "1b", reason: "seasonal strawberries have better flavor and less CO₂", distance: 47 },
  "24": { swapId: "32", reason: "local blueberries are in season and 33% less CO₂", distance: 22 },
  
  // VEGETABLES - Conventional to Organic/Local
  "5": { swapId: "5b", reason: "plastic-free packaging with no price difference", distance: 0 },
  "6": { swapId: "22", reason: "local lettuce is fresher and 50% less CO₂", distance: 28 },
  "21": { swapId: "12", reason: "local broccoli has similar nutrients and lower footprint", distance: 31 },
  "28": { swapId: "3", reason: "organic spinach is nutrient-rich and locally sourced", distance: 18 },
  "37": { swapId: "12", reason: "broccoli is in season and 33% less CO₂", distance: 31 },
  "38": { swapId: "39", reason: "Brussels sprouts are seasonal and save €0.50", distance: 0 },
  
  // MEAT - High Impact to Lower Impact or Plant-Based
  "2": { swapId: "2b", reason: "92% less CO₂ emissions and €1.50 savings", distance: 0 },
  "16": { swapId: "25", reason: "plant-based alternative with 85% less CO₂", distance: 0 },
  "40": { swapId: "25", reason: "tofu alternative with 92% less CO₂", distance: 0 },
  "41": { swapId: "16", reason: "chicken has 82% less CO₂ and saves €8.50", distance: 0 },
  "42": { swapId: "16", reason: "chicken breast has similar protein and 37% less CO₂", distance: 0 },
  
  // SEAFOOD - High Impact to Sustainable Options
  "15": { swapId: "45", reason: "local cod has 44% less CO₂ and saves €1.00", distance: 0 },
  "43": { swapId: "45", reason: "cod has 89% less CO₂ and saves €4.00", distance: 0 },
  "44": { swapId: "45", reason: "cod is sustainably sourced and saves €2.50", distance: 0 },
  
  // DAIRY - Dairy to Plant-Based
  "17": { swapId: "9", reason: "dairy-free option saves 66% CO₂ and €1.00", distance: 0 },
  "46": { swapId: "9", reason: "oat milk has 79% less CO₂ than dairy", distance: 0 },
  "18": { swapId: "49", reason: "fresher and 8% lower carbon footprint", distance: 0 },
  "4": { swapId: "9", reason: "oat milk is a sustainable protein alternative", distance: 0 },
  
  // PANTRY - Conventional to Organic
  "19": { swapId: "20", reason: "organic brown rice is healthier and supports sustainable farming", distance: 0 },
  "26": { swapId: "53", reason: "natural peanut butter saves €3.00 and has similar nutrition", distance: 0 },
  "55": { swapId: "31", reason: "organic granola is a healthier sweet alternative", distance: 0 },
  "56": { swapId: "30", reason: "olive oil is more versatile and €1.50 cheaper", distance: 0 },
  
  // NUTS & SEEDS - Imported to Local/Lower Impact
  "57": { swapId: "58", reason: "walnuts have omega-3 and 21% less CO₂", distance: 0 },
  "59": { swapId: "58", reason: "walnuts are locally sourced and save €0.50", distance: 0 },
  
  // BEVERAGES - Standard to Sustainable
  "9": { swapId: "47", reason: "soy milk has similar protein and 33% more CO₂ efficient", distance: 0 },
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
      const cartData: CartData = JSON.parse(storedCart);
      
      // Handle both old array format and new object format
      let cartObj: CartData;
      if (Array.isArray(cartData)) {
        cartObj = {};
        cartData.forEach(id => {
          cartObj[id] = 1;
        });
      } else {
        cartObj = cartData;
      }

      const items: CartItem[] = Object.entries(cartObj).map(([id, quantity]) => {
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
          quantity,
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
    .reduce((sum, item) => sum + (item.co2 * item.quantity), 0);

  const totalPrice = cartItems
    .filter((item) => item.inCart)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const totalItems = cartItems
    .filter((item) => item.inCart)
    .reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setCartItems(items => {
      const updatedItems = items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      // Update localStorage
      const cartData: CartData = {};
      updatedItems.forEach(item => {
        cartData[item.id] = item.quantity;
      });
      localStorage.setItem('cartItems', JSON.stringify(cartData));

      return updatedItems;
    });
  };

  const handleSwapAccept = (itemId: string) => {
    setCartItems((items) => {
      const updatedItems = items.map((item) => {
        if (item.id === itemId && item.swapSuggestion) {
          // Find the swap product ID
          const swapId = swapSuggestions[itemId]?.swapId;
          const swapProduct = allProducts.find(p => p.id === swapId);
          
          if (swapProduct) {
            return {
              ...swapProduct,
              quantity: item.quantity, // Preserve quantity
              inCart: true,
              hasSwap: false,
              swapSuggestion: undefined,
            };
          }
        }
        return item;
      });

      // Update localStorage
      const cartData: CartData = {};
      updatedItems.forEach(item => {
        cartData[item.id] = item.quantity;
      });
      localStorage.setItem('cartItems', JSON.stringify(cartData));

      return updatedItems;
    });
    setShowComparison(null);
  };

  const handleSwapReject = (itemId: string, reason: string) => {
    setRejectionReasons({ ...rejectionReasons, [itemId]: reason });
    setTimeout(() => {
      setRejectionReasons({ ...rejectionReasons, [itemId]: null });
    }, 3000);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    
    // Update localStorage
    const cartData: CartData = {};
    updatedItems.forEach(item => {
      cartData[item.id] = item.quantity;
    });
    localStorage.setItem('cartItems', JSON.stringify(cartData));
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

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
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
                            <div className="bg-white rounded-lg p-4 border space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Impact Comparison</h4>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setShowComparison(null)}
                                  className="text-xs text-gray-500"
                                >
                                  Close
                                </Button>
                              </div>
                              
                              {/* Product Comparison Cards */}
                              <div className="grid grid-cols-2 gap-3">
                                {/* Current Product */}
                                <div className="border rounded-lg p-3 bg-gray-50">
                                  <div className="text-xs text-gray-500 mb-2">Current</div>
                                  <div className="w-full h-20 rounded overflow-hidden mb-2">
                                    <ImageWithFallback
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="text-xs font-medium mb-1">{item.name}</div>
                                  <div className="text-xs text-gray-600">
                                    <div>€{item.price.toFixed(2)}</div>
                                    <div>{item.co2.toFixed(1)} kg CO₂</div>
                                  </div>
                                </div>

                                {/* Suggested Product */}
                                <div className="border-2 border-green-500 rounded-lg p-3 bg-green-50">
                                  <div className="text-xs text-green-700 mb-2 font-medium">Suggested</div>
                                  <div className="w-full h-20 rounded overflow-hidden mb-2">
                                    <ImageWithFallback
                                      src={item.swapSuggestion.image}
                                      alt={item.swapSuggestion.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="text-xs font-medium mb-1">{item.swapSuggestion.name}</div>
                                  <div className="text-xs text-gray-600">
                                    <div className="text-green-700">€{item.swapSuggestion.price.toFixed(2)}</div>
                                    <div className="text-green-700">{item.swapSuggestion.co2.toFixed(1)} kg CO₂</div>
                                  </div>
                                </div>
                              </div>

                              {/* Chart */}
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

                              {/* Savings Summary */}
                              <div className="bg-green-50 rounded p-3">
                                <div className="text-xs font-medium text-green-900 mb-1">Potential Savings</div>
                                <div className="flex gap-4 text-xs text-green-800">
                                  <div>
                                    <span className="font-semibold">€{Math.abs(item.price - item.swapSuggestion.price).toFixed(2)}</span>
                                    {item.price > item.swapSuggestion.price ? " saved" : " more"}
                                  </div>
                                  <div>
                                    <span className="font-semibold">{Math.abs(item.co2 - item.swapSuggestion.co2).toFixed(1)} kg CO₂</span>
                                    {item.co2 > item.swapSuggestion.co2 ? " reduced" : " more"}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSwapAccept(item.id)}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Accept Swap
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowComparison(null)}
                                  className="flex-1"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Decline
                                </Button>
                              </div>

                              {/* Rejection Reasons */}
                              <div className="pt-3 border-t">
                                <p className="text-xs text-gray-600 mb-2">Not interested? Tell us why:</p>
                                <div className="flex gap-2 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      handleSwapReject(item.id, "Too Expensive");
                                      setShowComparison(null);
                                    }}
                                    className="text-xs"
                                  >
                                    Too Expensive
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      handleSwapReject(item.id, "Don't Like Taste");
                                      setShowComparison(null);
                                    }}
                                    className="text-xs"
                                  >
                                    Don't Like Taste
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      handleSwapReject(item.id, "Need Specific Brand");
                                      setShowComparison(null);
                                    }}
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
                    <span className="font-medium">{totalItems}</span>
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