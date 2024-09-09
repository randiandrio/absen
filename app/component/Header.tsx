import { AdminLogin } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const session = useSession();
  const akun = session.data as unknown as AdminLogin;
  return (
    <div>
      <div className="nav-header">
        <a href="#" className="brand-logo">
          <Image
            className="logo-abbr"
            src={`/template/logo.png`}
            width={40}
            height={40}
            alt="xxx"
          />
          <Image
            className="brand-title"
            src={`/template/logo_text.png`}
            width={200}
            height={70}
            alt="xxx"
          />
        </a>
        <div className="nav-control">
          <div className="hamburger">
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </div>
      </div>

      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                <div className="px-3 pt-1">
                  {session.status == "authenticated" ? (
                    <>
                      <h4 style={{ lineHeight: "0px" }}>{akun.namaSekolah}</h4>
                      <small style={{ lineHeight: "15px" }}>{akun.nama}</small>
                    </>
                  ) : (
                    <h4 style={{ lineHeight: "0px" }}>Presensi Biometrik</h4>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
