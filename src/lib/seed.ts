// lib/seed.ts
import Asesmen from "@/models/asesmen";
import AsesmentResult from "@/models/asesmentResult";
import Class from "@/models/class";
import Student from "@/models/student";

export async function seedTestData() {
  try {
    // Bersihkan data jika ada (opsional)
    await Class.deleteMany({});
    await AsesmentResult.deleteMany({});
    await Asesmen.deleteMany({});
    await Student.deleteMany({});

    // 1. Buat Siswa Contoh
    const student1 = await Student.create({
      _id: "000000000000000000000005",
      name: "Budi Santoso",
      scores: [80, 85],
    });

    const student2 = await Student.create({
      _id: "000000000000000000000004",
      name: "Siti Aminah",
      scores: [90, 80],
    });

    const asesmentResult1 = await AsesmentResult.create({
      _id: "000000000000000000000003",
      studentData: student1._id,
      score: 56,
    });

    const asesmentResult2 = await AsesmentResult.create({
      _id: "000000000000000000000002",
      studentData: student2._id,
      score: 56,
    });

    const asesments = await Asesmen.create({
      _id: "000000000000000000000001",
      name: "Ujian Akhir Semester",
      date: new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta",
      }),
      asesmentResults: [asesmentResult1._id, asesmentResult2._id],
    });

    // 2. Buat Kelas Contoh dan hubungkan dengan ID siswa tadi
    const newClass = await Class.create({
      _id: "6594d2f1e4b0f1a2b3c4d5e6", // Kita hardcode ID-nya agar gampang di Postman
      className: "10 IPA 1",
      subjectName: "IPA",
      semester: 1,
      students: [student1._id, student2._id],
      owner: "6594d2f1e4b0f1a2b3c5d5e6",
      asesments: [asesments._id],
    });

    console.log("✅ Seed Data Berhasil:");
    console.log(`   - Class ID: ${newClass._id}`);
  } catch (error) {
    console.error("❌ Gagal melakukan seeding:", error);
  }
}
