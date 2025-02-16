// Sample cards with both images and HTML
const OFFSET_Y = 25;
const OFFEST_ROTATEZ = 45;

// Define a type for our card content
export type Card = {
    type: "image" | "html" | "switch" | "result";
    bgClassName?: string;
    content: string;
    y: number;
    rotateZ: number;
    left?: "bwfilter" | "nothing" | null;
    right?: "bwfilter" | "nothing" | null;
};

export const initialCards: Card[] = [
    {
        type: "html",
        bgClassName:
            "bg-gradient-to-b from-fuchsia-600 via-pink-500 to-blue-400 border-2 border-orange-200",
        content:
            '<div class="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 animate-gradient-x inline-block text-transparent bg-clip-text text-4xl font-bold m-4 text-slate-200 pointer-events-none">Swipe<br>↑ ↓ ← →<br>to <u>Start</u></div>',
        y: 0,
        rotateZ: 0,
    },
    {
        type: "switch",
        bgClassName:
            "bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-zinc-300",
        content:
            '<div class="bg-gradient-to-r from-gray-400 to-white animate-gradient-x inline-block text-transparent bg-clip-text text-4xl font-bold m-4 text-slate-200 pointer-events-none">Swipe Left for B&W mode</div>',
        y: 0,
        rotateZ: 0,
        left: "bwfilter",
        right: "nothing",
    },
    {
        type: "image",
        content: "/images/1.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "image",
        content: "/images/2.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "image",
        content: "/images/3.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "image",
        content: "/images/4.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "image",
        content: "/images/5.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "image",
        content: "/images/6.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "image",
        content: "/images/7.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "image",
        content: "/images/8.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "image",
        content: "/images/9.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "image",
        content: "/images/10.png",
        y: OFFSET_Y * Math.random() * Math.pow(-1, Math.floor(Math.random() * 2)),
        rotateZ:
            OFFEST_ROTATEZ *
            Math.random() *
            Math.pow(-1, Math.floor(Math.random() * 2)),
    },
    {
        type: "html",
        bgClassName:
            "bg-gradient-to-b from-red-500 to-rose-400 border-2 border-rose-300",
        content:
            '<div class="bg-gradient-to-r from-orange-400 via-sky-400 to-yellow-400 animate-gradient-x inline-block text-transparent bg-clip-text text-4xl font-bold m-4 text-slate-200 pointer-events-none">Thank You for Viewing</div>',
        y: 0,
        rotateZ: 0,
    },
    {
        type: "result",
        bgClassName:
            "bg-gradient-to-b from-red-500 to-rose-400 border-2 border-rose-300",
        content:
            '<div class="text-4xl font-bold m-4 text-slate-200 pointer-events-none">Swipe Results</div>',
        y: 0,
        rotateZ: 0,
    },
];
