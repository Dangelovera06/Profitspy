import { Hero } from './Hero';

export default function InfiniteHero() {
  return (
    <Hero
      title="ProfitSpy"
      subtitle="Discover high-performing ads and recreate them for your campaigns"
      actions={[
        {
          label: "Go to Dashboard",
          href: "/dashboard",
          variant: "default",
          size: "lg"
        }
      ]}
      titleClassName="profitspy-title"
      subtitleClassName="profitspy-subtitle"
      actionsClassName="profitspy-actions"
    />
  );
}
