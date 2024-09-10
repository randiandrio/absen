// pages/api/sysparam.js

export default async function handler(req, res) {
  // Melakukan request ke server HTTP
  const response = await fetch("http://192.168.1.10/action/GetSysParam");
  const data = await response.json();

  // Kirimkan data kembali sebagai response API
  res.status(200).json(data);
}
