import { HTMLMotionProps } from "motion/react";
import { LuHeart, LuPencil } from "react-icons/lu";
import avatar1 from "@/assets/avatars/avatar1.webp"
import avatar2 from "@/assets/avatars/avatar2.webp"
import avatar3 from "@/assets/avatars/avatar3.webp"
import avatar4 from "@/assets/avatars/avatar4.webp"


export const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4
];

export const features = [
  {
    title: "از ایده تا لباس",
    description: "در عرض چند دقیقه",
  },
  {
    title: "دوخت حرفه‌ای",
    description: "با بهترین پارچه‌ها",
  },
  {
    title: "تحویل سریع",
    description: "تا درب خانه",
  },
];

export const floatingCards = [
  {
    title: "لباسی نو",
    subtitle: "به روایتِ تو",
    Icon: LuHeart,
    className: "absolute -bottom-5 -right-4 sm:-right-10",
  },
  {
    title: "طرحی جدید",
    subtitle: "روی بوم تنِ تو",
    Icon: LuPencil,
    className: "absolute top-10 md:-top-4 -left-4 sm:-left-10",
  },
];

export const floatingAnimation: Pick<
  HTMLMotionProps<"div">,
  "initial" | "animate" | "transition"
> = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: [0, -12, 0],
    scale: 1,
  },
  transition: {
    opacity: {
      duration: 0.6,
      delay: 1.2,
    },
    scale: {
      duration: 0.6,
      delay: 1.2,
    },
    y: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
