import ReviewForm from "@/components/ReviewForm";

export default function RestaurantReviewPage() {
  return (
    <main className="h-screen flex bg-primary justify-center items-center">
      <div className="w-[300px]">
        <ReviewForm variant="Create" />
      </div>
    </main>
  );
}
