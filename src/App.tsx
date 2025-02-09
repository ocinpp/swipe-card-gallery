import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDrag } from "@use-gesture/react";
import ImagePreloader from "./components/ImagePreloader";

// Define a type for our card content
type Card = {
  type: "image" | "html";
  bgClassName?: string;
  content: string;
  y: number;
  rotateZ: number;
};

// Sample cards with both images and HTML
const initialCards: Card[] = [
  {
    type: "html",
    bgClassName: "bg-gradient-to-r from-violet-500 to-blue-400",
    content:
      '<div class="text-4xl font-bold m-4 text-slate-200 pointer-events-none">Swipe or Drag to <u>Start</u></div>',
    y: 0,
    rotateZ: 0,
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1018/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1015/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1016/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1020/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1006/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1031/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1032/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1033/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1005/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1001/400/600",
    y: 25 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
    rotateZ: 45 * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
  },
  {
    type: "html",
    bgClassName: "bg-gradient-to-r from-red-500 to-rose-400",
    content:
      '<div class="text-4xl font-bold m-4 text-slate-200 pointer-events-none">Thank You for Viewing</div>',
    y: 0,
    rotateZ: 0,
  },
];

function CardStack() {
  const [cards, setCards] = useState(initialCards);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );

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
    setIsDragging(false);
    setSwipeDirection(null);
    clearTimeouts();
  };

  const handleSwipe = (direction: number) => {
    clearTimeouts();

    setExitDirection(direction);
    setIsExiting(true);
    setSwipeDirection(direction > 0 ? "right" : "left");

    swipeTimeoutRef.current = window.setTimeout(() => {
      setCards((current) => {
        const [first, ...rest] = current;
        return [...rest, first];
      });

      setDragX(0);
      setIsExiting(false);

      resetTimeoutRef.current = window.setTimeout(() => {
        setSwipeDirection(null);
      }, 1000);
    }, 200);
  };

  const bind = useDrag(
    ({ movement: [x], velocity: [vx], active, last, cancel, event }) => {
      // Prevent default to stop text selection
      event.preventDefault();

      if (isExiting) {
        cancel();
        return;
      }

      setIsDragging(active);

      if (active) {
        setDragX(x);
        if (Math.abs(x) > 20) {
          setSwipeDirection(x > 0 ? "right" : "left");
        }
      } else {
        if (Math.abs(x) > 100 || Math.abs(vx) > 0.5) {
          handleSwipe(x > 0 ? 1 : -1);
        } else {
          resetSwipeState();
        }
      }
    },
    {
      axis: "x",
      filterTaps: true,
      from: () => [dragX, 0],
      bounds: { left: -1000, right: 1000 },
      rubberband: true,
    }
  );

  const renderCardContent = (card: Card) => {
    if (card.type === "image") {
      return {
        style: {
          backgroundImage: `url(${card.content})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          touchAction: "none",
          userSelect: "none",
        },
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

  return (
    <div className="h-dvh bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="relative w-[300px] h-[450px]">
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            {cards.map((card, index) => {
              const cardContent = renderCardContent(card);
              return (
                <motion.div
                  key={`${card.content}-${index}`}
                  {...(index === 0 ? bind() : {})}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    pointerEvents: index === 0 ? "auto" : "none",
                    cursor:
                      index === 0 && !isDragging
                        ? "grab"
                        : index === 0
                        ? "grabbing"
                        : "default",
                    transformOrigin: "50% 50%",
                    ...cardContent.style,
                  }}
                  initial={{
                    x: 0,
                    y: cardContent.y,
                    zIndex: cards.length - index,
                    rotateZ: cardContent.rotateZ,
                    opacity: 1,
                  }}
                  animate={{
                    x:
                      index === 0
                        ? isExiting
                          ? exitDirection * window.innerWidth
                          : dragX
                        : 0,
                    y: cardContent.y,
                    zIndex: cards.length - index,
                    rotateZ:
                      index === 0
                        ? isExiting
                          ? exitDirection * 45
                          : cardContent.rotateZ + dragX * 0.1
                        : cardContent.rotateZ,
                    opacity: index === 0 && isExiting ? 0 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.5,
                    ...(isExiting &&
                      index === 0 && {
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
            Swipe {swipeDirection}
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
