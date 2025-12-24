import { CreateCardForm } from "./ui/CreateCardForm";
import { PosterLayout } from "../ui/PosterLayout";

export default function CreatePage() {
  return (
    <PosterLayout
      variant="green"
      kicker="CHRISTMAS CAROL CARD"
      title={
        <>
          Write a card,
          <br />
          seal it with a carol.
        </>
      }
      subtitle="Pick an artist and one carol will be locked into your link."
      footer="Tip: Keep it short. The envelope reveal is the main event."
    >
      <section className="mx-auto w-full max-w-xl rounded-[28px] bg-[#FDFBF7] p-5 text-[#06281f] shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-6">
        <CreateCardForm variant="green" />
      </section>
    </PosterLayout>
  );
}


