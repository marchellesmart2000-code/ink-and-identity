import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { api } from "../../convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { AdminTable } from "./components/AdminTable";

export function UsersAdminPage() {
  const me = useQuery(api.users.me);
  const users = useQuery(api.users.listStaff);
  const createStaff = useAction(api.users.createStaff);
  const setStatus = useMutation(api.users.setUserStatus);
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");

  if (me && me.role !== "admin") {
    return <p>User management is limited to administrators.</p>;
  }

  return (
    <div>
      <h1 className="display text-5xl">Studio users</h1>
      <form
        className="mt-8 max-w-xl space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            await createStaff({ email, name, password, role });
            push("Staff account created.");
            setEmail("");
            setName("");
            setPassword("");
          } catch (error) {
            push(error instanceof Error ? error.message : "Could not create user.", "error");
          }
        }}
      >
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Temporary password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as "admin" | "editor")}>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </Select>
        <Button type="submit">Create staff user</Button>
      </form>
      <div className="mt-10">
        <AdminTable headers={["Name", "Email", "Role", "Status", ""]}>
          {(users ?? []).map((user) => (
            <tr key={user._id} className="border-t border-gold/20">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3">{user.status}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() =>
                    void setStatus({
                      userId: user._id,
                      status: user.status === "disabled" ? "active" : "disabled",
                    })
                  }
                >
                  {user.status === "disabled" ? "Activate" : "Disable"}
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
