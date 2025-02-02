import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDrag } from "@use-gesture/react";

// Define a type for our card content
type Card = {
  type: "image" | "html";
  content: string;
};

// Sample cards with both images and HTML
const initialCards: Card[] = [
  {
    type: "image",
    content: "https://picsum.photos/id/1018/400/600",
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1015/400/600",
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1016/400/600",
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1020/400/600",
  },
  {
    type: "html",
    content: '<div class="text-4xl font-bold select-none">Hello World</div>',
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1031/400/600",
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1032/400/600",
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1033/400/600",
  },
  {
    type: "image",
    content: "https://picsum.photos/id/1005/400/600",
  },
  {
    type: "html",
    content: '<div class="text-4xl font-bold select-none">Thank You</div>',
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
        },
      };
    } else {
      return {
        style: {
          background: "white",
        },
        html: (
          <div
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: card.content }}
          />
        ),
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="relative w-[300px] h-[450px]">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
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
                    scale: 1 - index * 0.05,
                    y: index * 15,
                    zIndex: cards.length - index,
                    x: 0,
                    rotateZ: 0,
                    opacity: 1,
                  }}
                  animate={{
                    scale: 1 - index * 0.05,
                    y: index * 15,
                    zIndex: cards.length - index,
                    x:
                      index === 0
                        ? isExiting
                          ? exitDirection * window.innerWidth
                          : dragX
                        : 0,
                    rotateZ:
                      index === 0
                        ? isExiting
                          ? exitDirection * 45
                          : dragX * 0.1
                        : 0,
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

      <div className="absolute bottom-4 text-white text-center">
        <p>Swipe or drag the top image to cycle through the stack</p>
      </div>
    </div>
  );
}

export default App;
