import { HiUserGroup, HiClipboardList, HiUserAdd } from "react-icons/hi";

export default function Header({ activePage }) {
  const pageData = {
    employeeData: {
      title: "ข้อมูลพนักงาน",
      icon: <HiUserGroup className="inline mr-2 text-lg" />,
    },
    booking: {
      title: "ข้อมูลการจอง",
      icon: <HiClipboardList className="inline mr-2 text-lg" />,
    },
    addEmployee: {
      title: "เพิ่มพนักงาน",
      icon: <HiUserAdd className="inline mr-2 text-lg" />,
    },
  };

  const current = pageData[activePage] || {};

  return (
    <header className="flex justify-between items-center mb-6 bg-[#3A4E4E] p-4 rounded text-white">
      <h1 className="text-xl font-bold flex items-center">
        {current.icon}
        {current.title}
      </h1>
      <div className="flex items-center gap-2">
        <div className="bg-green-500 rounded-full w-2 h-2" />
        <span>Admin</span>
      </div>
    </header>
  );
}
