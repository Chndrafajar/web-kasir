import { BiSolidBookContent, BiSolidCategory, BiSolidFoodMenu } from "react-icons/bi";
import { FaMoneyCheck, FaStoreAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { MdLibraryBooks } from "react-icons/md";
import { RiHealthBookFill } from "react-icons/ri";

export const SidebarMenu = [
  {
    title: "Dashboard",
    icons: <BiSolidCategory />,
    path: "/dashboard/home",
  },
  {
    title: "Menu",
    icons: <BiSolidFoodMenu />,
    path: "/dashboard/menu",
  },
  {
    title: "Transaksi",
    icons: <FaMoneyCheck />,
    path: "/dashboard/transaksi",
  },
  {
    title: "Kelola Menu",
    icons: <RiHealthBookFill />,
    path: "/dashboard/menu-admin",
  },
  {
    title: "Category",
    icons: <MdLibraryBooks />,
    path: "/dashboard/category",
  },
  {
    title: "Laporan",
    icons: <BiSolidBookContent />,
    path: "/dashboard/laporan",
  },
  {
    title: "Profile Toko",
    icons: <FaStoreAlt />,
    path: "/dashboard/profile-toko",
  },
  {
    title: "Kelola User",
    icons: <FaCircleUser />,
    path: "/dashboard/user-administrator",
  },
];
