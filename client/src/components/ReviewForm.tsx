"use client";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";

export default function ReviewForm() {
  const [star, setStar] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const handleStarClick = (star: number) => {
    setStar(star);
  };

  return (
    <div className="bg-white space-y-4 w-[300px] rounded-[32px] shadow-lg shadow-slate-400 p-4">
      <div className="flex justify-center">
        <p className="text-lg font-medium">Complete!</p>
      </div>
      <div className="space-y-2.5">
        <p className="text-base">review this restaurant</p>
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((object, index) => {
            return (
              <StarIcon
                key={`ster_${object}`}
                className={
                  object <= star
                    ? "text-5xl text-yellow"
                    : "text-5xl text-slate-300"
                }
                onClick={() => handleStarClick(object)}
              />
            );
          })}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            id="comment"
            placeholder="comment something..."
            className="bg-white w-4/5 text-xs border border-[#D9D9D9] rounded-md px-1.5 py-2.5"
            onChange={(e) => setReview(e.target.value)}
          />
          <button className="border border-[2px] border-[#3D79FE] rounded-md text-[#3D79FE] px-4">
            Post
          </button>
        </div>
      </div>

      <button className="w-full bg-[#3D79FE] text-white border rounded-md py-3">
        Got it!
      </button>
    </div>
  );
}
