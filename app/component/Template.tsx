import "material-icons/iconfont/material-icons.css";
import "bootstrap-select/dist/css/bootstrap-select.min.css";
import "../../public/template/css/style.css";

import { signOut, useSession } from "next-auth/react";
import Header from "./Header";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import { AdminLogin } from "next-auth";

export default function Template({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const akun = session.data as unknown as AdminLogin;

  const logout = async () => {
    Swal.fire({
      title: "Anda yakin ...",
      text: "Logut dari akun ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, logout sekarang!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        signOut();
      }
    });
  };

  return (
    <div>
      <div id="preloader">
        <div className="dz-ripple">
          <div />
          <div />
        </div>
      </div>
      <div id="main-wrapper">
        <Header />
        <div className="deznav">
          <div className="deznav-scroll">
            <ul className="metismenu mm-show" id="menu">
              <li>
                <Link href="/" className="" aria-expanded="false">
                  <div className="menu-icon">
                    <Image
                      src="/template/menu/dashboard.png"
                      width={25}
                      height={25}
                      alt="xxx"
                    />
                  </div>
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>

              <li>
                <Link href="/device" className="" aria-expanded="false">
                  <div className="menu-icon">
                    <Image
                      src="/template/menu/device.png"
                      width={25}
                      height={25}
                      alt="xxx"
                    />
                  </div>
                  <span className="nav-text">Device</span>
                </Link>
              </li>

              <li>
                <Link href="/kelas" className="" aria-expanded="false">
                  <div className="menu-icon">
                    <Image
                      src="/template/menu/kelas.png"
                      width={25}
                      height={25}
                      alt="xxx"
                    />
                  </div>
                  <span className="nav-text">Kelas</span>
                </Link>
              </li>

              <li>
                <Link href="/user/kelas/All" className="" aria-expanded="false">
                  <div className="menu-icon">
                    <Image
                      src="/template/menu/user.png"
                      width={25}
                      height={25}
                      alt="xxx"
                    />
                  </div>
                  <span className="nav-text">User</span>
                </Link>
              </li>

              <li>
                <Link href="/setting" className="" aria-expanded="false">
                  <div className="menu-icon">
                    <Image
                      src="/template/menu/setting.png"
                      width={25}
                      height={25}
                      alt="xxx"
                    />
                  </div>
                  <span className="nav-text">Setting</span>
                </Link>
              </li>

              <li>
                <Link
                  href={`/ganti-password`}
                  className=""
                  aria-expanded="false"
                >
                  <div className="menu-icon">
                    <Image
                      src="/template/menu/password.png"
                      width={25}
                      height={25}
                      alt="xxx"
                    />
                  </div>
                  <span className="nav-text">Ganti Password</span>
                </Link>
              </li>
            </ul>

            <div onClick={logout} className="switch-btn">
              <a href="javascript:void(0);">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.36 6.63965C19.6184 7.89844 20.4753 9.50209 20.8223 11.2478C21.1693 12.9936 20.9909 14.803 20.3096 16.4474C19.6284 18.0918 18.4748 19.4972 16.9948 20.486C15.5148 21.4748 13.7749 22.0026 11.995 22.0026C10.2151 22.0026 8.47515 21.4748 6.99517 20.486C5.51519 19.4972 4.36164 18.0918 3.68036 16.4474C2.99909 14.803 2.82069 12.9936 3.16772 11.2478C3.51475 9.50209 4.37162 7.89844 5.63 6.63965"
                    stroke="#252525"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2V12"
                    stroke="#252525"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>

        <div className="outer-body">
          <div className="inner-body">
            <div className="content-body">
              <div className="container-fluid">{children}</div>
            </div>
          </div>
        </div>
      </div>
      <script
        defer={true}
        src={`${process.env.NEXTAUTH_URL}/template/vendor/global/global.min.js`}
      />

      <script
        defer={true}
        src={`${process.env.NEXTAUTH_URL}/template/js/custom.js`}
      />
      <script
        defer={true}
        src={`${process.env.NEXTAUTH_URL}/template/js/deznav-init.js`}
      />
      <script
        defer={true}
        src={`${process.env.NEXTAUTH_URL}/template/js/demo.js`}
      />
    </div>
  );
}
