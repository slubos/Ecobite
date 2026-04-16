import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Leaf, ShoppingCart, TrendingDown, Plus, Check, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts, type Product } from "../data/products";

// Cart now stores { productId: quantity }
type CartData = { [productId: string]: number };

export function ShopPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartData>({});
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Handle both old format (array) and new format (object)
        if (Array.isArray(parsedCart)) {
          // Convert old array format to new object format
          const cartObj: CartData = {};
          parsedCart.forEach(id => {
            cartObj[id] = 1;
          });
          setCart(cartObj);
          localStorage.setItem('cartItems', JSON.stringify(cartObj));
        } else {
          setCart(parsedCart);
        }
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const categories = ["All", "Fruits", "Vegetables", "Meat", "Meat Alternatives", "Seafood", "Dairy & Eggs", "Bakery", "Pantry", "Nuts & Seeds", "Beverages"];

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const handleGoToCart = () => {
    // Cart is already saved to localStorage via useEffect
    navigate("/cart");
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-xl font-semibold">Eco-Bite</span>
          </div>
          <nav className="flex gap-6 text-sm items-center">
            <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-900">
              Home
            </button>
            <button onClick={() => navigate("/discover")} className="text-gray-600 hover:text-gray-900">
              Discover
            </button>
            <Button 
              onClick={handleGoToCart}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              disabled={totalItems === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{totalItems}</span>
              View Cart
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-3">Shop Sustainable Groceries</h1>
          <p className="text-lg text-gray-600">
            Browse our selection of eco-friendly products tailored to your values
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 bg-white p-2 rounded-lg border">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const quantity = cart[product.id] || 0;
            const isInCart = quantity > 0;
            return (
              <Card key={product.id} className="bg-white hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.local && (
                    <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs">
                      Local
                    </Badge>
                  )}
                  {product.organic && (
                    <Badge className="absolute top-2 right-2 bg-blue-600 text-white text-xs">
                      Organic
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-lg">€{product.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1 text-gray-600">
                        <TrendingDown className="w-3 h-3 text-green-600" />
                        <span className="text-xs">{product.co2} kg CO₂</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {isInCart ? (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => removeFromCart(product.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 rounded">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{quantity}</span>
                      </div>
                      <Button
                        onClick={() => addToCart(product.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(product.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}