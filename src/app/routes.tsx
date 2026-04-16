import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { ShopPage } from "./components/ShopPage";
import { SmartCartPage } from "./components/SmartCartPage";
import { DiscoveryPage } from "./components/DiscoveryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/onboarding",
    Component: OnboardingPage,
  },
  {
    path: "/shop",
    Component: ShopPage,
  },
  {
    path: "/cart",
    Component: SmartCartPage,
  },
  {
    path: "/discover",
    Component: DiscoveryPage,
  },
]);
