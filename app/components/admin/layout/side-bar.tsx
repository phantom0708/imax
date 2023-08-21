import TreeMenu from "./tree-menu";
import { usePathname } from "next/navigation";
export default function SideBar() {
  const data = [
    {
      id: 1,
      url: "/-",
      title: "Quản lý cư dân",
      parentId: 0,
      childrens: [
        {
          id: 2,
          url: "/admin/citizen",
          title: "Thông tin cư dân",
          parentId: 1,
        },
      ],
    },
  ];
  const pathname = usePathname();
  return (
    <div className="fixed z-40 w-56 h-full shadow-xl bg-gradient text-white text-sm overflow-y-auto">
      <div className="flex justify-center mt-6 mb-6">
        <picture>
          <img
            className="max-w-xs max-h-20"
            src="/logo.png"
            alt="company logo"
          />
        </picture>
      </div>
      <ul className="pt-2 pl-2">
        {data.map((menu: any) => (
          <TreeMenu key={menu.id} node={menu} pathname={pathname} lever={0} />
        ))}
      </ul>
    </div>
  );
}
