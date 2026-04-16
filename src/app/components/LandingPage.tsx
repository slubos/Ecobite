import { useNavigate } from "react-router";
import { Leaf, TrendingDown, Shield, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingDown,
      title: "Carbon Tracking",
      description: "We calculate the CO₂ of every mile traveled.",
    },
    {
      icon: Shield,
      title: "Ethics Engine",
      description: "From plastic-free packaging to animal welfare.",
    },
    {
      icon: DollarSign,
      title: "Price Protection",
      description: "Sustainable shouldn't mean expensive. We find the best deals.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-xl font-semibold">Eco-Bite</span>
          </div>
          <nav className="flex gap-6 text-sm">
            <button onClick={() => navigate("/discover")} className="text-gray-600 hover:text-gray-900">
              Discover
            </button>
            <button onClick={() => navigate("/shop")} className="text-gray-600 hover:text-gray-900">
              Shop
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl leading-tight">
              Shop like the planet depends on it. Because it does.
            </h1>
            <p className="text-xl text-gray-600">
              Personalized groceries that match your taste, your budget, and your carbon goals.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
            >
              Build My Ethical Profile
            </Button>
          </div>
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1772480790826-91624eb300ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGxvY2FsJTIwcHJvZHVjZSUyMHdvb2RlbiUyMHRhYmxlfGVufDF8fHx8MTc3NjMyNzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Fresh local produce on wooden table"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Transparency Trio */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl text-center mb-4">The Eco-Score Logic</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Every recommendation is powered by transparent, verifiable metrics that put you in control.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Join the Movement</p>
          <p className="text-4xl">
            <span className="text-green-600">12,847</span> shoppers already reducing their carbon footprint
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-sm text-gray-600">Eco-Bite © 2026</span>
            </div>
            <p className="text-sm text-gray-500">Making sustainable choices easier, one cart at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}