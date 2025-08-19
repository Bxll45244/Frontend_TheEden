import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingAnimation from '../animations/LoadingAnimation';

const API_BASE_URL = "http://localhost:5000/api";

const Step3 = ({ bookingData, handleChange, onNext, onPrev }) => {
    const { golfCartQty, golfBagQty, caddy, caddySelectionEnabled } = bookingData;
    const [caddySearchTerm, setCaddySearchTerm] = useState('');
    const [availableCaddies, setAvailableCaddies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCaddies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/caddies/available`);
                setAvailableCaddies(response.data);
            } catch (err) {
                console.error("Failed to fetch caddies:", err);
                setError('ไม่สามารถดึงข้อมูลแคดดี้ได้ กรุณาลองใหม่อีกครั้ง');
            } finally {
                setIsLoading(false);
            }
        };

        if (caddySelectionEnabled) {
            getCaddies();
        }
    }, [caddySelectionEnabled]);

    const filteredCaddies = availableCaddies.filter(caddyOption =>
        caddyOption.name.toLowerCase().includes(caddySearchTerm.toLowerCase())
    );

    const handleCaddySelection = (caddyId) => {
        let updatedCaddies = [...caddy];
        if (updatedCaddies.includes(caddyId)) {
            updatedCaddies = updatedCaddies.filter(id => id !== caddyId);
        } else {
            updatedCaddies.push(caddyId);
        }
        handleChange({ target: { name: 'caddy', value: updatedCaddies } });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 3: บริการเสริม</h2>
            {/* JSX for optional services */}
            <div className="mb-4 text-center">
                <label className="block text-gray-700 text-sm font-bold mb-2">จำนวนกระเป๋าไม้กอล์ฟ:</label>
                <div className="flex items-center justify-center space-x-2">
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'golfBagQty', value: Math.max(0, golfBagQty - 1) } })}
                    >
                        -
                    </button>
                    <span className="text-2xl font-bold">{golfBagQty}</span>
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'golfBagQty', value: golfBagQty + 1 } })}
                    >
                        +
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">*ค่าบริการกระเป๋าไม้กอล์ฟ/ท่าน 300 บาท</p>
            </div>
            <div className="mb-4 text-center">
                <label className="block text-gray-700 text-sm font-bold mb-2">จำนวนรถกอล์ฟ:</label>
                <div className="flex items-center justify-center space-x-2">
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'golfCartQty', value: Math.max(0, golfCartQty - 1) } })}
                    >
                        -
                    </button>
                    <span className="text-2xl font-bold">{golfCartQty}</span>
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'golfCartQty', value: golfCartQty + 1 } })}
                    >
                        +
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">*ค่าบริการรถกอล์ฟ/คัน 500 บาท</p>
            </div>
            <div className="mb-4 border-t pt-4">
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="caddy-selection-toggle"
                        checked={caddySelectionEnabled}
                        onChange={() => handleChange({ target: { name: 'caddySelectionEnabled', value: !caddySelectionEnabled } })}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="caddy-selection-toggle" className="text-gray-800 font-bold text-sm">
                        ต้องการเลือกแคดดี้
                    </label>
                </div>
                {caddySelectionEnabled && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อแคดดี้..."
                            value={caddySearchTerm}
                            onChange={(e) => setCaddySearchTerm(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <LoadingAnimation />
                            </div>
                        ) : error ? (
                            <p className="col-span-2 text-center text-red-500">{error}</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {filteredCaddies.length > 0 ? (
                                    filteredCaddies.map(caddyOption => (
                                        <div
                                            key={caddyOption._id}
                                            className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${caddy.includes(caddyOption._id) ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'}`}
                                            onClick={() => handleCaddySelection(caddyOption._id)}
                                        >
                                            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
                                                <img src={caddyOption.profilePic} alt={caddyOption.name} className="w-full h-full object-cover" />
                                                {caddy.includes(caddyOption._id) && (
                                                    <div className="absolute inset-0 bg-green-500 bg-opacity-70 flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-center">{caddyOption.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-2 text-center text-gray-500">ไม่พบแคดดี้ที่ค้นหา</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <p className="text-xs text-gray-500 mt-2">*ค่าบริการแคดดี้/ท่าน 400 บาท</p>
            </div>
            <div className="flex justify-between mt-6">
                <button onClick={onPrev} className="bg-gray-600 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">ย้อนกลับ</button>
                <button onClick={onNext} className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">จองต่อ</button>
            </div>
        </div>
    );
};

export default Step3;