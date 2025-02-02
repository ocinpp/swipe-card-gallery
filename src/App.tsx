import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDrag } from "@use-gesture/react";

// Define a type for our card content
type Card = {
  type: "image" | "html";
  content: string;
  y: number;
  rotateZ: number;
};

// Sample cards with both images and HTML
const initialCards: Card[] = [
  {
    type: "html",
    content:
      '<div class="text-4xl font-bold m-4 select-none">Swipe or Drag to Start</div>',
    y: 0,
    rotateZ: 0,
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1018/400/600",
    y: 0,
    rotateZ: 0,
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
    content:
      '<div class="text-4xl font-bold m-4 select-none">Thank You for Viewing</div>',
    y: 0,
    rotateZ: 0,
  },
];

function App() {
  const [cards, setCards] = useState(initialCards);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState(0);

  const handleSwipe = () => {
    const direction = dragX > 0 ? 1 : -1;
    setExitDirection(direction);
    setIsExiting(true);

    setTimeout(() => {
      setCards((current) => {
        const [first, ...rest] = current;
        return [...rest, first];
      });
      setDragX(0);
      setIsExiting(false);
    }, 200);
  };

  const bind = useDrag(
    ({ movement: [x], velocity: [vx], active, last }) => {
      setIsDragging(active);
      setDragX(active ? x : 0);

      if (!active && (Math.abs(x) > 100 || Math.abs(vx) > 0.5)) {
        handleSwipe();
      }
    },
    {
      axis: "x",
      filterTaps: true,
      from: () => [0, 0],
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
        },
        y: card.y,
        rotateZ: card.rotateZ,
      };
    } else {
      return {
        style: {
          background: "white",
          touchAction: "none",
        },
        html: (
          <div
            className="w-full h-full flex items-center justify-center"
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
                          : cardContent.rotateZ
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
                >
                  {cardContent.html}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* <div className="absolute bottom-2 text-white text-center">
        <p>Swipe or drag the top image to cycle through the stack</p>
      </div> */}
    </div>
  );
}

export default App;
