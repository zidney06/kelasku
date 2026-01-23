export const dynamic = "force-dynamic";

import { z } from "zod";
import AddClassComponent from "@/components/dashboardComponents/AddClassComponent";
import { getClassList } from "@/actions/dasboardAct/actions";
import ClassCard from "@/components/dashboardComponents/ClassCard";

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
});

const getClassResSchema = z.object({
  success: z.boolean(),
  msg: z.string(),
  data: dataSchema.optional(),
});

export default async function DashboardPage() {
  const classList = [] as z.infer<typeof classSchema>[];
  let username = "";

  const res = await getClassList();

  const parsedRes = getClassResSchema.safeParse(res);

  if (parsedRes.success) {
    const parsed = dataSchema.safeParse(res.data);

    if (parsed.success) {
      classList.push(...parsed.data.classList);
      username = parsed.data.username;
    }
  }

  return (
    <div className="container-fluid p-0">
      <main className="p-2">
        <p>Halo {username}, selamat Datang</p>

        <AddClassComponent />

        <h2 className="my-3">Daftar kelas</h2>

        <div className="row gx-2 p-2">
          {classList.length > 0 ? (
            classList.map((item: z.infer<typeof classSchema>, i: number) => (
              <ClassCard item={item} i={i} key={i} />
            ))
          ) : (
            <div className="mx-auto">
              <div className="card my-2 mx-sm-2">
                <div className="card-body">
                  <h5 className="card-title m-0 text-center">
                    Belum ada kelas
                  </h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
