"use client";

import { Plan } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const plans: Plan[] = [
  {
    name: "free",
    price: 0,
    instances: 3,
    usage: "1 hour of usage",
    maxDuration: "20 mins per instance max",
    ads: true,
  },
  {
    name: "premium",
    price: 10,
    instances: 10,
    usage: "5 hours of usage",
    maxDuration: "30 mins per instance max",
    ads: true,
  },
  {
    name: "pro",
    price: 25,
    instances: 15,
    usage: "10 hours of usage",
    maxDuration: "40 mins per instance max",
    ads: false,
  },
];

const Pricing = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className="flex flex-col border-2 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <CardHeader className="bg-gray-50 p-6">
            <CardTitle className="text-2xl font-bold capitalize text-gray-800">
              {plan.name}
            </CardTitle>
            <CardDescription className="text-4xl font-extrabold text-gray-900">
              ${plan.price}
              <span className="text-base font-medium text-gray-500">/mo</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-grow">
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{plan.instances} instances</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{plan.usage}</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{plan.maxDuration}</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{plan.ads ? "Contains Ads" : "Ad-Free"}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="p-6 bg-gray-50">
            <Button className="w-full text-lg font-semibold">
              Select Plan
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Pricing;