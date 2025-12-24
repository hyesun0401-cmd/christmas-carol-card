import { EnvelopeReveal } from "./ui/EnvelopeReveal";
import { PosterLayout } from "../../ui/PosterLayout";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CardPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <PosterLayout
      kicker="A GIFT FOR YOU"
      title="Tap the envelope."
      subtitle="A message and one carol will appear the moment you open it."
      footer="If animations feel heavy, your device settings may reduce motion automatically."
    >
      <EnvelopeReveal cardId={id} />
    </PosterLayout>
  );
}


