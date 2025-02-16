import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDrag } from "@use-gesture/react";
import ImagePreloader from "./components/ImagePreloader";
import { Card, initialCards } from "./data/cards";

function CardStack() {
  const [cardIndex, setCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState(0);
  const [exitAxis, setExitAxis] = useState<"x" | "y">("x");
  const [swipeDirection, setSwipeDirection] = useState<
    "left" | "right" | "up" | "down" | null
  >(null);
  const [bwFilterEnabled, setBWFilterEnabled] = useState(false);
  const [swipeCounts, setSwipeCounts] = useState({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  });

  const swipeTimeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  const clearTimeouts = () => {
    if (swipeTimeoutRef.current) {
      clearTimeout(swipeTimeoutRef.current);
      swipeTimeoutRef.current = null;
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  };

  const resetSwipeState = () => {
    setIsExiting(false);
    setDragX(0);
    setDragY(0);
    setIsDragging(false);
    setSwipeDirection(null);
    clearTimeouts();
  };

  const handleSwipe = (direction: number, axis: "x" | "y") => {
    clearTimeouts();
    setIsInitialState(false);

    const currentCard = initialCards[cardIndex];
    if (currentCard.type === "switch" && axis === "x") {
      const action = direction > 0 ? currentCard.right : currentCard.left;
      setBWFilterEnabled(action === "bwfilter");
    }

    setExitDirection(direction);
    setExitAxis(axis);
    setIsExiting(true);

    let newDirection: "left" | "right" | "up" | "down" | null = null;

    if (axis === "x") {
      newDirection = direction > 0 ? "right" : "left";
    } else {
      newDirection = direction > 0 ? "down" : "up";
    }

    setSwipeDirection(newDirection);

    // Only update swipe counts for image cards
    if (newDirection && currentCard.type === "image") {
      setSwipeCounts((prev) => ({
        ...prev,
        [newDirection!]: prev[newDirection!] + 1,
      }));
    }

    swipeTimeoutRef.current = window.setTimeout(() => {
      setCardIndex((current) => {
        const nextIndex = (current + 1) % initialCards.length;
        // Reset counters when moving past the result card
        if (currentCard.type === "result") {
          setSwipeCounts({ up: 0, down: 0, left: 0, right: 0 });
        }
        if (nextIndex === 0) {
          setBWFilterEnabled(false);
        }
        return nextIndex;
      });

      setDragX(0);
      setDragY(0);
      setIsExiting(false);

      resetTimeoutRef.current = window.setTimeout(() => {
        setSwipeDirection(null);
      }, 1000);
    }, 200);
  };

  const bind = useDrag(
    ({ movement: [x, y], velocity: [vx, vy], active, cancel, event }) => {
      // Prevent default to stop text selection
      event.preventDefault();

      if (isExiting) {
        cancel();
        return;
      }

      setIsDragging(active);

      if (active) {
        const absX = Math.abs(x);
        const absY = Math.abs(y);

        if (absX > absY) {
          setDragX(x);
          setDragY(0);
          if (absX > 20) {
            setSwipeDirection(x > 0 ? "right" : "left");
          }
        } else {
          setDragX(0);
          setDragY(y);
          if (absY > 20) {
            setSwipeDirection(y > 0 ? "down" : "up");
          }
        }
      } else {
        const absX = Math.abs(x);
        const absY = Math.abs(y);
        const absVx = Math.abs(vx);
        const absVy = Math.abs(vy);

        if (absX > absY) {
          if (absX > 100 || absVx > 0.5) {
            handleSwipe(x > 0 ? 1 : -1, "x");
          } else {
            resetSwipeState();
          }
        } else {
          if (absY > 100 || absVy > 0.5) {
            handleSwipe(y > 0 ? 1 : -1, "y");
          } else {
            resetSwipeState();
          }
        }
      }
    },
    {
      filterTaps: true,
      from: () => [dragX, dragY],
      bounds: { left: -1000, right: 1000, top: -1000, bottom: 1000 },
      rubberband: true,
    }
  );

  const renderCardContent = (card: Card, index: number) => {
    if (card.type === "image") {
      return {
        style: {
          backgroundImage: `url(${card.content})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          touchAction: "none",
          userSelect: "none",
          filter: bwFilterEnabled ? "grayscale(100%)" : "none",
        },
        y: card.y,
        rotateZ: card.rotateZ,
      };
    } else if (card.type === "result") {
      const totalSwipes = Object.values(swipeCounts).reduce((a, b) => a + b, 0);
      return {
        style: {
          touchAction: "none",
          userSelect: "none",
        },
        className: card.bgClassName,
        html: (
          <div className="w-full h-full flex flex-col items-center justify-center select-none text-slate-200">
            <div className="text-4xl font-bold mb-8">Image Swipes</div>
            <div className="text-2xl space-y-4">
              <div>⬆️ Up: {swipeCounts.up}</div>
              <div>⬇️ Down: {swipeCounts.down}</div>
              <div>⬅️ Left: {swipeCounts.left}</div>
              <div>➡️ Right: {swipeCounts.right}</div>
              <div className="pt-4 text-xl opacity-75">
                Total: {totalSwipes}
              </div>
            </div>
          </div>
        ),
        y: card.y,
        rotateZ: card.rotateZ,
      };
    } else {
      return {
        style: {
          touchAction: "none",
          userSelect: "none",
        },
        className: card.bgClassName,
        html: (
          <div
            className="w-full h-full flex items-center justify-center select-none"
            dangerouslySetInnerHTML={{ __html: card.content }}
          />
        ),
        y: card.y,
        rotateZ: card.rotateZ,
      };
    }
  };

  const visibleCards = initialCards
    .slice(cardIndex)
    .concat(initialCards.slice(0, cardIndex));

  return (
    <div className="h-dvh bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="relative w-[300px] h-[450px]">
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            {visibleCards.map((card, index) => {
              const cardContent = renderCardContent(card, index);
              const isFirstCard = index === 0;
              const isLastCard = index === visibleCards.length - 1;

              return (
                <motion.div
                  key={`${card.content}-${cardIndex}`}
                  {...(isFirstCard ? bind() : {})}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    pointerEvents: isFirstCard ? "auto" : "none",
                    cursor:
                      isFirstCard && !isDragging
                        ? "grab"
                        : isFirstCard
                        ? "grabbing"
                        : "default",
                    transformOrigin: "50% 50%",
                    ...cardContent.style,
                  }}
                  initial={
                    isLastCard && !isInitialState
                      ? {
                          x: 0,
                          y: cardContent.y + 50,
                          zIndex: -1,
                          rotateZ: cardContent.rotateZ,
                          opacity: 0,
                        }
                      : {
                          x: 0,
                          y: cardContent.y,
                          zIndex: visibleCards.length - index,
                          rotateZ: cardContent.rotateZ,
                          opacity: 1,
                        }
                  }
                  animate={{
                    x: isFirstCard
                      ? isExiting && exitAxis === "x"
                        ? exitDirection * window.innerWidth
                        : dragX
                      : 0,
                    y:
                      (isFirstCard
                        ? isExiting && exitAxis === "y"
                          ? exitDirection * window.innerHeight
                          : dragY
                        : 0) + cardContent.y,
                    zIndex: visibleCards.length - index,
                    rotateZ: isFirstCard
                      ? isExiting
                        ? exitDirection * 45
                        : cardContent.rotateZ +
                          (exitAxis === "x" ? dragX * 0.1 : dragY * 0.1)
                      : cardContent.rotateZ,
                    opacity: isFirstCard && isExiting ? 0 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.5,
                    ...(isExiting &&
                      isFirstCard && {
                        duration: 0.2,
                        type: "tween",
                        ease: "easeOut",
                      }),
                  }}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  className={cardContent.className}
                >
                  {cardContent.html}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {swipeDirection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white font-mono text-sm"
          >
            {swipeDirection === "up"
              ? "⬆️ Up"
              : swipeDirection === "down"
              ? "⬇️ Down"
              : swipeDirection === "left"
              ? "⬅️ Left"
              : swipeDirection === "right"
              ? "➡️ Right"
              : ""}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {swipeDirection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white font-mono text-sm"
          >
            {bwFilterEnabled ? "B&W Mode" : "Color Mode"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ImagePreloader cards={initialCards}>
      <CardStack />
    </ImagePreloader>
  );
}

export default App;
