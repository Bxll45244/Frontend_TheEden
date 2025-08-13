import Issue from '../models/Issue.model.js';
import HoleStatus from '../models/HoleStatus.model.js';

/**
 * ดึงสถานะหลุมกอล์ฟทั้งหมดจากฐานข้อมูล
 * @returns {Array} ข้อมูลสถานะของแต่ละหลุม
 */
export const getHoleStatusesService = async () => {
    // ดึงข้อมูลสถานะหลุมทั้งหมดจาก HoleStatus model
    return await HoleStatus.find({});
};

/**
 * อัปเดตสถานะของหลุมกอล์ฟและสร้าง Issue ถ้าจำเป็น
 * @param {string} holeNumber - หมายเลขหลุม
 * @param {object} statusData - ข้อมูลสถานะใหม่ (color, status)
 * @returns {object} สถานะหลุมที่อัปเดตแล้ว
 */
export const updateHoleStatusService = async (holeNumber, statusData) => {
    // อัปเดตสถานะหลุมกอล์ฟ
    const updatedHole = await HoleStatus.findOneAndUpdate(
        { number: holeNumber },
        { $set: statusData },
        { new: true, upsert: true } // upsert: true จะสร้างเอกสารใหม่ถ้าไม่พบ
    );

    // หากสถานะใหม่เป็น 'ปิดหลุม', 'กำลังแก้ไข', หรือ 'กระเป๋าเสีย' ให้สร้าง Issue ใหม่
    if (statusData.color === 'red' || statusData.color === 'blue' || statusData.color === 'yellow') {
        const newIssue = new Issue({
            holeNumber: holeNumber,
            issueType: statusData.status, // ใช้ข้อความสถานะเป็นประเภทปัญหา
            color: statusData.color
        });
        await newIssue.save();
    }

    return updatedHole;
};