import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, ArrowRight, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [carbonPriority, setCarbonPriority] = useState([50]);
  const [budgetSensitivity, setBudgetSensitivity] = useState([50]);
  const [animalWelfare, setAnimalWelfare] = useState([50]);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  const handleComplete = () => {
    // Store preferences in localStorage for use in other pages
    localStorage.setItem('ecoPreferences', JSON.stringify({
      carbonPriority: carbonPriority[0],
      budgetSensitivity: budgetSensitivity[0],
      animalWelfare: animalWelfare[0],
      hasAllergies,
      allergies,
      isVegan,
      isGlutenFree,
    }));
    navigate("/shop");
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter(a => a !== allergy));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-xl font-semibold">Eco-Bite</span>
          </div>
          <button onClick={() => navigate("/")} className="text-sm text-gray-600 hover:text-gray-900">
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-3">What do you stand for today?</h1>
          <p className="text-lg text-gray-600">
            Customize your shopping experience to align with your values
          </p>
        </div>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-8 space-y-10">
            {/* Preference Matrix */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl mb-6">Preference Matrix</h2>
                <p className="text-sm text-gray-600 mb-8">
                  Set your priorities—these sliders help us recommend products that match what matters most to you.
                </p>
                
                {/* Carbon Footprint Slider */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">Carbon Footprint Priority</Label>
                    <span className="text-sm text-gray-500">
                      {carbonPriority[0] < 33 ? "Low Priority" : carbonPriority[0] < 67 ? "Medium Priority" : "High Priority"}
                    </span>
                  </div>
                  <Slider
                    value={carbonPriority}
                    onValueChange={setCarbonPriority}
                    max={100}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low Priority</span>
                    <span>High Priority</span>
                  </div>
                </div>

                {/* Budget Sensitivity Slider */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">Budget Sensitivity</Label>
                    <span className="text-sm text-gray-500">
                      {budgetSensitivity[0] < 33 ? "€" : budgetSensitivity[0] < 67 ? "€€" : "€€€"}
                    </span>
                  </div>
                  <Slider
                    value={budgetSensitivity}
                    onValueChange={setBudgetSensitivity}
                    max={100}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Budget-Conscious (€)</span>
                    <span>Premium OK (€€€)</span>
                  </div>
                </div>

                {/* Animal Welfare Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">Animal Welfare Standards</Label>
                    <span className="text-sm text-gray-500">
                      {animalWelfare[0] < 33 ? "Standard" : animalWelfare[0] < 67 ? "Certified" : "Gold-Certified"}
                    </span>
                  </div>
                  <Slider
                    value={animalWelfare}
                    onValueChange={setAnimalWelfare}
                    max={100}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Standard</span>
                    <span>Gold-Certified</span>
                  </div>
                </div>
              </div>

              {/* Dietary Constraints */}
              <div className="pt-8 border-t">
                <h3 className="text-lg mb-4">Dietary Constraints</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Hard filters—products that don't meet these criteria will be completely removed from your recommendations.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allergies" className="text-base cursor-pointer">
                      I have allergies
                    </Label>
                    <Switch
                      id="allergies"
                      checked={hasAllergies}
                      onCheckedChange={setHasAllergies}
                    />
                  </div>

                  {/* Allergy Specification */}
                  {hasAllergies && (
                    <div className="ml-4 p-4 bg-gray-50 rounded-lg space-y-3">
                      <Label className="text-sm">Specify your allergies:</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Nuts, Dairy, Shellfish"
                          value={allergyInput}
                          onChange={(e) => setAllergyInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addAllergy();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addAllergy}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {allergies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {allergies.map((allergy, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1 flex items-center gap-2"
                            >
                              {allergy}
                              <button
                                onClick={() => removeAllergy(allergy)}
                                className="hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="vegan" className="text-base cursor-pointer">
                      I am Vegan
                    </Label>
                    <Switch
                      id="vegan"
                      checked={isVegan}
                      onCheckedChange={setIsVegan}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gluten-free" className="text-base cursor-pointer">
                      I am Gluten-Free
                    </Label>
                    <Switch
                      id="gluten-free"
                      checked={isGlutenFree}
                      onCheckedChange={setIsGlutenFree}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Button */}
            <div className="pt-6">
              <Button
                onClick={handleComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
              >
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          You can update these preferences anytime from your account settings.
        </p>
      </main>
    </div>
  );
}