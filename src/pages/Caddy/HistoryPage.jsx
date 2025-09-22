import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faStar, faLocationDot, faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";

// ข้อมูลจำลอง (Mock data)
const mockWorkHistory = [
    { id: 1, date: "1 ก.พ. 2568", time: "06:00", customer: "คุณสมศักดิ์", status: "completed", isRepeatCustomer: true, holes: 18 },
    { id: 2, date: "1 ก.พ. 2568", time: "17:00", customer: "คุณมานะ", status: "completed", isRepeatCustomer: false, holes: 9 },
    { id: 3, date: "31 ม.ค. 2568", time: "17:00", customer: "คุณวิชิต", status: "canceled", isRepeatCustomer: false, holes: 18, cancellationReason: "ลูกค้าไม่มา" },
    { id: 4, date: "30 ม.ค. 2568", time: "06:00", customer: "คุณกฤษณะ", status: "completed", isRepeatCustomer: true, holes: 18 },
    { id: 5, date: "29 ม.ค. 2568", time: "10:00", customer: "คุณปรีชา", status: "completed", isRepeatCustomer: true, holes: 9 },
    { id: 6, date: "28 ม.ค. 2568", time: "14:00", customer: "คุณสมศรี", status: "canceled", isRepeatCustomer: false, holes: 9, cancellationReason: "ฝนตก" },
];

const HistoryPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all'); // State สำหรับการกรองหลัก: all, completed, canceled, repeatCustomer
    const [searchTerm, setSearchTerm] = useState('');
    const [holesFilter, setHolesFilter] = useState('all');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [isHolesDropdownOpen, setIsHolesDropdownOpen] = useState(false);
    // เพิ่ม state สำหรับจัดการ dropdown การออกรอบ
    const [isRoundsDropdownOpen, setIsRoundsDropdownOpen] = useState(false);

    const handleBackClick = () => {
        navigate(-1);
    };

    const filteredHistory = mockWorkHistory.filter(item => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const lowerCaseDate = item.date.toLowerCase();
        const lowerCaseCustomer = item.customer.toLowerCase();
        const lowerCaseStatus = item.status.toLowerCase();

        let categoryMatches = true;
        // ปรับปรุง logic การกรองตาม state ใหม่
        if (filter === 'completed' && item.status !== 'completed') {
            categoryMatches = false;
        }
        if (filter === 'canceled' && item.status !== 'canceled') {
            categoryMatches = false;
        }
        if (filter === 'repeatCustomer' && !item.isRepeatCustomer) {
            categoryMatches = false;
        }

        let holesMatches = true;
        if (holesFilter !== 'all') {
            const selectedHoles = parseInt(holesFilter);
            if (item.holes !== selectedHoles) {
                holesMatches = false;
            }
        }
    
        const searchMatches = 
            lowerCaseDate.includes(lowerCaseSearchTerm) ||
            lowerCaseCustomer.includes(lowerCaseSearchTerm) ||
            lowerCaseStatus.includes(lowerCaseSearchTerm);

        return categoryMatches && searchMatches && holesMatches;
    });

    const completedRounds = mockWorkHistory.filter(item => item.status === 'completed').length;

    // ปรับปรุงฟังก์ชัน getFilterLabel เพื่อแสดง "การออกรอบ" เมื่อเลือกสำเร็จหรือยกเลิก
    const getFilterLabel = () => {
        switch (filter) {
            case 'completed':
            case 'canceled':
                return 'การออกรอบ';
            case 'repeatCustomer':
                return 'ลูกค้าประจำ';
            default:
                return 'ทั้งหมด';
        }
    };

    const getHolesLabel = () => {
        if (holesFilter === '9') return '9 หลุม';
        if (holesFilter === '18') return '18 หลุม';
        return 'จำนวนหลุม';
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4">
            <div className="max-w-2xl mx-auto">
                {/* ส่วนหัว */}
                <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white py-4 rounded-b-xl shadow-md flex justify-center items-center mb-6">
                    <h1 className="text-white text-2xl font-bold uppercase">
                        ประวัติการทำงาน
                    </h1>
                </div>
                
                {/* ปุ่ม "ย้อนกลับ" */}
                <div className="flex justify-start items-center mt-6 mb-6">
                    <button 
                        onClick={handleBackClick}
                        className="text-[#324441] text-lg font-bold"
                    >
                        &lt; ย้อนกลับ
                    </button>
                </div>

                {/* สรุปผลการทำงาน */}
                <div className="bg-white rounded-lg p-4 mb-6 text-center shadow-md">
                    <h2 className="text-lg font-semibold text-[#324441]">สรุปผลการทำงาน</h2>
                    <div className="flex justify-around mt-4">
                        <div>
                            <p className="text-xl font-bold text-gray-800">{mockWorkHistory.length}</p>
                            <p className="text-sm text-gray-500">รอบทั้งหมด</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-green-600">{completedRounds}</p>
                            <p className="text-sm text-gray-500">รอบสำเร็จ</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                    {/* ปุ่ม Filter และ Dropdown จำนวนหลุม สำหรับ Mobile */}
                    <div className="flex flex-row space-x-2 md:hidden w-full">
                        <div className="relative flex-1">
                            {/* ปุ่มหลักสำหรับ filter การออกรอบและลูกค้าประจำ */}
                            <button 
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className="w-full px-4 py-2 rounded-full text-sm font-semibold bg-[#324441] text-white flex items-center justify-between"
                            >
                                {getFilterLabel()}
                                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 ml-2" />
                            </button>
                            {isFilterDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <button 
                                        onClick={() => { setFilter('all'); setIsFilterDropdownOpen(false); setIsRoundsDropdownOpen(false); }} 
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        ทั้งหมด
                                    </button>
                                    {/* ปุ่มย่อยสำหรับ 'การออกรอบ' */}
                                    <div className="relative">
                                        <button 
                                            onClick={() => setIsRoundsDropdownOpen(!isRoundsDropdownOpen)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                                        >
                                            การออกรอบ <FontAwesomeIcon icon={faChevronDown} className={`h-3 w-3 transition-transform ${isRoundsDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isRoundsDropdownOpen && (
                                            <div className="bg-gray-50">
                                                <button
                                                    onClick={() => { setFilter('completed'); setIsFilterDropdownOpen(false); setIsRoundsDropdownOpen(false); }}
                                                    className="block w-full text-left pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                                >
                                                    - รอบสำเร็จ
                                                </button>
                                                <button
                                                    onClick={() => { setFilter('canceled'); setIsFilterDropdownOpen(false); setIsRoundsDropdownOpen(false); }}
                                                    className="block w-full text-left pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                                >
                                                    - รอบยกเลิก
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => { setFilter('repeatCustomer'); setIsFilterDropdownOpen(false); setIsRoundsDropdownOpen(false); }} 
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        ลูกค้าประจำ
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Dropdown จำนวนหลุม สำหรับ Mobile */}
                        <div className="relative flex-1">
                            <button
                                onClick={() => setIsHolesDropdownOpen(!isHolesDropdownOpen)}
                                className="w-full px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 flex items-center justify-between"
                            >
                                {getHolesLabel()}
                                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 ml-2" />
                            </button>
                            {isHolesDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <button 
                                        onClick={() => {
                                            setHolesFilter('all'); 
                                            setIsHolesDropdownOpen(false); 
                                        }} 
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        ทั้งหมด
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setHolesFilter('9'); 
                                            setIsHolesDropdownOpen(false); 
                                        }} 
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        9 หลุม
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setHolesFilter('18'); 
                                            setIsHolesDropdownOpen(false); 
                                        }} 
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        18 หลุม
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ปุ่ม Filter และ Dropdown สำหรับ Desktop */}
                    <div className="hidden md:flex flex-wrap items-center gap-2">
                        {/* ปุ่มทั้งหมด */}
                        <button
                            onClick={() => { setFilter('all'); setSearchTerm(''); setHolesFilter('all'); }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                filter === 'all' ? 'bg-[#324441] text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            ทั้งหมด
                        </button>
                        
                        {/* Dropdown การออกรอบ */}
                        <div className="relative">
                            <button
                                onClick={() => setIsRoundsDropdownOpen(!isRoundsDropdownOpen)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    (filter === 'completed' || filter === 'canceled') ? 'bg-[#324441] text-white' : 'bg-gray-200 text-gray-700'
                                } flex items-center gap-2`}
                            >
                                การออกรอบ
                                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
                            </button>
                            {isRoundsDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <button
                                        onClick={() => {
                                            setFilter('completed');
                                            setSearchTerm('');
                                            setHolesFilter('all');
                                            setIsRoundsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        รอบสำเร็จ
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter('canceled');
                                            setSearchTerm('');
                                            setHolesFilter('all');
                                            setIsRoundsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        รอบยกเลิก
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* ปุ่มลูกค้าประจำ */}
                        <button
                            onClick={() => { setFilter('repeatCustomer'); setSearchTerm(''); setHolesFilter('all'); }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                filter === 'repeatCustomer' ? 'bg-[#324441] text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            ลูกค้าประจำ
                        </button>
                        
                        {/* Dropdown จำนวนหลุม สำหรับ Desktop */}
                        <div className="relative">
                            <button
                                onClick={() => setIsHolesDropdownOpen(!isHolesDropdownOpen)}
                                className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 flex items-center gap-2"
                            >
                                จำนวนหลุม
                                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
                            </button>
                            {isHolesDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <button
                                        onClick={() => {
                                            setHolesFilter('all');
                                            setIsHolesDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        ทั้งหมด
                                    </button>
                                    <button
                                        onClick={() => {
                                            setHolesFilter('9');
                                            setIsHolesDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        9 หลุม
                                    </button>
                                    <button
                                        onClick={() => {
                                            setHolesFilter('18');
                                            setIsHolesDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        18 หลุม
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ช่องค้นหา */}
                    <div className="relative w-full md:w-auto mt-4 md:mt-0">
                        <label className="input input-bordered flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                            <FontAwesomeIcon icon={faSearch} className="h-4 w-4 opacity-50" />
                            <input 
                                type="search" 
                                required 
                                placeholder="ค้นหา" 
                                className="grow w-full text-gray-700 bg-transparent outline-none" 
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setFilter('all');
                                }}
                            />
                        </label>
                    </div>
                </div>

                {/* รายการประวัติการทำงาน */}
                <div className="space-y-4">
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((history) => (
                            <div key={history.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                <div className="flex justify-between items-center text-lg font-semibold text-[#324441]">
                                    <span>{history.date}</span>
                                    <span className="text-gray-600">{history.time}</span>
                                </div>
                                <div className="text-gray-500 text-sm mt-1">
                                    <p>ลูกค้า: {history.customer}</p>
                                    {history.isRepeatCustomer && (
                                        <p className="text-yellow-500 text-xs mt-1">
                                            <FontAwesomeIcon icon={faStar} className="mr-1" /> ลูกค้าประจำ
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-semibold text-gray-700">
                                        {history.status === 'completed' ? 'สถานะ: สำเร็จ' : 'สถานะ: ยกเลิก'}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        {history.holes && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FontAwesomeIcon icon={faLocationDot} className="mr-1 text-gray-400" />
                                                <span>{history.holes} หลุม</span>
                                            </div>
                                        )}
                                        {history.status === 'completed' ? (
                                            <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-xl" />
                                        ) : (
                                            <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-xl" />
                                        )}
                                    </div>
                                </div>
                                {history.status === 'canceled' && history.cancellationReason && (
                                    <p className="text-red-500 text-xs mt-2 italic">
                                        เหตุผล: {history.cancellationReason}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-10">ไม่มีประวัติการทำงานที่ตรงกับตัวกรอง</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;