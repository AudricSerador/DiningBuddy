import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import FavOnClickModal from "./fav_onclick_modal";

interface FavoriteBtnProps {
  userId: string;
  foodId: string;
  foodName: string;
}

const FavoriteBtn: React.FC<FavoriteBtnProps> = ({
  userId,
  foodId,
  foodName,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleFavorite = async () => {
    if (userId === "") {
      setShowModal(true);
      return;
    }

    const response = await fetch("/api/favorite/create_favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        foodId,
      }),
    });

    if (response.ok) {
      setIsFavorited(true);
      toast.success(
        <>
          <strong>{foodName}</strong> has been favorited!
        </>,
        {
          icon: (
            <span role="img" aria-label="star" style={{ fontSize: "20px" }}>
              🌟
            </span>
          ),
        }
      );
    } else {
      console.error("Failed to favorite");
      toast.error("Failed to favorite food.");
    }
  };

  const handleUnfavorite = async () => {
    const response = await fetch("/api/favorite/delete_favorite", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        foodId,
      }),
    });

    if (response.ok) {
      setIsFavorited(false);
      toast.success(
        <>
          <strong>{foodName}</strong> removed from favorites.
        </>,
        {
          icon: (
            <span role="img" aria-label="star" style={{ fontSize: "20px" }}>
              🗑️
            </span>
          ),
        }
      );
    } else {
      console.error("Failed to unfavorite");
      toast.error("Failed to unfavorite food.");
    }
  };

  return (
    <>
      <button
        onClick={isFavorited ? handleUnfavorite : handleFavorite}
        className={`star-btn text-5xl transition-colors duration-200 ${
          isFavorited
            ? "text-yellow-500 hover:text-yellow-600"
            : "text-gray-500 hover:text-gray-600"
        }`}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorited ? "★" : "☆"}
      </button>
      {showModal && <FavOnClickModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default FavoriteBtn;
