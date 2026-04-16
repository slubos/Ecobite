import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, ShoppingCart, TrendingDown, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: string;
  name: string;
  price: number;
  co2: number;
  category: string;
  image: string;
  tags: string[];
  distance?: number;
  local?: boolean;
  organic?: boolean;
}

const allProducts: Product[] = [
  // FRUITS - High variance in pricing and CO2
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
    distance: 47,
    local: true,
  },
  {
    id: "11",
    name: "Local Apples",
    price: 3.79,
    co2: 0.2,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1744801283301-5a58c498794d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwYXBwbGVzJTIwZnJ1aXR8ZW58MXx8fHwxNzc2MjI5MjU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local", "Organic"],
    local: true,
    organic: true,
  },
  {
    id: "13",
    name: "Organic Bananas",
    price: 2.99,
    co2: 0.5,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1774983882471-abcf681085cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJhbmFuYXMlMjBmcnVpdCUyMGJ1bmNofGVufDF8fHx8MTc3NjMyODkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic"],
    organic: true,
  },
  {
    id: "23",
    name: "Fresh Oranges",
    price: 4.29,
    co2: 0.4,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1661669273498-ee01566be6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2VzJTIwY2l0cnVzJTIwZnJ1aXQlMjBmcmVzaHxlbnwxfHx8fDE3NzYzMjg5NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Vitamin-C"],
  },
  {
    id: "24",
    name: "Ripe Avocados",
    price: 5.49,
    co2: 0.9,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1757332914587-6d3e174e0e19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvcyUyMHJpcGUlMjBmcmVzaCUyMGZydWl0fGVufDF8fHx8MTc3NjMyODk0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Healthy-Fats"],
  },
  {
    id: "32",
    name: "Fresh Blueberries",
    price: 5.99,
    co2: 0.6,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1628104102181-a4688bcf2724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlYmVycmllcyUyMGZyZXNoJTIwYmVycmllcyUyMG9yZ2FuaWN8ZW58MXx8fHwxNzc2MzI4OTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic", "Local"],
    local: true,
    organic: true,
  },

  // VEGETABLES - Very diverse pricing and footprints
  {
    id: "3",
    name: "Organic Spinach",
    price: 2.49,
    co2: 0.4,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1634731201932-9bd92839bea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwaW5hY2glMjBsZWF2ZXN8ZW58MXx8fHwxNzc2MzI3NzU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic", "Local"],
    local: true,
    organic: true,
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
    local: true,
  },
  {
    id: "6",
    name: "Organic Tomatoes",
    price: 3.49,
    co2: 0.6,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG9lcyUyMGZyZXNoJTIwcHJvZHVjZXxlbnwxfHx8fDE3NzYzMTQ4NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic"],
    organic: true,
  },
  {
    id: "7",
    name: "Organic Carrots",
    price: 2.29,
    co2: 0.3,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY2Fycm90cyUyMGJ1bmNofGVufDF8fHx8MTc3NjI0OTAzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic", "Local"],
    local: true,
    organic: true,
  },
  {
    id: "12",
    name: "Fresh Broccoli",
    price: 2.89,
    co2: 0.4,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1757332334626-8dadb145540d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyb2Njb2xpJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3NjMyMjA0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
    local: true,
  },
  {
    id: "14",
    name: "Organic Potatoes",
    price: 3.29,
    co2: 0.3,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1744659751904-3b2e5c095323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwcG90YXRvZXMlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc3NjI2OTY4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic", "Local"],
    local: true,
    organic: true,
  },
  {
    id: "21",
    name: "Fresh Bell Peppers",
    price: 4.49,
    co2: 0.5,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1757332334667-d2e75d5816ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJlbGwlMjBwZXBwZXJzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzc2MzI4OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
    local: true,
  },
  {
    id: "22",
    name: "Organic Lettuce",
    price: 2.79,
    co2: 0.3,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1741515042603-70545daeb0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwbGV0dHVjZSUyMGxlYWZ5JTIwZ3JlZW5zfGVufDF8fHx8MTc3NjMyODk0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic", "Local"],
    local: true,
    organic: true,
  },
  {
    id: "28",
    name: "Fresh Mushrooms",
    price: 3.99,
    co2: 0.4,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1608331542023-37dc03862c45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG11c2hyb29tcyUyMG9yZ2FuaWMlMjB2ZWdldGFibGV8ZW58MXx8fHwxNzc2MzI4OTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
    local: true,
  },
  {
    id: "29",
    name: "Yellow Onions",
    price: 1.99,
    co2: 0.2,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1639172486437-28d0e1ce6493?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmlvbnMlMjBmcmVzaCUyMHZlZ2V0YWJsZSUyMG9yZ2FuaWN8ZW58MXx8fHwxNzc2MzI4OTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
    local: true,
  },
  {
    id: "33",
    name: "Organic Kale",
    price: 3.29,
    co2: 0.3,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1698613321357-71be6dc6e866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYWxlJTIwZ3JlZW4lMjBsZWFmeSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzYzMjk4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic", "Superfood"],
    organic: true,
  },
  {
    id: "34",
    name: "Sweet Potatoes",
    price: 2.79,
    co2: 0.25,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1744659749700-c4213f840355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VldCUyMHBvdGF0byUyMG9yYW5nZSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzYzMjk4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
    local: true,
  },
  {
    id: "35",
    name: "Zucchini (Green)",
    price: 2.49,
    co2: 0.3,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1627770246352-35d53657538f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6dWNjaGluaSUyMGdyZWVuJTIwc3F1YXNoJTIwZnJlc2h8ZW58MXx8fHwxNzc2MzI5NjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
    local: true,
  },
  {
    id: "36",
    name: "Organic Eggplant",
    price: 3.49,
    co2: 0.4,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1659261822750-daa38e3020f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2dwbGFudCUyMHB1cnBsZSUyMGF1YmVyZ2luZSUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzYzMjk2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic"],
    organic: true,
  },
  {
    id: "37",
    name: "Fresh Asparagus",
    price: 5.99,
    co2: 0.6,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1592571798995-c045d7d730a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc3BhcmFndXMlMjBncmVlbiUyMHNwZWFycyUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzYzMjk4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Seasonal"],
  },
  {
    id: "38",
    name: "Organic Cauliflower",
    price: 4.29,
    co2: 0.4,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1773643940896-bae7e69e968c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXVsaWZsb3dlciUyMHdoaXRlJTIwdmVnZXRhYmxlJTIwaGVhZHxlbnwxfHx8fDE3NzYzMjk4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Organic"],
    organic: true,
  },
  {
    id: "39",
    name: "Brussels Sprouts",
    price: 3.79,
    co2: 0.4,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1668120082660-735234f1a845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVzc2VscyUyMHNwcm91dHMlMjBncmVlbiUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NzYzMjk4MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
    local: true,
  },

  // MEAT - High CO2, Higher prices
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
    id: "16",
    name: "Free-Range Chicken Breast",
    price: 9.49,
    co2: 6.9,
    category: "Meat",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0JTIwbWVhdCUyMHByb3RlaW58ZW58MXx8fHwxNzc2MzI4OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Free-Range"],
  },
  {
    id: "40",
    name: "Pork Chops",
    price: 7.99,
    co2: 12.1,
    category: "Meat",
    image: "https://images.unsplash.com/photo-1769434339536-f4be3cbed26b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3JrJTIwY2hvcHMlMjBtZWF0JTIwcmF3fGVufDF8fHx8MTc3NjMyOTgwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein"],
  },
  {
    id: "41",
    name: "Lamb Chops (Premium)",
    price: 18.99,
    co2: 39.2,
    category: "Meat",
    image: "https://images.unsplash.com/photo-1761983723667-99c7fd98af53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW1iJTIwbWVhdCUyMGNob3BzJTIwcHJvdGVpbnxlbnwxfHx8fDE3NzYzMjk4MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Premium"],
  },
  {
    id: "42",
    name: "Turkey Breast",
    price: 10.49,
    co2: 10.9,
    category: "Meat",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJrZXklMjBicmVhc3QlMjBtZWF0JTIwcG91bHRyeXxlbnwxfHx8fDE3NzYzMjk4MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Lean"],
  },

  // MEAT ALTERNATIVES - Low CO2, moderate prices
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
    id: "25",
    name: "Organic Tofu",
    price: 3.49,
    co2: 1.0,
    category: "Meat Alternatives",
    image: "https://images.unsplash.com/photo-1668434344247-5daf7c7aff63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2Z1JTIwYmxvY2slMjBwcm90ZWluJTIwdmVnYW58ZW58MXx8fHwxNzc2MzI4OTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Vegan", "Protein", "Low-Carbon"],
    organic: true,
  },

  // SEAFOOD - Varied CO2 and prices
  {
    id: "15",
    name: "Wild-Caught Salmon",
    price: 12.99,
    co2: 5.2,
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1772285253181-b1257afb3698?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBmaXNoJTIwZmlsbGV0JTIwZnJlc2h8ZW58MXx8fHwxNzc2MzI4OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Omega-3"],
  },
  {
    id: "43",
    name: "Fresh Shrimp",
    price: 15.99,
    co2: 26.9,
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1756364084889-9a8d9ece6112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJpbXAlMjBwcmF3bnMlMjBzZWFmb29kJTIwZnJlc2h8ZW58MXx8fHwxNzc2MzI5ODA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Premium"],
  },
  {
    id: "44",
    name: "Tuna Steaks",
    price: 14.49,
    co2: 6.1,
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1770839112008-f6a165687cca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5hJTIwZmlzaCUyMHN0ZWFrJTIwc3VzaGl8ZW58MXx8fHwxNzc2MzI5ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Omega-3"],
  },
  {
    id: "45",
    name: "Cod Fillets",
    price: 11.99,
    co2: 2.9,
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1773739685848-a46fb41ae4f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2QlMjBmaXNoJTIwd2hpdGUlMjBmaWxsZXR8ZW58MXx8fHwxNzc2MzI5ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Low-Carbon"],
  },

  // DAIRY & EGGS - Varied footprints
  {
    id: "4",
    name: "Free-Range Eggs",
    price: 3.99,
    co2: 1.8,
    category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1585355611444-06154f329e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVlJTIwcmFuZ2UlMjBlZ2dzJTIwY2FydG9ufGVufDF8fHx8MTc3NjMyNzc1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Free-Range"],
    local: true,
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
    id: "17",
    name: "Greek Yogurt (Organic)",
    price: 4.49,
    co2: 1.2,
    category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1763825613390-287a9db0803d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlayUyMHlvZ3VydCUyMGRhaXJ5JTIwb3JnYW5pY3xlbnwxfHx8fDE3NzYzMjg5Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Protein"],
    organic: true,
  },
  {
    id: "18",
    name: "Aged Cheddar Cheese",
    price: 5.99,
    co2: 2.3,
    category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1757857755327-5b38c51a0302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVkZGFyJTIwY2hlZXNlJTIwYmxvY2slMjBkYWlyeXxlbnwxfHx8fDE3NzYzMjg5Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Local"],
    local: true,
  },
  {
    id: "46",
    name: "Whole Milk (Dairy)",
    price: 2.99,
    co2: 1.9,
    category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1768850418251-17480117ac9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMG1pbGslMjBkYWlyeSUyMGJvdHRsZXxlbnwxfHx8fDE3NzYzMjk4MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Local"],
    local: true,
  },
  {
    id: "47",
    name: "Soy Milk",
    price: 3.49,
    co2: 0.6,
    category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1595177924963-751716e81b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3klMjBtaWxrJTIwcGxhbnQlMjBiYXNlZHxlbnwxfHx8fDE3NzYzMjk2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Vegan", "Low-Carbon"],
  },
  {
    id: "48",
    name: "Coconut Milk",
    price: 3.99,
    co2: 0.8,
    category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1641320785764-17cd1ab58a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwbWlsayUyMGNhcnRvbiUyMG9yZ2FuaWN8ZW58MXx8fHwxNzc2MzI5ODEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Vegan"],
  },
  {
    id: "49",
    name: "Fresh Mozzarella",
    price: 4.99,
    co2: 2.1,
    category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1596924699756-b7348645ffa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3p6YXJlbGxhJTIwY2hlZXNlJTIwZnJlc2glMjBiYWxsfGVufDF8fHx8MTc3NjMyOTgxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh"],
  },

  // BAKERY
  {
    id: "8",
    name: "Artisan Sourdough Bread",
    price: 4.29,
    co2: 0.7,
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1663904460424-91895028aa9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyZWFkJTIwbG9hZnxlbnwxfHx8fDE3NzYzMTI2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fresh", "Local"],
    local: true,
  },

  // PANTRY - Wide variance
  {
    id: "10",
    name: "Organic Chickpeas",
    price: 1.99,
    co2: 0.5,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1760942852135-e98d57fe0ba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja3BlYXMlMjBkcmllZCUyMGxlZ3VtZXN8ZW58MXx8fHwxNzc2MzI3NzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Vegan", "Protein"],
    organic: true,
  },
  {
    id: "19",
    name: "Whole Grain Pasta",
    price: 2.79,
    co2: 0.6,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1639585947237-614052c44ec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMGdyYWluJTIwcGFzdGElMjBkcnl8ZW58MXx8fHwxNzc2MzI4OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Whole Grain"],
  },
  {
    id: "20",
    name: "Organic Brown Rice",
    price: 3.99,
    co2: 0.8,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1763431158054-ccc996a3deac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwcmljZSUyMGdyYWluc3xlbnwxfHx8fDE3NzYzMDQzNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Whole Grain"],
    organic: true,
  },
  {
    id: "26",
    name: "Organic Almond Butter",
    price: 7.99,
    co2: 1.3,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1624209393671-5cdccd81a1eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG1vbmQlMjBidXR0ZXIlMjBqYXIlMjBzcHJlYWR8ZW58MXx8fHwxNzc2MzI4OTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Protein"],
    organic: true,
  },
  {
    id: "27",
    name: "Local Honey",
    price: 6.49,
    co2: 0.6,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1759442727303-4c08421317d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGphciUyMGdvbGRlbiUyMG5hdHVyYWx8ZW58MXx8fHwxNzc2MzE5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Local", "Natural"],
    local: true,
  },
  {
    id: "30",
    name: "Extra Virgin Olive Oil",
    price: 8.99,
    co2: 1.1,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1765850257647-811b8d3c20ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGl2ZSUyMG9pbCUyMGJvdHRsZSUyMHByZW1pdW18ZW58MXx8fHwxNzc2Mjg4NDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic"],
    organic: true,
  },
  {
    id: "31",
    name: "Organic Granola",
    price: 5.49,
    co2: 0.7,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1645517976245-569a91016f79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFub2xhJTIwY2VyZWFsJTIwaGVhbHRoeSUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NzYzMjg5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Whole Grain"],
    organic: true,
  },
  {
    id: "50",
    name: "Organic Quinoa",
    price: 6.99,
    co2: 0.9,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1644704170910-a0cdf183649b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWlub2ElMjBzZWVkcyUyMGdyYWluJTIwYm93bHxlbnwxfHx8fDE3NzYzMjk4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Protein", "Superfood"],
    organic: true,
  },
  {
    id: "51",
    name: "Black Beans (Dried)",
    price: 2.49,
    co2: 0.4,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1767911503405-c7cfcf67bcd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGJlYW5zJTIwbGVndW1lcyUyMHByb3RlaW58ZW58MXx8fHwxNzc2MzI5ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Vegan", "Protein", "Low-Carbon"],
  },
  {
    id: "52",
    name: "Red Lentils",
    price: 3.29,
    co2: 0.5,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1737732137216-677b7252a7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW50aWxzJTIwcmVkJTIwZHJpZWQlMjBwdWxzZXN8ZW58MXx8fHwxNzc2MzI5ODA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Vegan", "Protein", "Low-Carbon"],
  },
  {
    id: "53",
    name: "Peanut Butter (Natural)",
    price: 4.99,
    co2: 0.9,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1757801602612-30f20d8dd243?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFudXQlMjBidXR0ZXIlMjBqYXIlMjBzcHJlYWR8ZW58MXx8fHwxNzc2MzI5NjYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Natural"],
  },
  {
    id: "54",
    name: "Maple Syrup (Organic)",
    price: 9.99,
    co2: 1.2,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1740423099949-b0dfcabd91ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXBsZSUyMHN5cnVwJTIwYm90dGxlJTIwcGFuY2FrZXxlbnwxfHx8fDE3NzYzMjk4MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Natural"],
    organic: true,
  },
  {
    id: "55",
    name: "Dark Chocolate (Fair Trade)",
    price: 4.49,
    co2: 2.9,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1622484211828-17230f29dfa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2hvY29sYXRlJTIwYmFyJTIwb3JnYW5pY3xlbnwxfHx8fDE3NzYzMjk4MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Fair-Trade", "Organic"],
    organic: true,
  },
  {
    id: "56",
    name: "Organic Coconut Oil",
    price: 7.49,
    co2: 1.6,
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1703174323034-23a90537bab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwb2lsJTIwamFyJTIwb3JnYW5pY3xlbnwxfHx8fDE3NzYzMjk2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Vegan"],
    organic: true,
  },

  // NUTS & SEEDS - Higher prices, varied CO2
  {
    id: "57",
    name: "Organic Cashews",
    price: 8.99,
    co2: 1.4,
    category: "Nuts & Seeds",
    image: "https://images.unsplash.com/photo-1627820752174-acae1b399128?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNoZXclMjBudXRzJTIwcmF3JTIwb3JnYW5pY3xlbnwxfHx8fDE3NzYzMjk4MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Protein"],
    organic: true,
  },
  {
    id: "58",
    name: "Raw Walnuts",
    price: 7.49,
    co2: 1.1,
    category: "Nuts & Seeds",
    image: "https://images.unsplash.com/photo-1766186471435-4f23d1ac09f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxudXRzJTIwd2hvbGUlMjBzaGVsbCUyMG51dHN8ZW58MXx8fHwxNzc2MzI5ODE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Omega-3", "Protein"],
  },
  {
    id: "59",
    name: "Raw Almonds",
    price: 6.99,
    co2: 1.3,
    category: "Nuts & Seeds",
    image: "https://images.unsplash.com/photo-1772986799860-6dd2cd2f286d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG1vbmRzJTIwcmF3JTIwbnV0cyUyMGhlYWx0aHl8ZW58MXx8fHwxNzc2MzI5NjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Protein", "Healthy-Fats"],
  },
  {
    id: "60",
    name: "Chia Seeds (Organic)",
    price: 5.99,
    co2: 0.7,
    category: "Nuts & Seeds",
    image: "https://images.unsplash.com/photo-1760533535534-c69f637df2e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlhJTIwc2VlZHMlMjBzdXBlcmZvb2QlMjBvcmdhbmljfGVufDF8fHx8MTc3NjMyOTgxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Superfood", "Omega-3"],
    organic: true,
  },

  // BEVERAGES - New category
  {
    id: "61",
    name: "Organic Matcha Powder",
    price: 12.99,
    co2: 1.8,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1708573106044-2bbefb3d9fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRlYSUyMG1hdGNoYSUyMHBvd2RlcnxlbnwxfHx8fDE3NzYyMzk1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Organic", "Superfood"],
    organic: true,
  },
];

export function ShopPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Fruits", "Vegetables", "Meat", "Meat Alternatives", "Seafood", "Dairy & Eggs", "Bakery", "Pantry", "Nuts & Seeds", "Beverages"];

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  const toggleCart = (productId: string) => {
    if (cart.includes(productId)) {
      setCart(cart.filter(id => id !== productId));
    } else {
      setCart([...cart, productId]);
    }
  };

  const handleGoToCart = () => {
    // Store cart in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    navigate("/cart");
  };

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
              disabled={cart.length === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{cart.length}</span>
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
            const isInCart = cart.includes(product.id);
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

                  <Button
                    onClick={() => toggleCart(product.id)}
                    className={`w-full ${
                      isInCart
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        In Cart
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
