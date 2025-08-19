import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export default function UserList() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error(err));
  }, [token]);

  // Legacy discount reset removed

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Tên</th>
          {/* Legacy discounts removed */}
          <th className="border px-2 py-1">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u._id}>
            <td className="border px-2 py-1">{u._id}</td>
            <td className="border px-2 py-1">{u.name}</td>
            <td className="border px-2 py-1">—</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
