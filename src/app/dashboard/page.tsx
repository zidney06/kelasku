// ini digunakan untuk menghindari error dynamic server usage
// karena penggunaan getServerSession actions.ts
// + agar data user A tidak ke-cache dan ditampilkan ke user B
export const dynamic = "force-dynamic";

import { z } from "zod";
import { getDashboardData } from "@/actions/dasboardAct/actions";
import Container from "@/components/dashboardComponents/Container";

const classSchema = z.object({
  _id: z.preprocess((val) => String(val), z.string()),
  className: z.string(),
  subjectName: z.string(),
  semester: z.union([z.string(), z.number()]),
  students: z.array(z.string()),
});

const dataSchema = z.object({
  classList: z.array(classSchema),
  username: z.string(),
  remainingDays: z.number(),
});

const getClassResSchema = z.object({
  success: z.boolean(),
  msg: z.string(),
  data: dataSchema.optional(),
});

export default async function DashboardPage() {
  const classList = [] as z.infer<typeof classSchema>[];
  let username = "";
  let remainingDays = 0;

  const res = await getDashboardData();

  const parsedRes = getClassResSchema.safeParse(res);

  if (parsedRes.success) {
    const parsed = dataSchema.safeParse(res.data);

    if (parsed.success) {
      classList.push(...parsed.data.classList);
      username = parsed.data.username;
      remainingDays = parsed.data.remainingDays;
    }
  }

  return (
    <div className="container-fluid p-0">
      <Container username={username} classList={classList} remainingDays={4} />
    </div>
  );
}
