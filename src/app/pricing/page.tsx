'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createStripeCheckoutSession } from '@/lib/stripe/actions';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

const plans = [
  {
    name: 'Hobby',
    price: '$0',
    priceDescription: 'per month',
    description: 'For personal projects and experiments.',
    features: ['1 user', '1 project', '1GB storage'],
    isPopular: false,
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$29',
    priceDescription: 'per month',
    description: 'For professionals and small teams.',
    features: ['10 users', 'Unlimited projects', '100GB storage', 'Priority support'],
    isPopular: true,
    cta: 'Upgrade to Pro',
    priceId: 'price_1STn4R8bQ1wpTXPRVuDAgNp0',
  },
  {
    name: 'Custom',
    price: 'Contact Us',
    priceDescription: '',
    description: 'For large organizations with custom needs.',
    features: ['Unlimited users', 'Custom integrations', 'Dedicated support', 'On-premise option'],
    isPopular: false,
    cta: 'Contact Sales',
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const handleCtaClick = async (plan: (typeof plans)[0]) => {
    if (plan.name === 'Hobby') {
      // Handle hobby plan click - maybe redirect to dashboard
      window.location.href = '/';
    } else if (plan.name === 'Custom') {
      // Handle custom plan click - maybe redirect to contact page
      window.location.href = '/contact';
    } else if (plan.priceId) {
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to upgrade your plan.',
          variant: 'destructive',
        });
        return;
      }
      setLoadingPlan(plan.name);
      try {
        const sessionURL = await createStripeCheckoutSession(plan.priceId, user.email || '');
        if (sessionURL) {
          window.location.href = sessionURL;
        } else {
          throw new Error('Could not create Stripe session.');
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
        console.error(error);
      } finally {
        setLoadingPlan(null);
      }
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that's right for you. No hidden fees.
              </p>
            </div>
            <div className="mx-auto grid max-w-sm items-start gap-8 py-12 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.name} className={cn('relative', plan.isPopular && 'border-2 border-primary')}>
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="p-6">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold tracking-tighter">{plan.price}</span>
                      {plan.priceDescription && <span className="text-sm text-muted-foreground">{plan.priceDescription}</span>}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button
                      className="w-full"
                      variant={plan.isPopular ? 'default' : 'outline'}
                      onClick={() => handleCtaClick(plan)}
                      disabled={loadingPlan === plan.name}
                    >
                      {loadingPlan === plan.name ? 'Processing...' : plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
