"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface IUserAuth {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface IUser {
  name: string;
  email: string;
  tier: string;
}

export default function AkunPage() {
  const [user, setUser] = useState<IUser>({
    name: "",
    email: "",
    tier: "",
  });

  const { data: session } = useSession();

  const tmp = session!.user as IUserAuth;

  useEffect(() => {
    axios.get(`/api/auth/user-info/${tmp.id}`).then((res) => {
      console.log(res.data);
      setUser(res.data.data.user);
    });
  }, [session]);

  console.log(user);

  return (
    <div className="container-fluid p-2">
      <main className="">
        <Link href="/dashboard" className="btn btn-info text-light">
          <i className="bi bi-arrow-return-left"></i>
        </Link>
        <div className="row my-2">
          <div className="col-md-6">
            <h3>Informasi Akun</h3>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Detail Akun</h5>
                <p className="card-text">Nama: {user.name}</p>
                <p className="card-text">Email: {user.email}</p>
                <p className="card-text">Tier: {user.tier}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
