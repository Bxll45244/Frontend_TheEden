// src/components/AssetStatusDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssetStatusDashboard = () => {
    // State สำหรับเก็บข้อมูลที่ดึงมาจาก backend
    const [assetData, setAssetData] = useState({
        golfCart: {},
        golfBag: {}
    });
    // State สำหรับจัดการสถานะการโหลด
    const [isLoading, setIsLoading] = useState(true);
    // State สำหรับจัดการข้อผิดพลาดที่อาจเกิดขึ้น
    const [error, setError] = useState(null);

    useEffect(() => {
        // ฟังก์ชันสำหรับดึงข้อมูลสถานะของทรัพย์สินจาก backend
        const fetchAssetStatus = async () => {
            try {
                // ส่งคำขอ GET ไปยัง endpoint API ของ backend
                // **อย่าลืมเปลี่ยน URL เป็น URL เซิร์ฟเวอร์จริงของคุณ**
                const response = await axios.get('http://localhost:5000/api/item/all-status');
                
                // อัปเดต state ด้วยข้อมูลที่ได้มา
                setAssetData(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load asset data.");
                setIsLoading(false);
            }
        };

        fetchAssetStatus();
    }, []); // Array ว่างเปล่าทำให้ effect นี้ทำงานเพียงครั้งเดียวเมื่อ component ถูก mount

    // แสดงสถานะการโหลดขณะที่กำลังดึงข้อมูล
    if (isLoading) {
        return <div className="loading">Loading asset status...</div>;
    }

    // แสดงสถานะข้อผิดพลาดหากการดึงข้อมูลล้มเหลว
    if (error) {
        return <div className="error">{error}</div>;
    }

    // ฟังก์ชันช่วยในการแสดงรายการสรุปสถานะ
    const renderSummary = (title, summary) => (
        <div className="summary-section">
            <h3>{title} Status</h3>
            <ul className="status-list">
                {Object.entries(summary).map(([status, count]) => (
                    <li key={status}>
                        <strong>{status.charAt(0).toUpperCase() + status.slice(1)}:</strong> {count}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="asset-status-dashboard">
            <h2>Overall Asset Status</h2>
            <div className="summary-container">
                {renderSummary("Golf Cart", assetData.golfCart)}
                {renderSummary("Golf Bag", assetData.golfBag)}
            </div>
        </div>
    );
};

export default AssetStatusDashboard;